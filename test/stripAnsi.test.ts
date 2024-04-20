import { stripAnsi } from '../src';

describe('stripAnsi', () => {
    test('removes ansi sequences from strings', () => {
        expect(stripAnsi('\x1b[32m\x1b[46mfoo\x1b[49m\x1b[39m')).toMatchAnsi('foo');
    });

    test('removes hyperlinks from strings', () => {
        expect(stripAnsi('\x1b]8;;https://github.com\x07foo\x1b]8;;\x07')).toMatchAnsi('foo');
    });

    test('handles non string inputs', () => {
        expect(stripAnsi(NaN as any)).toBe('NaN');
        expect(stripAnsi(15 as any)).toBe('15');
    });
});