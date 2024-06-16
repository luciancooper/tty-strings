import { charWidths } from '../src';

describe('charWidths', () => {
    test('handles zero-length strings', () => {
        expect([...charWidths('')]).toStrictEqual([]);
    });

    test('handles non-string inputs', () => {
        expect([...charWidths(NaN as any)]).toStrictEqual([]);
    });

    test('handles basic latin characters', () => {
        expect([...charWidths('foo')]).toStrictEqual([['f', 1], ['o', 1], ['o', 1]]);
    });

    test('does not split between a carriage return & line feed', () => {
        expect([...charWidths('a\r\nb')]).toStrictEqual([['a', 1], ['\r\n', 0], ['b', 1]]);
    });

    test('handles characters with combining diacritical marks', () => {
        expect([...charWidths('Ĺo͂řȩm̅')]).toStrictEqual([['Ĺ', 1], ['o͂', 1], ['ř', 1], ['ȩ', 1], ['m̅', 1]]);
    });

    test('handles hindi characters with combining marks', () => {
        expect([...charWidths('अनुच्छेद')]).toStrictEqual([['अ', 1], ['नु', 1], ['च्छे', 2], ['द', 1]]);
    });

    test('handles hangul syllable characters', () => {
        expect([...charWidths('뎌쉐련')]).toStrictEqual([['뎌', 2], ['쉐', 2], ['련', 2]]);
        // dynamically composed hangul syllables must be normalized first
        expect([...charWidths('쩨뼕'.normalize('NFC'))]).toStrictEqual([['쩨', 2], ['뼕', 2]]);
    });

    test('handles emoji characters', () => {
        // basic emoji
        expect([...charWidths('🌷🎁💩😜👍')]).toStrictEqual([['🌷', 2], ['🎁', 2], ['💩', 2], ['😜', 2], ['👍', 2]]);
        // presentation sequences
        expect([...charWidths('♠️♣️♥️♦️')]).toStrictEqual([['♠️', 1], ['♣️', 1], ['♥️', 1], ['♦️', 1]]);
        // modifier bases & modifier sequences
        expect([...charWidths('👩👩🏿')]).toStrictEqual([['👩', 2], ['👩🏿', 2]]);
        // flag sequences
        expect([...charWidths('🇨🇵🇺🇸🇪🇸')]).toStrictEqual([['🇨🇵', 1], ['🇺🇸', 1], ['🇪🇸', 1]]);
        // tag sequences
        expect([...charWidths('🏴󠁧󠁢󠁥󠁮󠁧󠁿🏴󠁧󠁢󠁳󠁣󠁴󠁿🏴󠁧󠁢󠁷󠁬󠁳󠁿')]).toStrictEqual([['🏴󠁧󠁢󠁥󠁮󠁧󠁿', 2], ['🏴󠁧󠁢󠁳󠁣󠁴󠁿', 2], ['🏴󠁧󠁢󠁷󠁬󠁳󠁿', 2]]);
        // keycap sequences
        expect([...charWidths('#️⃣*️⃣6️⃣')]).toStrictEqual([['#️⃣', 1], ['*️⃣', 1], ['6️⃣', 1]]);
        // zwj sequences
        expect([...charWidths('👨‍❤️‍💋‍👨👨‍👩‍👧‍👧🧑🏾‍🚀🦹🏻‍♀️')]).toStrictEqual([['👨‍❤️‍💋‍👨', 2], ['👨‍👩‍👧‍👧', 2], ['🧑🏾‍🚀', 2], ['🦹🏻‍♀️', 2]]);
    });
});