import { splitLines } from '../src';

describe('splitLines', () => {
    test('supports both LF and CRLF newline types', () => {
        expect(splitLines('AA\nBB\r\nCC')).toEqual(['AA', 'BB', 'CC']);
    });

    test('handles non-string inputs', () => {
        expect(splitLines(10 as any)).toEqual(['10']);
    });

    test('splits SGR escapes that span multiple lines', () => {
        expect(splitLines('\x1b[41mAAA\x1b[33mBBB\nCCC\x1b[39mDDD\x1b[49m')).toMatchAnsi([
            '\x1b[41mAAA\x1b[33mBBB\x1b[39;49m',
            '\x1b[41;33mCCC\x1b[39mDDD\x1b[49m',
        ]);
    });

    test('splits compound SGR escapes that span multiple lines', () => {
        expect(splitLines('\x1b[32;41mAAABBB\nCCCDDD\x1b[39;49m')).toMatchAnsi([
            '\x1b[32;41mAAABBB\x1b[49;39m',
            '\x1b[32;41mCCCDDD\x1b[49;39m',
        ]);
    });

    test('splits SGR escapes that span a single line', () => {
        expect(splitLines('\x1b[41mAAAA\x1b[49m\x1b[33m\nBBBB\x1b[39m')).toMatchAnsi([
            '\x1b[41mAAAA\x1b[49m',
            '\x1b[33mBBBB\x1b[39m',
        ]);
    });

    test('splits SGR escape sequences that overlap across a line break', () => {
        expect(splitLines('\x1b[41mAAAA\x1b[33m\n\x1b[49mBBBB\x1b[39m')).toMatchAnsi([
            '\x1b[41mAAAA\x1b[49m',
            '\x1b[33mBBBB\x1b[39m',
        ]);
    });

    test('splits compound SGR sequences that overlap across a line break', () => {
        expect(splitLines('\x1b[41mAAAA\n\x1b[49;33mBBBB\x1b[39m')).toMatchAnsi([
            '\x1b[41mAAAA\x1b[49m',
            '\x1b[33mBBBB\x1b[39m',
        ]);
    });

    test('splits SGR escape sequences that span empty lines', () => {
        expect(splitLines('\x1b[41m\nAAA\n\nBBB\x1b[49m')).toMatchAnsi([
            '',
            '\x1b[41mAAA\x1b[49m',
            '',
            '\x1b[41mBBB\x1b[49m',
        ]);
    });

    test('supports compound SGR sequences with both opening and closing codes', () => {
        expect(splitLines('\x1b[32;41mAAABBB\nCCC\x1b[39;33mDDD\x1b[39;49m')).toMatchAnsi([
            '\x1b[32;41mAAABBB\x1b[49;39m',
            '\x1b[32;41mCCC\x1b[39m\x1b[33mDDD\x1b[39;49m',
        ]);
    });

    test('preserves non SGR/OSC hyperlink escape sequences', () => {
        // contains a window title sequence in the first line and a cursor up sequence in the second
        expect(splitLines('AA\x1b]0;window_title\x07\nB\x1b[AB')).toMatchAnsi([
            'AA\x1b]0;window_title\x07',
            'B\x1b[AB',
        ]);
    });

    describe('superfluous SGR escapes', () => {
        test('scrubs empty SGR sequences', () => {
            expect(splitLines('AA\x1b[41m\x1b[49mA\nBB')).toMatchAnsi(['AAA', 'BB']);
        });

        test('scrubs empty compound SGR sequences', () => {
            expect(splitLines('AA\x1b[41;49mA\nBB')).toMatchAnsi(['AAA', 'BB']);
        });

        test('scrubs SGR sequences that span only line breaks', () => {
            expect(splitLines('AAAA\x1b[41m\n\x1b[49mBBBB')).toMatchAnsi(['AAAA', 'BBBB']);
        });
    });

    describe('SGR reset escapes', () => {
        test('supports ESC[0m reset escapes', () => {
            expect(splitLines('\x1b[41;32mAAAA\nBB\x1b[0mBB')).toMatchAnsi([
                '\x1b[41;32mAAAA\x1b[39;49m',
                '\x1b[41;32mBB\x1b[0mBB',
            ]);
        });

        test('supports ESC[m implied reset escapes', () => {
            // when no code is given on an SGR escape, it is treated as a reset code
            expect(splitLines('\x1b[41;32mAAAA\nBB\x1b[mBB')).toMatchAnsi([
                '\x1b[41;32mAAAA\x1b[39;49m',
                '\x1b[41;32mBB\x1b[0mBB',
            ]);
        });

        test('supports ESC[:m implied reset escapes', () => {
            expect(splitLines('\x1b[41;32mAAAA\nBB\x1b[:mBB')).toMatchAnsi([
                '\x1b[41;32mAAAA\x1b[39;49m',
                '\x1b[41;32mBB\x1b[0mBB',
            ]);
        });

        test('supports compound SGR sequences with both opening and reset ESC[0m codes', () => {
            expect(splitLines('AAA\x1b[0;33mBBB\nCCC\x1b[0mDDD')).toMatchAnsi([
                'AAA\x1b[33mBBB\x1b[39m',
                '\x1b[33mCCC\x1b[0mDDD',
            ]);
        });

        test('supports ESC[;#m implied resets in compound SGR codes', () => {
            expect(splitLines('\x1b[41;32mAAAA\nBB\x1b[;33mBB\x1b[39m')).toMatchAnsi([
                '\x1b[41;32mAAAA\x1b[39;49m',
                '\x1b[41;32mBB\x1b[0m\x1b[33mBB\x1b[39m',
            ]);
        });
    });

    describe('SGR 38, 48, 58 color escapes', () => {
        test('8 & 24 bit sequences with ; delimiters', () => {
            // foreground [38;5;164] + background [48;2;50;168;133]
            expect(splitLines(
                '\x1b[38;5;164;48;2;50;168;133mAAAAAA\nBBB\x1b[39mBBB\nCCCCCC\x1b[49m',
            )).toMatchAnsi([
                '\x1b[38;5;164;48;2;50;168;133mAAAAAA\x1b[49;39m',
                '\x1b[38;5;164;48;2;50;168;133mBBB\x1b[39mBBB\x1b[49m',
                '\x1b[48;2;50;168;133mCCCCCC\x1b[49m',
            ]);
        });

        test('8 & 24 bit sequences with : subparam delimiters', () => {
            // foreground [38:2::168:50:158] + background [48:2:50:168:133] + underline [58:5:202]
            expect(splitLines(
                '\x1b[38:2::168:50:158;48:2:50:168:133;58:5:202mAAAAAA\nBBB\x1b[39mBBB\nCCCCCC\x1b[49;59m',
            )).toMatchAnsi([
                '\x1b[38:2::168:50:158;48:2:50:168:133;58:5:202mAAAAAA\x1b[59;49;39m',
                '\x1b[38:2::168:50:158;48:2:50:168:133;58:5:202mBBB\x1b[39mBBB\x1b[59;49m',
                '\x1b[48:2:50:168:133;58:5:202mCCCCCC\x1b[59;49m',
            ]);
        });

        test('8 & 24 bit sequences with mixed ; & : subparam delimiters', () => {
            // foreground [38;5:164] + background [48;2:50:168:133] + underline [58;2;217:141:20]
            expect(splitLines(
                '\x1b[38;5:164;48;2:50:168:133;58;2;217:141:20mAAAAAA\nBBB\x1b[49mBBB\nCCCCCC\x1b[39;59m',
            )).toMatchAnsi([
                '\x1b[38;5:164;48;2:50:168:133;58;2;217:141:20mAAAAAA\x1b[59;49;39m',
                '\x1b[38;5:164;48;2:50:168:133;58;2;217:141:20mBBB\x1b[49mBBB\x1b[59;39m',
                '\x1b[38;5:164;58;2;217:141:20mCCCCCC\x1b[59;39m',
            ]);
        });

        test('8 & 24 bit sequences with ; delimiters and implied / missing arguments', () => {
            // foreground [38;2;168;;158] / [38;5] + background [48;5;] + underline [58;2;]
            expect(splitLines(
                '\x1b[38;2;168;;158;48;5;;58;2;mAAAAAA\nBBB\x1b[39;38;5mBBB\nCCCCCC\x1b[m',
            )).toMatchAnsi([
                '\x1b[38;2;168;;158;48;5;;58;2;mAAAAAA\x1b[59;49;39m',
                '\x1b[38;2;168;;158;48;5;;58;2;mBBB\x1b[39m\x1b[38;5mBBB\x1b[39;59;49m',
                '\x1b[48;5;;58;2;m\x1b[38;5mCCCCCC\x1b[0m',
            ]);
        });

        test('8 & 24 bit sequences with : subparam delimiters and implied / missing arguments', () => {
            // foreground [38:2:::50:158] + background [48:5] + underline [58:2:217::20] / [58:2:217:141]
            expect(splitLines(
                '\x1b[38:2:::50:158;48:5;58:2:217::20mAAAAAA\nBB\x1b[39;59mBB\x1b[58:2:217:141mBB\nCCCCCC\x1b[49;59m',
            )).toMatchAnsi([
                '\x1b[38:2:::50:158;48:5;58:2:217::20mAAAAAA\x1b[59;49;39m',
                '\x1b[38:2:::50:158;48:5;58:2:217::20mBB\x1b[59;39mBB\x1b[58:2:217:141mBB\x1b[59;49m',
                '\x1b[48:5;58:2:217:141mCCCCCC\x1b[59;49m',
            ]);
        });

        test('8 & 24 bit sequences with mixed ; & : subparam delimiters and implied / missing arguments', () => {
            // foreground [38;2:168:50] + background [48;5:] / [48;2;50;168:] + underline [58;2;:141]
            expect(splitLines(
                '\x1b[38;2:168:50;48;5:;58;2;:141mAAAAAA\nBBB\x1b[49;48;2;50;168:mBBB\nCCCCCC\x1b[39;49;59m',
            )).toMatchAnsi([
                '\x1b[38;2:168:50;48;5:;58;2;:141mAAAAAA\x1b[59;49;39m',
                '\x1b[38;2:168:50;48;5:;58;2;:141mBBB\x1b[49m\x1b[48;2;50;168:mBBB\x1b[49;59;39m',
                '\x1b[38;2:168:50;58;2;:141;48;2;50;168:mCCCCCC\x1b[49;59;39m',
            ]);
        });

        test('handles non 8 or 24 bit color model sequences', () => {
            // foreground [38;0] + background [48;] + underline [58:0]
            expect(splitLines('\x1b[38;0;48;;58:0mAAAAAA\nBBB\x1b[59mBBB\nCCCCCC\x1b[39;49m')).toMatchAnsi([
                '\x1b[38;0;48;;58:0mAAAAAA\x1b[59;49;39m',
                '\x1b[38;0;48;;58:0mBBB\x1b[59mBBB\x1b[49;39m',
                '\x1b[38;0;48;mCCCCCC\x1b[49;39m',
            ]);
        });

        test('handles sequences with missing color model arguments', () => {
            // foreground [38] + background [48] + underline [58]
            expect(splitLines('\x1b[38m\x1b[48m\x1b[58mAAAAAA\nBBB\x1b[39mBBB\nCCCCCC\x1b[49;59m')).toMatchAnsi([
                '\x1b[38m\x1b[48m\x1b[58mAAAAAA\x1b[59;49;39m',
                '\x1b[38m\x1b[48m\x1b[58mBBB\x1b[39mBBB\x1b[59;49m',
                '\x1b[48m\x1b[58mCCCCCC\x1b[59;49m',
            ]);
        });
    });

    describe('SGR underline escapes with subparameters', () => {
        test('uses 4:0 sequence to close underline escapes with subparameters', () => {
            expect(splitLines('\x1b[4:2mAAAAAA\nBBBBBB\x1b[m')).toMatchAnsi([
                '\x1b[4:2mAAAAAA\x1b[4:0m',
                '\x1b[4:2mBBBBBB\x1b[0m',
            ]);
        });

        test('interprets 4: implied argument as solid style underline', () => {
            expect(splitLines('\x1b[4:mAAAAAA\nBBBBBB\x1b[4:0m')).toMatchAnsi([
                '\x1b[4:mAAAAAA\x1b[4:0m',
                '\x1b[4:mBBBBBB\x1b[4:0m',
            ]);
        });

        test('a 4:0 sequence closes all underline escapes', () => {
            expect(splitLines('\x1b[4:1mAAAAAA\nB\x1b[4:0mBB\x1b[21mBB\x1b[4:0mB')).toMatchAnsi([
                '\x1b[4:1mAAAAAA\x1b[4:0m',
                '\x1b[4:1mB\x1b[4:0mBB\x1b[21mBB\x1b[24mB',
            ]);
        });

        test('reset code 24 overrides 4:0 format when legacy escapes are used', () => {
            expect(splitLines('\x1b[4:3mAAAA\nBB\x1b[4mBB\nC\x1b[24mCCC')).toMatchAnsi([
                '\x1b[4:3mAAAA\x1b[4:0m',
                '\x1b[4:3mBB\x1b[4mBB\x1b[24m',
                '\x1b[4:3;4mC\x1b[24mCCC',
            ]);
        });
    });

    describe('OSC hyperlink escapes', () => {
        test('supports hyperlink escapes', () => {
            expect(splitLines('\x1b]8;;link\x07AA\nB\x1b]8;;\x07b')).toMatchAnsi([
                '\x1b]8;;link\x07AA\x1b]8;;\x07',
                '\x1b]8;;link\x07B\x1b]8;;\x07b',
            ]);
        });

        test('supports hyperlink escapes with `+` in the url', () => {
            expect(splitLines('\x1b]8;;https://www.example.com/?q=hello+world\x07hello\nworld\x1b]8;;\x07')).toMatchAnsi([
                '\x1b]8;;https://www.example.com/?q=hello+world\x07hello\x1b]8;;\x07',
                '\x1b]8;;https://www.example.com/?q=hello+world\x07world\x1b]8;;\x07',
            ]);
        });

        test('supports hyperlink escapes with key value pairs', () => {
            expect(splitLines('\x1b]8;k=v;https://www.example.com\x07hello\nworld\x1b]8;;\x07')).toMatchAnsi([
                '\x1b]8;k=v;https://www.example.com\x07hello\x1b]8;;\x07',
                '\x1b]8;k=v;https://www.example.com\x07world\x1b]8;;\x07',
            ]);
        });

        test('supports hyperlink closing escapes with key value pairs', () => {
            expect(splitLines(
                '\x1b]8;id=value;https://www.example.com\x07AAAAAA\nBBB\x1b]8;id=value;\x07BBB\nCCCCCC',
            )).toMatchAnsi([
                '\x1b]8;id=value;https://www.example.com\x07AAAAAA\x1b]8;;\x07',
                '\x1b]8;id=value;https://www.example.com\x07BBB\x1b]8;id=value;\x07BBB',
                'CCCCCC',
            ]);
        });

        test('supports hyperlink escapes with SGR styling', () => {
            expect(splitLines('\x1b[36m\x1b]8;;link\x07\x1b[43mAA\nBB\x1b[39;49m\x1b]8;;\x07')).toMatchAnsi([
                '\x1b[36m\x1b]8;;link\x07\x1b[43mAA\x1b]8;;\x07\x1b[49;39m',
                '\x1b[36m\x1b]8;;link\x07\x1b[43mBB\x1b[49;39m\x1b]8;;\x07',
            ]);
        });

        test('preserves the string terminator format of hyperlink escapes', () => {
            expect(splitLines('\x1b]8;;https://www.example.com\x1b\x5chello\nworld\x1b]8;;\x1b\x5c')).toMatchAnsi([
                '\x1b]8;;https://www.example.com\x1b\x5chello\x1b]8;;\x1b\x5c',
                '\x1b]8;;https://www.example.com\x1b\x5cworld\x1b]8;;\x1b\x5c',
            ]);
        });

        test('ignores malformed hyperlink sequences', () => {
            expect(splitLines('\x1b]8;https://www.example.com\x07hello\nworld\x1b]8;;\x07')).toMatchAnsi([
                '\x1b]8;https://www.example.com\x07hello',
                'world',
            ]);
        });
    });
});