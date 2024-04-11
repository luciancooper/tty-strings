import { stripAnsi } from '../src';

describe('stripAnsi', () => {
    test('removes ansi sequences from strings', () => {
        expect(stripAnsi('\u001b[32m\u001b[46mfoo\u001b[49m\u001b[39m')).toBe('foo');
    });

    test('removes hyperlinks from strings', () => {
        expect(stripAnsi('\u001B]8;;https://github.com\u0007foo\u001B]8;;\u0007')).toBe('foo');
    });

    test('handles non string inputs', () => {
        expect(stripAnsi(NaN as any)).toBe('NaN');
        expect(stripAnsi(15 as any)).toBe('15');
    });
});