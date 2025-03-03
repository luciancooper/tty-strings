import { sliceChars, sliceColumns } from '../src';

describe('sliceChars', () => {
    test('return an empty string if beginIndex >= endIndex', () => {
        expect(sliceChars('foobar', 2, 2)).toBe('');
        expect(sliceChars('foobar', 4, 2)).toBe('');
    });

    test('handles non-string inputs', () => {
        expect(sliceChars(NaN as any)).toBe('NaN');
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

    test('slices strings with SGR escape sequences', () => {
        // slice starts and ends before sgr styling
        expect(sliceChars('fo\x1b[31mob\x1b[39mar', 0, 2)).toMatchAnsi('fo');
        // slice starts and ends after sgr styling
        expect(sliceChars('fo\x1b[31mob\x1b[39mar', 4, 6)).toMatchAnsi('ar');
        // slice begins before and ends after sgr styling
        expect(sliceChars('fo\x1b[31mob\x1b[39mar', 1, 5)).toMatchAnsi('o\x1b[31mob\x1b[39ma');
        // slice begins and ends within sgr styling
        expect(sliceChars('\x1b[31mfoo\x1b[39m\x1b[32mbar\x1b[39m', 1, 5))
            .toMatchAnsi('\x1b[31moo\x1b[39m\x1b[32mba\x1b[39m');
    });

    test('slices strings with both foreground & background SGR styling', () => {
        // slice begins and ends within sgr styling
        expect(sliceChars('\x1b[41m\x1b[33mfoobar\x1b[39m\x1b[49m', 1, 5)).toMatchAnsi('\x1b[41;33mooba\x1b[39;49m');
        expect(sliceChars('\x1b[41mf\x1b[33mooba\x1b[39mr\x1b[49m', 2, 4)).toMatchAnsi('\x1b[41;33mob\x1b[39;49m');
        // slice begins before and ends after sgr styling
        expect(sliceChars('fo\x1b[41m\x1b[33mob\x1b[39m\x1b[49mar', 1, 5)).toMatchAnsi('o\x1b[41;33mob\x1b[39;49ma');
    });

    test('slices strings with compound SGR escape sequences', () => {
        // slice begins and ends within sgr styling
        expect(sliceChars('\x1b[41;33mfoobar\x1b[39;49m', 1, 5)).toMatchAnsi('\x1b[41;33mooba\x1b[39;49m');
        // slice begins before and ends after sgr styling
        expect(sliceChars('fo\x1b[41;33mob\x1b[39;49mar', 1, 5)).toMatchAnsi('o\x1b[41;33mob\x1b[39;49ma');
    });

    test('supports compound SGR sequences with both opening and closing codes', () => {
        expect(sliceChars('\x1b[32;41mAAABBB\x1b[39;33mCCCDDD\x1b[39;49m', 3, 9))
            .toMatchAnsi('\x1b[32;41mBBB\x1b[39m\x1b[33mCCC\x1b[39;49m');
    });

    test('handles unclosed escape sequences', () => {
        // inputs contain unclosed foreground codes
        expect(sliceChars('\x1b[32mfoobar')).toMatchAnsi('\x1b[32mfoobar\x1b[39m');
        expect(sliceChars('\x1b[32mfoobar', 1, 5)).toMatchAnsi('\x1b[32mooba\x1b[39m');
        // inputs contain unclosed foreground & background codes
        expect(sliceChars('\x1b[41m\x1b[32mfoobar')).toMatchAnsi('\x1b[41;32mfoobar\x1b[39;49m');
        expect(sliceChars('\x1b[41m\x1b[32mfoobar', 1, 5)).toMatchAnsi('\x1b[41;32mooba\x1b[39;49m');
    });

    test('does not add unnecessary closing escape sequences', () => {
        // all slice should have 2 foreground color opening codes and be closed with a single `\x1b[39m`
        expect(sliceChars('\x1b[31m\x1b[32mfoo', 1)).toMatchAnsi('\x1b[31;32moo\x1b[39m');
        expect(sliceChars('\x1b[31m\x1b[33mfoo\x1b[39mbar', 0, 4)).toMatchAnsi('\x1b[31;33mfoo\x1b[39mb');
        expect(sliceChars('\x1b[31mf\x1b[33moo\x1b[39mbar', 1, 4)).toMatchAnsi('\x1b[31;33moo\x1b[39mb');
    });

    test('supports unknown SGR codes', () => {
        // unknown escape sequence \x1b[1001m should be closed by a reset sequence \x1b[0m
        expect(sliceChars('\x1b[1001mfoobar\x1b[49m', 0, 3)).toMatchAnsi('\x1b[1001mfoo\x1b[0m');
    });

    test('scrubs non SGR/OSC hyperlink escape sequences', () => {
        // contains a window title escape sequence
        expect(sliceChars('foo\x1b]0;window_title\x07bar')).toMatchAnsi('foobar');
    });

    describe('superfluous SGR escapes', () => {
        test('scrubs empty SGR escape sequences', () => {
            // slice begins immediately after an empty escape sequence
            expect(sliceChars('fo\x1b[42m\x1b[49m\x1b[41mob\x1b[49mar', 1, 5)).toMatchAnsi('o\x1b[41mob\x1b[49ma');
            // slice ends immediately before an empty escape sequence
            expect(sliceChars('fo\x1b[41mob\x1b[49ma\x1b[42m\x1b[49mr', 1, 5)).toMatchAnsi('o\x1b[41mob\x1b[49ma');
            // slice spans an empty escape sequence
            expect(sliceChars('fo\x1b[41mo\x1b[32m\x1b[39mb\x1b[49mar', 1, 5)).toMatchAnsi('o\x1b[41mob\x1b[49ma');
            // string ends in an empty escape sequence
            expect(sliceChars('fo\x1b[41mob\x1b[49mar\x1b[32m\x1b[39m', 1)).toMatchAnsi('o\x1b[41mob\x1b[49mar');
        });

        test('scrubs empty compound SGR escape sequences', () => {
            // slice begins immediately after an empty escape sequence
            expect(sliceChars('fo\x1b[42;49m\x1b[41mob\x1b[49mar', 1, 5)).toMatchAnsi('o\x1b[41mob\x1b[49ma');
            // slice ends immediately before an empty escape sequence
            expect(sliceChars('fo\x1b[41mob\x1b[49ma\x1b[42;49mr', 1, 5)).toMatchAnsi('o\x1b[41mob\x1b[49ma');
            // slice spans an empty escape sequence
            expect(sliceChars('fo\x1b[41mo\x1b[32;39mb\x1b[49mar', 1, 5)).toMatchAnsi('o\x1b[41mob\x1b[49ma');
            // string ends in an empty escape sequence
            expect(sliceChars('fo\x1b[41mob\x1b[49mar\x1b[32;39m', 1)).toMatchAnsi('o\x1b[41mob\x1b[49mar');
        });

        test('scrubs unnecessary opening escape sequences', () => {
            // string ends with an opening 31m code, which should not appear in the result
            expect(sliceChars('foo\x1b[32mbar\x1b[39m\x1b[31m', 4)).toMatchAnsi('\x1b[32mar\x1b[39m');
            // the slice range ends on an opening 31m code, which should not appear in the result
            expect(sliceChars('foo\x1b[32mba\x1b[31mr\x1b[39m', 3, 5)).toMatchAnsi('\x1b[32mba\x1b[39m');
        });
    });

    describe('SGR reset escapes', () => {
        test('supports ESC[0m reset escapes', () => {
            // both foreground and background are closed by a reset sequence (\x1b[0m)
            expect(sliceChars('\x1b[32mfoo\x1b[41mbar\x1b[0m', 2)).toMatchAnsi('\x1b[32mo\x1b[41mbar\x1b[0m');
        });

        test('supports ESC[m implied reset escapes', () => {
            // when no code is given on an sgr escape, it is treated as a reset code
            expect(sliceChars('\x1b[32mfoo\x1b[41mba\x1b[mr', 2)).toMatchAnsi('\x1b[32mo\x1b[41mba\x1b[0mr');
        });

        test('supports ESC[:m implied reset escapes', () => {
            expect(sliceChars('\x1b[32mfoo\x1b[41mba\x1b[:mr', 2)).toMatchAnsi('\x1b[32mo\x1b[41mba\x1b[0mr');
        });

        test('supports compound SGR sequences with both opening and reset ESC[0m codes', () => {
            // slice ends after ESC[0m code
            expect(sliceChars('AAA\x1b[0;33mBBBCCC\x1b[0mDDD', 2, 11)).toMatchAnsi('A\x1b[33mBBBCCC\x1b[0mDD');
            // slice ends before ESC[0m code
            expect(sliceChars('AAA\x1b[0;33mBBBCCC\x1b[0mDDD', 4, 8)).toMatchAnsi('\x1b[33mBBCC\x1b[39m');
        });

        test('supports ESC[;#m implied resets in compound SGR codes', () => {
            expect(sliceChars('\x1b[32mfoo\x1b[;41mba\x1b[49mr', 2)).toMatchAnsi('\x1b[32mo\x1b[0m\x1b[41mba\x1b[49mr');
        });
    });

    describe('SGR 8 bit color escapes', () => {
        test('supports 8 bit sequences with ; delimiters', () => {
            // foreground [38;5;55] + background [48;5;176]
            expect(sliceChars('\x1b[38;5;55m\x1b[48;5;176mfoobar\x1b[49m\x1b[39m', 0, 3))
                .toMatchAnsi('\x1b[38;5;55;48;5;176mfoo\x1b[49;39m');
        });

        test('supports 8 bit sequences with : subparam delimiters', () => {
            // foreground [38:5:55] + background [48:5]
            expect(sliceChars('\x1b[38:5:55m\x1b[48:5mfoobar\x1b[49m\x1b[39m', 0, 3))
                .toMatchAnsi('\x1b[38:5:55;48:5mfoo\x1b[49;39m');
        });

        test('supports 8 bit sequences with mixed ; & : subparam delimiters', () => {
            // foreground [38;5:55] + background [48;5:24:]
            expect(sliceChars('\x1b[38;5:55m\x1b[48;5:24:mfoobar\x1b[49m\x1b[39m', 0, 3))
                .toMatchAnsi('\x1b[38;5:55;48;5:24:mfoo\x1b[49;39m');
        });

        test('supports 8 bit sequences with implied / missing ; delimited arguments', () => {
            // foreground [38;5;] + background [48;5]
            expect(sliceChars('\x1b[38;5;m\x1b[48;5mfoobar\x1b[49;39m', 0, 3))
                .toMatchAnsi('\x1b[38;5;;48;5mfoo\x1b[49;39m');
        });

        test('does not group consecutive 8 bit sequences with missing ; delimited arguments', () => {
            // foreground [38;5] + background [48;5]
            expect(sliceChars('\x1b[38;5m\x1b[48;5mfoobar\x1b[39m\x1b[49m', 0, 3))
                .toMatchAnsi('\x1b[38;5m\x1b[48;5mfoo\x1b[49;39m');
        });
    });

    describe('SGR 24 bit color escapes', () => {
        test('supports 24 bit sequences with ; delimiters', () => {
            // foreground [38;2;97;52;235] + background [48;2;204;192;240]
            expect(sliceChars('\x1b[38;2;97;52;235m\x1b[48;2;204;192;240mfoobar\x1b[49m\x1b[39m', 0, 3))
                .toMatchAnsi('\x1b[38;2;97;52;235;48;2;204;192;240mfoo\x1b[49;39m');
        });

        test('supports 24 bit sequences with : suparam delimiters', () => {
            // foreground [38:2::97:52:235] + background [48:2:204:192:240]
            expect(sliceChars('\x1b[38:2::97:52:235m\x1b[48:2:204:192:240mfoobar\x1b[49m\x1b[39m', 0, 3))
                .toMatchAnsi('\x1b[38:2::97:52:235;48:2:204:192:240mfoo\x1b[49;39m');
        });

        test('supports 24 bit sequences with mixed ; & : subparam delimiters', () => {
            // foreground [38;2;97:52:235] + background [48;2;204;192:240]
            expect(sliceChars('\x1b[38;2;97:52:235;48;2;204;192:240mfoobar\x1b[49;39m', 0, 3))
                .toMatchAnsi('\x1b[38;2;97:52:235;48;2;204;192:240mfoo\x1b[49;39m');
        });

        test('supports 24 bit sequences with implied / missing : subparam arguments', () => {
            // foreground [38:2:::255:] + background [48:2:204:]
            expect(sliceChars('\x1b[38:2:::255:m\x1b[48:2:204:mfoobar\x1b[49;39m', 0, 3))
                .toMatchAnsi('\x1b[38:2:::255:;48:2:204:mfoo\x1b[49;39m');
        });

        test('supports 24 bit sequences with implied / missing ; delimited arguments', () => {
            // foreground [38;2;;255;] + background [48;2;255]
            expect(sliceChars('\x1b[38;2;;255;m\x1b[48;2;255mfoobar\x1b[49;39m', 0, 3))
                .toMatchAnsi('\x1b[38;2;;255;;48;2;255mfoo\x1b[49;39m');
        });

        test('does not group consecutive 24 bit sequences with missing ; delimited arguments', () => {
            // foreground [38;2;] + background [48;2;150;]
            expect(sliceChars('\x1b[38;2;m\x1b[48;2;150;mfoobar\x1b[39m\x1b[49m', 0, 3))
                .toMatchAnsi('\x1b[38;2;m\x1b[48;2;150;mfoo\x1b[49;39m');
        });
    });

    describe('SGR underline escapes with subparameters', () => {
        test('uses 4:0 sequence to close underline escapes with subparameters', () => {
            expect(sliceChars('\x1b[4:2mfoobar\x1b[m', 1, 4)).toMatchAnsi('\x1b[4:2moob\x1b[4:0m');
        });

        test('closes 4:x underline escapes with subparameter values greater than 5', () => {
            expect(sliceChars('\x1b[4:6mfoobar\x1b[m', 1, 4)).toMatchAnsi('\x1b[4:6moob\x1b[4:0m');
        });

        test('interprets 4: implied argument as solid style underline', () => {
            expect(sliceChars('\x1b[4:mfoobar\x1b[24m', 1, 4)).toMatchAnsi('\x1b[4:moob\x1b[4:0m');
        });

        test('reset code 24 overrides 4:0 format when legacy escapes are used', () => {
            expect(sliceChars('\x1b[4:2;21mfoobar\x1b[m', 1, 4)).toMatchAnsi('\x1b[4:2;21moob\x1b[24m');
        });
    });

    describe('OSC hyperlink escapes', () => {
        test('slices OSC hyperlink escapes', () => {
            // slice within a link
            expect(sliceChars('\x1b]8;;link\x07foobar\x1b]8;;\x07', 0, 3))
                .toMatchAnsi('\x1b]8;;link\x07foo\x1b]8;;\x07');
            // slice begins outside link and ends inside link
            expect(sliceChars('fo\x1b]8;;link\x07ob\x1b]8;;\x07ar', 0, 3))
                .toMatchAnsi('fo\x1b]8;;link\x07o\x1b]8;;\x07');
            // slice spans the link
            expect(sliceChars('fo\x1b]8;;link\x07ob\x1b]8;;\x07ar', 1, 5))
                .toMatchAnsi('o\x1b]8;;link\x07ob\x1b]8;;\x07a');
            // slice adjacent hyperlinks
            expect(sliceChars('\x1b]8;;link1\x07foo\x1b]8;;\x07\x1b]8;;link2\x07bar\x1b]8;;\x07', 3, 5))
                .toMatchAnsi('\x1b]8;;link2\x07ba\x1b]8;;\x07');
        });

        test('slices OSC hyperlink escapes that contain style sequences', () => {
            // color styling contained in link text
            expect(sliceChars('\x1b]8;;link\x07\x1b[41mfoo\x1b[49mbar\x1b]8;;\x07', 2, 6))
                .toMatchAnsi('\x1b]8;;link\x07\x1b[41mo\x1b[49mbar\x1b]8;;\x07');
            // link and color styling overlap
            expect(sliceChars('\x1b]8;;link\x07fo\x1b[32mob\x1b]8;;\x07ar\x1b[39m', 2))
                .toMatchAnsi('\x1b]8;;link\x07\x1b[32mob\x1b]8;;\x07ar\x1b[39m');
        });

        test('handles unclosed OSC hyperlink escapes', () => {
            expect(sliceChars('\x1b]8;;link1\x07foo\x1b]8;;link2\x07bar', 3))
                .toMatchAnsi('\x1b]8;;link1\x07\x1b]8;;link2\x07bar\x1b]8;;\x07');
        });
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