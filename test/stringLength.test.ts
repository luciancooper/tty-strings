import { stringLength } from '../src';

describe('stringLength', () => {
    test('returns 0 on empty strings', () => {
        expect(stringLength('')).toBe(0);
        // empty string with escape sequences
        expect(stringLength('\u001b[31m\u001b[39m')).toBe(0);
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
        expect(stringLength('\u001B[31mfoo\u001B[39m')).toBe(3);
    });

    test('ignores ansi hyperlink escape sequences', () => {
        expect(stringLength('\u001B]8;;https://foo.com\u0007bar\u001B]8;;\u0007')).toBe(3);
    });

    test('counts latin letters with combining diacritical marks', () => {
        expect(stringLength('Ĺo͂řȩm̅')).toBe(5);
    });

    test('counts hindi letters with combining marks', () => {
        expect(stringLength('अनुच्छेद')).toBe(5);
    });

    test('counts hangul syllables', () => {
        expect(stringLength('뎌쉐련쩨뼕')).toBe(5);
    });

    test('counts emoji characters', () => {
        expect(stringLength('🌷🎁💩😜👍🇺🇸🇬🇷🏳️‍🌈🦹🏻‍♀️')).toBe(9);
    });
});