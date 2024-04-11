import { splitLines } from '../src';

describe('splitLines', () => {
    test('supports both LF and CRLF newline types', () => {
        expect(splitLines('AA\nBB\r\nCC')).toEqual(['AA', 'BB', 'CC']);
    });

    test('handles non-string inputs', () => {
        expect(splitLines(10 as any)).toEqual(['10']);
    });

    test('splits style escapes that span multiple lines', () => {
        expect(splitLines('\u001b[41mAAA\u001b[33mBBB\nCCC\u001b[39mDDD\u001b[49m')).toEqual([
            '\u001b[41mAAA\u001b[33mBBB\u001b[39m\u001b[49m',
            '\u001b[41m\u001b[33mCCC\u001b[39mDDD\u001b[49m',
        ]);
    });

    test('splits style escapes that span a single line', () => {
        expect(splitLines('\u001b[41mAAAA\u001b[49m\u001b[33m\nBBBB\u001b[39m')).toEqual([
            '\u001b[41mAAAA\u001b[49m',
            '\u001b[33mBBBB\u001b[39m',
        ]);
    });

    test('splits style escape sequences that overlap across a line break', () => {
        expect(splitLines('\u001b[41mAAAA\u001b[33m\n\u001b[49mBBBB\u001b[39m')).toEqual([
            '\u001b[41mAAAA\u001b[49m',
            '\u001b[33mBBBB\u001b[39m',
        ]);
    });

    test('splits style escape sequences that span empty lines', () => {
        expect(splitLines('\u001b[41m\nAAA\n\nBBB\u001b[49m')).toEqual([
            '',
            '\u001b[41mAAA\u001b[49m',
            '',
            '\u001b[41mBBB\u001b[49m',
        ]);
    });

    test('scrubs empty escape sequences', () => {
        expect(splitLines('AA\u001b[41m\u001b[49mA\nBB')).toEqual(['AAA', 'BB']);
    });

    test('scrubs escape sequences that span only line breaks', () => {
        expect(splitLines('AAAA\u001b[41m\n\u001b[49mBBBB')).toEqual(['AAAA', 'BBBB']);
    });

    test('supports ansi hyperlink escapes', () => {
        expect(splitLines('\u001b]8;;link\u0007AA\nB\u001b]8;;\u0007b')).toEqual([
            '\u001b]8;;link\u0007AA\u001b]8;;\u0007',
            '\u001b]8;;link\u0007B\u001b]8;;\u0007b',
        ]);
    });

    test('handles non-SGR/non-hyperlink ansi escape sequences', () => {
        expect(splitLines('AA\u001B]0;window_title\u0007\nBB')).toEqual([
            'AA\u001B]0;window_title\u0007',
            'BB',
        ]);
    });
});