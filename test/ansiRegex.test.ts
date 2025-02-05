import { ansiRegex } from '../src';
import escapeFixtures from './escapeFixtures';

describe('ansiRegex', () => {
    test('match all escape codes in a string', () => {
        expect(ansiRegex()).toMatchAll(
            '\x1b[m\x1b[4m\x1b[42m\x1b[31mfoo\x1b[39m\x1b[49m\x1b[24mfoo\x1b[0m',
            ['\x1b[m', '\x1b[4m', '\x1b[42m', '\x1b[31m', '\x1b[39m', '\x1b[49m', '\x1b[24m', '\x1b[0m'],
        );
    });

    test('match only the first escape code when `global` is false', () => {
        expect(ansiRegex({ global: false })).toMatchAll('\x1b[1m\x1b[7m%\x1b[27m\x1b[1m\x1b[0m', ['\x1b[1m']);
    });

    describe('string terminated sequences', () => {
        test('matches privacy message escapes', () => {
            expect(ansiRegex()).toMatchEscapeSequence('\x1b^message content\x1b\x5c');
        });

        test('matches start of string escapes', () => {
            expect(ansiRegex()).toMatchEscapeSequence('\x1bXstring content\x1b\x5c');
        });
    });

    describe('c1 control codes', () => {
        test('matches c1 csi escapes', () => {
            expect(ansiRegex()).toMatchAll('\x9b31mfoo\x9b39m', ['\x9b31m', '\x9b39m']);
        });

        test('matches c1 dcs escapes', () => {
            // report alternate text color setting (DECATC)
            expect(ansiRegex()).toMatchEscapeSequence('\x900$r0;1;15,}\x9c');
        });

        test('matches c1 osc escapes', () => {
            // set highlight background color to rgb(168, 168, 171)
            expect(ansiRegex()).toMatchEscapeSequence('\x9d17;rgb:a83c/a85a/abda\x9c');
        });

        test('matches c1 sos escapes', () => {
            expect(ansiRegex()).toMatchEscapeSequence('\x98start of string content\x9c');
        });

        test('matches c1 pm escapes', () => {
            expect(ansiRegex()).toMatchEscapeSequence('\x9eprivacy message\x9c');
        });

        test('matches c1 apc escapes', () => {
            // extended keyboard report (DECEKBD) - a left shift key and an A key
            expect(ansiRegex()).toMatchEscapeSequence('\x9f:B9901/C01\x9c');
        });
    });

    describe.each(escapeFixtures)('$group', ({ escapes }) => {
        test.each(escapes)('$desc', ({ code }) => {
            expect(ansiRegex()).toMatchEscapeSequence(code);
        });
    });
});