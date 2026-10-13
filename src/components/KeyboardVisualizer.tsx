import React, { useState, useRef } from 'react';
import {
  mapKeystrokeToHindi,
  combineDevLysSequence,
  ALT_CODES_REFERENCE,
  ALT_CODES_MAP,
  decodeAltCode,
} from '../utils/remingtonEngine';
import { Printer, RotateCcw, Sparkles, Hash, Check } from 'lucide-react';

interface KeyboardVisualizerProps {
  activeKey?: string;
  isShiftActive?: boolean;
}

export interface KeyItem {
  code: string;
  engLower: string;
  engUpper: string;
  hindiNormal: string;
  hindiShift: string;
  width?: string;
  isSpecial?: boolean;
  specialLabel?: string;
  specialIcon?: React.ReactNode;
}

/**
 * 100% Exact 1:1 Key Data matching official Kruti Dev 010 / DevLys 010
 * "KRUTIDEV KEYBOARD (HINDI FONT)" Reference Poster
 */
export const KRUTIDEV_ROWS: KeyItem[][] = [
  // ROW 1: Number Row
  [
    { code: 'Backquote', engLower: '`', engUpper: '~', hindiNormal: '‘', hindiShift: '~' },
    { code: 'Digit1', engLower: '1', engUpper: '!', hindiNormal: '१', hindiShift: '!' },
    { code: 'Digit2', engLower: '2', engUpper: '@', hindiNormal: '२', hindiShift: '/' },
    { code: 'Digit3', engLower: '3', engUpper: '#', hindiNormal: '३', hindiShift: 'रु' },
    { code: 'Digit4', engLower: '4', engUpper: '$', hindiNormal: '४', hindiShift: '+' },
    { code: 'Digit5', engLower: '5', engUpper: '%', hindiNormal: '५', hindiShift: ':' },
    { code: 'Digit6', engLower: '6', engUpper: '^', hindiNormal: '६', hindiShift: '‘' },
    { code: 'Digit7', engLower: '7', engUpper: '&', hindiNormal: '७', hindiShift: '-' },
    { code: 'Digit8', engLower: '8', engUpper: '*', hindiNormal: '८', hindiShift: "'" },
    { code: 'Digit9', engLower: '9', engUpper: '(', hindiNormal: '९', hindiShift: ';' },
    { code: 'Digit0', engLower: '0', engUpper: ')', hindiNormal: '०', hindiShift: 'द्ध' },
    { code: 'Minus', engLower: '-', engUpper: '_', hindiNormal: '.', hindiShift: 'ऋ' },
    { code: 'Equal', engLower: '=', engUpper: '+', hindiNormal: 'त्र', hindiShift: '़' },
    {
      code: 'Backspace',
      engLower: '',
      engUpper: '',
      hindiNormal: '',
      hindiShift: '',
      width: 'w-24 sm:w-26 md:w-28',
      isSpecial: true,
      specialLabel: 'Backspace',
      specialIcon: (
        <span className="text-base leading-none font-bold tracking-tighter">⟵</span>
      ),
    },
  ],

  // ROW 2: QWERTY Row
  [
    {
      code: 'Tab',
      engLower: '',
      engUpper: '',
      hindiNormal: '',
      hindiShift: '',
      width: 'w-16 sm:w-18 md:w-20',
      isSpecial: true,
      specialLabel: 'Tab',
      specialIcon: (
        <span className="text-xs leading-none tracking-tighter flex items-center justify-center gap-1 font-mono">
          <span>|⟵</span>
          <span>⟶|</span>
        </span>
      ),
    },
    { code: 'KeyQ', engLower: 'q', engUpper: 'Q', hindiNormal: 'ु', hindiShift: 'फ' },
    { code: 'KeyW', engLower: 'w', engUpper: 'W', hindiNormal: 'ू', hindiShift: 'ॅ' },
    { code: 'KeyE', engLower: 'e', engUpper: 'E', hindiNormal: 'म', hindiShift: 'म्' },
    { code: 'KeyR', engLower: 'r', engUpper: 'R', hindiNormal: 'त', hindiShift: 'त्' },
    { code: 'KeyT', engLower: 't', engUpper: 'T', hindiNormal: 'ज', hindiShift: 'ज्' },
    { code: 'KeyY', engLower: 'y', engUpper: 'Y', hindiNormal: 'ल', hindiShift: 'ल्' },
    { code: 'KeyU', engLower: 'u', engUpper: 'U', hindiNormal: 'न', hindiShift: 'न्' },
    { code: 'KeyI', engLower: 'i', engUpper: 'I', hindiNormal: 'प', hindiShift: 'प्' },
    { code: 'KeyO', engLower: 'o', engUpper: 'O', hindiNormal: 'व', hindiShift: 'व्' },
    { code: 'KeyP', engLower: 'p', engUpper: 'P', hindiNormal: 'च', hindiShift: 'च्' },
    { code: 'BracketLeft', engLower: '[', engUpper: '{', hindiNormal: 'ख्', hindiShift: 'क्ष्' },
    { code: 'BracketRight', engLower: ']', engUpper: '}', hindiNormal: ',', hindiShift: 'द्व' },
    {
      code: 'Backslash',
      engLower: '\\',
      engUpper: '|',
      hindiNormal: '?',
      hindiShift: 'द्य',
      width: 'w-13 sm:w-14 md:w-16',
    },
  ],

  // ROW 3: Home Row
  [
    {
      code: 'CapsLock',
      engLower: '',
      engUpper: '',
      hindiNormal: '',
      hindiShift: '',
      width: 'w-20 sm:w-22 md:w-24',
      isSpecial: true,
      specialLabel: 'Caps Lock',
    },
    { code: 'KeyA', engLower: 'a', engUpper: 'A', hindiNormal: 'ं', hindiShift: '।' },
    { code: 'KeyS', engLower: 's', engUpper: 'S', hindiNormal: 'े', hindiShift: 'ै' },
    { code: 'KeyD', engLower: 'd', engUpper: 'D', hindiNormal: 'क', hindiShift: 'क्' },
    { code: 'KeyF', engLower: 'f', engUpper: 'F', hindiNormal: 'ि', hindiShift: 'थ्' },
    { code: 'KeyG', engLower: 'g', engUpper: 'G', hindiNormal: 'ह', hindiShift: 'ळ' },
    { code: 'KeyH', engLower: 'h', engUpper: 'H', hindiNormal: 'ी', hindiShift: 'भ' },
    { code: 'KeyJ', engLower: 'j', engUpper: 'J', hindiNormal: 'र', hindiShift: 'श्र' },
    { code: 'KeyK', engLower: 'k', engUpper: 'K', hindiNormal: 'ा', hindiShift: 'ज्ञ' },
    { code: 'KeyL', engLower: 'l', engUpper: 'L', hindiNormal: 'स', hindiShift: 'स्' },
    { code: 'Semicolon', engLower: ';', engUpper: ':', hindiNormal: 'य', hindiShift: 'रू' },
    { code: 'Quote', engLower: "'", engUpper: '"', hindiNormal: 'श्', hindiShift: 'ष्' },
    {
      code: 'Enter',
      engLower: '',
      engUpper: '',
      hindiNormal: '',
      hindiShift: '',
      width: 'w-24 sm:w-26 md:w-28',
      isSpecial: true,
      specialLabel: 'Enter',
    },
  ],

  // ROW 4: Shift Row
  [
    {
      code: 'ShiftLeft',
      engLower: '',
      engUpper: '',
      hindiNormal: '',
      hindiShift: '',
      width: 'w-24 sm:w-26 md:w-28',
      isSpecial: true,
      specialLabel: 'Shift',
      specialIcon: <span className="text-sm font-bold">⇧</span>,
    },
    // The exact standard Z Key: Top-left = र् (Reph), Bottom-left = ्र (Paden Ra)
    { code: 'KeyZ', engLower: 'z', engUpper: 'Z', hindiNormal: '्र', hindiShift: 'र्' },
    { code: 'KeyX', engLower: 'x', engUpper: 'X', hindiNormal: 'ग', hindiShift: 'ग्' },
    { code: 'KeyC', engLower: 'c', engUpper: 'C', hindiNormal: 'ब', hindiShift: 'ब्' },
    { code: 'KeyV', engLower: 'v', engUpper: 'V', hindiNormal: 'अ', hindiShift: 'ट' },
    { code: 'KeyB', engLower: 'b', engUpper: 'B', hindiNormal: 'इ', hindiShift: 'ठ' },
    { code: 'KeyN', engLower: 'n', engUpper: 'N', hindiNormal: 'द', hindiShift: 'छ' },
    { code: 'KeyM', engLower: 'm', engUpper: 'M', hindiNormal: 'उ', hindiShift: 'ड' },
    { code: 'Comma', engLower: ',', engUpper: '<', hindiNormal: 'ए', hindiShift: 'ढ' },
    { code: 'Period', engLower: '.', engUpper: '>', hindiNormal: 'ण्', hindiShift: 'झ' },
    { code: 'Slash', engLower: '/', engUpper: '?', hindiNormal: 'ध्', hindiShift: 'घ्' },
    {
      code: 'ShiftRight',
      engLower: '',
      engUpper: '',
      hindiNormal: '',
      hindiShift: '',
      width: 'w-24 sm:w-26 md:w-28',
      isSpecial: true,
      specialLabel: 'Shift',
      specialIcon: <span className="text-sm font-bold">⇧</span>,
    },
  ],

  // ROW 5: Bottom Modifier Row
  [
    { code: 'ControlLeft', engLower: 'Ctrl', engUpper: 'Ctrl', hindiNormal: '', hindiShift: '', width: 'w-14 sm:w-16', isSpecial: true, specialLabel: 'Ctrl' },
    { code: 'MetaLeft', engLower: 'win', engUpper: 'win', hindiNormal: '', hindiShift: '', width: 'w-14 sm:w-16', isSpecial: true, specialLabel: 'win' },
    { code: 'AltLeft', engLower: 'Alt', engUpper: 'Alt', hindiNormal: '', hindiShift: '', width: 'w-14 sm:w-16', isSpecial: true, specialLabel: 'Alt' },
    { code: 'Space', engLower: 'space', engUpper: 'space', hindiNormal: '', hindiShift: '', width: 'flex-1 min-w-[200px]', isSpecial: true, specialLabel: 'space' },
    { code: 'AltRight', engLower: 'Alt', engUpper: 'Alt', hindiNormal: '', hindiShift: '', width: 'w-14 sm:w-16', isSpecial: true, specialLabel: 'Alt' },
    { code: 'MetaRight', engLower: 'win', engUpper: 'win', hindiNormal: '', hindiShift: '', width: 'w-14 sm:w-16', isSpecial: true, specialLabel: 'win' },
    {
      code: 'ContextMenu',
      engLower: '',
      engUpper: '',
      hindiNormal: '',
      hindiShift: '',
      width: 'w-14 sm:w-16',
      isSpecial: true,
      specialIcon: (
        <div className="w-5 h-5 border border-slate-700 flex flex-col justify-center items-center gap-0.5 p-0.5 rounded-xs">
          <div className="w-3.5 h-[1.5px] bg-slate-700" />
          <div className="w-3.5 h-[1.5px] bg-slate-700" />
          <div className="w-2.5 h-[1.5px] bg-slate-700 self-start ml-0.5" />
        </div>
      ),
    },
    { code: 'ControlRight', engLower: 'Ctrl', engUpper: 'Ctrl', hindiNormal: '', hindiShift: '', width: 'w-14 sm:w-16', isSpecial: true, specialLabel: 'Ctrl' },
  ],
];

// Exact Alt Code Table matching image 7891dd73d03827530134e15ab51729ed.jpg
export const EXACT_IMAGE_ALT_CODES = [
  // Column 1
  [
    'ALT + 0161 = ॅ',
    'ALT + 0165 = ञ',
    'ALT + 0170 = ^',
    'ALT + 0182 = फ्',
    'ALT + 0183 = ऽ',
    'ALT + 0184 = ृ',
    'ALT + 0187 = ÷',
    'ALT + 0188 = (',
    'ALT + 0189 = )',
  ],
  // Column 2
  [
    'ALT + 0190 = =',
    'ALT + 00191 = [',
    'ALT + 0192 = ]',
    'ALT + 0197 = ॐ',
    'ALT + 0204 = द्ध',
    'ALT + 0205 = द्',
    'ALT + 0206 = द्व',
    'ALT + 0207 = ड्ढ',
    'ALT + 02012 = ङ्ग',
  ],
  // Column 3
  [
    'ALT + 0216 = क्र',
    'ALT + 0217 = त्र',
    'ALT + 0218 = =',
    'ALT + 0220 = ्र',
    'ALT + 0221 = फ्र',
    'ALT + 0222 = ़',
    'ALT + 0223 = ·',
    'ALT + 0224 = ष्ठ',
    'ALT + 0225 = ह्य',
    'ALT + 0226 = हृ',
  ],
  // Column 4
  [
    'ALT + 0227 = ह्म',
    'ALT + 0228 = क्त',
    'ALT + 0229 = ०',
    'ALT + 0233 = श्र',
    'ALT + 0243 = स्त्र',
    'ALT + 0216 = क्र',
  ],
];

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  activeKey: propActiveKey,
  isShiftActive: propShiftActive = false,
}) => {
  const [testInput, setTestInput] = useState('');
  const [testActiveKey, setTestActiveKey] = useState('');
  const [testShiftActive, setTestShiftActive] = useState(false);
  const [manualShift, setManualShift] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const altBufferRef = useRef('');

  const effectiveShift = propShiftActive || manualShift || testShiftActive;
  const currentActive = propActiveKey || testActiveKey;

  const handleTestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTestActiveKey(e.key);
    setTestShiftActive(e.shiftKey);

    // Alt Code Detection: when Alt key is held and user enters digits
    if (e.altKey || e.key === 'Alt') {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        altBufferRef.current += e.key;
        const decoded = ALT_CODES_MAP[altBufferRef.current];
        if (decoded && altBufferRef.current.length >= 4) {
          setTestInput((prev) => combineDevLysSequence(prev, decoded));
          altBufferRef.current = '';
        }
        return;
      }
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      setTestInput((prev) => (prev.length <= 1 ? '' : prev.slice(0, -1)));
      return;
    }

    if (e.key === ' ' || e.key === 'Space') {
      e.preventDefault();
      setTestInput((prev) => prev + ' ');
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      const hindiChar = mapKeystrokeToHindi(e.key, e.shiftKey) || e.key;
      setTestInput((prev) => combineDevLysSequence(prev, hindiChar));
    }
  };

  const handleTestKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTestShiftActive(e.shiftKey);

    // If Alt was released and we have accumulated digits in buffer
    if (e.key === 'Alt') {
      if (altBufferRef.current) {
        const decoded = ALT_CODES_MAP[altBufferRef.current];
        if (decoded) {
          setTestInput((prev) => combineDevLysSequence(prev, decoded));
        }
        altBufferRef.current = '';
      }
    }
  };

  const handleInsertAltChar = (char: string, code: string) => {
    setTestInput((prev) => combineDevLysSequence(prev, char));
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans select-text py-4 space-y-6">
      {/* 
        POSTER CONTAINER: Pure White Card matching image 7891dd73d03827530134e15ab51729ed.jpg 
        Header in Red, Keyboard in clean rounded chassis, and 4-column Alt table below.
      */}
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl border border-slate-300 shadow-md">
        {/* Title exactly as in image: KRUTIDEV KEYBOARD (HINDI FONT) */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#B91C1C] tracking-wide uppercase font-sans">
            KRUTIDEV KEYBOARD (HINDI FONT)
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Standard Remington GAIL (DevLys 010 / Kruti Dev 010) RSMSSB LDC Specification
          </p>
        </div>

        {/* Keyboard Chassis Outline */}
        <div className="border border-slate-500 rounded-[24px] sm:rounded-[28px] p-2.5 sm:p-3.5 md:p-4 bg-white shadow-2xs overflow-x-auto">
          <div className="min-w-[760px] space-y-2 select-none">
            {KRUTIDEV_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-between gap-1.5 sm:gap-2">
                {row.map((k) => {
                  const isSpecial = Boolean(k.isSpecial);
                  const isShiftKey = k.code === 'ShiftLeft' || k.code === 'ShiftRight';
                  const isSpaceKey = k.code === 'Space';

                  // Dynamic Highlight state
                  const isPressed =
                    Boolean(currentActive) &&
                    (currentActive === k.engLower ||
                      currentActive === k.engUpper ||
                      currentActive.toLowerCase() === k.engLower ||
                      (isShiftKey && effectiveShift));

                  if (isSpecial) {
                    return (
                      <div
                        key={k.code}
                        onClick={() => {
                          if (isShiftKey) setManualShift(!manualShift);
                        }}
                        className={`h-11 sm:h-12 md:h-13 border border-slate-400 rounded-lg flex items-center justify-center font-sans transition-all text-xs sm:text-sm font-semibold select-none ${
                          k.width || 'w-14 sm:w-16'
                        } ${
                          isPressed || (isShiftKey && effectiveShift)
                            ? 'bg-blue-600 text-white border-blue-700 shadow-inner'
                            : 'bg-white text-slate-800 hover:bg-slate-50'
                        } ${isShiftKey ? 'cursor-pointer' : ''}`}
                      >
                        {k.specialIcon ? (
                          <div className="flex items-center gap-1.5">
                            {k.specialIcon}
                            {k.specialLabel && (
                              <span className="text-[11px] sm:text-xs">{k.specialLabel}</span>
                            )}
                          </div>
                        ) : isSpaceKey ? (
                          <span className="text-xs sm:text-sm lowercase font-mono text-slate-500 tracking-wider">
                            space
                          </span>
                        ) : k.code.startsWith('Meta') ? (
                          <span className="font-serif italic font-normal text-xs sm:text-sm text-slate-700">
                            win
                          </span>
                        ) : (
                          <span>{k.specialLabel}</span>
                        )}
                      </div>
                    );
                  }

                  // 4-Quadrant Standard Alphanumeric Key
                  return (
                    <div
                      key={k.code}
                      onClick={() => {
                        const char = effectiveShift ? k.hindiShift : k.hindiNormal;
                        if (char) {
                          setTestInput((prev) => combineDevLysSequence(prev, char));
                        }
                      }}
                      className={`h-11 sm:h-12 md:h-13 ${
                        k.width || 'flex-1 min-w-[42px] max-w-[58px]'
                      } border border-slate-400 rounded-lg p-1 sm:p-1.5 flex flex-col justify-between transition-all select-none cursor-pointer ${
                        isPressed
                          ? 'bg-amber-100 border-amber-500 shadow-inner ring-1 ring-amber-400'
                          : 'bg-white hover:bg-slate-50 hover:border-slate-500 shadow-2xs'
                      }`}
                    >
                      {/* Top Row: Shift Hindi (Left) & Shift English (Right) */}
                      <div className="flex items-start justify-between w-full leading-none">
                        <span
                          className={`text-sm sm:text-base font-bold font-serif ${
                            effectiveShift ? 'text-blue-700 scale-105' : 'text-slate-800'
                          }`}
                        >
                          {k.hindiShift}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-slate-400">
                          {k.engUpper}
                        </span>
                      </div>

                      {/* Bottom Row: Normal Hindi (Left) & Normal English (Right) */}
                      <div className="flex items-end justify-between w-full leading-none mt-0.5">
                        <span
                          className={`text-sm sm:text-base font-bold font-serif ${
                            !effectiveShift ? 'text-slate-900' : 'text-slate-600'
                          }`}
                        >
                          {k.hindiNormal}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-sans font-medium text-slate-500">
                          {k.engLower}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 
          BOTTOM SECTION: 4-Column Alt Code Table exactly matching image 7891dd73d03827530134e15ab51729ed.jpg
        */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Hash className="w-4 h-4 text-blue-700" />
              <span>Standard DevLys 010 / Kruti Dev 010 Special Character Alt Codes</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              क्लिक करके टेस्ट बॉक्स में इनपुट करें या NumPad से Alt दबाकर कोड टाइप करें
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
            {EXACT_IMAGE_ALT_CODES.map((column, colIdx) => (
              <div key={colIdx} className="space-y-1.5">
                {column.map((item, itemIdx) => {
                  const parts = item.split('=');
                  const code = parts[0]?.trim();
                  const char = parts[1]?.trim() || '';

                  return (
                    <button
                      key={itemIdx}
                      type="button"
                      onClick={() => handleInsertAltChar(char, code)}
                      className="w-full flex items-center justify-between py-1 px-2 rounded hover:bg-white hover:shadow-2xs hover:border hover:border-slate-300 transition-all text-left text-slate-800 cursor-pointer group"
                    >
                      <span className="text-slate-600 font-semibold group-hover:text-blue-700">
                        {code}
                      </span>
                      <span className="font-bold font-serif text-base text-slate-900 group-hover:text-blue-900 ml-2">
                        = {char}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Live Interactive Typing Sandbox */}
        <div className="mt-6 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                लाइव टाइपिंग सैंडबॉक्स (DevLys 010 Live Test Box):
              </label>
            </div>
            <div className="flex items-center gap-2">
              {copiedCode && (
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> {copiedCode} डाला गया
                </span>
              )}
              <button
                type="button"
                onClick={() => setTestInput('')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                साफ़ करें (Clear)
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={testInput}
              onChange={() => {}}
              onKeyDown={handleTestKeyDown}
              onKeyUp={handleTestKeyUp}
              placeholder="यहाँ टाइप करें (e.g. dsoy ➔ केवल, dz ➔ क्र, Shift+Z e ➔ र्म, Alt+0216 ➔ क्र)..."
              className="w-full p-3.5 bg-white border-2 border-slate-300 rounded-lg text-lg font-serif text-slate-900 focus:outline-hidden focus:border-blue-600 shadow-inner"
            />
          </div>

          {/* Quick ligature shortcut buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">
              क्विक लिगेचर्स:
            </span>
            {ALT_CODES_REFERENCE.slice(0, 10).map((ref) => (
              <button
                key={ref.code}
                type="button"
                onClick={() => handleInsertAltChar(ref.char, ref.code)}
                title={`${ref.code}: ${ref.description}`}
                className="px-2 py-0.5 bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50 rounded text-xs font-serif text-slate-800 transition-colors shadow-2xs cursor-pointer"
              >
                <span className="font-bold text-sm text-blue-900">{ref.char}</span>
                <span className="ml-1 text-[10px] text-slate-400 font-mono">
                  {ref.code.replace('Alt+', '')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer print action and guidelines note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-4 gap-2">
          <span>Standard की-बोर्ड एवं DevLys 010 फॉन्ट — राजस्थान कर्मचारी चयन बोर्ड (RSMSSB)</span>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 font-semibold cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>प्रिंट चार्ट (Print Layout)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
