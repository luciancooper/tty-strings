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

    test('preserves legacy reset format for underline SGR escapes', () => {
        expect(splitLines('\x1b[4:3mAAAA\nBB\x1b[4mBB\nC\x1b[4:0mC\x1b[4mCC\x1b[24m')).toMatchAnsi([
            '\x1b[4:3mAAAA\x1b[4:0m',
            '\x1b[4:3mBB\x1b[4mBB\x1b[24m',
            '\x1b[4:3;4mC\x1b[24mC\x1b[4mCC\x1b[24m',
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

    describe('OSC hyperlink escapes', () => {
        test('supports OSC hyperlink escapes', () => {
            expect(splitLines('\x1b]8;;link\x07AA\nB\x1b]8;;\x07b')).toMatchAnsi([
                '\x1b]8;;link\x07AA\x1b]8;;\x07',
                '\x1b]8;;link\x07B\x1b]8;;\x07b',
            ]);
        });

        test('supports OSC hyperlink escapes with `+` in the url', () => {
            expect(splitLines('\x1b]8;;https://www.example.com/?q=hello+world\x07hello\nworld\x1b]8;;\x07')).toMatchAnsi([
                '\x1b]8;;https://www.example.com/?q=hello+world\x07hello\x1b]8;;\x07',
                '\x1b]8;;https://www.example.com/?q=hello+world\x07world\x1b]8;;\x07',
            ]);
        });

        test('supports OSC hyperlink escapes with key value pairs', () => {
            expect(splitLines('\x1b]8;k=v;https://www.example.com\x07hello\nworld\x1b]8;;\x07')).toMatchAnsi([
                '\x1b]8;k=v;https://www.example.com\x07hello\x1b]8;;\x07',
                '\x1b]8;k=v;https://www.example.com\x07world\x1b]8;;\x07',
            ]);
        });

        test('supports OSC hyperlink escapes with SGR styling', () => {
            expect(splitLines('\x1b[36m\x1b]8;;link\x07\x1b[43mAA\nBB\x1b[39;49m\x1b]8;;\x07')).toMatchAnsi([
                '\x1b[36m\x1b]8;;link\x07\x1b[43mAA\x1b]8;;\x07\x1b[49;39m',
                '\x1b[36m\x1b]8;;link\x07\x1b[43mBB\x1b[49;39m\x1b]8;;\x07',
            ]);
        });

        test('preserves the string terminator format of OSC hyperlink escapes', () => {
            expect(splitLines('\x1b]8;;https://www.example.com\x1b\x5chello\nworld\x1b]8;;\x1b\x5c')).toMatchAnsi([
                '\x1b]8;;https://www.example.com\x1b\x5chello\x1b]8;;\x1b\x5c',
                '\x1b]8;;https://www.example.com\x1b\x5cworld\x1b]8;;\x1b\x5c',
            ]);
        });
    });
});