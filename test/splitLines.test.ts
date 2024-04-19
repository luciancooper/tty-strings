import { splitLines } from '../src';

describe('splitLines', () => {
    test('supports both LF and CRLF newline types', () => {
        expect(splitLines('AA\nBB\r\nCC')).toEqual(['AA', 'BB', 'CC']);
    });

    test('handles non-string inputs', () => {
        expect(splitLines(10 as any)).toEqual(['10']);
    });

    test('splits style escapes that span multiple lines', () => {
        expect(splitLines('\x1b[41mAAA\x1b[33mBBB\nCCC\x1b[39mDDD\x1b[49m')).toEqual([
            '\x1b[41mAAA\x1b[33mBBB\x1b[39m\x1b[49m',
            '\x1b[41m\x1b[33mCCC\x1b[39mDDD\x1b[49m',
        ]);
    });

    test('splits style escapes that span a single line', () => {
        expect(splitLines('\x1b[41mAAAA\x1b[49m\x1b[33m\nBBBB\x1b[39m')).toEqual([
            '\x1b[41mAAAA\x1b[49m',
            '\x1b[33mBBBB\x1b[39m',
        ]);
    });

    test('splits style escape sequences that overlap across a line break', () => {
        expect(splitLines('\x1b[41mAAAA\x1b[33m\n\x1b[49mBBBB\x1b[39m')).toEqual([
            '\x1b[41mAAAA\x1b[49m',
            '\x1b[33mBBBB\x1b[39m',
        ]);
    });

    test('splits style escape sequences that span empty lines', () => {
        expect(splitLines('\x1b[41m\nAAA\n\nBBB\x1b[49m')).toEqual([
            '',
            '\x1b[41mAAA\x1b[49m',
            '',
            '\x1b[41mBBB\x1b[49m',
        ]);
    });

    test('scrubs empty escape sequences', () => {
        expect(splitLines('AA\x1b[41m\x1b[49mA\nBB')).toEqual(['AAA', 'BB']);
    });

    test('scrubs escape sequences that span only line breaks', () => {
        expect(splitLines('AAAA\x1b[41m\n\x1b[49mBBBB')).toEqual(['AAAA', 'BBBB']);
    });

    test('supports ansi hyperlink escapes', () => {
        expect(splitLines('\x1b]8;;link\x07AA\nB\x1b]8;;\x07b')).toEqual([
            '\x1b]8;;link\x07AA\x1b]8;;\x07',
            '\x1b]8;;link\x07B\x1b]8;;\x07b',
        ]);
    });

    test('handles non-SGR/non-hyperlink ansi escape sequences', () => {
        expect(splitLines('AA\x1b]0;window_title\x07\nBB')).toEqual([
            'AA\x1b]0;window_title\x07',
            'BB',
        ]);
    });
});