import { wordWrap } from '../src';

describe('wordWrap', () => {
    test('wraps words to a specified column width', () => {
        expect(wordWrap('aa bbb ccc dd', 6)).toBe(
            'aa bbb\n'
            + 'ccc dd',
        );
    });

    test('does not break words longer than the max width by default', () => {
        expect(wordWrap('aaa bbbbbbb cccc', 6)).toBe(
            'aaa\n'
            + 'bbbbbbb\n'
            + 'cccc',
        );
    });

    test('breaks words longer than the max width when hard-wrap is enabled', () => {
        expect(wordWrap('aa bbbbbbb c', 6, { hard: true })).toBe(
            'aa bbb\n'
            + 'bbbb c',
        );
    });

    test('trims leading whitespace by default', () => {
        expect(wordWrap('  a bb c ddd', 6)).toBe(
            'a bb c\n'
            + 'ddd',
        );
    });

    test('trims whitespace between words when a linebreak occurs', () => {
        expect(wordWrap('aaa    bb ccc', 6)).toBe(
            'aaa\n'
            + 'bb ccc',
        );
    });

    test('preserves whitespace between words when no linebreak occurs', () => {
        expect(wordWrap('a   bb cc ddd', 6)).toBe(
            'a   bb\n'
            + 'cc ddd',
        );
    });

    test('trims whitespace when a hard-wrap word break begins on the next line', () => {
        expect(wordWrap('aaa  bbbbbbbb ccc', 6, { hard: true })).toBe(
            'aaa\n'
            + 'bbbbbb\n'
            + 'bb ccc',
        );
    });

    test('preserves whitespace when a hard-wrap word break begins on the same line', () => {
        expect(wordWrap('a  bbbbbbb c', 6, { hard: true })).toBe(
            'a  bbb\n'
            + 'bbbb c',
        );
    });

    test('handles empty input strings', () => {
        expect(wordWrap('', 6)).toBe('');
        // empty escape sequence
        expect(wordWrap('\x1b[31m\x1b[39m', 6)).toBe('');
    });

    test('wraps ansi escape sequences', () => {
        expect(wordWrap('aa \x1b[31mbbb ccc\x1b[39m dd', 6)).toBe(
            'aa \x1b[31mbbb\x1b[39m\n'
            + '\x1b[31mccc\x1b[39m dd',
        );
    });

    test('hard wraps ansi escape sequences', () => {
        expect(wordWrap('aa \x1b[41mbbbbbbb c\x1b[49m', 6, { hard: true })).toBe(
            'aa \x1b[41mbbb\x1b[49m\n'
            + '\x1b[41mbbbb c\x1b[49m',
        );
    });

    test('wraps hyperlink escape sequences', () => {
        expect(wordWrap('aa \x1b]8;;link\x07bbb ccc\x1b]8;;\x07 dd', 6)).toBe(
            'aa \x1b]8;;link\x07bbb\x1b]8;;\x07\n'
            + '\x1b]8;;link\x07ccc\x1b]8;;\x07 dd',
        );
    });

    test('hard wraps hyperlink escape sequences', () => {
        expect(wordWrap('aa \x1b]8;;link\x07bbbbbbb\x1b]8;;\x07 c', 6, { hard: true })).toBe(
            'aa \x1b]8;;link\x07bbb\x1b]8;;\x07\n'
            + '\x1b]8;;link\x07bbbb\x1b]8;;\x07 c',
        );
    });

    test('wraps text with both foreground and background styling', () => {
        expect(wordWrap('\x1b[41maa b\x1b[32mbb cc\x1b[39mc dd\x1b[49m', 6)).toBe(
            '\x1b[41maa b\x1b[32mbb\x1b[39m\x1b[49m\n'
            + '\x1b[41m\x1b[32mcc\x1b[39mc dd\x1b[49m',
        );
    });

    test('hard wraps words with both foreground and background styling', () => {
        expect(wordWrap('\x1b[41maaa \x1b[32mbbbbbbb\x1b[39m\x1b[49m', 6, { hard: true })).toBe(
            '\x1b[41maaa \x1b[32mbb\x1b[39m\x1b[49m\n'
            + '\x1b[41m\x1b[32mbbbbb\x1b[39m\x1b[49m',
        );
    });

    test('wraps text with overlapping foreground & background styling', () => {
        expect(wordWrap('\x1b[41maa b\x1b[33mbb\x1b[49m ccc\x1b[39m dd', 6)).toBe(
            '\x1b[41maa b\x1b[33mbb\x1b[49m\x1b[39m\n'
            + '\x1b[33mccc\x1b[39m dd',
        );
    });

    test('wraps hyperlink escapes within background styling', () => {
        expect(wordWrap('aa \x1b[41m\x1b]8;;link\x07bbb ccc\x1b]8;;\x07 dd\x1b[49m', 6)).toBe(
            'aa \x1b[41m\x1b]8;;link\x07bbb\x1b]8;;\x07\x1b[49m\n'
            + '\x1b[41m\x1b]8;;link\x07ccc\x1b]8;;\x07 dd\x1b[49m',
        );
    });

    test('hard wraps hyperlink escapes that contain background styling', () => {
        expect(wordWrap('a \x1b]8;;link\x07\x1b[41mbbbb\x1b[49mbbb\x1b]8;;\x07 cc', 6, {
            hard: true,
        })).toBe(
            'a \x1b]8;;link\x07\x1b[41mbbbb\x1b[49m\x1b]8;;\x07\n'
            + '\x1b]8;;link\x07bbb\x1b]8;;\x07 cc',
        );
    });

    test('hard wraps hyperlink escapes that overlap with background styling', () => {
        expect(wordWrap('aa bb\x1b]8;;link\x07bbb\x1b[41mbb \x1b]8;;\x07c\x1b[49m', 6, {
            hard: true,
        })).toBe(
            'aa bb\x1b]8;;link\x07b\x1b]8;;\x07\n'
            + '\x1b]8;;link\x07bb\x1b[41mbb \x1b]8;;\x07c\x1b[49m',
        );
    });

    test('handles escape sequences that span multiple input lines', () => {
        expect(wordWrap('\x1b[41maaaa \x1b[33mbbb\nccc\x1b[39m dd\x1b[49m', 6)).toBe(
            '\x1b[41maaaa\x1b[49m\n'
            + '\x1b[41m\x1b[33mbbb\x1b[39m\x1b[49m\n'
            + '\x1b[41m\x1b[33mccc\x1b[39m dd\x1b[49m',
        );
    });

    test('handles ESC[0m reset escape codes', () => {
        expect(wordWrap('\x1b[41maa \x1b[32mbb \x1b[0mccc', 6)).toBe(
            '\x1b[41maa \x1b[32mbb\x1b[0m\n'
            + 'ccc',
        );
    });

    test('handles unknown SGR escape sequences', () => {
        // unknown escape sequence ESC[1001m should be closed by a reset sequence ESC[0m
        expect(wordWrap('aa \x1b[1001mbbb ccc\x1b[0m dd', 6)).toBe(
            'aa \x1b[1001mbbb\x1b[0m\n'
            + '\x1b[1001mccc\x1b[0m dd',
        );
    });

    test('ignores non-SGR/non-hyperlink ansi escape sequences', () => {
        // contains a window title escape sequence
        expect(wordWrap('aa bbb\x1b]0;window_title\x07 ccc', 6)).toBe(
            'aa bbb\n'
            + 'ccc',
        );
    });

    test('does not add unnecessary closing escape sequences', () => {
        // multiple opening bg codes should both be closed by a single `ESC[49m`
        expect(wordWrap('\x1b[45maa \x1b[41mbbb ccc \x1b[49mdd', 6)).toBe(
            '\x1b[45maa \x1b[41mbbb\x1b[49m\n'
            + '\x1b[45m\x1b[41mccc \x1b[49mdd',
        );
    });

    test('handles text with unclosed escape sequences', () => {
        // closes the unclosed bg style escape
        expect(wordWrap('\x1b[45maa bbb', 6)).toBe('\x1b[45maa bbb\x1b[49m');
    });

    describe('closing escape sequences at a word boundary following a line break', () => {
        test('should not wrap to the next row', () => {
            expect(wordWrap('aaa \x1b[32mbb \x1b[39mcc', 6)).toBe(
                'aaa \x1b[32mbb\x1b[39m\n'
                + 'cc',
            );
        });

        test('should not wrap to the next row when the word is hard wrapped', () => {
            expect(wordWrap('aa \x1b[32mbb \x1b[39mccccccc ddd', 6, { hard: true })).toBe(
                'aa \x1b[32mbb\x1b[39m\n'
                + 'cccccc\n'
                + 'c ddd',
            );
        });
    });

    describe('opening escape sequences at a word boundary preceeding a line break', () => {
        test('should wrap to the next row', () => {
            expect(wordWrap('aaa\x1b[41m bbb\x1b[49m cc', 6)).toBe(
                'aaa\n'
                + '\x1b[41mbbb\x1b[49m cc',
            );
        });

        test('should wrap to the next row when the following word is hard wrapped', () => {
            expect(wordWrap('aaa\x1b[41m  bbbbbbbb\x1b[49m ccc', 6, { hard: true })).toBe(
                'aaa\n'
                + '\x1b[41mbbbbbb\x1b[49m\n'
                + '\x1b[41mbb\x1b[49m ccc',
            );
        });
    });

    describe('opening & closing escape sequences at word boundaries that straddle a line break', () => {
        test('should wrap to their respective rows', () => {
            expect(wordWrap('aaa \x1b[32mbb\x1b[41m \x1b[39mcc\x1b[49m', 6)).toBe(
                'aaa \x1b[32mbb\x1b[39m\n'
                + '\x1b[41mcc\x1b[49m',
            );
        });

        test('should wrap to their respective rows when the next word is hard-wrapped', () => {
            expect(wordWrap('\x1b[32maaaa\x1b[41m \x1b[39mbbbbbbbb ccc\x1b[49m', 6, { hard: true })).toBe(
                '\x1b[32maaaa\x1b[39m\n'
                + '\x1b[41mbbbbbb\x1b[49m\n'
                + '\x1b[41mbb ccc\x1b[49m',
            );
        });
    });

    describe('at the break point in a hard-wrapped word', () => {
        test('closing escape sequences should not wrap to the next row', () => {
            expect(wordWrap('\x1b[41maa bbb\x1b[49mbbbb c', 6, { hard: true })).toBe(
                '\x1b[41maa bbb\x1b[49m\n'
                + 'bbbb c',
            );
        });

        test('opening escape sequences should wrap to the next row', () => {
            expect(wordWrap('aa bbb\x1b[32mbbbb\x1b[39m c', 6, { hard: true })).toBe(
                'aa bbb\n'
                + '\x1b[32mbbbb\x1b[39m c',
            );
        });

        test('overlapping opening & closing escape sequences should wrap to their respective rows', () => {
            expect(wordWrap('\x1b[41maa bbb\x1b[32m\x1b[49mbbbb c\x1b[39m', 6, { hard: true })).toBe(
                '\x1b[41maa bbb\x1b[49m\n'
                + '\x1b[32mbbbb c\x1b[39m',
            );
        });
    });

    describe('empty escape sequences', () => {
        test('should be scrubbed from words', () => {
            expect(wordWrap('aa\x1b[33m\x1b[39m b\x1b]8;;link\x07\x1b]8;;\x07bb', 6)).toBe('aa bbb');
        });

        test('should be scrubbed from hard-wrapped words', () => {
            expect(wordWrap('aa \x1b[31m\x1b[39mbbb\x1b[32m\x1b[39mbbbb\x1b[33m\x1b[39m c', 6, {
                hard: true,
            })).toBe(
                'aa bbb\n'
                + 'bbbb c',
            );
        });

        test('should be scrubbed from whitespace', () => {
            expect(wordWrap('aa \x1b]8;;link\x07\x1b]8;;\x07 bb cc \x1b[31m\x1b[39m', 6)).toBe(
                'aa  bb\n'
                + 'cc',
            );
        });
    });

    describe('superfluous closing escape sequences', () => {
        test('should be scrubbed from words', () => {
            expect(wordWrap('aa\x1b[49m bb\x1b[39mb', 6)).toBe('aa bbb');
        });

        test('should be scrubbed from hard-wrapped words', () => {
            expect(wordWrap('aa bbbbb\x1b[49mbb\x1b]8;;\x07 c', 6, { hard: true })).toBe(
                'aa bbb\n'
                + 'bbbb c',
            );
        });

        test('should be scrubbed from whitespace', () => {
            expect(wordWrap('aa bbb cc \x1b[49m dd \x1b]8;;\x07', 6)).toBe(
                'aa bbb\n'
                + 'cc  dd',
            );
        });
    });

    describe('extra opening escape sequences', () => {
        test('should be scrubbed from words', () => {
            // the extra `ESC[33m` sequence should not appear in the result
            expect(wordWrap('\x1b[31maa bbb\x1b[33m\x1b[39m ccc', 6)).toBe(
                '\x1b[31maa bbb\x1b[39m\n'
                + 'ccc',
            );
        });

        test('should be scrubbed from hard-wrapped words', () => {
            // the extra `ESC[33m` sequence should not appear in the result
            expect(wordWrap('aa \x1b[31mbbbbb\x1b[33m\x1b[39mbb c', 6, { hard: true })).toBe(
                'aa \x1b[31mbbb\x1b[39m\n'
                + '\x1b[31mbb\x1b[39mbb c',
            );
        });

        test('should be scrubbed from whitespace', () => {
            // the extra `ESC[43m` sequence should not appear in the result
            expect(wordWrap('aa \x1b[41mbbb cc \x1b[43m\x1b[49m dd', 6)).toBe(
                'aa \x1b[41mbbb\x1b[49m\n'
                + '\x1b[41mcc \x1b[49m dd',
            );
        });
    });

    describe('whitespace that follows an opening escape sequence', () => {
        test('can be trimmed', () => {
            expect(wordWrap('aa \x1b[41m bbb\x1b[49m cc', 6)).toBe(
                'aa\n'
                + '\x1b[41mbbb\x1b[49m cc',
            );
        });

        test('can be trimmed when it preceeds a hard-wrapped word', () => {
            expect(wordWrap('aaaa \x1b[41m bbbbbbb\x1b[49m ccc', 6, { hard: true })).toBe(
                'aaaa\n'
                + '\x1b[41mbbbbbb\x1b[49m\n'
                + '\x1b[41mb\x1b[49m ccc',
            );
        });

        test('can be trimmed from the beginning of a line', () => {
            expect(wordWrap('\x1b[41m  a bb\x1b[49m c', 6)).toBe('\x1b[41ma bb\x1b[49m c');
        });
    });

    describe('whitespace that preceeds a closing escape sequence', () => {
        test('can be trimmed', () => {
            expect(wordWrap('\x1b[41maa bbb \x1b[49m ccc', 6)).toBe(
                '\x1b[41maa bbb\x1b[49m\n'
                + 'ccc',
            );
        });

        test('should be trimmed when it ends a line', () => {
            expect(wordWrap('aa \x1b[41mbbb ccc dd \x1b[49m', 6)).toBe(
                'aa \x1b[41mbbb\x1b[49m\n'
                + '\x1b[41mccc dd\x1b[49m',
            );
        });
    });

    describe('whitespace enclosed by escape sequences', () => {
        test('can be trimmed', () => {
            expect(wordWrap('aa \x1b[41m \x1b[49m bbb cc', 6)).toBe(
                'aa\n'
                + 'bbb cc',
            );
        });

        test('can be trimmed when it preceeds a hard-wrapped word', () => {
            expect(wordWrap('aaa \x1b[41m \x1b[49m bbbbbbbb', 6, { hard: true })).toBe(
                'aaa\n'
                + 'bbbbbb\n'
                + 'bb',
            );
        });

        test('can be trimmed from the beginning of a line', () => {
            expect(wordWrap('\x1b[41m \x1b[49m a bb c', 6)).toBe('a bb c');
        });

        describe('when the opening sequence is at the boundary of the prior word', () => {
            test('can be trimmed', () => {
                expect(wordWrap('aa\x1b[41m \x1b[49m bbb cc', 6)).toBe(
                    'aa\n'
                    + 'bbb cc',
                );
            });

            test('can be trimmed when it preceeds a hard-wrapped word', () => {
                expect(wordWrap('aaa\x1b[41m \x1b[49m bbbbbbbb', 6, { hard: true })).toBe(
                    'aaa\n'
                    + 'bbbbbb\n'
                    + 'bb',
                );
            });
        });

        describe('that span an input line break', () => {
            test('is trimmed', () => {
                expect(wordWrap('aaa bbb\x1b[41m  \n   \x1b[49mccc', 6)).toBe(
                    'aaa\n'
                    + 'bbb\n'
                    + 'ccc',
                );
            });

            test('is trimmed when it preceeds a hard-wrapped word', () => {
                expect(wordWrap('aaa bbb\x1b[41m  \n   \x1b[49mccccccc', 6, { hard: true })).toBe(
                    'aaa\n'
                    + 'bbb\n'
                    + 'cccccc\n'
                    + 'c',
                );
            });

            describe('when trim left is disabled', () => {
                test('is preserved after the line break', () => {
                    expect(wordWrap('aaa bbb\x1b[41m  \n   \x1b[49mccc', 6, { trimLeft: false })).toBe(
                        'aaa\n'
                        + 'bbb\n'
                        + '\x1b[41m   \x1b[49mccc',
                    );
                });

                test('is preserved after the line break that preceeds a hard-wrapped word', () => {
                    expect(wordWrap('aaa bbb\x1b[41m  \n   \x1b[49mcccccc', 6, {
                        hard: true,
                        trimLeft: false,
                    })).toBe(
                        'aaa\n'
                        + 'bbb\n'
                        + '\x1b[41m   \x1b[49mccc\n'
                        + 'ccc',
                    );
                });
            });
        });
    });

    describe('when trim left is disabled', () => {
        test('leading whitespace is preserved', () => {
            expect(wordWrap('  \x1b[41maa bbb cc\x1b[49m', 6, { trimLeft: false })).toBe(
                '  \x1b[41maa\x1b[49m\n'
                + '\x1b[41mbbb cc\x1b[49m',
            );
        });

        test('leading whitespace is preserved hard-wrap mode', () => {
            expect(wordWrap('\x1b[41m   \x1b[49maaaaaaaaaa', 6, { hard: true, trimLeft: false })).toBe(
                '\x1b[41m   \x1b[49maaa\n'
                + 'aaaaaa\n'
                + 'a',
            );
        });

        test('leading whitespace will not cause the first word to wrap', () => {
            // the first row should exceed the column limit
            expect(wordWrap('\x1b[41m   aaaaa\x1b[49m bbb cc', 6, { trimLeft: false })).toBe(
                '\x1b[41m   aaaaa\x1b[49m\n'
                + 'bbb cc',
            );
        });

        test('leading whitespace will cause the first word to break in hard wrap mode', () => {
            // first word should break despite not being longer than the column width
            expect(wordWrap('\x1b[41m   aaaaa\x1b[49m', 6, { hard: true, trimLeft: false })).toBe(
                '\x1b[41m   aaa\x1b[49m\n'
                + '\x1b[41maa\x1b[49m',
            );
        });

        // edge case where the width of leading whitespace >= columns
        describe('large leading whitespace', () => {
            test('forces a line break before the first word', () => {
                expect(wordWrap('      aaaa', 6, { trimLeft: false })).toBe(
                    '      \n'
                    + 'aaaa',
                );
            });

            test('preserves styles within a forced line break before the first word', () => {
                expect(wordWrap('\x1b[41m      \x1b[32m\x1b[49m  aaaa\x1b[39m', 6, { trimLeft: false })).toBe(
                    '\x1b[41m      \x1b[49m\n'
                    + '\x1b[32m  aaaa\x1b[39m',
                );
            });

            test('forces a line break before the first word in hard-wrap mode', () => {
                expect(wordWrap('      aaaaaaa', 6, { hard: true, trimLeft: false })).toBe(
                    '      \n'
                    + 'aaaaaa\n'
                    + 'a',
                );
            });

            test('preserves styles within a forced line break before the first word in hard-wrap mode', () => {
                expect(wordWrap('\x1b[41m      \x1b[32m\x1b[49maaaaaaa\x1b[39m', 6, {
                    hard: true,
                    trimLeft: false,
                })).toBe(
                    '\x1b[41m      \x1b[49m\n'
                    + '\x1b[32maaaaaa\x1b[39m\n'
                    + '\x1b[32ma\x1b[39m',
                );
            });

            test('preserves styling across paragraphs that start with a forced line break', () => {
                expect(wordWrap('\x1b[33maaaa\x1b[41m\n      \x1b[49maaa\x1b[39m bb', 6, { trimLeft: false })).toBe(
                    '\x1b[33maaaa\x1b[39m\n'
                    + '\x1b[33m\x1b[41m      \x1b[49m\x1b[39m\n'
                    + '\x1b[33maaa\x1b[39m bb',
                );
            });

            test('preserves styling across paragraphs that start with a forced line break in hard-wrap mode', () => {
                expect(wordWrap('\x1b[41maaaa\n      aaaaaaa\x1b[49m', 6, { hard: true, trimLeft: false })).toBe(
                    '\x1b[41maaaa\x1b[49m\n'
                    + '\x1b[41m      \x1b[49m\n'
                    + '\x1b[41maaaaaa\x1b[49m\n'
                    + '\x1b[41ma\x1b[49m',
                );
            });

            test('returns an empty string if the entire input is whitespace', () => {
                expect(wordWrap('\x1b[41m         \x1b[49m', 6, { trimLeft: false })).toBe('');
            });
        });
    });
});