import { graphemeBreakProperty, shouldBreak, GBProps, type GBP } from '../src/graphemeBreak';
import { fetchUnicodeFile, reduceRanges, selectFixtures } from './unicodeHelpers';

describe('graphemeBreakProperty', () => {
    let fixtures: [number, GBP][];

    beforeAll(async () => {
        // fetch GraphemeBreakProperty.txt & emoji-data.txt unicode files
        let fetched: [number, number, string][];
        try {
            fetched = [
                // get grapheme break property data
                ...(await fetchUnicodeFile('UCD/latest/ucd/auxiliary/GraphemeBreakProperty.txt', true))
                    .map<[number, number, string]>(([x, y, p]) => [x, y, p === 'Regional_Indicator' ? 'RI' : p!]),
                // get emoji property data
                ...(await fetchUnicodeFile('UCD/latest/ucd/emoji/emoji-data.txt', true))
                    // keep only Extended_Pictographic values
                    .filter(([,, prop]) => prop === 'Extended_Pictographic')
                    .map<[number, number, string]>(([x, y]) => [x, y, 'ExtendedPictographic']),
            ];
        } catch (e) {
            throw new Error(`Failed to fetch grapheme break property data:\n\n${(e as { message: string }).message}`);
        }
        // convert each grapheme break property to its equivalent integer value
        let ranges = fetched.map<[number, number, GBP]>(([x, y, k]) => [x, y, GBProps[k as keyof typeof GBProps]]);
        // sort & reduce the ranges
        ranges = reduceRanges(ranges.sort(([a], [b]) => a - b));
        // select fixture code points
        fixtures = selectFixtures(ranges, 0);
    });

    test.each(Object.entries(GBProps))('grapheme break property %s', (cls, value: GBP) => {
        expect(fixtures.filter(([, v]) => v === value).map(([cp]) => [cp, graphemeBreakProperty(cp)]))
            .toMatchEachCodePoint(value);
    });
});

type GBFixture = [number[], number, number];

describe('shouldBreak', () => {
    let fixtures: [GBFixture, boolean][];

    beforeAll(async () => {
        // fetch the GraphemeBreakTest.txt unicode data file
        let breakTests: string[];
        try {
            breakTests = await fetchUnicodeFile('15.0.0/ucd/auxiliary/GraphemeBreakTest.txt', false);
        } catch (e) {
            throw new Error(`Failed to fetch grapheme break test data:\n\n${(e as { message: string }).message}`);
        }
        // remove leading & trailing '÷'
        breakTests = breakTests.map((l) => l.replace(/(?:^\s*÷\s*|\s*÷\s*$)/g, ''));
        // parse each test into individual fixtures
        fixtures = breakTests.reduce<[GBFixture, boolean][]>((acc, l) => {
            // split test (each line goes cp, ×|÷, cp, ×|÷, cp, etc..)
            const e = l.split(' ').map((x, i) => ((i % 2 === 0) ? parseInt(x, 16) : x === '÷'));
            for (let i = 1, cp: number[] = []; i < e.length; i += 2) {
                acc.push([[cp.slice(), e[i - 1] as number, e[i + 1] as number], e[i] as boolean]);
                // extend code points
                cp.push(e[i - 1] as number);
            }
            return acc;
        }, []);
    });

    test('passes unicode grapheme break tests', () => {
        for (const [[cp, prev, next], expected] of fixtures) {
            expect(shouldBreak(
                cp.map(graphemeBreakProperty),
                graphemeBreakProperty(prev),
                graphemeBreakProperty(next),
            )).toBe(expected);
        }
    });
});