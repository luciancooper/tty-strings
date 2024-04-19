import { codePointWidth } from '../src';
import { fetchUnicodeFile, processRanges, selectFixtures } from './unicodeHelpers';

describe('codePointWidth', () => {
    let fixtures: [number, 0 | 1 | 2][];

    beforeAll(async () => {
        // fetch full width code point data file
        let ranges: [number, number, 0 | 2][];
        try {
            ranges = [
                // fetch and parse the DerivedEastAsianWidth.txt unicode data file
                ...(await fetchUnicodeFile('UCD/latest/ucd/extracted/DerivedEastAsianWidth.txt', true))
                    // keep only East_Asian_Width property values `W` and `F`
                    .filter(([,, East_Asian_Width]) => (East_Asian_Width === 'W' || East_Asian_Width === 'F'))
                    .map<[number, number, 2]>(([cp1, cp2]) => [cp1, cp2, 2]),
                // fetch and parse the DerivedCoreProperties.txt unicode data file
                ...(await fetchUnicodeFile('UCD/latest/ucd/DerivedCoreProperties.txt', true))
                    // keep only the Default_Ignorable_Code_Point code point ranges
                    .filter(([,, prop]) => prop === 'Default_Ignorable_Code_Point')
                    .map<[number, number, 0]>(([cp1, cp2]) => [cp1, cp2, 0]),
                // fetch and parse the DerivedGeneralCategory.txt unicode data file
                ...(await fetchUnicodeFile('UCD/latest/ucd/extracted/DerivedGeneralCategory.txt', true))
                    // keep only code points with General_Category values `Mn`, `Me`, and `Cc`
                    .filter(([,, gc]) => (gc === 'Mn' || gc === 'Me' || gc === 'Cc'))
                    .map<[number, number, 0]>(([cp1, cp2]) => [cp1, cp2, 0]),
            ];
        } catch (e) {
            throw new Error(`Failed to fetch code point width data:\n\n${(e as { message: string }).message}`);
        }
        // process the code point ranges
        ranges = processRanges(ranges, () => 0);
        // select fixtures
        fixtures = selectFixtures(ranges, 1);
    });

    test('full width code points', () => {
        expect(fixtures.filter(([, n]) => n === 2).map(([cp]) => [cp, codePointWidth(cp)])).toMatchEachCodePoint(2);
    });

    test('zero width code points', () => {
        expect(fixtures.filter(([, n]) => n === 0).map(([cp]) => [cp, codePointWidth(cp)])).toMatchEachCodePoint(0);
    });

    test('normal width code points', () => {
        expect(fixtures.filter(([, n]) => n === 1).map(([cp]) => [cp, codePointWidth(cp)])).toMatchEachCodePoint(1);
    });
});