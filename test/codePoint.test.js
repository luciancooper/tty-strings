const codePointWidth = require('../lib/codePoint'),
    { fetchUnicodeFile, reduceRanges, selectFixtures } = require('./unicodeHelpers');

describe('codePointWidth', () => {
    let fixtures;

    beforeAll(async () => {
        // fetch full width code point data file
        let full;
        try {
            full = await fetchUnicodeFile('UCD/latest/ucd/extracted/DerivedEastAsianWidth.txt', true);
        } catch (e) {
            throw new Error(`Failed to fetch full width code point data:\n\n${e.message}`);
        }
        // keep only East_Asian_Width property values `W` and `F`
        full = full.filter(([,, East_Asian_Width]) => (East_Asian_Width === 'W' || East_Asian_Width === 'F'))
            .map(([cp1, cp2]) => [cp1, cp2, 2])
            .sort(([a], [b]) => a - b);
        // reduce full width ranges
        full = reduceRanges(full);
        // fetch zero width code point data files
        let zero;
        try {
            zero = [
                // fetch and parse the DerivedCoreProperties.txt unicode data file
                ...(await fetchUnicodeFile('UCD/latest/ucd/DerivedCoreProperties.txt', true))
                    // keep only the Default_Ignorable_Code_Point code point ranges
                    .filter(([,, prop]) => prop === 'Default_Ignorable_Code_Point'),
                // fetch and parse the DerivedGeneralCategory.txt unicode data file
                ...(await fetchUnicodeFile('UCD/latest/ucd/extracted/DerivedGeneralCategory.txt', true))
                    // keep only code points with General_Category values `Mn`, `Me`, and `Cc`
                    .filter(([,, gc]) => (gc === 'Mn' || gc === 'Me' || gc === 'Cc')),
            ];
        } catch (e) {
            throw new Error(`Failed to fetch zero width code point data:\n\n${e.message}`);
        }
        // sort zero width ranges
        zero = zero.map(([cp1, cp2]) => [cp1, cp2, 0]).sort(([a], [b]) => a - b);
        // reduce zero width ranges
        zero = reduceRanges(zero);
        // initialize array to store merged ranges
        const merged = [];
        // merge ranges together
        let [i, j] = [0, 0],
            [x1, x2] = full[i],
            [y1, y2] = zero[j];
        while (i < full.length && j < zero.length) {
            if (x2 < y1) {
                // [x1 ... x2] ... [y1 ... y2]
                merged.push([x1, x2, 2]);
                i += 1;
                [x1, x2] = full[i] || [];
                continue;
            }
            if (y2 < x1) {
                // [y1 ... y2] ... [x1 ... x2]
                merged.push([y1, y2, 0]);
                j += 1;
                [y1, y2] = zero[j] || [];
                continue;
            }
            if (x1 < y1) {
                // [x1 ... [y1 ... x2] ... y2]
                merged.push([x1, y1 - 1, 2]);
                x1 = y1;
            } else if (y1 < x1) {
                // [y1 ... [x1 ... y2] ... x2]
                merged.push([y1, x1 - 1, 0]);
                y1 = x1;
            }
            merged.push([x1, Math.min(x2, y2), 0]);
            if (x2 < y2) {
                // [[(x1, y1) ... x2] ... y2]
                y1 = x2 + 1;
                i += 1;
                [x1, x2] = full[i] || [];
            } else if (y2 < x2) {
                // [[(x1, y1) ... y1] ... x2]
                x1 = y2 + 1;
                j += 1;
                [y1, y2] = zero[j] || [];
            } else {
                // [(x1, y1) ... (x2, y2)]
                i += 1;
                j += 1;
                [x1, x2] = full[i] || [];
                [y1, y2] = zero[j] || [];
            }
        }
        while (i < full.length) {
            merged.push([x1, x2, 2]);
            i += 1;
            [x1, x2] = full[i] || [];
        }
        while (j < zero.length) {
            merged.push([y1, y2, 0]);
            j += 1;
            [y1, y2] = zero[j] || [];
        }
        // select fixtures
        fixtures = selectFixtures(reduceRanges(merged), 1);
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