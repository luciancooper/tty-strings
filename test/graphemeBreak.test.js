const { graphemeBreakProperty, shouldBreak, classes } = require('../lib/graphemeBreak'),
    { fetchUnicodeFile, reduceRanges, selectFixtures } = require('./unicodeHelpers');

describe('graphemeBreakProperty', () => {
    let fixtures;

    beforeAll(async () => {
        // fetch GraphemeBreakProperty.txt & emoji-data.txt unicode files
        let ranges;
        try {
            ranges = [
                // get grapheme break property data
                ...(await fetchUnicodeFile('UCD/latest/ucd/auxiliary/GraphemeBreakProperty.txt', true))
                    // convert each grapheme break property to its equivalent integer value
                    .map(([x, y, p]) => [x, y, classes[p === 'Regional_Indicator' ? 'RI' : p]]),
                // get emoji property data
                ...(await fetchUnicodeFile('UCD/latest/ucd/emoji/emoji-data.txt', true))
                    // keep only Extended_Pictographic values
                    .filter(([,, prop]) => prop === 'Extended_Pictographic')
                    // convert the Extended_Pictographic property to its equivalent integer value
                    .map(([x, y]) => [x, y, classes.ExtendedPictographic]),
            ];
        } catch (e) {
            throw new Error(`Failed to fetch grapheme break property data:\n\n${e.message}`);
        }
        // sort & reduce the ranges
        ranges = reduceRanges(ranges.sort(([a], [b]) => a - b));
        // select fixture code points
        fixtures = selectFixtures(ranges, 0);
    });

    test.each(Object.entries({ ...classes, Other: 0 }))('grapheme break property %s', (cls, value) => {
        expect(fixtures.filter(([, v]) => v === value).map(([cp]) => [cp, graphemeBreakProperty(cp)]))
            .toMatchEachCodePoint(value);
    });
});

describe('shouldBreak', () => {
    let fixtures;

    beforeAll(async () => {
        // fetch the GraphemeBreakTest.txt unicode data file
        let breakTests;
        try {
            breakTests = await fetchUnicodeFile('UCD/latest/ucd/auxiliary/GraphemeBreakTest.txt');
        } catch (e) {
            throw new Error(`Failed to fetch grapheme break test data:\n\n${e.message}`);
        }
        // remove leading & trailing '÷'
        breakTests = breakTests.map((l) => l.replace(/(?:^\s*÷\s*|\s*÷\s*$)/g, ''));
        // parse each test into individual fixtures
        fixtures = breakTests.reduce((acc, l) => {
            // split test
            const e = l.split(' ').map((x, i) => ((i % 2 === 0) ? parseInt(x, 16) : x === '÷'));
            for (let i = 1, cp = []; i < e.length; i += 2) {
                acc.push([[cp.slice(), e[i - 1], e[i + 1]], e[i]]);
                // extend code points
                cp.push(e[i - 1]);
            }
            return acc;
        }, []);
    });

    test('passes unicode grapheme break tests', () => {
        for (let i = 0; i < fixtures.length; i += 1) {
            const [[cp, prev, next], expected] = fixtures[i];
            expect(shouldBreak(
                cp.map(graphemeBreakProperty),
                graphemeBreakProperty(prev),
                graphemeBreakProperty(next),
            )).toBe(expected);
        }
    });
});