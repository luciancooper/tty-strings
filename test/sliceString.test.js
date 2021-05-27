const { sliceChars, sliceColumns } = require('..');

describe('sliceChars', () => {
    test('return an empty string if beginIndex >= endIndex', () => {
        expect(sliceChars('foobar', 2, 2)).toBe('');
        expect(sliceChars('foobar', 4, 2)).toBe('');
    });

    test('handles non-string inputs', () => {
        expect(sliceChars(NaN)).toBe('NaN');
    });

    test('treats negative beginIndex values as length + beginIndex', () => {
        expect(sliceChars('foobar', -3)).toBe('bar');
        expect(sliceChars('foobar', -5, 4)).toBe('oob');
    });

    test('treats negative endIndex values as length + endIndex', () => {
        expect(sliceChars('foobar', 0, -3)).toBe('foo');
        expect(sliceChars('foobar', 1, -2)).toBe('oob');
    });

    test('slices surrogate pairs', () => {
        expect(sliceChars('a\u{D834}\u{DD1E}bc', 0, 2)).toBe('a\u{D834}\u{DD1E}');
    });

    test('slices ansi escape sequences', () => {
        expect(sliceChars('fo\u001b[31mob\u001b[39mar', 0, 2)).toBe('fo');
        expect(sliceChars('fo\u001b[31mob\u001b[39mar', 4, 6)).toBe('ar');
        expect(sliceChars('fo\u001b[31mob\u001b[39mar', 1, 5)).toBe('o\u001b[31mob\u001b[39ma');
        expect(sliceChars('\u001b[31mfoo\u001b[39m\u001b[32mbar\u001b[39m', 1, 5))
            .toBe('\u001b[31moo\u001b[39m\u001b[32mba\u001b[39m');
    });

    test('slices strings with both foreground & background styling', () => {
        expect(sliceChars('\u001b[41m\u001b[33mfoobar\u001b[39m\u001b[49m', 1, 5))
            .toBe('\u001b[41m\u001b[33mooba\u001b[39m\u001b[49m');
        expect(sliceChars('\u001b[41mf\u001b[33mooba\u001b[39mr\u001b[49m', 2, 4))
            .toBe('\u001b[41m\u001b[33mob\u001b[39m\u001b[49m');
        expect(sliceChars('fo\u001b[41m\u001b[33mob\u001b[39m\u001b[49mar', 1, 5))
            .toBe('o\u001b[41m\u001b[33mob\u001b[39m\u001b[49ma');
    });

    test('ignores empty escape sequences', () => {
        // slice begins immediately after an empty escape sequence
        expect(sliceChars('fo\u001b[42m\u001b[49m\u001b[41mob\u001b[49mar', 1, 5)).toBe('o\u001b[41mob\u001b[49ma');
        // slice ends immediately before an empty escape sequence
        expect(sliceChars('fo\u001b[41mob\u001b[49ma\u001b[42m\u001b[49mr', 1, 5)).toBe('o\u001b[41mob\u001b[49ma');
        // slice spans an empty escape sequence
        expect(sliceChars('fo\u001b[41mo\u001b[32m\u001b[39mb\u001b[49mar', 1, 5)).toBe('o\u001b[41mob\u001b[49ma');
        // string ends in an empty escape sequence
        expect(sliceChars('fo\u001b[41mob\u001b[49mar\u001b[32m\u001b[39m', 1)).toBe('o\u001b[41mob\u001b[49mar');
    });

    test('handles unclosed escape sequences', () => {
        // inputs contain unclosed foreground codes
        expect(sliceChars('\u001b[32mfoobar')).toBe('\u001b[32mfoobar\u001b[39m');
        expect(sliceChars('\u001b[32mfoobar', 1, 5)).toBe('\u001b[32mooba\u001b[39m');
        // inputs contain unclosed foreground & background codes
        expect(sliceChars('\u001b[41m\u001b[32mfoobar')).toBe('\u001b[41m\u001b[32mfoobar\u001b[39m\u001b[49m');
        expect(sliceChars('\u001b[41m\u001b[32mfoobar', 1, 5)).toBe('\u001b[41m\u001b[32mooba\u001b[39m\u001b[49m');
    });

    test('ignores unnecessary opening escape sequences', () => {
        // string ends with an opening 31m code, which should not appear in the result
        expect(sliceChars('foo\u001b[32mbar\u001b[39m\u001b[31m', 4)).toBe('\u001b[32mar\u001b[39m');
        // the slice range ends on an opening 31m code, which should not appear in the result
        expect(sliceChars('foo\u001b[32mba\u001b[31mr\u001b[39m', 3, 5)).toBe('\u001b[32mba\u001b[39m');
    });

    test('does not add unnecessary closing escape sequences', () => {
        // all slice should have 2 foreground color opening codes and be closed with a single `\u001b[39m`
        expect(sliceChars('\u001b[31m\u001b[32mfoo', 1)).toBe('\u001b[31m\u001b[32moo\u001b[39m');
        expect(sliceChars('\u001b[31m\u001b[33mfoo\u001b[39mbar', 0, 4)).toBe('\u001b[31m\u001b[33mfoo\u001b[39mb');
        expect(sliceChars('\u001b[31mf\u001b[33moo\u001b[39mbar', 1, 4)).toBe('\u001b[31m\u001b[33moo\u001b[39mb');
    });

    test('handles unknown ansi style codes', () => {
        // unknown escape sequence \u001b[1001m should be closed by a reset sequence \u001b[0m
        expect(sliceChars('\u001b[1001mfoobar\u001b[49m', 0, 3)).toBe('\u001b[1001mfoo\u001b[0m');
    });

    test('handles reset escape sequences', () => {
        // both foreground and background are closed by a reset sequence (\u001b[0m)
        expect(sliceChars('\u001b[32mfoo\u001b[41mbar\u001b[0m', 2)).toBe('\u001b[32mo\u001b[41mbar\u001b[0m');
    });

    test('slices hyperlink escape sequences', () => {
        // slice within a link
        expect(sliceChars('\u001b]8;;link\u0007foobar\u001b]8;;\u0007', 0, 3))
            .toBe('\u001b]8;;link\u0007foo\u001b]8;;\u0007');
        // slice begins outside link and ends inside link
        expect(sliceChars('fo\u001b]8;;link\u0007ob\u001b]8;;\u0007ar', 0, 3))
            .toBe('fo\u001b]8;;link\u0007o\u001b]8;;\u0007');
        // slice spans the link
        expect(sliceChars('fo\u001b]8;;link\u0007ob\u001b]8;;\u0007ar', 1, 5))
            .toBe('o\u001b]8;;link\u0007ob\u001b]8;;\u0007a');
        // slice adjacent hyperlinks
        expect(sliceChars('\u001b]8;;link1\u0007foo\u001b]8;;\u0007\u001b]8;;link2\u0007bar\u001b]8;;\u0007', 3, 5))
            .toBe('\u001b]8;;link2\u0007ba\u001b]8;;\u0007');
    });

    test('slices hyperlink escape sequences that contain style sequences', () => {
        // color styling contained in link text
        expect(sliceChars('\u001b]8;;link\u0007\u001b[41mfoo\u001b[49mbar\u001b]8;;\u0007', 2, 6))
            .toBe('\u001b]8;;link\u0007\u001b[41mo\u001b[49mbar\u001b]8;;\u0007');
        // link and color styling overlap
        expect(sliceChars('\u001b]8;;link\u0007fo\u001b[32mob\u001b]8;;\u0007ar\u001b[39m', 2))
            .toBe('\u001b]8;;link\u0007\u001b[32mob\u001b]8;;\u0007ar\u001b[39m');
    });

    test('handles unclosed hyperlink escape sequences', () => {
        expect(sliceChars('\u001b]8;;link1\u0007foo\u001b]8;;link2\u0007bar', 3))
            .toBe('\u001b]8;;link1\u0007\u001b]8;;link2\u0007bar\u001b]8;;\u0007');
    });

    test('supports 8 bit color escape sequences', () => {
        // foreground 55 & background 176
        expect(sliceChars('\u001b[38;5;55m\u001b[48;5;176mfoobar\u001b[49m\u001b[39m', 0, 3))
            .toBe('\u001b[38;5;55m\u001b[48;5;176mfoo\u001b[49m\u001b[39m');
    });

    test('supports 24 bit color escape sequences', () => {
        // foreground #6134eb & background #ccc0f0
        expect(sliceChars('\u001b[38;2;97;52;235m\u001b[48;2;204;192;240mfoobar\u001b[49m\u001b[39m', 0, 3))
            .toBe('\u001b[38;2;97;52;235m\u001b[48;2;204;192;240mfoo\u001b[49m\u001b[39m');
    });

    test('ignores escape sequences that are not styles or hyperlinks', () => {
        // contains a window title escape sequence
        expect(sliceChars('foo\u001B]0;window_title\u0007bar')).toBe('foobar');
    });
});

describe('sliceColumns', () => {
    test('slices fullwidth characters', () => {
        expect(sliceColumns('👨‍❤️‍💋‍👨👨‍👩‍👧‍👧🧑🏾‍🚀', 0, 4)).toBe('👨‍❤️‍💋‍👨👨‍👩‍👧‍👧');
    });

    test('handles case where endIndex falls within a fullwidth character', () => {
        expect(sliceColumns('👨‍❤️‍💋‍👨👨‍👩‍👧‍👧🧑🏾‍🚀', 2, 5)).toBe('👨‍👩‍👧‍👧');
    });

    test('result slice does not include control characters located at slice boundaries', () => {
        // newline at the starting slice boundary should not be in the result
        expect(sliceColumns('foo\nbar', 3)).toBe('bar');
        // newline at the ending slice boundary should not be in the result
        expect(sliceColumns('foo\nbar', 0, 3)).toBe('foo');
        // the newline at both slice boundaries should not be in the result
        expect(sliceColumns('fo\r\nobar\n', 2, 6)).toBe('obar');
    });
});