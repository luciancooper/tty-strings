import { styleCodes, closingCodes } from './ansiCodes';

export type AnsiEscape<T> = [string, true, string, T] | [string, false, number, T];

export function parseEscape<T>(stack: AnsiEscape<T>[], seq: string, idx: T) {
    const [, code, link] = /[\u001B\u009B](?:\[(\d+)(?:;\d+)*m|\]8;;(.*)\u0007)/.exec(seq) ?? [];
    // index of the lowest item in the stack closed by this sequence
    let closed;
    // update ansi escape stack
    if (code) {
        const n = Number(code);
        if (closingCodes.includes(n)) {
            // remove all escapes that this sequence closes from the stack
            for (let x = stack.length - 1; x >= 0; x -= 1) {
                const [, isLink, close, cidx] = stack[x]!;
                // if item is a link or is not closed by this code, skip it
                if (isLink || (n !== 0 && close !== n)) continue;
                // remove style sequence from the stack
                stack.splice(x, 1);
                // update the closed index
                closed = cidx;
            }
        } else {
            // add this ansi escape to the stack
            stack.push([seq, false, styleCodes.get(n) ?? 0, idx]);
        }
    } else if (link !== undefined) {
        // if link is an empty string, then this is a closing hyperlink sequence
        if (!link.length) {
            // remove all hyperlink escapes from the stack
            for (let x = stack.length - 1; x >= 0; x -= 1) {
                const [, isLink,, cidx] = stack[x]!;
                // if item is not an open hyperlink, skip it
                if (!isLink) continue;
                // remove open hyperlink sequence from the stack
                stack.splice(x, 1);
                // update the closed index
                closed = cidx;
            }
        } else {
            // add this hyperlink escape to the stack
            stack.push([seq, true, '\x1b]8;;\x07', idx]);
        }
    } else {
        // return null on a non SGR/hyperlink escape sequence
        return null;
    }
    return closed;
}

export function closeEscapes<T>(stack: AnsiEscape<T>[]) {
    const escapes = stack.map(([, isLink, close]) => (isLink ? close : `\x1b[${close}m`));
    let result = '';
    while (escapes.length) {
        const esc = escapes.pop();
        for (let i = escapes.length - 1; i >= 0; i -= 1) {
            if (esc === escapes[i]) escapes.splice(i, 1);
        }
        result += esc;
    }
    return result;
}