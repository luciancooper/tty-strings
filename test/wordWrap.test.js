const { wordWrap } = require('..');

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
        expect(wordWrap('\u001b[31m\u001b[39m', 6)).toBe('');
    });

    test('wraps ansi escape sequences', () => {
        expect(wordWrap('aa \u001b[31mbbb ccc\u001b[39m dd', 6)).toBe(
            'aa \u001b[31mbbb\u001b[39m\n'
            + '\u001b[31mccc\u001b[39m dd',
        );
    });

    test('hard wraps ansi escape sequences', () => {
        expect(wordWrap('aa \u001b[41mbbbbbbb c\u001b[49m', 6, { hard: true })).toBe(
            'aa \u001b[41mbbb\u001b[49m\n'
            + '\u001b[41mbbbb c\u001b[49m',
        );
    });

    test('wraps hyperlink escape sequences', () => {
        expect(wordWrap('aa \u001b]8;;link\u0007bbb ccc\u001b]8;;\u0007 dd', 6)).toBe(
            'aa \u001b]8;;link\u0007bbb\u001b]8;;\u0007\n'
            + '\u001b]8;;link\u0007ccc\u001b]8;;\u0007 dd',
        );
    });

    test('hard wraps hyperlink escape sequences', () => {
        expect(wordWrap('aa \u001b]8;;link\u0007bbbbbbb\u001b]8;;\u0007 c', 6, { hard: true })).toBe(
            'aa \u001b]8;;link\u0007bbb\u001b]8;;\u0007\n'
            + '\u001b]8;;link\u0007bbbb\u001b]8;;\u0007 c',
        );
    });

    test('wraps text with both foreground and background styling', () => {
        expect(wordWrap('\u001b[41maa b\u001b[32mbb cc\u001b[39mc dd\u001b[49m', 6)).toBe(
            '\u001b[41maa b\u001b[32mbb\u001b[39m\u001b[49m\n'
            + '\u001b[41m\u001b[32mcc\u001b[39mc dd\u001b[49m',
        );
    });

    test('hard wraps words with both foreground and background styling', () => {
        expect(wordWrap('\u001b[41maaa \u001b[32mbbbbbbb\u001b[39m\u001b[49m', 6, { hard: true })).toBe(
            '\u001b[41maaa \u001b[32mbb\u001b[39m\u001b[49m\n'
            + '\u001b[41m\u001b[32mbbbbb\u001b[39m\u001b[49m',
        );
    });

    test('wraps text with overlapping foreground & background styling', () => {
        expect(wordWrap('\u001b[41maa b\u001b[33mbb\u001b[49m ccc\u001b[39m dd', 6)).toBe(
            '\u001b[41maa b\u001b[33mbb\u001b[49m\u001b[39m\n'
            + '\u001b[33mccc\u001b[39m dd',
        );
    });

    test('wraps hyperlink escapes within background styling', () => {
        expect(wordWrap('aa \u001b[41m\u001b]8;;link\u0007bbb ccc\u001b]8;;\u0007 dd\u001b[49m', 6)).toBe(
            'aa \u001b[41m\u001b]8;;link\u0007bbb\u001b]8;;\u0007\u001b[49m\n'
            + '\u001b[41m\u001b]8;;link\u0007ccc\u001b]8;;\u0007 dd\u001b[49m',
        );
    });

    test('hard wraps hyperlink escapes that contain background styling', () => {
        expect(wordWrap('a \u001b]8;;link\u0007\u001b[41mbbbb\u001b[49mbbb\u001b]8;;\u0007 cc', 6, {
            hard: true,
        })).toBe(
            'a \u001b]8;;link\u0007\u001b[41mbbbb\u001b[49m\u001b]8;;\u0007\n'
            + '\u001b]8;;link\u0007bbb\u001b]8;;\u0007 cc',
        );
    });

    test('hard wraps hyperlink escapes that overlap with background styling', () => {
        expect(wordWrap('aa bb\u001b]8;;link\u0007bbb\u001b[41mbb \u001b]8;;\u0007c\u001b[49m', 6, {
            hard: true,
        })).toBe(
            'aa bb\u001b]8;;link\u0007b\u001b]8;;\u0007\n'
            + '\u001b]8;;link\u0007bb\u001b[41mbb \u001b]8;;\u0007c\u001b[49m',
        );
    });

    test('handles escape sequences that span multiple input lines', () => {
        expect(wordWrap('\u001b[41maaaa \u001b[33mbbb\nccc\u001b[39m dd\u001b[49m', 6)).toBe(
            '\u001b[41maaaa\u001b[49m\n'
            + '\u001b[41m\u001b[33mbbb\u001b[39m\u001b[49m\n'
            + '\u001b[41m\u001b[33mccc\u001b[39m dd\u001b[49m',
        );
    });

    test('handles ESC[0m reset escape codes', () => {
        expect(wordWrap('\u001b[41maa \u001b[32mbb \u001b[0mccc', 6)).toBe(
            '\u001b[41maa \u001b[32mbb\u001b[0m\n'
            + 'ccc',
        );
    });

    test('handles unknown SGR escape sequences', () => {
        // unknown escape sequence ESC[1001m should be closed by a reset sequence ESC[0m
        expect(wordWrap('aa \u001b[1001mbbb ccc\u001b[0m dd', 6)).toBe(
            'aa \u001b[1001mbbb\u001b[0m\n'
            + '\u001b[1001mccc\u001b[0m dd',
        );
    });

    test('ignores non-SGR/non-hyperlink ansi escape sequences', () => {
        // contains a window title escape sequence
        expect(wordWrap('aa bbb\u001b]0;window_title\u0007 ccc', 6)).toBe(
            'aa bbb\n'
            + 'ccc',
        );
    });

    test('does not add unnecessary closing escape sequences', () => {
        // multiple opening bg codes should both be closed by a single `ESC[49m`
        expect(wordWrap('\u001b[45maa \u001b[41mbbb ccc \u001b[49mdd', 6)).toBe(
            '\u001b[45maa \u001b[41mbbb\u001b[49m\n'
            + '\u001b[45m\u001b[41mccc \u001b[49mdd',
        );
    });

    test('handles text with unclosed escape sequences', () => {
        // closes the unclosed bg style escape
        expect(wordWrap('\u001b[45maa bbb', 6)).toBe('\u001b[45maa bbb\u001b[49m');
    });

    describe('closing escape sequences at a word boundary following a line break', () => {
        test('should not wrap to the next row', () => {
            expect(wordWrap('aaa \u001b[32mbb \u001b[39mcc', 6)).toBe(
                'aaa \u001b[32mbb\u001b[39m\n'
                + 'cc',
            );
        });

        test('should not wrap to the next row when the word is hard wrapped', () => {
            expect(wordWrap('aa \u001b[32mbb \u001b[39mccccccc ddd', 6, { hard: true })).toBe(
                'aa \u001b[32mbb\u001b[39m\n'
                + 'cccccc\n'
                + 'c ddd',
            );
        });
    });

    describe('opening escape sequences at a word boundary preceeding a line break', () => {
        test('should wrap to the next row', () => {
            expect(wordWrap('aaa\u001b[41m bbb\u001b[49m cc', 6)).toBe(
                'aaa\n'
                + '\u001b[41mbbb\u001b[49m cc',
            );
        });

        test('should wrap to the next row when the following word is hard wrapped', () => {
            expect(wordWrap('aaa\u001b[41m  bbbbbbbb\u001b[49m ccc', 6, { hard: true })).toBe(
                'aaa\n'
                + '\u001b[41mbbbbbb\u001b[49m\n'
                + '\u001b[41mbb\u001b[49m ccc',
            );
        });
    });

    describe('opening & closing escape sequences at word boundaries that straddle a line break', () => {
        test('should wrap to their respective rows', () => {
            expect(wordWrap('aaa \u001b[32mbb\u001b[41m \u001b[39mcc\u001b[49m', 6)).toBe(
                'aaa \u001b[32mbb\u001b[39m\n'
                + '\u001b[41mcc\u001b[49m',
            );
        });

        test('should wrap to their respective rows when the next word is hard-wrapped', () => {
            expect(wordWrap('\u001b[32maaaa\u001b[41m \u001b[39mbbbbbbbb ccc\u001b[49m', 6, { hard: true })).toBe(
                '\u001b[32maaaa\u001b[39m\n'
                + '\u001b[41mbbbbbb\u001b[49m\n'
                + '\u001b[41mbb ccc\u001b[49m',
            );
        });
    });

    describe('at the break point in a hard-wrapped word', () => {
        test('closing escape sequences should not wrap to the next row', () => {
            expect(wordWrap('\u001b[41maa bbb\u001b[49mbbbb c', 6, { hard: true })).toBe(
                '\u001b[41maa bbb\u001b[49m\n'
                + 'bbbb c',
            );
        });

        test('opening escape sequences should wrap to the next row', () => {
            expect(wordWrap('aa bbb\u001b[32mbbbb\u001b[39m c', 6, { hard: true })).toBe(
                'aa bbb\n'
                + '\u001b[32mbbbb\u001b[39m c',
            );
        });

        test('overlapping opening & closing escape sequences should wrap to their respective rows', () => {
            expect(wordWrap('\u001b[41maa bbb\u001b[32m\u001b[49mbbbb c\u001b[39m', 6, { hard: true })).toBe(
                '\u001b[41maa bbb\u001b[49m\n'
                + '\u001b[32mbbbb c\u001b[39m',
            );
        });
    });

    describe('empty escape sequences', () => {
        test('should be scrubbed from words', () => {
            expect(wordWrap('aa\u001b[33m\u001b[39m b\u001b]8;;link\u0007\u001b]8;;\u0007bb', 6)).toBe('aa bbb');
        });

        test('should be scrubbed from hard-wrapped words', () => {
            expect(wordWrap('aa bbb\u001b]8;;link\u0007\u001b]8;;\u0007bbbb\u001b[33m\u001b[39m c', 6, {
                hard: true,
            })).toBe(
                'aa bbb\n'
                + 'bbbb c',
            );
        });

        test('should be scrubbed from whitespace', () => {
            expect(wordWrap('aa \u001b]8;;link\u0007\u001b]8;;\u0007 bb cc \u001b[31m\u001b[39m', 6)).toBe(
                'aa  bb\n'
                + 'cc',
            );
        });
    });

    describe('superfluous closing escape sequences', () => {
        test('should be scrubbed from words', () => {
            expect(wordWrap('aa\u001b[49m bb\u001b[39mb', 6)).toBe('aa bbb');
        });

        test('should be scrubbed from hard-wrapped words', () => {
            expect(wordWrap('aa bbbbb\u001b[49mbb\u001b]8;;\u0007 c', 6, { hard: true })).toBe(
                'aa bbb\n'
                + 'bbbb c',
            );
        });

        test('should be scrubbed from whitespace', () => {
            expect(wordWrap('aa bbb cc \u001b[49m dd \u001b]8;;\u0007', 6)).toBe(
                'aa bbb\n'
                + 'cc  dd',
            );
        });
    });

    describe('extra opening escape sequences', () => {
        test('should be scrubbed from words', () => {
            // the extra `ESC[33m` sequence should not appear in the result
            expect(wordWrap('\u001b[31maa bbb\u001b[33m\u001b[39m ccc', 6)).toBe(
                '\u001b[31maa bbb\u001b[39m\n'
                + 'ccc',
            );
        });

        test('should be scrubbed from hard-wrapped words', () => {
            // the extra `ESC[33m` sequence should not appear in the result
            expect(wordWrap('aa \u001b[31mbbbbb\u001b[33m\u001b[39mbb c', 6, { hard: true })).toBe(
                'aa \u001b[31mbbb\u001b[39m\n'
                + '\u001b[31mbb\u001b[39mbb c',
            );
        });

        test('should be scrubbed from whitespace', () => {
            // the extra `ESC[43m` sequence should not appear in the result
            expect(wordWrap('aa \u001b[41mbbb cc \u001b[43m\u001b[49m dd', 6)).toBe(
                'aa \u001b[41mbbb\u001b[49m\n'
                + '\u001b[41mcc \u001b[49m dd',
            );
        });
    });

    describe('whitespace that follows an opening escape sequence', () => {
        test('can be trimmed', () => {
            expect(wordWrap('aa \u001b[41m bbb\u001b[49m cc', 6)).toBe(
                'aa\n'
                + '\u001b[41mbbb\u001b[49m cc',
            );
        });

        test('can be trimmed when it preceeds a hard-wrapped word', () => {
            expect(wordWrap('aaaa \u001b[41m bbbbbbb\u001b[49m ccc', 6, { hard: true })).toBe(
                'aaaa\n'
                + '\u001b[41mbbbbbb\u001b[49m\n'
                + '\u001b[41mb\u001b[49m ccc',
            );
        });

        test('can be trimmed from the beginning of a line', () => {
            expect(wordWrap('\u001b[41m  a bb\u001b[49m c', 6)).toBe('\u001b[41ma bb\u001b[49m c');
        });
    });

    describe('whitespace that preceeds a closing escape sequence', () => {
        test('can be trimmed', () => {
            expect(wordWrap('\u001b[41maa bbb \u001b[49m ccc', 6)).toBe(
                '\u001b[41maa bbb\u001b[49m\n'
                + 'ccc',
            );
        });

        test('should be trimmed when it ends a line', () => {
            expect(wordWrap('aa \u001b[41mbbb ccc dd \u001b[49m', 6)).toBe(
                'aa \u001b[41mbbb\u001b[49m\n'
                + '\u001b[41mccc dd\u001b[49m',
            );
        });
    });

    describe('whitespace enclosed by escape sequences', () => {
        test('can be trimmed', () => {
            expect(wordWrap('aa \u001b[41m \u001b[49m bbb cc', 6)).toBe(
                'aa\n'
                + 'bbb cc',
            );
        });

        test('can be trimmed when it preceeds a hard-wrapped word', () => {
            expect(wordWrap('aaa \u001b[41m \u001b[49m bbbbbbbb', 6, { hard: true })).toBe(
                'aaa\n'
                + 'bbbbbb\n'
                + 'bb',
            );
        });

        test('can be trimmed from the beginning of a line', () => {
            expect(wordWrap('\u001b[41m \u001b[49m a bb c', 6)).toBe('a bb c');
        });

        describe('when the opening sequence is at the boundary of the prior word', () => {
            test('can be trimmed', () => {
                expect(wordWrap('aa\u001b[41m \u001b[49m bbb cc', 6)).toBe(
                    'aa\n'
                    + 'bbb cc',
                );
            });

            test('can be trimmed when it preceeds a hard-wrapped word', () => {
                expect(wordWrap('aaa\u001b[41m \u001b[49m bbbbbbbb', 6, { hard: true })).toBe(
                    'aaa\n'
                    + 'bbbbbb\n'
                    + 'bb',
                );
            });
        });

        describe('that span an input line break', () => {
            test('is trimmed', () => {
                expect(wordWrap('aaa bbb\u001b[41m  \n   \u001b[49mccc', 6)).toBe(
                    'aaa\n'
                    + 'bbb\n'
                    + 'ccc',
                );
            });

            test('is trimmed when it preceeds a hard-wrapped word', () => {
                expect(wordWrap('aaa bbb\u001b[41m  \n   \u001b[49mccccccc', 6, { hard: true })).toBe(
                    'aaa\n'
                    + 'bbb\n'
                    + 'cccccc\n'
                    + 'c',
                );
            });

            describe('when trim left is disabled', () => {
                test('is preserved after the line break', () => {
                    expect(wordWrap('aaa bbb\u001b[41m  \n   \u001b[49mccc', 6, { trimLeft: false })).toBe(
                        'aaa\n'
                        + 'bbb\n'
                        + '\u001b[41m   \u001b[49mccc',
                    );
                });

                test('is preserved after the line break that preceeds a hard-wrapped word', () => {
                    expect(wordWrap('aaa bbb\u001b[41m  \n   \u001b[49mcccccc', 6, {
                        hard: true,
                        trimLeft: false,
                    })).toBe(
                        'aaa\n'
                        + 'bbb\n'
                        + '\u001b[41m   \u001b[49mccc\n'
                        + 'ccc',
                    );
                });
            });
        });
    });

    describe('when trim left is disabled', () => {
        test('leading whitespace is preserved', () => {
            expect(wordWrap('  \u001b[41maa bbb cc\u001b[49m', 6, { trimLeft: false })).toBe(
                '  \u001b[41maa\u001b[49m\n'
                + '\u001b[41mbbb cc\u001b[49m',
            );
        });

        test('leading whitespace is preserved hard-wrap mode', () => {
            expect(wordWrap('\u001b[41m   \u001b[49maaaaaaaaaa', 6, { hard: true, trimLeft: false })).toBe(
                '\u001b[41m   \u001b[49maaa\n'
                + 'aaaaaa\n'
                + 'a',
            );
        });

        test('leading whitespace will not cause the first word to wrap', () => {
            // the first row should exceed the column limit
            expect(wordWrap('\u001b[41m   aaaaa\u001b[49m bbb cc', 6, { trimLeft: false })).toBe(
                '\u001b[41m   aaaaa\u001b[49m\n'
                + 'bbb cc',
            );
        });

        test('leading whitespace will cause the first word to break in hard wrap mode', () => {
            // first word should break despite not being longer than the column width
            expect(wordWrap('\u001b[41m   aaaaa\u001b[49m', 6, { hard: true, trimLeft: false })).toBe(
                '\u001b[41m   aaa\u001b[49m\n'
                + '\u001b[41maa\u001b[49m',
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
                expect(wordWrap('\u001b[41m      \u001b[32m\u001b[49m  aaaa\u001b[39m', 6, { trimLeft: false })).toBe(
                    '\u001b[41m      \u001b[49m\n'
                    + '\u001b[32m  aaaa\u001b[39m',
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
                expect(wordWrap('\u001b[41m      \u001b[32m\u001b[49maaaaaaa\u001b[39m', 6, {
                    hard: true,
                    trimLeft: false,
                })).toBe(
                    '\u001b[41m      \u001b[49m\n'
                    + '\u001b[32maaaaaa\u001b[39m\n'
                    + '\u001b[32ma\u001b[39m',
                );
            });

            test('preserves styling across paragraphs that start with a forced line break', () => {
                expect(wordWrap('\u001b[33maaaa\u001b[41m\n      \u001b[49maaa\u001b[39m bb', 6, { trimLeft: false })).toBe(
                    '\u001b[33maaaa\u001b[39m\n'
                    + '\u001b[33m\u001b[41m      \u001b[49m\u001b[39m\n'
                    + '\u001b[33maaa\u001b[39m bb',
                );
            });

            test('preserves styling across paragraphs that start with a forced line break in hard-wrap mode', () => {
                expect(wordWrap('\u001b[41maaaa\n      aaaaaaa\u001b[49m', 6, { hard: true, trimLeft: false })).toBe(
                    '\u001b[41maaaa\u001b[49m\n'
                    + '\u001b[41m      \u001b[49m\n'
                    + '\u001b[41maaaaaa\u001b[49m\n'
                    + '\u001b[41ma\u001b[49m',
                );
            });

            test('returns an empty string if the entire input is whitespace', () => {
                expect(wordWrap('\u001b[41m         \u001b[49m', 6, { trimLeft: false })).toBe('');
            });
        });
    });
});