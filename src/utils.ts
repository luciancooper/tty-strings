// eslint-disable-next-line @typescript-eslint/no-require-imports
import ansiRegex = require('ansi-regex');
import { styleCodes, closingCodes } from './ansiCodes';

/**
 * A generator function that matches all ansi escape sequences within a string, yielding sequential
 * chunks that are either a matched escape sequence or a run of plain text between matches.
 *
 * @param string - input string
 * @returns - A generator that yields `[chunk, isEscape]` pairs
 */
export function* parseAnsi(string: string): Generator<[string, boolean], void> {
    // lower index of the chunk preceeding each escape sequence
    let i = 0;
    // match all ansi escape codes
    for (let regex = ansiRegex(), m = regex.exec(string); m; m = regex.exec(string)) {
        const { 0: seq, index: j } = m;
        // yield the chunk preceeding this escape if its length > 0
        if (j > i) yield [string.slice(i, j), false];
        // yield the matched escape
        yield [seq, true];
        // set lower string index of the next chunk to be processed
        i = j + seq.length;
    }
    // yield the final chunk of string if its length > 0
    if (i < string.length) yield [string.slice(i), false];
}

export type AnsiEscape<T> = [string, true, string, T] | [string, false, number, T];

export function parseEscape<T>(stack: AnsiEscape<T>[], seq: string, idx: T) {
    const [, sgr, link] = /[\u001B\u009B](?:\[(\d*(?:;[\d;]+)?m)|\]8;;(.*)\u0007)/.exec(seq) ?? [],
        // array of indexes of stack items closed by this sequence
        closedIndex: number[] = [];
    // update ansi escape stack
    if (sgr) {
        // parse each sgr code
        for (let re = /(?:[345]8;(?:2(?:;\d*){0,3}|5(?:;\d*)?|\d*)|\d*)[;m]/g, m = re.exec(sgr); m; m = re.exec(sgr)) {
            // no code is treated as a reset code
            const code = m[0].slice(0, -1) || '0',
                n = Number(/^[345]8;/.test(code) ? code.slice(0, 2) : code);
            if (closingCodes.includes(n)) {
                // remove all escapes that this sequence closes from the stack
                for (let x = stack.length - 1; x >= 0; x -= 1) {
                    const [, isLink, close] = stack[x]!;
                    // if item is a link or is not closed by this code, skip it
                    if (isLink || (n !== 0 && n !== close) || closedIndex.includes(x)) continue;
                    // if closed by reset, update the stack item
                    if (n === 0) stack[x]![2] = 0;
                    // add stack item index to closed array
                    closedIndex.push(x);
                }
            } else {
                // add this ansi escape to the stack
                stack.push([code, false, styleCodes.get(n) ?? 0, idx]);
            }
        }
    } else if (link !== undefined) {
        // if link is an empty string, then this is a closing hyperlink sequence
        if (!link.length) {
            // remove all hyperlink escapes from the stack
            for (let x = stack.length - 1; x >= 0; x -= 1) {
                const [, isLink] = stack[x]!;
                // if item is not an open hyperlink, skip it
                if (!isLink || closedIndex.includes(x)) continue;
                // add stack item index to closed array
                closedIndex.push(x);
            }
        } else {
            // add this hyperlink escape to the stack
            stack.push([seq, true, '\x1b]8;;\x07', idx]);
        }
    } else {
        // return null on a non SGR/hyperlink escape sequence
        return null;
    }
    const closed: AnsiEscape<T>[] = [];
    // remove closed items from the stack
    if (closedIndex.length) {
        for (const x of closedIndex.sort((a, b) => b - a)) {
            // add stack item to closed array
            closed.unshift(stack[x]!);
            // remove style sequence from the stack
            stack.splice(x, 1);
        }
    }
    return closed;
}

export function openEscapes<T>(stack: AnsiEscape<T>[]) {
    let esc = '',
        sgr: string[] = [];
    for (const [seq, isLink] of stack) {
        if (!isLink) {
            sgr.push(seq);
            continue;
        }
        if (sgr.length) {
            esc += `\x1b[${sgr.join(';')}m`;
            sgr = [];
        }
        esc += seq;
    }
    return esc + (sgr.length ? `\x1b[${sgr.join(';')}m` : '');
}

export function closeEscapes<T>(stack: AnsiEscape<T>[]) {
    const sgr: number[] = [];
    let link = '';
    for (const [, isLink, close] of stack) {
        if (!isLink) {
            if (!sgr.includes(close)) sgr.unshift(close);
        } else link = close;
    }
    return link + (sgr.length ? (sgr.includes(0) ? '\x1b[0m' : `\x1b[${sgr.join(';')}m`) : '');
}