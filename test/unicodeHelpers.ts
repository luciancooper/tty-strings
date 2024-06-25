// eslint-disable-next-line @typescript-eslint/no-require-imports
import http = require('http');

/**
 * Fetch and parse a unicode data file
 * @param path - path portion of the data file url
 * @param props - specify if the file is a code point properties file, and parse accordingly
 * @param cols - number of columns to extract from the source file
 * @returns the contents of the fetched unicode file
 */
export function fetchUnicodeFile(path: string, props: false, cols?: number): Promise<string[]>;
export function fetchUnicodeFile(path: string, props: true, cols?: number): Promise<[number, number, ...string[]][]>;
export function fetchUnicodeFile(path: string, props: boolean, cols?: number) {
    const url = path.startsWith('http://') ? path : `http://unicode.org/Public/${path}`;
    return new Promise((resolve, reject) => {
        http.get(url, {
            headers: { 'Cache-Control': 'no-cache' },
        }, (res) => {
            const { statusCode } = res;
            // check for redirect
            if (statusCode === 302) {
                // handle redirect
                const redirect = res.headers.location!;
                if (redirect !== url) {
                    fetchUnicodeFile(redirect, props as false, cols).then(resolve).catch(reject);
                } else {
                    reject(new Error(
                        `Request to fetch '${url}' failed\n`
                        + `Status Code ${statusCode} - bad redirect`,
                    ));
                }
                return;
            }
            // ensure status code is 200
            if (statusCode !== 200) {
                reject(new Error(
                    `Request to fetch '${url}' failed\n`
                    + `Status Code ${statusCode}`,
                ));
                return;
            }
            res.setEncoding('utf8');
            let data = '';
            // A chunk of data has been recieved
            res.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received
            res.on('end', () => {
                // split file lines
                const lines = data
                        .split('\n')
                        // remove comments & clean up line
                        .map((raw) => {
                            const i = raw.indexOf('#'),
                                l = i >= 0 ? raw.slice(0, i) : raw;
                            return l.split(';').slice(0, cols).join(';').trim();
                        })
                        // filter out empty lines
                        .filter(Boolean),
                    // ensure response data is not corrupt
                    corrupted = lines.filter((l) => !/^[A-Z0-9 ÷×.;_-]+$/i.test(l));
                if (corrupted.length) {
                    reject(new Error(
                        `Request to fetch '${url}' returned the following corrupted lines:${
                            corrupted.slice(0, 5).map((l) => `\n * '${l}'`).join('')
                        }${corrupted.length > 5 ? `\n ... ${corrupted.length - 5} more lines` : ''}`,
                    ));
                    return;
                }
                // resolve the promise
                resolve(props ? lines.map<readonly [number, number, ...string[]]>((line) => {
                    const [cp = '', ...p] = line.split(/\s*;\s*/g),
                        [cp1, cp2 = cp1] = cp.split('..').map((h) => parseInt(h, 16)) as [number, ...number[]];
                    return [cp1, cp2, ...p];
                }) : lines);
            });
        }).on('error', (err: { code: string, message: string }) => {
            reject(new Error(
                `Request to fetch '${url}' failed\n`
                + `Error Code: ${err.code}\n${err.message}`,
            ));
        });
    });
}

/**
 * Sort code point ranges and split any that overlap
 * @param ranges - code point ranges to process
 * @param merge - optional function to merge the values of two overlapping ranges
 * @returns processed code point ranges
 */
export function processRanges<T>(
    ranges: [number, number, T][],
    merge: (a: T, b: T) => T | null = () => null,
) {
    // sort ranges in place
    ranges.sort(([a1, a2], [b1, b2]) => a1 - b1 || a2 - b2);
    // split overlapping ranges
    for (let i = 0; i < ranges.length - 1;) {
        const [r1, r2] = [ranges[i]!, ranges[i + 1]!];
        if (r2[0] > r1[1]) {
            i += 1;
            continue;
        }
        if (r1[0] < r2[0]) {
            ranges.splice(i, 0, [r1[0], r2[0] - 1, r1[2]]);
            r1[0] = r2[0];
            i += 1;
            // ensure following range is sorted correctly
            if (r1[1] > r2[1]) {
                let j = i;
                for (; j < ranges.length - 1; j += 1) {
                    const [c1, c2] = ranges[j + 1]!;
                    if (r1[0] < c1 || (r1[0] === c1 && r1[1] <= c2)) break;
                }
                // shift down ranges and swap
                for (let x = i; x < j; x += 1) ranges[x] = ranges[x + 1]!;
                ranges[j] = r1;
            }
            continue;
        }
        // merge values of the two ranges
        if (r1[2] !== r2[2]) {
            const v = merge(r1[2], r2[2]);
            if (v === null) {
                throw new Error(
                    'Invalid overlap between the following code point ranges overlap:\n\n'
                    + `  ${r1[0].toString(16)} - ${r1[1].toString(16)} (${String(r1[2])})\n`
                    + `  ${r2[0].toString(16)} - ${r2[1].toString(16)} (${String(r2[2])})`,
                );
            }
            r1[2] = v;
        }
        if (r1[1] === r2[1]) {
            // following range overlaps, remove it
            ranges.splice(i + 1, 1);
            continue;
        }
        r2[0] = r1[1] + 1;
        // ensure following range is sorted correctly
        let j = i + 1;
        for (; j < ranges.length - 1; j += 1) {
            const [c1, c2] = ranges[j + 1]!;
            if (r2[0] < c1 || (r2[0] === c1 && r2[1] <= c2)) break;
        }
        if (j > i + 1) {
            // shift down ranges and swap
            for (let x = i + 1; x < j; x += 1) ranges[x] = ranges[x + 1]!;
            ranges[j] = r2;
        } else i += 1;
    }
    return ranges;
}

/**
 * Validates that a sequence of code point ranges does not overlap and has no gaps
 */
export function validateSequentialRanges<T>(ranges: [number, number, T][]) {
    // validate range overlap
    for (let i = 0; i < ranges.length - 1; i += 1) {
        const [r1, r2] = [ranges[i]!, ranges[i + 1]!];
        if (r2[0] <= r1[1]) {
            throw new Error(
                'The following code point ranges overlap:\n'
                + ` [${r1[0].toString(16)} ${r1[1].toString(16)}] (${String(r1[2])})`
                + ` & [${r2[0].toString(16)} ${r2[1].toString(16)}] (${String(r2[2])})`,
            );
        }
        if (r2[0] - r1[1] > 1) {
            throw new Error(
                'Code point range gap:\n'
                + ` [${(r1[1] + 1).toString(16)} ${(r2[0] - 1).toString(16)}] (${r2[0] - r1[1] - 1})`,
            );
        }
    }
}

/**
 * Select up to 3 representative code points from each range to test on
 * @param ranges - code point ranges
 * @param def - fallback value for gaps between ranges
 * @returns array of selected fixtures
 */
export function selectFixtures<T extends number>(ranges: [number, number, T][], def: T): [number, T][] {
    const fixtures: [number, T][] = [];
    let prev = -1;
    for (const [cp1, cp2, value] of ranges) {
        if (cp1 - prev > 1) {
            // add lowest code point in the gap range
            fixtures.push([prev + 1, def]);
            // add median code point in the gap range
            if (cp1 - prev > 3) fixtures.push([Math.floor((prev + cp1) / 2), def]);
            // add highest code point in the gap range
            if (cp1 - prev > 2) fixtures.push([cp1 - 1, def]);
        }
        // add lowest code point in the range
        fixtures.push([cp1, value]);
        // add median code point in the range
        if (cp2 - cp1 > 1) fixtures.push([Math.floor((cp1 + cp2) / 2), value]);
        // add highest code point in the range
        if (cp2 - cp1 > 0) fixtures.push([cp2, value]);
        // update prev
        prev = cp2;
    }
    fixtures.push([prev + 1, def]);
    return fixtures;
}