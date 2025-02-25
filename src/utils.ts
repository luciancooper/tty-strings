import ansiRegex from './ansiRegex';
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

interface SGRParam {
    value: number
    subparams?: [number, ...number[]]
}

/**
 * Parse an SGR parameter string into commands
 * @param str - SGR parameter string, consisting of numerical digits (0 - 9) and delimeters : & ;
 */
function* parseSgrParams(str: string): Generator<({
    code: 38 | 48 | 58
    params: SGRParam[] | SGRParam
} | {
    code: number
    params: SGRParam
}) & { incomplete?: boolean }> {
    // start by parsing ; separated commands
    let digitIsSub = false,
        current: SGRParam = { value: -1 };
    const params: SGRParam[] = [current];
    for (let i = 0; i < str.length; i += 1) {
        const code = str.charCodeAt(i);
        switch (code) {
            case 0x3b: // semicolon ;
                digitIsSub = false;
                current = { value: -1 };
                params.push(current);
                break;
            case 0x3a: // colon :
                digitIsSub = true;
                if (current.subparams) current.subparams.push(-1);
                else current.subparams = [-1];
                break;
            default: {
                // digit 0x30 - 0x39
                const digit = code - 48;
                if (digitIsSub) {
                    const sub = current.subparams!,
                        cur = sub[sub.length - 1]!;
                    sub[sub.length - 1] = ~cur ? cur * 10 + digit : digit;
                } else current.value = ~current.value ? current.value * 10 + digit : digit;
                break;
            }
        }
    }
    // group params into commands
    for (let i = 0; i < params.length; i += 1) {
        const param = params[i]!,
            // get command code. -1 is converted to 0 (ZDM)
            code = Math.max(param.value, 0);
        if (code === 38 || code === 48 || code === 58) {
            // stop if this params has subparams, or if there are no more params to consume
            if (param.subparams) {
                yield { code, params: param };
                continue;
            }
            // store param starting index
            const start = i;
            // move to next param
            i += 1;
            // consume next param to get color model
            let next = params[i];
            // determine how many params need to be consumed based on the color model (only 2 & 5 are supported)
            const args = next?.value === 2 ? 3 : next?.value === 5 ? 1 : 0;
            // consume params
            for (let n = 0; next && !next.subparams && n < args; n += 1, i += 1, next = params[i]);
            // determine param span length
            const len = Math.min(i + 1, params.length) - start;
            // yield this color command
            yield {
                code,
                params: len === 1 ? param : params.slice(start, start + len),
                incomplete: !next?.subparams && len < args + 2,
            };
            continue;
        }
        yield { code, params: param };
    }
}

/**
 * Stringify a parsed SGR param, preserving the original syntax
 */
function stringifySgrParam(param: SGRParam) {
    return param.subparams
        ? [param.value, ...param.subparams].map((v) => (~v ? String(v) : '')).join(':')
        : ~param.value ? String(param.value) : '';
}

/**
 * Additional information about the escape sequence
 * - 0 = no additional info
 * - 1 = is link
 * - 2 = is incomplete sgr sequence that will consume subsequent parameters
 */
type EscapeAttr = 0 | 1 | 2;

export type AnsiEscape<T> = [string, EscapeAttr, string, T];

const sgrLinkRegex = /(?:(?:\x1b\x5b|\x9b)([\x30-\x3b]*m)|(?:\x1b\x5d|\x9d)8;(.*?)(?:\x1b\x5c|[\x07\x9c]))/;

export function parseEscape<T>(stack: AnsiEscape<T>[], seq: string, idx: T) {
    const [, sgr, link] = sgrLinkRegex.exec(seq) ?? [],
        // array of indexes of stack items closed by this sequence
        closedIndex: number[] = [];
    // update ansi escape stack
    if (sgr) {
        // parse each sgr param
        for (const { code, params, incomplete } of parseSgrParams(sgr.slice(0, -1))) {
            let id = String(code);
            // if command is underline with subparams, make id '4:0' or '4:'
            if (code === 4 && params.subparams) id += params.subparams[0] === 0 ? ':0' : ':';
            // check if this is a closing code
            if (closingCodes.includes(id)) {
                // create alias list for the two different underline close escapes
                const aliases = (id === '4:0' || id === '24') ? ['4:0', '24'] : null;
                // remove all escapes that this sequence closes from the stack
                for (let x = stack.length - 1; x >= 0; x -= 1) {
                    const [, attr, close] = stack[x]!;
                    // if item is a link or has already been closed within this sequence, skip it
                    if (attr === 1 || closedIndex.includes(x)) continue;
                    // if item not closed by this code, continue
                    if (id !== '0' && (aliases ? !aliases.includes(close) : id !== close)) continue;
                    // if closed by reset, update the stack item
                    if (id === '0') stack[x]![2] = '0';
                    // add stack item index to closed array
                    closedIndex.push(x);
                }
                continue;
            }
            // stringify param to preserve original syntax
            const str = Array.isArray(params) ? params.map(stringifySgrParam).join(';') : stringifySgrParam(params);
            // add this ansi escape to the stack
            stack.push([str, incomplete ? 2 : 0, styleCodes.get(id) ?? '0', idx]);
        }
    } else if (link !== undefined) {
        // escape follows this pattern: OSC 8 ; [params] ; [url] ST, so params portion must be removed to get the url
        const url = link.replace(/^[^;]*;/, '');
        // ignore malformed hyperlink escapes that do not contain an additional ; delimeter
        if (link === url) return null;
        // if url is empty, then this is a closing hyperlink sequence
        if (url === '') {
            // remove all hyperlink escapes from the stack
            for (let x = stack.length - 1; x >= 0; x -= 1) {
                const [, attr] = stack[x]!;
                // if item is not an open hyperlink, skip it
                if (attr !== 1 || closedIndex.includes(x)) continue;
                // update the closing sequence for this link
                stack[x]![2] = seq;
                // add stack item index to closed array
                closedIndex.push(x);
            }
        } else {
            // add this hyperlink escape to the stack
            const close = seq.replace(/((?:\x1b\x5d|\x9d)8;).*?(\x1b\x5c|[\x07\x9c])/, '$1;$2');
            stack.push([seq, 1, close, idx]);
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
    for (const [seq, attr] of stack) {
        // handle links
        if (attr === 1) {
            // add any accumulated sgr escapes
            if (sgr.length) {
                esc += `\x1b[${sgr.join(';')}m`;
                sgr = [];
            }
            esc += seq;
            continue;
        }
        // add sgr sequence to list of accumulated sgr escapes
        sgr.push(seq);
        // if this sequence is incomplete and will consume subsequent parameters, escapes must be broken up
        if (attr === 2) {
            esc += `\x1b[${sgr.join(';')}m`;
            sgr = [];
        }
    }
    return esc + (sgr.length ? `\x1b[${sgr.join(';')}m` : '');
}

export function closeEscapes<T>(stack: AnsiEscape<T>[]) {
    const sgr: string[] = [];
    let link = '';
    for (const [, attr, close] of stack) {
        if (attr === 1) {
            link = close;
            continue;
        }
        // don't add duplicate close commands
        if (sgr.includes(close)) continue;
        // add new underline close escape if old one is not present
        if (close === '4:0') {
            if (!sgr.includes('24')) sgr.unshift(close);
            continue;
        }
        // legacy underline close overrides newer 4:0 close
        if (close === '24') {
            const index = sgr.indexOf('4:0');
            if (index < 0) sgr.unshift(close);
            else sgr[index] = close;
            continue;
        }
        // add any other close escape
        sgr.unshift(close);
    }
    return link + (sgr.length ? (sgr.includes('0') ? '\x1b[0m' : `\x1b[${sgr.join(';')}m`) : '');
}