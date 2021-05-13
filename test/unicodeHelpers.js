const https = require('https');

/**
 * Fetch and parse a unicode data file
 * @param {string} path - path portion of the data file url
 * @param {boolean} [props=false] - specify if the file is a properties file, and parse accordingly
 * @returns {string[]|Object[]}
 */
function fetchUnicodeFile(path, props = false) {
    const url = `https://unicode.org/Public/${path}`;
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
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
                        // remove comments
                        .map((l) => {
                            const i = l.indexOf('#');
                            return (i >= 0 ? l.slice(0, i) : l).trim();
                        })
                        // filter out empty lines
                        .filter(Boolean);
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
            } else {
                reject(new Error(`Could not fetch '${url}'`));
            }
        }).on('error', (err) => {
            reject(err);
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