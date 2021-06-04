const http = require('http');

/**
 * Fetch and parse a unicode data file
 * @param {string} path - path portion of the data file url
 * @param {boolean} [props=false] - specify if the file is a properties file, and parse accordingly
 * @returns {Promise<string[]|Object[]>}
 */
function fetchUnicodeFile(path, props = false) {
    const url = /^http:\/\//.test(path) ? path : `http://unicode.org/Public/${path}`;
    return new Promise((resolve, reject) => {
        http.get(url, {
            headers: { 'Cache-Control': 'no-cache' },
        }, (res) => {
            const { statusCode } = res;
            // check for redirect
            if (statusCode === 302) {
                // handle redirect
                const { location: redirect } = res.headers;
                if (redirect !== url) {
                    fetchUnicodeFile(redirect, props)
                        .then((result) => resolve(result))
                        .catch((err) => reject(err));
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
                let lines = data
                    .split('\n')
                    // remove comments & clean up line
                    .map((raw) => {
                        const i = raw.indexOf('#'),
                            l = i >= 0 ? raw.slice(0, i) : raw;
                        return l.split(';').slice(0, 2).join(';').trim();
                    })
                    // filter out empty lines
                    .filter(Boolean);
                // ensure response data is not corrupt
                const corrupted = lines.filter((l) => !/^[A-Z0-9 ÷×.;_-]+$/i.test(l));
                if (corrupted.length) {
                    reject(new Error(
                        `Request to fetch '${url}' returned the following corrupted lines:${
                            corrupted.slice(0, 5).map((l) => `\n * '${l}'`).join('')
                        }${corrupted.length > 5 ? `\n ... ${corrupted.length - 5} more lines` : ''}`,
                    ));
                    return;
                }
                // parse props if specified
                if (props) {
                    lines = lines.map((line) => {
                        const [cp, ...p] = line.split(/\s*;\s*/g),
                            [cp1, cp2 = cp1] = cp.split('..').map((h) => parseInt(h, 16));
                        return [cp1, cp2, ...p];
                    });
                }
                // resolve the promise
                resolve(lines);
            });
        }).on('error', (err) => {
            reject(new Error(
                `Request to fetch '${url}' failed\n`
                + `Error Code: ${err.code}\n${err.message}`,
            ));
        });
    });
}

/**
 * Merge overlapping / adjacent code point ranges
 * @param {Array[]} ranges - code point ranges
 * @returns {Array[]}
 */
function reduceRanges(ranges) {
    let i = 0;
    while (i < ranges.length - 1) {
        const [r1, r2] = [ranges[i], ranges[i + 1]];
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
 * @param {Array[]} ranges - code point ranges
 * @param {*} def - fallback value for gaps between ranges
 * @returns {Array[]}
 */
function selectFixtures(ranges, def) {
    const fixtures = [];
    let prev = 0;
    ranges.forEach(([cp1, cp2, value]) => {
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
    });
    fixtures.push([prev, def]);
    return fixtures;
}

module.exports = {
    fetchUnicodeFile,
    reduceRanges,
    selectFixtures,
};