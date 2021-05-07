const { wordWrap } = require('..');

describe('wordWrap', () => {
    test('wraps words to a specified column width', () => {
        expect(wordWrap('aa bbb ccc dd', 6)).toBe([
            'aa bbb',
            'ccc dd',
        ].join('\n'));
    });

    test('does not break words longer than the max width by default', () => {
        expect(wordWrap('aaa bbbbbbb cccc', 6)).toBe([
            'aaa',
            'bbbbbbb',
            'cccc',
        ].join('\n'));
    });

    test('breaks words longer than the max width when hard-wrap is enabled', () => {
        expect(wordWrap('aa bbbbbbb c', 6, true)).toBe([
            'aa bbb',
            'bbbb c',
        ].join('\n'));
    });

    test('trims whitespace between words when a linebreak occurs', () => {
        expect(wordWrap('aaa    bb ccc', 6)).toBe([
            'aaa',
            'bb ccc',
        ].join('\n'));
    });

    test('preserves whitespace between words when no linebreak occurs', () => {
        expect(wordWrap('a   bb cc ddd', 6)).toBe([
            'a   bb',
            'cc ddd',
        ].join('\n'));
    });

    test('trims whitespace when a hard-wrap word break begins on the next line', () => {
        expect(wordWrap('aaa  bbbbbbbb ccc', 6, true)).toBe([
            'aaa',
            'bbbbbb',
            'bb ccc',
        ].join('\n'));
    });

    test('preserves whitespace when a hard-wrap word break begins on the same line', () => {
        expect(wordWrap('a  bbbbbbb c', 6, true)).toBe([
            'a  bbb',
            'bbbb c',
        ].join('\n'));
    });

    test('handles empty input strings', () => {
        expect(wordWrap('', 6)).toBe('');
        // empty escape sequence
        expect(wordWrap('\u001b[31m\u001b[39m', 6)).toBe('');
    });

    test('wraps ansi escape sequences', () => {
        expect(wordWrap('aa \u001b[31mbbb ccc\u001b[39m dd', 6)).toBe([
            'aa \u001b[31mbbb\u001b[39m',
            '\u001b[31mccc\u001b[39m dd',
        ].join('\n'));
    });

    test('hard wraps ansi escape sequences', () => {
        expect(wordWrap('aa \u001b[41mbbbbbbb c\u001b[49m', 6, true)).toBe([
            'aa \u001b[41mbbb\u001b[49m',
            '\u001b[41mbbbb c\u001b[49m',
        ].join('\n'));
    });

    test('wraps hyperlink escape sequences', () => {
        expect(wordWrap('aa \u001b]8;;link\u0007bbb ccc\u001b]8;;\u0007 dd', 6)).toBe([
            'aa \u001b]8;;link\u0007bbb\u001b]8;;\u0007',
            '\u001b]8;;link\u0007ccc\u001b]8;;\u0007 dd',
        ].join('\n'));
    });

    test('hard wraps hyperlink escape sequences', () => {
        expect(wordWrap('aa \u001b]8;;link\u0007bbbbbbb\u001b]8;;\u0007 c', 6, true)).toBe([
            'aa \u001b]8;;link\u0007bbb\u001b]8;;\u0007',
            '\u001b]8;;link\u0007bbbb\u001b]8;;\u0007 c',
        ].join('\n'));
    });

    test('wraps text with both foreground and background styling', () => {
        expect(wordWrap('\u001b[41maa b\u001b[32mbb cc\u001b[39mc dd\u001b[49m', 6)).toBe([
            '\u001b[41maa b\u001b[32mbb\u001b[39m\u001b[49m',
            '\u001b[41m\u001b[32mcc\u001b[39mc dd\u001b[49m',
        ].join('\n'));
    });

    test('hard wraps words with both foreground and background styling', () => {
        expect(wordWrap('\u001b[41maaa \u001b[32mbbbbbbb\u001b[39m\u001b[49m', 6, true)).toBe([
            '\u001b[41maaa \u001b[32mbb\u001b[39m\u001b[49m',
            '\u001b[41m\u001b[32mbbbbb\u001b[39m\u001b[49m',
        ].join('\n'));
    });

    test('wraps text with overlapping foreground & background styling', () => {
        expect(wordWrap('\u001b[41maa b\u001b[33mbb\u001b[49m ccc\u001b[39m dd', 6)).toBe([
            '\u001b[41maa b\u001b[33mbb\u001b[49m\u001b[39m',
            '\u001b[33mccc\u001b[39m dd',
        ].join('\n'));
    });

    test('wraps hyperlink escapes within background styling', () => {
        expect(wordWrap('aa \u001b[41m\u001b]8;;link\u0007bbb ccc\u001b]8;;\u0007 dd\u001b[49m', 6)).toBe([
            'aa \u001b[41m\u001b]8;;link\u0007bbb\u001b]8;;\u0007\u001b[49m',
            '\u001b[41m\u001b]8;;link\u0007ccc\u001b]8;;\u0007 dd\u001b[49m',
        ].join('\n'));
    });

    test('hard wraps hyperlink escapes that contain background styling', () => {
        expect(wordWrap('a \u001b]8;;link\u0007\u001b[41mbbbb\u001b[49mbbb\u001b]8;;\u0007 cc', 6, true)).toBe([
            'a \u001b]8;;link\u0007\u001b[41mbbbb\u001b[49m\u001b]8;;\u0007',
            '\u001b]8;;link\u0007bbb\u001b]8;;\u0007 cc',
        ].join('\n'));
    });

    test('hard wraps hyperlink escapes that overlap with background styling', () => {
        expect(wordWrap('aa bb\u001b]8;;link\u0007bbb\u001b[41mbb \u001b]8;;\u0007c\u001b[49m', 6, true)).toBe([
            'aa bb\u001b]8;;link\u0007b\u001b]8;;\u0007',
            '\u001b]8;;link\u0007bb\u001b[41mbb \u001b]8;;\u0007c\u001b[49m',
        ].join('\n'));
    });

    test('handles ESC[0m reset escape codes', () => {
        expect(wordWrap('\u001b[41maa \u001b[32mbbb ccc\u001b[0m dd', 6)).toBe([
            '\u001b[41maa \u001b[32mbbb\u001b[39m\u001b[49m',
            '\u001b[41m\u001b[32mccc\u001b[0m dd',
        ].join('\n'));
    });

    test('handles unknown SGR escape sequences', () => {
        // unknown escape sequence ESC[1001m should be closed by a reset sequence ESC[0m
        expect(wordWrap('aa \u001b[1001mbbb ccc\u001b[0m dd', 6)).toBe([
            'aa \u001b[1001mbbb\u001b[0m',
            '\u001b[1001mccc\u001b[0m dd',
        ].join('\n'));
    });

    test('ignores non-SGR/non-hyperlink ansi escape sequences', () => {
        // contains a window title escape sequence
        expect(wordWrap('aa bbb\u001b]0;window_title\u0007 ccc', 6)).toBe([
            'aa bbb',
            'ccc',
        ].join('\n'));
    });

    test('does not add unnecessary closing escape sequences', () => {
        // multiple opening bg codes should both be closed by a single `ESC[49m`
        expect(wordWrap('\u001b[45maa \u001b[41mbbb ccc \u001b[49mdd', 6)).toBe([
            '\u001b[45maa \u001b[41mbbb\u001b[49m',
            '\u001b[45m\u001b[41mccc \u001b[49mdd',
        ].join('\n'));
    });

    test('handles text with unclosed escape sequences', () => {
        // closes the unclosed bg style escape
        expect(wordWrap('\u001b[45maa bbb', 6)).toBe('\u001b[45maa bbb\u001b[49m');
    });

    describe('closing escape sequences at a word boundary following a line break', () => {
        test('should not wrap to the next row', () => {
            expect(wordWrap('aaa \u001b[32mbb \u001b[39mcc', 6)).toBe([
                'aaa \u001b[32mbb\u001b[39m',
                'cc',
            ].join('\n'));
        });

        test('should not wrap to the next row when the word is hard wrapped', () => {
            // triggers line 172, 174
            expect(wordWrap('aa \u001b[32mbb \u001b[39mccccccc ddd', 6, true)).toBe([
                'aa \u001b[32mbb\u001b[39m',
                'cccccc',
                'c ddd',
            ].join('\n'));
        });
    });

    describe('opening escape sequences at a word boundary preceeding a line break', () => {
        test('should wrap to the next row', () => {
            expect(wordWrap('aaa\u001b[41m bbb\u001b[49m cc', 6)).toBe([
                'aaa',
                '\u001b[41mbbb\u001b[49m cc',
            ].join('\n'));
        });

        test('should wrap to the next row when the following word is hard wrapped', () => {
            expect(wordWrap('aaa\u001b[41m  bbbbbbbb\u001b[49m ccc', 6, true)).toBe([
                'aaa',
                '\u001b[41mbbbbbb\u001b[49m',
                '\u001b[41mbb\u001b[49m ccc',
            ].join('\n'));
        });
    });

    describe('opening & closing escape sequences at word boundaries that straddle a line break', () => {
        test('should wrap to their respective rows', () => {
            expect(wordWrap('aaa \u001b[32mbb\u001b[41m \u001b[39mcc\u001b[49m', 6)).toBe([
                'aaa \u001b[32mbb\u001b[39m',
                '\u001b[41mcc\u001b[49m',
            ].join('\n'));
        });

        test('should wrap to their respective rows when the next word is hard-wrapped', () => {
            expect(wordWrap('\u001b[32maaaa\u001b[41m \u001b[39mbbbbbbbb ccc\u001b[49m', 6, true)).toBe([
                '\u001b[32maaaa\u001b[39m',
                '\u001b[41mbbbbbb\u001b[49m',
                '\u001b[41mbb ccc\u001b[49m',
            ].join('\n'));
        });
    });

    describe('at the break point in a hard-wrapped word', () => {
        test('closing escape sequences should not wrap to the next row', () => {
            expect(wordWrap('\u001b[41maa bbb\u001b[49mbbbb c', 6, true)).toBe([
                '\u001b[41maa bbb\u001b[49m',
                'bbbb c',
            ].join('\n'));
        });

        test('opening escape sequences should wrap to the next row', () => {
            expect(wordWrap('aa bbb\u001b[32mbbbb\u001b[39m c', 6, true)).toBe([
                'aa bbb',
                '\u001b[32mbbbb\u001b[39m c',
            ].join('\n'));
        });

        test('overlapping opening & closing escape sequences should wrap to their respective rows', () => {
            expect(wordWrap('\u001b[41maa bbb\u001b[32m\u001b[49mbbbb c\u001b[39m', 6, true)).toBe([
                '\u001b[41maa bbb\u001b[49m',
                '\u001b[32mbbbb c\u001b[39m',
            ].join('\n'));
        });
    });

    describe('empty escape sequences', () => {
        test('should be scrubbed from words', () => {
            expect(wordWrap('aa\u001b[33m\u001b[39m b\u001b]8;;link\u0007\u001b]8;;\u0007bb', 6)).toBe('aa bbb');
        });

        test('should be scrubbed from hard-wrapped words', () => {
            expect(wordWrap('aa bbb\u001b]8;;link\u0007\u001b]8;;\u0007bbbb\u001b[33m\u001b[39m c', 6, true)).toBe([
                'aa bbb',
                'bbbb c',
            ].join('\n'));
        });

        test('should be scrubbed from whitespace', () => {
            expect(wordWrap('aa \u001b]8;;link\u0007\u001b]8;;\u0007 bb cc \u001b[31m\u001b[39m', 6)).toBe([
                'aa  bb',
                'cc',
            ].join('\n'));
        });
    });

    describe('superfluous closing escape sequences', () => {
        test('should be scrubbed from words', () => {
            expect(wordWrap('aa\u001b[49m bb\u001b[39mb', 6)).toBe('aa bbb');
        });

        test('should be scrubbed from hard-wrapped words', () => {
            expect(wordWrap('aa bbbbb\u001b[49mbb\u001b]8;;\u0007 c', 6, true)).toBe([
                'aa bbb',
                'bbbb c',
            ].join('\n'));
        });

        test('should be scrubbed from whitespace', () => {
            expect(wordWrap('aa bbb cc \u001b[49m dd \u001b]8;;\u0007', 6)).toBe([
                'aa bbb',
                'cc  dd',
            ].join('\n'));
        });
    });

    describe('extra opening escape sequences', () => {
        test('should be scrubbed from words', () => {
            // the extra `ESC[33m` sequence should not appear in the result
            expect(wordWrap('\u001b[31maa bbb\u001b[33m\u001b[39m ccc', 6)).toBe([
                '\u001b[31maa bbb\u001b[39m',
                'ccc',
            ].join('\n'));
        });

        test('should be scrubbed from hard-wrapped words', () => {
            // the extra `ESC[33m` sequence should not appear in the result
            expect(wordWrap('aa \u001b[31mbbbbb\u001b[33m\u001b[39mbb c', 6, true)).toBe([
                'aa \u001b[31mbbb\u001b[39m',
                '\u001b[31mbb\u001b[39mbb c',
            ].join('\n'));
        });

        test('should be scrubbed from whitespace', () => {
            // the extra `ESC[43m` sequence should not appear in the result
            expect(wordWrap('aa \u001b[41mbbb cc \u001b[43m\u001b[49m dd', 6)).toBe([
                'aa \u001b[41mbbb\u001b[49m',
                '\u001b[41mcc \u001b[49m dd',
            ].join('\n'));
        });
    });

    describe('whitespace that follows an opening escape sequence', () => {
        test('can be trimmed', () => {
            expect(wordWrap('aa \u001b[41m bbb\u001b[49m cc', 6)).toBe([
                'aa',
                '\u001b[41mbbb\u001b[49m cc',
            ].join('\n'));
        });

        test('can be trimmed when it preceeds a hard-wrapped word', () => {
            expect(wordWrap('aaaa \u001b[41m bbbbbbb\u001b[49m ccc', 6, true)).toBe([
                'aaaa',
                '\u001b[41mbbbbbb\u001b[49m',
                '\u001b[41mb\u001b[49m ccc',
            ].join('\n'));
        });
    });

    describe('whitespace that preceeds a closing escape sequence', () => {
        test('can be trimmed', () => {
            expect(wordWrap('\u001b[41maa bbb \u001b[49m ccc', 6)).toBe([
                '\u001b[41maa bbb\u001b[49m',
                'ccc',
            ].join('\n'));
        });

        test('should be trimmed when it ends a line', () => {
            expect(wordWrap('aa \u001b[41mbbb ccc dd \u001b[49m', 6)).toBe([
                'aa \u001b[41mbbb\u001b[49m',
                '\u001b[41mccc dd\u001b[49m',
            ].join('\n'));
        });
    });

    describe('whitespace enclosed by escape sequences', () => {
        test('can be trimmed', () => {
            expect(wordWrap('aa \u001b[41m \u001b[49m bbb cc', 6)).toBe([
                'aa',
                'bbb cc',
            ].join('\n'));
        });

        test('can be trimmed when it preceeds a hard-wrapped word', () => {
            expect(wordWrap('aaa \u001b[41m \u001b[49m bbbbbbbb', 6, true)).toBe([
                'aaa',
                'bbbbbb',
                'bb',
            ].join('\n'));
        });

        describe('when the opening sequence is at the boundary of the prior word', () => {
            test('can be trimmed', () => {
                expect(wordWrap('aa\u001b[41m \u001b[49m bbb cc', 6)).toBe([
                    'aa',
                    'bbb cc',
                ].join('\n'));
            });

            test('can be trimmed when it preceeds a hard-wrapped word', () => {
                expect(wordWrap('aaa\u001b[41m \u001b[49m bbbbbbbb', 6, true)).toBe([
                    'aaa',
                    'bbbbbb',
                    'bb',
                ].join('\n'));
            });
        });
    });
});