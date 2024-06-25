import { graphemeBreakProperty, isGraphemeBase, shouldBreak, GBProps, InCBProps, Emoji_Modifier } from '../src/graphemeBreak';
import { fetchUnicodeFile, processRanges, selectFixtures, validateSequentialRanges } from './unicodeHelpers';

describe('graphemeBreakProperty', () => {
    let fixtures: [number, number][];

    beforeAll(async () => {
        let ranges: [number, number, number][];
        try {
            ranges = processRanges<number>([
                // fetch GraphemeBreakProperty.txt unicode file data
                ...(await fetchUnicodeFile('UCD/latest/ucd/auxiliary/GraphemeBreakProperty.txt', true))
                    .map<[number, number, number]>(([x, y, p]) => (
                    [x, y, GBProps[(p === 'Regional_Indicator' ? 'RI' : p!) as keyof typeof GBProps]]
                )),
                // fetch emoji-data.txt unicode file data
                ...(await fetchUnicodeFile('UCD/latest/ucd/emoji/emoji-data.txt', true))
                    // keep only Extended_Pictographic & Emoji_Modifier properties
                    .filter(([,, prop]) => prop === 'Extended_Pictographic' || prop === 'Emoji_Modifier')
                    .map<[number, number, number]>(([x, y, p]) => (
                    [x, y, p === 'Extended_Pictographic' ? GBProps.ExtendedPictographic : Emoji_Modifier]
                )),
                // fetch DerivedCoreProperties.txt unicode file data
                ...(await fetchUnicodeFile('UCD/latest/ucd/DerivedCoreProperties.txt', true))
                    .filter(([,, prop]) => prop === 'InCB')
                    // convert each incb property to its equivalent integer value
                    .map<[number, number, number]>(([x, y,, k]) => [x, y, InCBProps[k as keyof typeof InCBProps]]),
            ], (a, b) => a | b);
        } catch (e) {
            throw new Error(`Failed to fetch unicode data:\n\n${(e as { message: string }).message}`);
        }
        // select fixture code points
        fixtures = selectFixtures(ranges, 0);
    });

    test.each(Object.entries(GBProps))('base prop %s', (cls, value) => {
        const matching = fixtures.filter(([, v]) => (v & 0xF) === value);
        expect(matching.map(([cp]) => [cp, graphemeBreakProperty(cp) & 0xF])).toMatchEachCodePoint(value);
    });

    test.each(Object.entries(InCBProps))('incb prop InCB_%s', (cls, value) => {
        const matching = fixtures.filter(([, v]) => (v & 0xF0) === value);
        expect(matching.map(([cp]) => [cp, graphemeBreakProperty(cp) & 0xF0])).toMatchEachCodePoint(value);
    });

    test('additional prop Emoji_Modifier', () => {
        const matching = fixtures.filter(([, v]) => (v & 0xF0) === Emoji_Modifier);
        expect(matching.map(([cp]) => [cp, graphemeBreakProperty(cp) & 0xF0])).toMatchEachCodePoint(Emoji_Modifier);
    });
});

describe('isGraphemeBase', () => {
    let tests: [number, string, boolean, boolean][];

    beforeAll(async () => {
        // fetch DerivedGeneralCategory.txt unicode file
        let GeneralCategory: [number, number, string][];
        try {
            GeneralCategory = (await fetchUnicodeFile('UCD/latest/ucd/extracted/DerivedGeneralCategory.txt', true))
                .sort(([a], [b]) => a - b) as [number, number, string][];
        } catch (e) {
            throw new Error(`Failed to fetch general category data:\n\n${(e as { message: string }).message}`);
        }
        // validate general category data
        validateSequentialRanges(GeneralCategory);
        // fetchDerivedCoreProperties.txt unicode file
        let GraphemeBaseData: [number, number, string][];
        try {
            GraphemeBaseData = (await fetchUnicodeFile('UCD/latest/ucd/DerivedCoreProperties.txt', true))
                .filter(([,, prop]) => prop === 'Grapheme_Base')
                .sort(([a], [b]) => a - b) as [number, number, string][];
        } catch (e) {
            throw new Error(`Failed to fetch derived core properties data:\n\n${(e as { message: string }).message}`);
        }
        // process Grapheme_Base data ranges
        let last = 0;
        const GraphemeBase: [number, number, boolean][] = [];
        for (const [r1, r2] of GraphemeBaseData) {
            if (r1 > last) GraphemeBase.push([last, r1 - 1, false]);
            GraphemeBase.push([r1, r2, true]);
            last = r2 + 1;
        }
        const max = GeneralCategory[GeneralCategory.length - 1]![1];
        if (max >= last) GraphemeBase.push([last, max, false]);
        // merge ranges together
        const ranges = processRanges<{ GC: string | null, GB: boolean | null }>([
            ...GeneralCategory.map<[number, number, { GC: string | null, GB: boolean | null }]>(
                ([a, b, GC]) => [a, b, { GC, GB: null }],
            ),
            ...GraphemeBase.map<[number, number, { GC: string | null, GB: boolean | null }]>(
                ([a, b, GB]) => [a, b, { GC: null, GB }],
            ),
        ], (a, b) => ({ GC: a.GC ?? b.GC, GB: a.GB ?? b.GB }));
        // validate that there is no range overlap or gaps between ranges
        validateSequentialRanges(ranges);
        // select fixtures
        tests = [];
        for (const [cp1, cp2, { GC, GB }] of ranges) {
            // validate general category and grapheme base value
            if (GC === null || GB === null) {
                throw new Error(
                    'Invalid Grapheme_Base fixture range:\n'
                    + `[${cp1.toString(16)} ${cp1.toString(16)}] GeneralCateogry: ${GC} GraphemeBase: ${GB}`,
                );
            }
            tests.push([cp1, GC, GB, isGraphemeBase(cp1, graphemeBreakProperty(cp1))]);
            // add median code point in the range
            if (cp2 - cp1 > 1) {
                const mid = Math.floor((cp1 + cp2) / 2);
                tests.push([mid, GC, GB, isGraphemeBase(mid, graphemeBreakProperty(mid))]);
            }
            // add highest code point in the range
            if (cp2 - cp1 > 0) tests.push([cp2, GC, GB, isGraphemeBase(cp1, graphemeBreakProperty(cp1))]);
        }
    });

    test('does not produce false negatives', () => {
        expect(tests.filter(([,, expected, recieved]) => (expected && !recieved))).toHaveLength(0);
    });

    test('all false positives are general category Cn, Co, or Cs', () => {
        const falsePositives = tests
            .filter(([,, expected, recieved]) => (!expected && recieved))
            .filter(([, gc]) => !['Cn', 'Co', 'Cs'].includes(gc));
        expect(falsePositives).toHaveLength(0);
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