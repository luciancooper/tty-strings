const { stripAnsi } = require('..');

function hex(num) {
    const h = num.toString(16).toUpperCase();
    return '0'.repeat(Math.max(0, 4 - h.length)) + h;
}

expect.extend({
    toMatchEachCodePoint(received, expected) {
        const unmatched = received.filter(([, rec, exp = expected]) => rec !== exp);
        return {
            pass: unmatched.length === 0,
            message: () => {
                let lines = unmatched.map(([cp, rec, exp = expected]) => [
                    this.utils.printReceived(rec),
                    this.utils.printExpected(exp),
                    hex(cp),
                ]);
                // calculate max column lengths
                const cols = lines.reduce(([m1, m2], [rec, exp]) => [
                    Math.max(m1, stripAnsi(rec).length),
                    Math.max(m2, stripAnsi(exp).length),
                ], ['Received'.length, 'Expected'.length]);
                // align output table columns
                lines = lines.map(([rec, exp, cp]) => [
                    rec + ' '.repeat(cols[0] - stripAnsi(rec).length),
                    exp + ' '.repeat(cols[1] - stripAnsi(exp).length),
                    cp,
                ].join('  '));
                // format table header
                const header = [
                    this.utils.DIM_COLOR('Received') + ' '.repeat(cols[0] - 'Received'.length),
                    this.utils.DIM_COLOR('Expected') + ' '.repeat(cols[1] - 'Expected'.length),
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
    toMatchEachSequence(received, expected) {
        const unmatched = expected === undefined
            // expected value was not provided, so it is included as the 3rd value in each fixture item
            ? received.filter(([, rec, exp]) => rec !== exp)
            // expected value has been provided
            : received.filter(([, rec]) => rec !== expected);
        return {
            pass: unmatched.length === 0,
            message: () => {
                let lines = unmatched.map(([seq, rec, exp = expected]) => [
                    this.utils.printReceived(rec),
                    this.utils.printExpected(exp),
                    seq.map(hex).join(' '),
                    seq.map((cp) => String.fromCodePoint(cp)).join(''),
                ]);
                // calculate max column lengths
                const cols = lines.reduce(([m1, m2, m3], [rec, exp, seq]) => [
                    Math.max(m1, stripAnsi(rec).length),
                    Math.max(m2, stripAnsi(exp).length),
                    Math.max(m3, seq.length),
                ], ['Received'.length, 'Expected'.length, 0]);
                // align output table columns
                lines = lines.map(([rec, exp, seq, char]) => [
                    rec + ' '.repeat(cols[0] - stripAnsi(rec).length),
                    exp + ' '.repeat(cols[1] - stripAnsi(exp).length),
                    seq + ' '.repeat(cols[2] - seq.length),
                    `'${char}'`,
                ].join('  '));
                // format table header
                const header = [
                    this.utils.DIM_COLOR('Received') + ' '.repeat(cols[0] - 'Received'.length),
                    this.utils.DIM_COLOR('Expected') + ' '.repeat(cols[1] - 'Expected'.length),
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