import { graphemeBreakProperty, shouldBreak, GBProps, InCBProps } from '../src/graphemeBreak';
import { fetchUnicodeFile, reduceRanges, selectFixtures } from './unicodeHelpers';

type Base_GBP = typeof GBProps[keyof typeof GBProps];

describe('grapheme break base properties', () => {
    let fixtures: [number, Base_GBP][];

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
        let ranges = fetched.map<[number, number, Base_GBP]>(([x, y, k]) => [x, y, GBProps[k as keyof typeof GBProps]]);
        // sort & reduce the ranges
        ranges = reduceRanges(ranges.sort(([a], [b]) => a - b));
        // select fixture code points
        fixtures = selectFixtures(ranges, 0);
    });

    test.each(Object.entries(GBProps))('base prop %s', (cls, value: Base_GBP) => {
        expect(
            fixtures.filter(([, v]) => v === value).map(([cp]) => [cp, graphemeBreakProperty(cp) & 0xF]),
        ).toMatchEachCodePoint(value);
    });
});

type InCB_GBP = typeof InCBProps[keyof typeof InCBProps];

describe('indic conjunct props', () => {
    let fixtures: [number, InCB_GBP | 0][];

    beforeAll(async () => {
        // fetch DerivedCoreProperties.txt unicode file
        let fetched: [number, number, string][];
        try {
            fetched = (await fetchUnicodeFile('UCD/latest/ucd/DerivedCoreProperties.txt', true))
                .filter(([,, prop]) => prop === 'InCB')
                .map<[number, number, string]>(([x, y,, prop]) => [x, y, prop!]);
        } catch (e) {
            throw new Error(`Failed to fetch derived core properties data:\n\n${(e as { message: string }).message}`);
        }
        // convert each grapheme break property to its equivalent integer value
        let ranges = fetched
            .map<[number, number, InCB_GBP]>(([x, y, k]) => [x, y, InCBProps[k as keyof typeof InCBProps]]);
        // sort & reduce the ranges
        ranges = reduceRanges(ranges.sort(([a], [b]) => a - b));
        // select fixture code points
        fixtures = selectFixtures(ranges, 0);
    });

    test.each(Object.entries(InCBProps))('incb prop %s', (cls, value: InCB_GBP) => {
        expect(
            fixtures.filter(([, v]) => v === value).map(([cp]) => [cp, graphemeBreakProperty(cp) & 0xF0]),
        ).toMatchEachCodePoint(value);
    });
});

type BreakTestFixture = [number[], number, number];

describe('shouldBreak', () => {
    let fixtures: [BreakTestFixture, boolean][];

    beforeAll(async () => {
        // fetch the GraphemeBreakTest.txt unicode data file
        let breakTests: string[];
        try {
            breakTests = await fetchUnicodeFile('UCD/latest/ucd/auxiliary/GraphemeBreakTest.txt', false);
        } catch (e) {
            throw new Error(`Failed to fetch grapheme break test data:\n\n${(e as { message: string }).message}`);
        }
        // remove leading & trailing '÷'
        breakTests = breakTests.map((l) => l.replace(/(?:^\s*÷\s*|\s*÷\s*$)/g, ''));
        // parse each test into individual fixtures
        fixtures = breakTests.reduce<[BreakTestFixture, boolean][]>((acc, l) => {
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
        expect(fixtures.map(([[cp, prev, next], expected]) => [
            [...cp, prev, next],
            shouldBreak(
                cp.map(graphemeBreakProperty),
                graphemeBreakProperty(prev),
                graphemeBreakProperty(next),
            ),
            expected,
        ])).toMatchEachSequence();
    });
});