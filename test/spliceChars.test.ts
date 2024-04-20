// eslint-disable-next-line @typescript-eslint/no-require-imports
import chalk = require('chalk');
import { spliceChars } from '../src';

describe('spliceChars', () => {
    test('negative splice index', () => {
        expect(spliceChars('abef', -2, 0, 'CD')).toBe('abCDef');
        expect(spliceChars(chalk.green('abef'), -2, 0, 'CD')).toMatchAnsi(chalk.green('abCDef'));
    });

    test('negative splice index exceeds the length of the string', () => {
        expect(spliceChars('def', -4, 0, 'ABC')).toBe('ABCdef');
        expect(spliceChars(chalk.green('def'), -4, 0, 'ABC')).toMatchAnsi(chalk.green('ABCdef'));
    });

    test('splice index exceeds than the length of the string', () => {
        expect(spliceChars('abc', 4, 0, 'DEF')).toBe('abcDEF');
        expect(spliceChars(chalk.green('abc'), 4, 0, 'DEF')).toMatchAnsi(`${chalk.green('abc')}DEF`);
    });

    describe('inserting characters', () => {
        test('at the beginning of a string', () => {
            expect(spliceChars('cdef', 0, 0, 'AB')).toBe('ABcdef');
            expect(spliceChars(chalk.green('cdef'), 0, 0, 'AB')).toMatchAnsi(chalk.green('ABcdef'));
        });

        test('into the middle of a string', () => {
            expect(spliceChars('abef', 2, 0, 'CD')).toBe('abCDef');
            expect(spliceChars(chalk.green('abef'), 2, 0, 'CD')).toMatchAnsi(chalk.green('abCDef'));
        });

        test('at the end of a string', () => {
            expect(spliceChars('abcd', 4, 0, 'EF')).toBe('abcdEF');
            expect(spliceChars(chalk.green('abcd'), 4, 0, 'EF')).toMatchAnsi(chalk.green('abcdEF'));
        });

        test('between ansi escape sequences', () => {
            expect(spliceChars(chalk.green('ab') + chalk.red('ef'), 2, 0, 'CD'))
                .toMatchAnsi(chalk.green('abCD') + chalk.red('ef'));
            expect(spliceChars(chalk.green('ab') + chalk.red('cf'), 3, 0, 'DE'))
                .toMatchAnsi(chalk.green('ab') + chalk.red('cDEf'));
            expect(spliceChars(`${chalk.green('a')}b${chalk.red('def')}`, 2, 0, 'C'))
                .toMatchAnsi(`${chalk.green('a')}bC${chalk.red('def')}`);
        });
    });

    describe('deleting characters', () => {
        test('from the beginning of a string', () => {
            expect(spliceChars('abcdef', 0, 2)).toBe('cdef');
            expect(spliceChars(chalk.green('abcdef'), 0, 2)).toMatchAnsi(chalk.green('cdef'));
            // across escape sequences
            expect(spliceChars(chalk.green('abc') + chalk.red('def'), 0, 3)).toMatchAnsi(chalk.red('def'));
        });

        test('from the middle of a string', () => {
            expect(spliceChars('abcdef', 2, 2)).toBe('abef');
            expect(spliceChars(chalk.green('abcdef'), 2, 2)).toMatchAnsi(chalk.green('abef'));
            // accross escape sequences
            expect(spliceChars(chalk.green('abc') + chalk.red('def'), 2, 2))
                .toMatchAnsi(chalk.green('ab') + chalk.red('ef'));
        });

        test('from the end of a string', () => {
            expect(spliceChars('abcdef', 4, 2)).toBe('abcd');
            expect(spliceChars(chalk.green('abcdef'), 4, 2)).toMatchAnsi(chalk.green('abcd'));
            // across escape sequences
            expect(spliceChars(chalk.green('abcd') + chalk.red('ef'), 4, 2)).toMatchAnsi(chalk.green('abcd'));
        });

        test('the entire string', () => {
            expect(spliceChars('abcdef', 0, 6)).toBe('');
            expect(spliceChars(chalk.green('abcdef'), 0, 6)).toMatchAnsi('');
        });

        test('case where deleteCount exceeds the characters in the string', () => {
            // the entire string
            expect(spliceChars('abcdef', 0, 8)).toBe('');
            // from the second character
            expect(spliceChars(chalk.green('abcdef'), 2, 8)).toMatchAnsi(chalk.green('ab'));
        });
    });

    describe('replacing characters', () => {
        test('at the beginning of a string', () => {
            expect(spliceChars('abcdef', 0, 3, 'ABC')).toBe('ABCdef');
            expect(spliceChars(chalk.bgRed(chalk.green('abc') + chalk.yellow('def')), 0, 3, 'ABC'))
                .toMatchAnsi(chalk.bgRed(chalk.green('ABC') + chalk.yellow('def')));
            expect(spliceChars(chalk.bgRed(`${chalk.green('ab')}cd${chalk.yellow('ef')}`), 0, 4, 'ABCD'))
                .toMatchAnsi(chalk.bgRed(chalk.green('ABCD') + chalk.yellow('ef')));
        });

        test('in the middle of a string', () => {
            expect(spliceChars('abcdef', 2, 2, 'CD')).toBe('abCDef');
            expect(spliceChars(chalk.green('ab') + chalk.bgRed.yellow('cdef'), 2, 2, 'CD'))
                .toMatchAnsi(chalk.green('abCD') + chalk.bgRed.yellow('ef'));
        });

        test('at the end of a string', () => {
            expect(spliceChars('abcdef', 3, 3, 'DEF')).toBe('abcDEF');
            expect(spliceChars(chalk.green('abc') + chalk.bgRed('def'), 3, 3, 'DEF'))
                .toMatchAnsi(chalk.green('abcDEF'));
        });

        test('the entire string', () => {
            expect(spliceChars('abcdef', 0, 6, 'ABCDEF')).toBe('ABCDEF');
            expect(spliceChars(chalk.bgRed(chalk.green('abc') + chalk.yellow('def')), 0, 6, 'ABCDEF'))
                .toMatchAnsi(chalk.bgRed.green('ABCDEF'));
        });
    });
});