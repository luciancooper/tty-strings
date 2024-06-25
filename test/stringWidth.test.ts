import { stringWidth } from '../src';

describe('stringWidth', () => {
    test('basic strings', () => {
        expect(stringWidth('foo')).toBe(3);
    });

    test('full width characters', () => {
        expect(stringWidth('⌚⭐⺎⽋豈Ａ🚀')).toBe(14);
    });

    test('devanagari linking consonants', () => {
        expect(stringWidth('अनुच्छेद')).toBe(5);
    });

    test('precomposed hangul syllables', () => {
        // U+B38C U+C250 U+B828
        expect(stringWidth('뎌쉐련')).toBe(6);
    });

    test('decomposed hangul syllables', () => {
        // U+110D U+1166 U+1108 U+1167 U+11B4
        expect(stringWidth('쩨뼕')).toBe(4);
    });

    test('precomposed musical notes', () => {
        // U+1D15E U+1D162 U+1D1BC U+1D1BF
        expect(stringWidth('𝅗𝅥𝅘𝅥𝅰𝆺𝅥𝆹𝅥𝅯')).toBe(4);
    });

    test('decomposed musical notes', () => {
        // U+1D157 U+1D165 / U+1D158 U+1D165 U+1D170 / U+1D1BA U+1D165 / U+1D1B9 U+1D165 U+1D16F
        expect(stringWidth('𝅗𝅥𝅘𝅥𝅰𝆺𝅥𝆹𝅥𝅯')).toBe(4);
    });

    test('precomposed oriya vowels', () => {
        // U+0B4C
        expect(stringWidth('ୌ')).toBe(1);
    });

    test('decomposed oriya vowels', () => {
        // U+0B47 U+0B57
        expect(stringWidth('ୌ')).toBe(1);
    });

    test('zero width characters', () => {
        expect(stringWidth('\x08\x7F')).toBe(0);
    });

    test('ignores ansi escape sequences', () => {
        expect(stringWidth('\x1b[31mfoo\x1b[39m')).toBe(3);
    });

    test('ignores ansi hyperlinks', () => {
        expect(stringWidth('\x1b]8;;https://foo.com\x07bar\x1b]8;;\x07')).toBe(3);
    });

    test('returns 0 on non-string inputs', () => {
        expect(stringWidth(NaN as any)).toBe(0);
        expect(stringWidth(true as any)).toBe(0);
        expect(stringWidth({} as any)).toBe(0);
        expect(stringWidth([1, 2] as any)).toBe(0);
    });

    test('returns 0 on empty strings', () => {
        expect(stringWidth('')).toBe(0);
        // empty string with escape sequences
        expect(stringWidth('\x1b[31m\x1b[39m')).toBe(0);
    });

    describe('emoji', () => {
        test('presentation sequences', () => {
            expect(stringWidth('☠️')).toBe(1);
        });

        test('modifier bases', () => {
            expect(stringWidth('👩')).toBe(2);
        });

        test('modifier sequences', () => {
            expect(stringWidth('👩🏿')).toBe(2);
        });

        test('modifier characters that do not follow valid bases', () => {
            expect(stringWidth('x\u{1F3FF}')).toBe(3);
        });

        test('flag sequences', () => {
            expect(stringWidth('🇺🇸')).toBe(1);
        });

        test('tag sequences', () => {
            expect(stringWidth('🏴󠁧󠁢󠁥󠁮󠁧󠁿')).toBe(2);
        });

        test('keycap sequences', () => {
            expect(stringWidth('#️⃣')).toBe(1);
        });

        test('zwj sequences', () => {
            expect(stringWidth('👨‍❤️‍💋‍👨🏳️‍🌈')).toBe(3);
        });

        test('minimally-qualified zwj sequences', () => {
            // fully qualified sequence (woman supervillain) - 1F9B9 1F3FB 200D 2640 FE0F
            expect(stringWidth('🦹🏻‍♀️')).toBe(2);
            // minimally qualified sequence (woman supervillain) - 1F9B9 1F3FB 200D 2640
            expect(stringWidth('🦹🏻‍♀')).toBe(2);
        });

        test('unqualified zwj sequences', () => {
            // first character already has `Emoji_Presentation`
            expect(stringWidth('👨️‍⚕️')).toBe(3);
            // second character already has `Emoji_Presentation`
            expect(stringWidth('⛹️‍😕️')).toBe(3);
            // first character is not an `Emoji_Modifier_Base`
            expect(stringWidth('😕🏻‍🦰')).toBe(6);
            // second character is not an `Emoji_Modifier_Base`
            expect(stringWidth('👨‍😕🏼')).toBe(6);
            // extra `Emoji_Modifier` character after the first emoji modifier sequence
            expect(stringWidth('🙆🏾🏾‍♂️')).toBe(5);
            // extra `Emoji_Modifier` characters after the second emoji modifier sequence
            expect(stringWidth('🧑🏽‍🤝🏿🏿‍🧑🏿')).toBe(8);
        });
    });
});