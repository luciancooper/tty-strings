const { graphemeBreakProperty, shouldBreak, classes } = require('../lib/graphemeBreak'),
    { fetchUnicodeFile, reduceRanges, selectFixtures } = require('./unicodeHelpers');

describe('graphemeBreakProperty', () => {
    let fixtures;

    beforeAll(async () => {
        const ranges = reduceRanges([
            // fetch and parse the GraphemeBreakProperty.txt unicode data file
            ...(await fetchUnicodeFile('UCD/latest/ucd/auxiliary/GraphemeBreakProperty.txt', true))
                // convert each grapheme break property to its equivalent integer value
                .map(([x, y, p]) => [x, y, classes[p === 'Regional_Indicator' ? 'RI' : p]]),
            // fetch and parse the emoji-data.txt unicode data file
            ...(await fetchUnicodeFile('UCD/latest/ucd/emoji/emoji-data.txt', true))
                // keep only Extended_Pictographic values
                .filter(([,, prop]) => prop === 'Extended_Pictographic')
                // convert the Extended_Pictographic property to its equivalent integer value
                .map(([x, y]) => [x, y, classes.ExtendedPictographic]),
        ].sort(([a], [b]) => a - b));
        // select fixture code points
        fixtures = selectFixtures(ranges, 0);
    });

    test.each(Object.entries({ ...classes, Other: 0 }))('grapheme break property %s', (cls, value) => {
        const fixtureSelection = fixtures.filter(([, v]) => v === value);
        for (let i = 0, n = fixtureSelection.length; i < n; i += 1) {
            const [cp] = fixtureSelection[i];
            expect(graphemeBreakProperty(cp)).toBe(value);
        }
    });
});

describe('shouldBreak', () => {
    let fixtures;

    beforeAll(async () => {
        // fetch and parse the GraphemeBreakTest.txt unicode data file
        const breakTests = (await fetchUnicodeFile('UCD/latest/ucd/auxiliary/GraphemeBreakTest.txt'))
            // remove leading & trailing '÷'
            .map((l) => l.replace(/(?:^\s*÷\s*|\s*÷\s*$)/g, ''));
        // initialize fixtures array
        fixtures = [];
        // parse each test into individual fixtures
        breakTests.forEach((l) => {
            // split test
            const e = l.split(' ').map((x, i) => ((i % 2 === 0) ? parseInt(x, 16) : x === '÷'));
            for (let i = 1, cp = []; i < e.length; i += 2) {
                fixtures.push([[cp.slice(), e[i - 1], e[i + 1]], e[i]]);
                // extend code points
                cp.push(e[i - 1]);
            }
        });
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