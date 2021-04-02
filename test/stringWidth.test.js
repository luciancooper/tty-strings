const { stringWidth } = require('..');

describe('stringWidth', () => {
    test('measures basic strings', () => {
        expect(stringWidth('foo')).toBe(3);
    });

    test('measures full width characters', () => {
        expect(stringWidth('⌚⭐⺎⽋豈Ａ🚀')).toBe(14);
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

    test('returns 0 on NaN', () => {
        expect(stringWidth(NaN)).toBe(0);
    });
});