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
 * Merge overlapping / adjacent code point ranges
 * @param ranges - code point ranges to merge
 * @returns merged code point ranges
 */
export function reduceRanges<T extends number>(ranges: [number, number, T][]) {
    let i = 0;
    while (i < ranges.length - 1) {
        const [r1, r2] = [ranges[i]!, ranges[i + 1]!];
        if (r2[0] - r1[1] <= 1 && r1[2] === r2[2]) {
            // merge the two ranges
            r1[1] = Math.max(r1[1], r2[1]);
            ranges.splice(i + 1, 1);
        } else i += 1;
    }
    return ranges;
}

/**
 * Select up to 3 representative code points from each range to test on
 * @param ranges - code point ranges
 * @param def - fallback value for gaps between ranges
 * @returns array of selected fixtures
 */
export function selectFixtures<T extends number>(ranges: [number, number, T][], def: T): [number, T][] {
    const fixtures: [number, T][] = [];
    let prev = 0;
    for (const [cp1, cp2, value] of ranges) {
        if (cp1 - prev) {
            // add lowest code point in the gap range
            fixtures.push([prev, def]);
            // add median code point in the gap range
            if (cp1 - prev > 2) fixtures.push([Math.floor((prev + cp1 - 1) / 2), def]);
            // add highest code point in the gap range
            if (cp1 - prev > 1) fixtures.push([cp1 - 1, def]);
        }
        // add lowest code point in the range
        fixtures.push([cp1, value]);
        // add median code point in the range
        if (cp2 - cp1 > 1) fixtures.push([Math.floor((cp1 + cp2) / 2), value]);
        // add highest code point in the range
        if (cp2 - cp1 > 0) fixtures.push([cp2, value]);
        // update prev
        prev = cp2 + 1;
    }
    fixtures.push([prev, def]);
    return fixtures;
}