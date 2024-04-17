import { stringWidth } from '../src';

describe('stringWidth', () => {
    test('measures basic strings', () => {
        expect(stringWidth('foo')).toBe(3);
    });

    test('measures full width characters', () => {
        expect(stringWidth('⌚⭐⺎⽋豈Ａ🚀')).toBe(14);
    });

    test('measures indic linking consonants', () => {
        expect(stringWidth('अनुच्छेद')).toBe(5);
    });

    test('measures zero width characters', () => {
        expect(stringWidth('\x08\x7F')).toBe(0);
    });

    test('ignores ansi escape sequences', () => {
        expect(stringWidth('\u001B[31mfoo\u001B[39m')).toBe(3);
    });

    test('ignores ansi hyperlinks', () => {
        expect(stringWidth('\u001B]8;;https://foo.com\u0007bar\u001B]8;;\u0007')).toBe(3);
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
        expect(stringWidth('\u001b[31m\u001b[39m')).toBe(0);
    });

    describe('measures emoji', () => {
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