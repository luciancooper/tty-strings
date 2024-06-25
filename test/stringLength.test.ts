import { stringLength } from '../src';

describe('stringLength', () => {
    test('returns 0 on empty strings', () => {
        expect(stringLength('')).toBe(0);
        // empty string with escape sequences
        expect(stringLength('\x1b[31m\x1b[39m')).toBe(0);
    });

    test('returns 0 on non-string inputs', () => {
        expect(stringLength(NaN as any)).toBe(0);
        expect(stringLength(true as any)).toBe(0);
        expect(stringLength({} as any)).toBe(0);
        expect(stringLength([1, 2] as any)).toBe(0);
    });

    test('counts characters in basic strings', () => {
        expect(stringLength('foo')).toBe(3);
    });

    test('ignores ansi escape sequences', () => {
        expect(stringLength('\x1b[31mfoo\x1b[39m')).toBe(3);
    });

    test('ignores ansi hyperlink escape sequences', () => {
        expect(stringLength('\x1b]8;;https://foo.com\x07bar\x1b]8;;\x07')).toBe(3);
    });

    test('counts latin letters with combining diacritical marks', () => {
        expect(stringLength('Ĺo͂řȩm̅')).toBe(5);
    });

    test('counts devanagari linking consonants', () => {
        expect(stringLength('अनुच्छेद')).toBe(4);
    });

    test('counts hangul syllables', () => {
        expect(stringLength('뎌쉐련쩨뼕')).toBe(5);
    });

    test('counts emoji characters', () => {
        expect(stringLength('🌷🎁💩😜👍🇺🇸🇬🇷🏳️‍🌈🦹🏻‍♀️')).toBe(9);
    });
});