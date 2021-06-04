// Type definitions for tty-strings
// Project: https://github.com/luciancooper/tty-strings
// Definitions by: Lucian Cooper <https://github.com/luciancooper>

export function codePointWidth(code: number): number;

export function stringLength(string: string): number;

export function stringWidth(string: string): number;

declare namespace wordWrap {
    export interface Options {
        /** @default false */
        hard?: boolean;
        /** @default true */
        trimLeft?: boolean;
    }
}

export function wordWrap(string: string, columns: number, options?: wordWrap.Options): string;

export function sliceChars(string: string, beginIndex?: number, endIndex?: number): string;

export function sliceColumns(string: string, beginIndex?: number, endIndex?: number): string;

export function stripAnsi(string: string): string;

export function splitChars(string: string): Generator<string, void, unknown>;

export function charWidths(string: string): Generator<readonly [string, number], void, unknown>;