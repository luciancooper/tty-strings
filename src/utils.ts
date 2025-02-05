import ansiRegex from './ansiRegex';
import { styleCodes, closingCodes, closingCodeAliases } from './ansiCodes';

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

export type AnsiEscape<T> = [string, boolean, string, T];

const sgrLinkRegex = /(?:(?:\x1b\x5b|\x9b)([\x30-\x3f]*[\x20-\x2f]*m)|(?:\x1b\x5d|\x9d)8;(.*?)(?:\x1b\x5c|[\x07\x9c]))/;

export function parseEscape<T>(stack: AnsiEscape<T>[], seq: string, idx: T) {
    const [, sgr, link] = sgrLinkRegex.exec(seq) ?? [],
        // array of indexes of stack items closed by this sequence
        closedIndex: number[] = [];
    // update ansi escape stack
    if (sgr) {
        // parse each sgr code
        for (let re = /(?:[345]8;(?:2(?:;\d*){0,3}|5(?:;\d*)?|\d*)|[\d:]*)[;m]/g, m = re.exec(sgr); m; m = re.exec(sgr)) {
            // no code is treated as a reset code
            const code = m[0].slice(0, -1) || '0',
                n = /^[345]8[:;]/.test(code) ? code.slice(0, 2) : code;
            if (closingCodes.includes(n)) {
                // retrieve closing code alias list if it has one
                const aliases = closingCodeAliases.get(n);
                // remove all escapes that this sequence closes from the stack
                for (let x = stack.length - 1; x >= 0; x -= 1) {
                    const [, isLink, close] = stack[x]!;
                    // if item is a link or has already been closed within this sequence, skip it
                    if (isLink || closedIndex.includes(x)) continue;
                    // if item not closed by this code, continue
                    if (n !== '0' && (aliases ? !aliases.includes(close) : n !== close)) continue;
                    // if closed by reset, update the stack item
                    if (n === '0') stack[x]![2] = '0';
                    // add stack item index to closed array
                    closedIndex.push(x);
                }
            } else {
                // add this ansi escape to the stack
                stack.push([code, false, styleCodes.get(n) ?? '0', idx]);
            }
        }
    } else if (link !== undefined) {
        // if link is just a semicolon, then this is a closing hyperlink sequence
        if (link === ';') {
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
            const close = seq.replace(/((?:\x1b\x5d|\x9d)8;).*?(\x1b\x5c|[\x07\x9c])/, '$1;$2');
            stack.push([seq, true, close, idx]);
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
    const sgr: string[] = [];
    let link = '';
    for (const [, isLink, close] of stack) {
        if (isLink) {
            link = close;
            continue;
        }
        if (sgr.includes(close)) continue;
        if (close === '4:0') {
            if (!sgr.includes('24')) sgr.unshift(close);
        } else if (close === '24') {
            const index = sgr.indexOf('4:0');
            if (index < 0) sgr.unshift(close);
            else sgr[index] = close;
        } else {
            sgr.unshift(close);
        }
    }
    return link + (sgr.length ? (sgr.includes('0') ? '\x1b[0m' : `\x1b[${sgr.join(';')}m`) : '');
}