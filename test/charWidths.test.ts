import { charWidths } from '../src';

describe('charWidths', () => {
    test('zero-length strings', () => {
        expect([...charWidths('')]).toStrictEqual([]);
    });

    test('non-string inputs', () => {
        expect([...charWidths(NaN as any)]).toStrictEqual([]);
    });

    test('basic latin characters', () => {
        expect([...charWidths('foo')]).toStrictEqual([['f', 1], ['o', 1], ['o', 1]]);
    });

    test('does not split between a carriage return & line feed', () => {
        expect([...charWidths('a\r\nb')]).toStrictEqual([['a', 1], ['\r\n', 0], ['b', 1]]);
    });

    test('characters with combining diacritical marks', () => {
        expect([...charWidths('Ĺo͂řȩm̅')]).toStrictEqual([['Ĺ', 1], ['o͂', 1], ['ř', 1], ['ȩ', 1], ['m̅', 1]]);
    });

    test('devanagari linking consonants', () => {
        expect([...charWidths('अनुच्छेद')]).toStrictEqual([['अ', 1], ['नु', 1], ['च्छे', 2], ['द', 1]]);
    });

    test('precomposed hangul syllables', () => {
        // U+B38C U+C250 U+B828
        expect([...charWidths('뎌쉐련')]).toStrictEqual([['뎌', 2], ['쉐', 2], ['련', 2]]);
    });

    test('decomposed hangul syllables', () => {
        // U+110D U+1166 U+1108 U+1167 U+11B4
        expect([...charWidths('쩨뼕')]).toStrictEqual([['쩨', 2], ['뼕', 2]]);
    });

    test('precomposed musical notes', () => {
        // U+1D15E U+1D162 U+1D1BC U+1D1BF
        expect([...charWidths('𝅗𝅥𝅘𝅥𝅰𝆺𝅥𝆹𝅥𝅯')]).toStrictEqual([['𝅗𝅥', 1], ['𝅘𝅥𝅰', 1], ['𝆺𝅥', 1], ['𝆹𝅥𝅯', 1]]);
    });

    test('decomposed musical notes', () => {
        // U+1D157 U+1D165 / U+1D158 U+1D165 U+1D170 / U+1D1BA U+1D165 / U+1D1B9 U+1D165 U+1D16F
        expect([...charWidths('𝅗𝅥𝅘𝅥𝅰𝆺𝅥𝆹𝅥𝅯')]).toStrictEqual([['𝅗𝅥', 1], ['𝅘𝅥𝅰', 1], ['𝆺𝅥', 1], ['𝆹𝅥𝅯', 1]]);
    });

    test('precomposed oriya vowels', () => {
        // U+0B4C
        expect([...charWidths('ୌ')]).toStrictEqual([['ୌ', 1]]);
    });

    test('decomposed oriya vowels', () => {
        // U+0B47 U+0B57
        expect([...charWidths('ୌ')]).toStrictEqual([['ୌ', 1]]);
    });

    describe('emoji', () => {
        test('basic emoji', () => {
            expect([...charWidths('🌷🎁💩😜👍')]).toStrictEqual([
                ['🌷', 2], ['🎁', 2], ['💩', 2], ['😜', 2], ['👍', 2],
            ]);
        });

        test('presentation sequences', () => {
            expect([...charWidths('♠️♣️♥️♦️')]).toStrictEqual([['♠️', 1], ['♣️', 1], ['♥️', 1], ['♦️', 1]]);
        });

        test('modifier bases & modifier sequences', () => {
            expect([...charWidths('👩👩🏿')]).toStrictEqual([['👩', 2], ['👩🏿', 2]]);
        });

        test('flag sequences', () => {
            expect([...charWidths('🇨🇵🇺🇸🇪🇸')]).toStrictEqual([['🇨🇵', 1], ['🇺🇸', 1], ['🇪🇸', 1]]);
        });

        test('tag sequences', () => {
            expect([...charWidths('🏴󠁧󠁢󠁥󠁮󠁧󠁿🏴󠁧󠁢󠁳󠁣󠁴󠁿🏴󠁧󠁢󠁷󠁬󠁳󠁿')]).toStrictEqual([['🏴󠁧󠁢󠁥󠁮󠁧󠁿', 2], ['🏴󠁧󠁢󠁳󠁣󠁴󠁿', 2], ['🏴󠁧󠁢󠁷󠁬󠁳󠁿', 2]]);
        });

        test('keycap sequences', () => {
            expect([...charWidths('#️⃣*️⃣6️⃣')]).toStrictEqual([['#️⃣', 1], ['*️⃣', 1], ['6️⃣', 1]]);
        });

        test('zwj sequences', () => {
            expect([...charWidths('👨‍❤️‍💋‍👨👨‍👩‍👧‍👧🧑🏾‍🚀🦹🏻‍♀️')]).toStrictEqual([['👨‍❤️‍💋‍👨', 2], ['👨‍👩‍👧‍👧', 2], ['🧑🏾‍🚀', 2], ['🦹🏻‍♀️', 2]]);
        });
    });
});