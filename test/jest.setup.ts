import { stripAnsi } from '../src';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toMatchEachCodePoint: <E extends number | boolean>(expected?: E) => R
            toMatchEachSequence: (expected?: boolean) => R
            toMatchAnsi: (expected: string | string[]) => R
        }
    }
}

function hex(num: number) {
    const h = num.toString(16).toUpperCase();
    return '0'.repeat(Math.max(0, 4 - h.length)) + h;
}

function escAnsi<T extends string | string[]>(arg: T): T {
    if (typeof arg !== 'string') return arg.map(escAnsi) as T;
    return arg.replace(/[\x1B\x9B\x07]/g, (s) => {
        const cp = s.codePointAt(0)!.toString(16);
        return `\\x${'0'.repeat(Math.max(0, 2 - cp.length))}${cp}`;
    }) as T;
}

expect.extend({
    toMatchAnsi<E extends string | string[]>(this: jest.MatcherContext, received: E, expected: E) {
        let pass: boolean,
            comment: string;
        if (typeof expected === 'string') {
            pass = Object.is(received, expected);
            comment = 'Object.is equality';
        } else {
            pass = this.equals(received, expected, [...this.customTesters, this.utils.iterableEquality]);
            comment = 'deep equality';
        }
        const options = { comment, ...(this.isNot != null && { isNot: this.isNot }) };
        return {
            pass,
            message: pass ? () => (
                this.utils.matcherHint('toMatchAnsi', undefined, undefined, options)
                + '\n\n'
                + `Expected: not ${this.utils.printExpected(escAnsi(expected)).replace(/\\\\(?=x)/g, '\\')}`
            ) : () => (
                this.utils.matcherHint('toMatchAnsi', undefined, undefined, options)
                + '\n\n'
                + this.utils.printDiffOrStringify(
                    escAnsi(expected),
                    escAnsi(received),
                    'Expected',
                    'Received',
                    this.expand !== false,
                ).replace(/\\\\(?=x)/g, '\\')
            ),
        };
    },

    toMatchEachCodePoint<E extends number | boolean>(
        this: jest.MatcherContext,
        received: [number, E, E?][],
        expected?: E,
    ) {
        // if expected arg was not provided, it must be provided as the 3rd value in each fixture item
        const unmatched = received.filter(([, rec, exp = expected]) => rec !== exp);
        return {
            pass: unmatched.length === 0,
            message: () => {
                const cols = unmatched.map<[string, string, string]>(([cp, rec, exp = expected]) => [
                        this.utils.printReceived(rec),
                        this.utils.printExpected(exp),
                        hex(cp),
                    ]),
                    // calculate max column widths
                    [cw1, cw2] = cols.reduce<[number, number]>(([m1, m2], [rec, exp]) => [
                        Math.max(m1, stripAnsi(rec).length),
                        Math.max(m2, stripAnsi(exp).length),
                    ], ['Received'.length, 'Expected'.length]),
                    // align output table columns
                    lines = cols.map(([rec, exp, cp]) => [
                        rec + ' '.repeat(cw1 - stripAnsi(rec).length),
                        exp + ' '.repeat(cw2 - stripAnsi(exp).length),
                        cp,
                    ].join('  ')),
                    // format table header
                    header = [
                        this.utils.DIM_COLOR('Received') + ' '.repeat(cw1 - 'Received'.length),
                        this.utils.DIM_COLOR('Expected') + ' '.repeat(cw2 - 'Expected'.length),
                        this.utils.DIM_COLOR('CodePoint'),
                    ].join('  ');
                // return jest matcher message
                return `${this.utils.matcherHint(
                    'toMatchEachCodePoint',
                    'received',
                    expected === undefined ? '' : 'expected',
                )}\n\n${[header, ...lines].join('\n')}`;
            },
        };
    },

    toMatchEachSequence(received: [number[], boolean, boolean?][], expected?: boolean) {
        // if expected arg was not provided, it must be provided as the 3rd value in each fixture item
        const unmatched = received.filter(([, rec, exp = expected]) => rec !== exp);
        return {
            pass: unmatched.length === 0,
            message: () => {
                const cols = unmatched.map<[string, string, string, string]>(([seq, rec, exp = expected]) => [
                        this.utils.printReceived(rec),
                        this.utils.printExpected(exp),
                        seq.map(hex).join(' '),
                        seq.map((cp) => String.fromCodePoint(cp)).join(''),
                    ]),
                    // calculate max column widths
                    [cw1, cw2, cw3] = cols.reduce<[number, number, number]>(([m1, m2, m3], [rec, exp, seq]) => [
                        Math.max(m1, stripAnsi(rec).length),
                        Math.max(m2, stripAnsi(exp).length),
                        Math.max(m3, seq.length),
                    ], ['Received'.length, 'Expected'.length, 0]),
                    // align output table columns
                    lines = cols.map(([rec, exp, seq, char]) => [
                        rec + ' '.repeat(cw1 - stripAnsi(rec).length),
                        exp + ' '.repeat(cw2 - stripAnsi(exp).length),
                        seq + ' '.repeat(cw3 - seq.length),
                        `'${char}'`,
                    ].join('  ')),
                    // format table header
                    header = [
                        this.utils.DIM_COLOR('Received') + ' '.repeat(cw1 - 'Received'.length),
                        this.utils.DIM_COLOR('Expected') + ' '.repeat(cw2 - 'Expected'.length),
                        this.utils.DIM_COLOR('Sequence'),
                    ].join('  ');
                // return jest matcher message
                return `${this.utils.matcherHint(
                    'toMatchEachSequence',
                    'received',
                    expected === undefined ? '' : 'expected',
                )}\n\n${[header, ...lines].join('\n')}`;
            },
        };
    },
});