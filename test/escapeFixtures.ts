export interface EscapeFixtures {
    group: string
    escapes: { code: string, desc: string }[]
}

/**
 * These fixtures are derived from a variety of sources.
 *
 * XTerm compatable escapes derived from:
 * {@link https://invisible-island.net/xterm/ctlseqs/ctlseqs.txt|XTerm Control Sequences}
 *
 * VT escapes derived from the VT520 docs chapter 5, found here:
 * {@link https://vt100.net/dec/ek-vt520-rm.pdf|VT520/VT525 Video Terminal Programmer Information}
 *
 * iTerm2 specific escapes found here:
 * {@link https://iterm2.com/documentation-escape-codes.html|iTerm2 Proprietary Escape Codes}
 *
 * Kitty terminal specific escapes are documented here:
 * {@link https://sw.kovidgoyal.net/kitty/protocol-extensions/|Kitty terminal protocol extensions}
*/
export default [{
    group: 'vt52 mode escapes',
    escapes: [
        { code: '\x1bA', desc: 'cursor up' },
        { code: '\x1bB', desc: 'cursor down' },
        { code: '\x1bC', desc: 'cursor right' },
        { code: '\x1bD', desc: 'cursor left' },
        { code: '\x1bF', desc: 'enter graphics mode' },
        { code: '\x1bG', desc: 'exit graphics mode' },
        { code: '\x1bH', desc: 'cursor to home position' },
        { code: '\x1bI', desc: 'reverse line feed' },
        { code: '\x1bJ', desc: 'erase from cursor to end of screen' },
        { code: '\x1bK', desc: 'erase from cursor to end of line' },
        { code: '\x1b=', desc: 'enter alternate keypad mode' },
        { code: '\x1b>', desc: 'exit alternate keypad mode' },
        { code: '\x1b<', desc: 'exit VT52 mode' },
        { code: '\x1b^', desc: 'enter autoprint mode' },
        { code: '\x1b_', desc: 'exit autoprint mode' },
        { code: '\x1bV', desc: 'print the line with the cursor' },
        { code: '\x1bW', desc: 'enter printer controller mode' },
        { code: '\x1bX', desc: 'exit printer controller mode' },
        { code: '\x1b]', desc: 'print screen' },
        { code: '\x1bY', desc: 'move the cursor' },
        { code: '\x1bZ', desc: 'identify (host to terminal)' },
        { code: '\x1b/Z', desc: 'report (terminal to host)' },
    ],
}, {
    group: 'escape sequences',
    escapes: [
        { code: '\x1b}', desc: 'locking shift 2 right (LS2R)' },
        { code: '\x1b~', desc: 'locking shift 1 right (LS1R)' },
        { code: '\x1b|', desc: 'locking shift 3 right (LS3R)' },
        { code: '\x1bM', desc: 'reverse index (RI)' },
        { code: '\x1bN', desc: 'single shift 2 (SS2)' },
        { code: '\x1bn', desc: 'locking shift 2 (LS2)' },
        { code: '\x1bO', desc: 'single shift 3 (SS3)' },
        { code: '\x1bo', desc: 'locking shift 3 (LS3)' },
        { code: '\x1b F', desc: '7-bit controls (S7C1T)' },
        { code: '\x1b G', desc: '8-bit controls (S8C1T)' },
        { code: '\x1bc', desc: 'reset to initial state (RIS)' },
        { code: '\x1bE', desc: 'next line (NEL)' },
        { code: '\x1b#3', desc: 'double height line top (DECDHL)' },
        { code: '\x1b#4', desc: 'double height line bottom (DECDHL)' },
        { code: '\x1b#5', desc: 'single width line (DECSWL)' },
        { code: '\x1b#6', desc: 'double width line (DECDWL)' },
        { code: '\x1b#8', desc: 'screen alignment pattern (DECALN)' },
        { code: '\x1b6', desc: 'back index (DECBI)' },
        { code: '\x1b7', desc: 'save cursor (DECSC)' },
        { code: '\x1b8', desc: 'restore cursor (DECRC)' },
        { code: '\x1b9', desc: 'forward index (DECFI)' },
        { code: '\x1b L', desc: 'set ANSI conformance level 1' },
        { code: '\x1b M', desc: 'set ANSI conformance level 2' },
        { code: '\x1b N', desc: 'set ANSI conformance level 3' },
        { code: '\x1b%@', desc: 'select default character set' },
        { code: '\x1b%G', desc: 'select UTF-8 character set' },
        { code: '\x1bl', desc: 'memory lock' },
        { code: '\x1bm', desc: 'memory unlock' },
        { code: '\x1bP', desc: 'delete / PF1 input sequence' },
        { code: '\x1bQ', desc: 'insert / PF2 input sequence' },
        { code: '\x1bR', desc: 'PF3 input sequence' },
        { code: '\x1bS', desc: 'next / PF4 input sequence' },
        { code: '\x1bT', desc: 'prior input sequence' },
        { code: '\x1bh', desc: 'home / find input sequence' },
        { code: '\x1bf', desc: 'right + alt input sequence' },
        { code: '\x1bb', desc: 'left + alt input sequence' },
        { code: '\x1b\x5c', desc: 'string terminator (ST)' },
    ],
}, {
    group: 'select character set',
    escapes: [
        { code: '\x1b)A', desc: 'designate G1 set (94 char) - united kingdom (UK)' },
        { code: '\x1b)%=', desc: 'designate G1 set (94 char) - hebrew' },
        { code: '\x1b)%0', desc: 'designate G1 set (94 char) - DEC turkish' },
        { code: '\x1b*7', desc: 'designate G2 set (94 char) - swedish' },
        { code: '\x1b*`', desc: 'designate G2 set (94 char) - norwegian/danish' },
        { code: '\x1b*&4', desc: 'designate G2 set (94 char) - DEC cyrillic' },
        { code: '\x1b+">', desc: 'designate G3 set (94 char) - greek' },
        { code: '\x1b+<', desc: 'designate G3 set (94 char) - user preferred selection set' },
        { code: '\x1b+"4', desc: 'designate G3 set (94 char) - DEC hebrew' },
        { code: '\x1b-A', desc: 'designate G1 set (96 char) - ISO latin-1 supplemental' },
        { code: '\x1b-H', desc: 'designate G1 set (96 char) - ISO hebrew supplemental' },
        { code: '\x1b-<', desc: 'designate G1 set (96 char) - user-preferred supplemental' },
        { code: '\x1b.B', desc: 'designate G2 set (96 char) - ISO latin-2 supplemental' },
        { code: '\x1b.L', desc: 'designate G2 set (96 char) - ISO latin-cyrillic' },
        { code: '\x1b/F', desc: 'designate G3 set (96 char) - ISO greek supplemental' },
        { code: '\x1b/M', desc: 'designate G3 set (96 char) - ISO latin-5 supplemental' },
    ],
}, {
    group: 'control sequences',
    escapes: [
        {
            code: '\x1b[@', // insert 1 blank character
            desc: 'insert character (ICH)',
        },
        {
            code: '\x1b[5 @', // 5 columns
            desc: 'shift left (SL)',
        },
        {
            code: '\x1b[3A', // move up 3 lines
            desc: 'cursor up (CUU)',
        },
        {
            code: '\x1b[ A', // 1 column
            desc: 'shift right (SR)',
        },
        {
            code: '\x1b[5B', // move down 5 lines
            desc: 'cursor down (CUD)',
        },
        {
            code: '\x1b[10C', // move forward (right) 10 columns
            desc: 'cursor forward (CUF)',
        },
        {
            code: '\x1b[D', // move left 1 column
            desc: 'cursor backward (CUB)',
        },
        {
            code: '\x1b[5E', // move down 5 lines
            desc: 'cursor next line (CNL)',
        },
        {
            code: '\x1b[F', // move up 1 line
            desc: 'cursor previous line (CPL)',
        },
        {
            code: '\x1b[9G', // move to column 9 of active line
            desc: 'cursor horizontal absolute (CHA)',
        },
        {
            code: '\x1b[H', // move to line 1 column 1
            desc: 'cursor position (CUP)',
        },
        {
            code: '\x1b[I', // move forward 1 tab stop
            desc: 'cursor horizontal forward tabulation (CHT)',
        },
        {
            code: '\x1b[2J', // erase all
            desc: 'erase in display (ED)',
        },
        {
            code: '\x1b[?1J', // selective erase above
            desc: 'selective erase in display (DECSED)',
        },
        {
            code: '\x1b[K', // erase to right
            desc: 'erase in line (EL)',
        },
        {
            code: '\x1b[?0K', // selective erase to right
            desc: 'selective erase in line (DECSEL)',
        },
        {
            code: '\x1b[L', // insert 1 line
            desc: 'insert line (IL)',
        },
        {
            code: '\x1b[5M', // delete 5 lines
            desc: 'delete line (DL)',
        },
        {
            code: '\x1b[99P', // delete 99 characters
            desc: 'delete character (DCH)',
        },
        {
            code: '\x1b[ P', // move to page 1
            desc: 'page position absolute (PPA)',
        },
        {
            code: '\x1b[2 Q', // move 2 pages forward
            desc: 'page position relative (PPR)',
        },
        {
            code: '\x1b[3 R', // move 3 pages backward
            desc: 'page position backward (PPB)',
        },
        {
            code: '\x1b[25;1R', // cursor at line 25 column 1
            desc: 'cursor position report (CPR)',
        },
        {
            code: '\x1b[?35;1;1R', // cursor at line 35, column 1, page 1
            desc: 'extended cursor position report (DECXCPR)',
        },
        {
            code: '\x1b[U', // next page
            desc: 'next page (NP)',
        },
        {
            code: '\x1b[2V', // 2 pages backward
            desc: 'preceding page (PP)',
        },
        {
            code: '\x1b[#P', // default push onto stack
            desc: 'push colors onto stack (XTPUSHCOLORS)',
        },
        {
            code: '\x1b[1#Q', // restore palette 1 without popping
            desc: 'pop colors from stack (XTPOPCOLORS)',
        },
        { code: '\x1b[#R', desc: 'report current entry on the palette stack (XTREPORTCOLORS)' },
        {
            code: '\x1b[S', // 1 line
            desc: 'scroll up (SU)',
        },
        {
            code: '\x1b[5T', // 5 lines
            desc: 'scroll down (SD)',
        },
        {
            // https://sw.kovidgoyal.net/kitty/unscroll/
            code: '\x1b[3+T', // 3 lines
            desc: 'unscroll the screen (kitty SD extension)',
        },
        {
            code: '\x1b[0;10#S', // response with parameters
            desc: 'report position on title stack (XTTITLEPOS)',
        },
        {
            code: '\x1b[?3;3;200;200S', // set ReGIS graphics geometry (200 x 200)
            desc: 'set or request graphics attribute (XTSMGRAPHICS)',
        },
        {
            code: '\x1b[1;5;5;1;1T', // start tracking
            desc: 'initiate highlight mouse tracking (XTHIMOUSE)',
        },
        {
            code: '\x1b[>2T', // do not set window/icon labels using UTF-8
            desc: 'reset title mode features (XTRMTITLE)',
        },
        { code: '\x1b[?5W', desc: 'reset tab stops (DECST8C)' },
        {
            code: '\x1b[X', // erase 1 character
            desc: 'erase character (ECH)',
        },
        {
            code: '\x1b[5Z', // move back 5 tab stops
            desc: 'cursor backward tabulation (CBT)',
        },
        {
            code: '\x1b[5^', // scroll down 5 lines
            desc: 'scroll down (SD)',
        },
        {
            code: '\x1b[`', // move to 1st column of active line
            desc: 'horizontal position absolute (HPA)',
        },
        {
            code: '\x1b[5a', // move 5 columns forward within active line
            desc: 'horizontal position relative (HPR)',
        },
        {
            code: '\x1b[5b', // 5 times
            desc: 'repeat preceding graphic character (REP)',
        },
        {
            code: '\x1b[c', // request attributes
            desc: 'primary device attributes (DA1)',
        },
        {
            code: '\x1b[?65;1;2;7;9;12;18;19;21;23;24;42;44;45;46c', // VT520 level 4
            desc: 'DA1 terminal response',
        },
        {
            code: '\x1b[>0c', // request secondary device attributes
            desc: 'secondary device attributes (DA2)',
        },
        {
            code: '\x1b[>65;20;1c', // VT525, firmware V2.0, PC keyboard
            desc: 'DA2 terminal response',
        },
        { code: '\x1b[=0c', desc: 'tertiary device attributes (DA3)' },
        {
            code: '\x1b[12d', // move to line 12
            desc: 'vertical line position absolute (VPA)',
        },
        {
            code: '\x1b[e', // move down 1 line
            desc: 'vertical position relative (VPR)',
        },
        {
            code: '\x1b[3;f', // move to row 3 column 1
            desc: 'horizontal and vertical position (HVP)',
        },
        {
            code: '\x1b[3g', // clear all tab stops
            desc: 'tab clear (TBC)',
        },
        {
            code: '\x1b[3h', // show control character mode - show control character (CRM)
            desc: 'set mode (SM)',
        },
        {
            code: '\x1b[?1047h', // screen buffer - use alternate screen buffer
            desc: 'DEC private mode set (DECSET)',
        },
        {
            code: '\x1b[2l', // keyboard action mode - unlock the keyboard (KAM)
            desc: 'reset mode (RM)',
        },
        {
            code: '\x1b[?25l', // text cursor enable mode - hide cursor (DECTCEM)
            desc: 'DEC private mode reset (DECRST)',
        },
        {
            code: '\x1b[12$p', // send/receive mode (SRM)
            desc: 'request ANSI mode (DECRQM)',
        },
        {
            code: '\x1b[?98$p', // auto resize mode (DECARSM)
            desc: 'request DEC mode (DECRQM)',
        },
        {
            code: '\x1b[19;2$y', // editing boundary - reset (EBM)
            desc: 'report ANSI mode (DECRPM)',
        },
        {
            code: '\x1b[?104;1$y', // secondary keyboard language - set (DECESKM)
            desc: 'report DEC mode (DECRPM)',
        },
        {
            code: '\x1b[?1053r', // SCO function-key mode
            desc: 'restore DEC private mode values (XTRESTORE)',
        },
        {
            code: '\x1b[?47s', // use alternate / normal screen buffer
            desc: 'save DEC private mode values (XTSAVE)',
        },
        {
            code: '\x1b[4i', // turn off printer controller mode
            desc: 'media copy (MC)',
        },
        {
            code: '\x1b[?1i', // print line containing cursor
            desc: 'media copy DEC-specific (DECMC)',
        },
        {
            code: '\x1b[>1;99m', // set modifyCursorKeys resource to 99
            desc: 'set/reset key modifier options (XTMODKEYS)',
        },
        {
            code: '\x1b[?1m', // modifyCursorKeys
            desc: 'query key modifier options (XTQMODKEYS)',
        },
        {
            code: '\x1b[6n', // request cursor position report (CPR)
            desc: 'device status report - ANSI standard (DSR)',
        },
        {
            code: '\x1b[?63;888n', // request memory checksum report - pid 888 (DECCKSR)
            desc: 'device status report - DEC private (DSR)',
        },
        {
            code: '\x1b[>0n', // modifyKeyboard
            desc: 'disable key modifier options',
        },
        {
            code: '\x1b[3p', // german
            desc: 'select set-up language (DECSSL)',
        },
        {
            code: '\x1b[>0p', // never hide the pointer
            desc: 'set pointerMode (XTSMPOINTER)',
        },
        { code: '\x1b[!p', desc: 'soft terminal reset (DECSTR)' },
        {
            code: '\x1b[65;2"p', // VT level 5 mode - 8 bit controls
            desc: 'set conformance level (DECSCL)',
        },
        {
            code: '\x1b[1;30#p', // bold & foreground attribute
            desc: 'push video attributes onto stack (XTPUSHSGR)',
        },
        {
            code: '\x1b[23;,p', // 23:00 PM
            desc: 'load time of day (DECLTOD)',
        },
        {
            code: '\x1b[4)p', // print all characters
            desc: 'select digital printed data type (DECSDPT)',
        },
        {
            code: '\x1b[210*p', // PC greek
            desc: 'select ProPrinter character set (DECSPPCS)',
        },
        {
            code: '\x1b[3943+p', // with optional id 3943
            desc: 'secure reset (DECSR)',
        },
        {
            code: '\x1b[6-p', // slow (10 cps)
            desc: 'select auto repeat rate (DECARR)',
        },
        {
            code: '\x1b[3943*q', // response to DECSR - secure reset successful
            desc: 'secure reset confirmation (DECSRC)',
        },
        {
            code: '\x1b[ p', // smooth 2
            desc: 'set scroll speed (DECSSCLS)',
        },
        { code: '\x1b[>0q', desc: 'report xterm name and version (XTVERSION)' },
        {
            code: '\x1b[2q', // light caps lock.
            desc: 'load LEDs (DECLL)',
        },
        {
            code: '\x1b[3 q', // blinking underline
            desc: 'set cursor style (DECSCUSR)',
        },
        {
            code: '\x1b[0"q', // DECSED and DECSEL can erase (default).
            desc: 'select character protection attribute (DECSCA)',
        },
        { code: '\x1b[#q', desc: 'pop video attributes from stack (XTPOPSGR)' },
        {
            code: '\x1b[2$q', // 60 ms
            desc: 'select disconnect delay time (DECSDDT)',
        },
        {
            code: '\x1b[10,q', // VT510
            desc: 'select terminal id (DECTID)',
        },
        {
            // copy paste keys (default mode) panning keys (enabled) resizing keys (disabled)
            code: '\x1b[1;0;2;1;3;2+q',
            desc: 'enable local functions (DECELF)',
        },
        {
            code: '\x1b[15-q', // 15 minutes
            desc: 'CRT saver timing (DECCRTST)',
        },
        {
            code: '\x1b[2;99r', // top margin = 2, bottom margin = 99
            desc: 'set top and bottom margins (DECSTBM)',
        },
        {
            code: '\x1b[0;0;99;99;32;43$r', // sgr 32;43
            desc: 'change attributes in rectangular area (DECCARA)',
        },
        {
            code: '\x1b[2;7*r', // host recive / 19200
            desc: 'select communication speed (DECSCS)',
        },
        {
            code: '\x1b[ r', // high
            desc: 'set key click volume (DECSKCV)',
        },
        {
            code: '\x1b[3;1;6;3+r', // lock (default modifier function) ; right alt (disabled)
            desc: 'select modifier key reporting (DECSMKR)',
        },
        {
            code: '\x1b[15-r', // 15 minutes
            desc: 'energy saver timing (DECSEST)',
        },
        { code: '\x1b[s', desc: 'save cursor (SCOSC)' },
        { code: '\x1b[5;5s', desc: 'set left and right margins (DECSLRM)' },
        {
            code: '\x1b[>3s', // never allow shift-key as modifier in mouse protocol
            desc: 'set/reset shift-escape options (XTSHIFTESCAPE)',
        },
        {
            code: '\x1b[;0;;2*s', // com port, transmit, XON/OFF, high (768)
            desc: 'select flow control (DECSFC)',
        },
        {
            code: '\x1b[3$s', // DEC + IBM
            desc: 'select printer type (DECSPRTT)',
        },
        {
            code: '\x1b[4;500;800t', // resize the xterm window to 800 x 500
            desc: 'window manipulation (XTWINOPS)',
        },
        {
            code: '\x1b[>2t', // set window/icon labels using UTF-8
            desc: 'set title mode features (XTSMTITLE)',
        },
        {
            code: '\x1b[3 t', // low
            desc: 'set warning-bell volume (DECSWBV)',
        },
        {
            code: '\x1b[0;0;99;99;1;4;5$t', // reverse bold, underlined, blink attributes
            desc: 'reverse attributes in rectangular area (DECRARA)',
        },
        {
            code: '\x1b[2"t', // 60 hz
            desc: 'select refresh rate (DECSRFR)',
        },
        { code: '\x1b[u', desc: 'restore cursor (SCORC)' },
        {
            code: '\x1b[107::75;2u', // shift+k with alternate key reporting
            desc: 'progressive enhancement keys',
        },
        {
            code: '\x1b[?u', // query current flags
            desc: 'report progressive enhancement flags',
        },
        {
            code: '\x1b[>31u', // all flags enabled
            desc: 'push progressive enhancement flags',
        },
        {
            code: '\x1b[<u', // pop 1 entry from stack
            desc: 'pop progressive enhancement flags',
        },
        {
            code: '\x1b[=1;3u', // reset disambiguate escape codes mode
            desc: 'update progressive enhancement settings',
        },
        { code: '\x1b[&u', desc: 'user-preferred supplemental set (DECRQUPSS)' },
        {
            code: '\x1b[ u', // off.
            desc: 'set margin-bell volume (DECSMBV)',
        },
        { code: '\x1b[1$u', desc: 'terminal state report (DECTSR / DECRQTSR)' },
        {
            code: '\x1b[2;2$u', // RGB (red 0-100, green 0-100, blue 0-100)
            desc: 'color table request (DECCTR)',
        },
        {
            code: '\x1b[97,u', // target keys station number 97
            desc: 'key type inquiry (DECRQKT)',
        },
        {
            code: '\x1b[1;2*u', // parallel port comm2
            desc: 'select communication port (DECSCP)',
        },
        {
            code: '\x1b[2;3"u', // graphic key / 30 cps
            desc: 'set transmit rate limit (DECSTRL)',
        },
        { code: '\x1b["v', desc: 'request displayed extent (DECRQDE)' },
        {
            code: '\x1b[1;1;99;99;1;99;99;2$v', // copy from rect [1,1,99,99] page 1 to [99,99] page 2
            desc: 'copy rectangular area (DECCRA)',
        },
        {
            code: '\x1b[97;0,v', // key station 97 - alphanumeric
            desc: 'report key type (DECRPKT)',
        },
        {
            code: '\x1b[ v', // caps lock
            desc: 'set lock key style (DECSLCK)',
        },
        {
            code: '\x1b[1$w', // cursor information report (DECCIR)
            desc: 'request presentation state report (DECRQPSR)',
        },
        {
            code: "\x1b[1;1;99;99'w", // rectangle top: 1, left: 1, bottom: 99, right: 99
            desc: 'enable filter rectangle (DECEFR)',
        },
        {
            code: '\x1b[99;99;1;1;1"w', // rectangle top: 1, left: 1, bottom: 99, right: 99 page 1
            desc: 'report displayed extent (DECRPDE)',
        },
        {
            code: '\x1b[118;5,w', // key definition for keystation 118 ; control
            desc: 'request key definition (DECRQKD)',
        },
        {
            code: '\x1b[2;1;2;2+w', // printer port ; 8 bits ; even parity ; 2 bits
            desc: 'set port parameter (DECSPP)',
        },
        { code: '\x1b[10;15;07;90;1&w', desc: 'locator report (DECLRP)' },
        {
            code: '\x1b[1;4;2x', // unsolicited report, parity set and odd, 7 bits per character (DECREPTPARM)
            desc: 'request terminal parameters (DECREQTPARM)',
        },
        { code: '\x1b[&x', desc: 'enable session (DECES)' },
        { code: '\x1b[+x', desc: 'program key free memory inquiry (DECRQPKFM)' },
        {
            code: '\x1b[*x', // from start to end position, wrapped
            desc: 'select attribute change extent (DECSACE)',
        },
        {
            code: '\x1b[97;1;1;99;99$x', // fill rect with character "a"
            desc: 'fill rectangular area (DECFRA)',
        },
        {
            code: '\x1b[5;5;5;5;,x', // allocate 5 line pages to each session
            desc: 'session page memory allocation (DECSPMA)',
        },
        {
            code: '\x1b[804;402+y', // 402 space remaining
            desc: 'program key free memory report (DECPKFMR)',
        },
        {
            code: '\x1b[4;1;2;9y', // power-up self test ; RS-232 port data loopback test ; parallel port loopback test
            desc: 'invoke confidence test (DECTST)',
        },
        {
            code: '\x1b[2#y', // do not omit checksum for blanks
            desc: 'select checksum extension (XTCHECKSUM)',
        },
        {
            code: '\x1b[888;1;1;1;99;99*y', // pid 888, rectangle top: 1, left: 1, bottom: 99, right: 99
            desc: 'request checksum of rectangular area (DECRQCRA)',
        },
        {
            code: '\x1b[1,y', // only when active
            desc: 'update session (DECUS)',
        },
        {
            code: '\x1b[214z', // home
            desc: 'sun keyboard non-function keys',
        },
        {
            code: '\x1b[1*z', // invoke macro with pid 1
            desc: 'invoke macro (DECINVM)',
        },
        {
            code: '\x1b[3+z', // recalls saved keys definition
            desc: 'program key action (DECPKA)',
        },
        {
            code: "\x1b[1;2'z", // locator enabled ; character cells
            desc: 'enable locator reports (DECELR)',
        },
        {
            code: '\x1b[1;1;99;99$z', // rectangle top: 1, left: 1, bottom: 99, right: 99
            desc: 'erase rectangular area (DECERA)',
        },
        {
            code: '\x1b[1,z', // one each
            desc: 'down line load allocation (DECDLDA)',
        },
        {
            code: '\x1b[1*{', // 16 bytes available
            desc: 'macro space report (DECMSR)',
        },
        {
            code: "\x1b[2;4'{", // do not report button up or down transitions
            desc: 'select locator events (DECSLE)',
        },
        {
            code: '\x1b[1;30#{', // bold & foreground attribute
            desc: 'push video attributes onto stack (XTPUSHSGR)',
        },
        {
            code: '\x1b[1;1;99;99${', // rectangle top: 1, left: 1, bottom: 99, right: 99
            desc: 'selective erase rectangular area (DECSERA)',
        },
        {
            code: '\x1b[1){', // alternate color
            desc: 'select color look-up table (DECSTGLT)',
        },
        {
            code: '\x1b[2,{', // zero with slash Ø
            desc: 'select zero symbol (DECSZS)',
        },
        {
            code: '\x1b[1;1;99;99#|', // rectangle top: 1, left: 1, bottom: 99, right: 99
            desc: 'report selected graphic rendition (XTREPORTSGR)',
        },
        {
            code: '\x1b[80$|', // 80 columns.
            desc: 'select columns per page (DECSCPP)',
        },
        { code: "\x1b[0'|", desc: 'request locator position (DECRQLP)' },
        {
            code: '\x1b[26*|', // 26 lines per screen
            desc: 'set number of lines per screen (DECSNLS)',
        },
        { code: '\x1b[#}', desc: 'pop video attributes from stack (XTPOPSGR)' },
        {
            code: '\x1b[1;1;15,|', // normal text, fg color 1, bg color 15
            desc: 'assign color (DECAC)',
        },
        {
            code: '\x1b[3;9;10,}', // underline, fg color 9, bg color 10
            desc: 'alternate text color (DECATC)',
        },
        {
            code: "\x1b[2'}", // insert 2 columns
            desc: 'insert column (DECIC)',
        },
        {
            code: '\x1b[2;5 }', // enhanced PC - danish
            desc: 'keyboard language selection (DECKBD)',
        },
        {
            code: '\x1b[2;3;3;1*}', // print (disabled) ; set-up (print)
            desc: 'local function key control (DECLFKC)',
        },
        {
            code: '\x1b[1$}', // status line
            desc: 'select active status display (DECSASD)',
        },
        {
            code: '\x1b[15;2~', // F5 + shift
            desc: 'function key (DECFNK)',
        },
        {
            code: "\x1b['~", // delete 1 column
            desc: 'delete column (DECDC)',
        },
        {
            code: '\x1b[1$~', // indicator status line
            desc: 'select status line type (DECSSDT)',
        },
        {
            code: '\x1b[4 ~', // VT420 PCTerm
            desc: 'terminal mode emulation (DECTME)',
        },
        {
            code: '\x1b[5;16;7,~', // high volume, 0.5 second, F#5
            desc: 'play sound (DECPS)',
        },
    ],
}, {
    group: 'sgr control sequences',
    escapes: [
        { code: '\x1b[0m', desc: 'reset' },
        { code: '\x1b[3m', desc: 'italic on' },
        { code: '\x1b[4:2m', desc: 'underline double' },
        { code: '\x1b[8:7m', desc: 'overstrike' },
        { code: '\x1b[22m', desc: 'bold/faint/shadow off' },
        { code: '\x1b[32m', desc: 'foreground green' },
        { code: '\x1b[38:5:244m', desc: 'foreground color 256 palette' },
        { code: '\x1b[38;2;97;52;235m', desc: 'foreground color RGB 8 (legacy encoding)' },
        { code: '\x1b[44m', desc: 'background blue' },
        { code: '\x1b[48:2:204:192:240m', desc: 'background color RGB 8' },
        { code: '\x1b[48;5;176m', desc: 'background color 256 palette (legacy encoding)' },
        { code: '\x1b[58:2:102:203:2m', desc: 'underline color RGB 8' },
        { code: '\x1b[58;2;102;203;2m', desc: 'underline color RGB 8 (legacy encoding)' },
        { code: '\x1b[91m', desc: 'foreground bright red' },
        { code: '\x1b[103m', desc: 'background bright yellow' },
    ],
}, {
    group: 'device control strings',
    escapes: [
        {
            code: '\x1bP!|00010205\x1b\x5c', // manufactured at site 00 with uuid 010205
            desc: 'report terminal unit id (DECRPTUI)',
        },
        {
            code: '\x1bP0!u%5\x1b\x5c', // DEC supplemental graphic
            desc: 'assigning user-preferred supplemental set (DECAUPSS)',
        },
        {
            code: '\x1bP"z24/97;117/118;\x1b\x5c', // copy defaults from key 24 to 97, 117 to 118
            desc: 'copy key default (DECCKD)',
        },
        {
            code: '\x1bP888!~09AF\x1b\x5c', // pid 888 checksum 09AF
            desc: 'memory checksum report (DECCKSR)',
        },
        {
            code: '\x1bP24;0;0!zDATA\x1b\x5c', // pid 24
            desc: 'define macro (DECDMAC)',
        },
        { code: '\x1bP1v3EA1\x1b\x5c', desc: 'load answerback message (DECLANS)' },
        {
            code: '\x1bP1rc48fa250d64f64b9d5ac418bc7760b\x1b\x5c', // message is 30 characters long
            desc: 'load banner message (DECLBAN)',
        },
        {
            code: '\x1bP"x118/2/100/2f/1\x1b\x5c', // key 118/shift modifier/fn 100/UDS 2f/local
            desc: 'program function key (DECPFK)',
        },
        {
            code: '\x1bP"~118/3F/100/2f/1\x1b\x5c', // key 118/3f/fn 100/UDS 2f/ local
            desc: 'report modifiers/alphanumeric key state (DECRPAK)',
        },
        {
            code: '\x1bP"}118/2/2f/1\x1b\x5c', // key 118/shift modifier/UDS 2f/local
            desc: 'report function key definition (DECRPFK)',
        },
        {
            code: '\x1bP0$r0;4;5;7m\x1b\x5c', // set graphic rendition (SGR)
            desc: 'report selection or setting (DECRPSS)',
        },
        {
            code: '\x1bP$qm\x1b\x5c', // set graphic rendition (SGR)
            desc: 'request selection or setting (DECRQSS)',
        },
        {
            code: '\x1bP1$s65;1;2;7;9;12;18;19;21;23;24;42;44;45;46\x1b\x5c', // response to DECTSR / DECRQTSR
            desc: 'terminal state report',
        },
        {
            code: '\x1bP2$p0;2;0;0;0/1;2;25;25;25/\x1b\x5c', // color table state
            desc: 'restore terminal state (DECRSTS)',
        },
        {
            code: '\x1bP2$t9/17/25/33/41/49/57/65/73\x1b\x5c', // restores tab stop report (DECTABSR)
            desc: 'restore presentation state (DECRSPS)',
        },
        {
            code: '\x1bP1$u"?\x1b\x5c', // DEC greek
            desc: 'cursor information report (DECCIR)',
        },
        { code: '\x1bP2$u9/17/25/33/41/49/57/65/73\x1b\x5c', desc: 'tab stop report (DECTABSR)' },
        {
            code: '\x1bP!{00010205\x1b\x5c', // manufactured at site 00 with uuid 010205
            desc: 'set terminal unit ID (DECSTUI)',
        },
        {
            code: '\x1bP1;1;1|34/5052494E54\x1b\x5c', // define unshifted F20 key to PRINT
            desc: 'user defined keys (DECUDK)',
        },
        {
            code: '\x1bP+q544E\x1b\x5c', // TN request termcap name
            desc: 'request termcap string (XTGETTCAP)',
        },
        {
            code: '\x1bP1+r544E=787465726D2D323536636F6C6F72\x1b\x5c', // encoded string 'xterm-256color'
            desc: 'response to termcap string request',
        },
        { code: '\x1bP>|iTerm2 3.5.10\x1b\x5c', desc: 'response to XTVERSION' },
    ],
}, {
    group: 'operating system commands',
    escapes: [
        {
            code: '\x1b]0;⚙️ C:\\WINDOWS\\system32\\cmd.exe \x07', // title string with emoji
            desc: 'set icon name & window title',
        },
        {
            code: '\x1b]2;sg\x1b[32m@tota\x1b[39m:~/git/\x07', // contains sgr sequences
            desc: 'set window title',
        },
        {
            code: '\x1b]4;2;rgb:5a5a/f7f7/8e8e\x07', // set ansi color 2 (green) to rgb(90, 247, 142)
            desc: 'change/query color number',
        },
        { code: '\x1b]7;file://example.com/usr/bin\x07', desc: 'set RemoteHost and CurrentDir (iterm2)' },
        { code: '\x1b]8;k=v;https://example-a.com/?q=hello+world&a_b=1&c=2#tit%20le\x07', desc: 'set hyperlink' },
        { code: '\x1b]8;;\x07', desc: 'empty hyperlink' },
        { code: '\x1b]9;Notification message\x07', desc: 'show notification (iterm2)' },
        {
            code: '\x1b]11;?\x07', // query color
            desc: 'set/query text background color',
        },
        {
            // set fg green, cursor color dynamic, reset bg color
            code: '\x1b]21;foreground=rgb:69/8b/69;cursor=;background\x1b\x5c',
            desc: 'set/query color values (kitty)',
        },
        { code: '\x1b]22;?__current__\x1b\x5c', desc: 'query mouse pointer shape (kitty)' },
        { code: '\x1b]99;i=1:d=0;Hello world\x1b\x5c', desc: 'show desktop notification (kitty)' },
        {
            code: '\x1b]104;8;9;10;11;12;13;14;15\x07', // reset ansi colors 8 - 15 (bright colors)
            desc: 'reset color number',
        },
        {
            code: '\x1b]133;C\x07', // FTCS_COMMAND_EXECUTED
            desc: 'shell integration semantic escapes',
        },
        {
            code: '\x1b]777;notify;title;body\x1b\x5c', // show notification
            desc: 'call rxvt notification extension',
        },
        {
            // image file is base64 encoded path
            code: '\x1b]1337;SetBackgroundImageFile=L1VzZXJzL2x1Y2lhbi9Eb3dubG9hZHMvZml4dHVyZS5qcGc=\x07',
            desc: 'set background image file (iterm2)',
        },
        {
            // encoded image data is from http://www.schaik.com/pngsuite/basn3p01.png
            code: '\x1b]1337;File=inline=1;width=32;height=32:iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABGdBTUEAAYagMeiWXwAAAAZQTFRF7v8iImb/bBrSJgAAABVJREFUeJxj4AcCBjTiAxCgEwOkDgC7Hz/Bk4JmWQAAAABJRU5ErkJggg==\x07',
            desc: 'display image (iterm2)',
        },
        {
            code: '\x1b]5113;ac=file;zip=zlib;tt=rsync\x1b\x5c', // send, zlib compression, rsync transmission
            desc: 'file transfer command (kitty)',
        },
    ],
}, {
    group: 'application program commands',
    escapes: [
        {
            code: '\x1b_:C0100/B18.../B16/B05\x1b\x5c', // a key with no modifiers, ⇒ keys (x4), ⇐ key, b key
            desc: 'extended keyboard report (DECEKBD)',
        },
        {
            code: '\x1b_Gf=24,s=3,v=3;/2Zm/71V//9m/71V//9mneJP//9mneJPh876\x1b\x5c', // 3x3 image rgb 24
            desc: 'display image (kitty)',
        },
        {
            code: '\x1b_Gi=99;OK\x1b\x5c', // image id 99 OK
            desc: 'image response acknowledgement code (kitty)',
        },
        {
            code: '\x1b_Ga=a,i=3,c=7\x1b\x5c', // make the current frame the 7th frame in the image with id 3
            desc: 'change current animation frame (kitty)',
        },
    ],
}] as EscapeFixtures[];