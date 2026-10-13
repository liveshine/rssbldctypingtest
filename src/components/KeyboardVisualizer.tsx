import React, { useState } from 'react';
import { ALT_CODES_REFERENCE, mapKeystrokeToHindi, combineDevLysSequence } from '../utils/remingtonEngine';
import { Search, Info, Keyboard as KeyboardIcon, Sparkles, RotateCcw, Printer, Eye } from 'lucide-react';

interface KeyboardVisualizerProps {
  activeKey?: string;
  isShiftActive?: boolean;
}

interface KeyData {
  code: string;
  engKey: string;
  normalHindi: string; // Bottom character (Normal / बिना Shift)
  shiftHindi: string;  // Top character (Shift / शीर्ष वर्ण)
  width?: string;
  isSpecial?: boolean;
  desc?: string;
}

/**
 * 100% Exact Key Layout from RSMSSB Official Circular:
 * "Standard की–बोर्ड एवं DevLys 010 फॉन्ट का प्रयोग किया जायेगा।"
 * "Hindi Keyboard"
 */
export const OFFICIAL_KEYBOARD_ROWS: KeyData[][] = [
  // ROW 1: Number Row (` to Backspace)
  [
    { code: 'Backquote', engKey: '`', normalHindi: 'ृ', shiftHindi: '्', desc: 'ऋ की मात्रा (ृ) / हलन्त (्)' },
    { code: 'Digit1', engKey: '1', normalHindi: '१', shiftHindi: '!', desc: 'संख्या १ / !' },
    { code: 'Digit2', engKey: '2', normalHindi: '२', shiftHindi: '@', desc: 'संख्या २ / @' },
    { code: 'Digit3', engKey: '3', normalHindi: '३', shiftHindi: 'रु', desc: 'संख्या ३ / रु' },
    { code: 'Digit4', engKey: '4', normalHindi: '४', shiftHindi: '$', desc: 'संख्या ४ / $' },
    { code: 'Digit5', engKey: '5', normalHindi: '५', shiftHindi: ':', desc: 'संख्या ५ / :' },
    { code: 'Digit6', engKey: '6', normalHindi: '६', shiftHindi: '‘', desc: 'संख्या ६ / ‘' },
    { code: 'Digit7', engKey: '7', normalHindi: '७', shiftHindi: '&', desc: 'संख्या ७ / &' },
    { code: 'Digit8', engKey: '8', normalHindi: '८', shiftHindi: "'", desc: "संख्या ८ / '" },
    { code: 'Digit9', engKey: '9', normalHindi: '९', shiftHindi: ';', desc: 'संख्या ९ / ;' },
    { code: 'Digit0', engKey: '0', normalHindi: '०', shiftHindi: 'द्ध', desc: 'संख्या ० / संयुक्त वर्ण द्ध' },
    { code: 'Minus', engKey: '-', normalHindi: '.', shiftHindi: 'ऋ', desc: 'बिन्दु (.) अथवा योजक (-) / स्वर ऋषि (ऋ)' },
    { code: 'Equal', engKey: '=', normalHindi: 'त्र', shiftHindi: '़', desc: 'संयुक्त वर्ण त्र / नुक्ता (़)' },
    {
      code: 'Backspace',
      engKey: 'Backspace',
      normalHindi: 'Backspace',
      shiftHindi: '⟵ ⟶',
      width: 'w-24 sm:w-28',
      isSpecial: true,
      desc: 'Backspace (पिछला वर्ण हटाएं)',
    },
  ],

  // ROW 2: QWERTY Row (Tab to \)
  [
    {
      code: 'Tab',
      engKey: 'Tab',
      normalHindi: 'Tab',
      shiftHindi: '⟵ ⟶',
      width: 'w-16 sm:w-20',
      isSpecial: true,
      desc: 'Tab कुंजी',
    },
    { code: 'KeyQ', engKey: 'q', normalHindi: 'ु', shiftHindi: 'फ', desc: 'ह्रस्व उ की मात्रा (ु) / फ' },
    { code: 'KeyW', engKey: 'w', normalHindi: 'ू', shiftHindi: 'ॅ', desc: 'दीर्घ ऊ की मात्रा (ू) / अर्धचन्द्र मात्रा (ॅ)' },
    { code: 'KeyE', engKey: 'e', normalHindi: 'म', shiftHindi: 'म्', desc: 'पूर्ण म / आधा म्' },
    { code: 'KeyR', engKey: 'r', normalHindi: 'त', shiftHindi: 'त्', desc: 'पूर्ण त / आधा त्' },
    { code: 'KeyT', engKey: 't', normalHindi: 'ज', shiftHindi: 'ज्', desc: 'पूर्ण ज / आधा ज्' },
    { code: 'KeyY', engKey: 'y', normalHindi: 'ल', shiftHindi: 'ल्', desc: 'पूर्ण ल / आधा ल्' },
    { code: 'KeyU', engKey: 'u', normalHindi: 'न', shiftHindi: 'न्', desc: 'पूर्ण न / आधा न्' },
    { code: 'KeyI', engKey: 'i', normalHindi: 'प', shiftHindi: 'प्', desc: 'पूर्ण प / आधा प्' },
    { code: 'KeyO', engKey: 'o', normalHindi: 'व', shiftHindi: 'व्', desc: 'पूर्ण व / आधा व्' },
    { code: 'KeyP', engKey: 'p', normalHindi: 'च', shiftHindi: 'च्', desc: 'पूर्ण च / आधा च्' },
    { code: 'BracketLeft', engKey: '[', normalHindi: 'ख्', shiftHindi: 'क्ष्', desc: 'आधा ख् ([k से ख) / आधा क्ष् ({k से क्ष)' },
    { code: 'BracketRight', engKey: ']', normalHindi: ',', shiftHindi: 'द्व', desc: 'अल्पविराम (,) / संयुक्त वर्ण द्व' },
    {
      code: 'Backslash',
      engKey: '\\',
      normalHindi: '?',
      shiftHindi: 'द्य',
      width: 'w-14 sm:w-16',
      desc: 'प्रश्नवाचक (?) / संयुक्त वर्ण द्य',
    },
  ],

  // ROW 3: Home Row (Caps Lock to Enter)
  [
    {
      code: 'CapsLock',
      engKey: 'Caps Lock',
      normalHindi: 'Caps Lock',
      shiftHindi: '',
      width: 'w-20 sm:w-24',
      isSpecial: true,
      desc: 'Caps Lock कुंजी',
    },
    { code: 'KeyA', engKey: 'a', normalHindi: 'ं', shiftHindi: '।', desc: 'अनुस्वार बिन्दु (ं) / पूर्णविराम (।)' },
    { code: 'KeyS', engKey: 's', normalHindi: 'े', shiftHindi: 'ै', desc: 'ए की मात्रा (े) / ऐ की मात्रा (ै)' },
    { code: 'KeyD', engKey: 'd', normalHindi: 'क', shiftHindi: 'क्', desc: 'पूर्ण क / आधा क्' },
    { code: 'KeyF', engKey: 'f', normalHindi: 'ि', shiftHindi: 'थ्', desc: 'ह्रस्व इ की मात्रा (ि) / आधा थ्' },
    { code: 'KeyG', engKey: 'g', normalHindi: 'ह', shiftHindi: 'ळ', desc: 'पूर्ण ह / मूर्धन्य ळ' },
    { code: 'KeyH', engKey: 'h', normalHindi: 'ी', shiftHindi: 'भ', desc: 'दीर्घ ई की मात्रा (ी) / पूर्ण भ' },
    { code: 'KeyJ', engKey: 'j', normalHindi: 'र', shiftHindi: 'श्र', desc: 'पूर्ण र / संयुक्त वर्ण श्र' },
    { code: 'KeyK', engKey: 'k', normalHindi: 'ा', shiftHindi: 'ज्ञ', desc: 'आ की मात्रा (ा) / संयुक्त वर्ण ज्ञ' },
    { code: 'KeyL', engKey: 'l', normalHindi: 'स', shiftHindi: 'स्', desc: 'पूर्ण स / आधा स् (Lk से स)' },
    { code: 'Semicolon', engKey: ';', normalHindi: 'य', shiftHindi: 'रू', desc: 'पूर्ण य / दीर्घ रू' },
    { code: 'Quote', engKey: "'", normalHindi: 'श्', shiftHindi: 'ष्', desc: "तालव्य आधा श् ('k से श) / मूर्धन्य आधा ष् (\"k से ष)" },
    {
      code: 'Enter',
      engKey: 'Enter',
      normalHindi: 'Enter',
      shiftHindi: '',
      width: 'w-24 sm:w-28',
      isSpecial: true,
      desc: 'Enter कुंजी',
    },
  ],

  // ROW 4: Shift Row (Shift to Shift)
  [
    {
      code: 'ShiftLeft',
      engKey: 'Shift',
      normalHindi: 'Shift',
      shiftHindi: '⇧',
      width: 'w-24 sm:w-28',
      isSpecial: true,
      desc: 'Shift कुंजी (बायाँ)',
    },
    { code: 'KeyZ', engKey: 'z', normalHindi: '्र', shiftHindi: 'र्', desc: 'पदेन र (्र) / रेफ र (र्)' },
    { code: 'KeyX', engKey: 'x', normalHindi: 'ग', shiftHindi: 'ग्', desc: 'पूर्ण ग / आधा ग्' },
    { code: 'KeyC', engKey: 'c', normalHindi: 'ब', shiftHindi: 'ब्', desc: 'पूर्ण ब / आधा ब्' },
    { code: 'KeyV', engKey: 'v', normalHindi: 'अ', shiftHindi: 'ट', desc: 'स्वर अ / मूर्धन्य ट' },
    { code: 'KeyB', engKey: 'b', normalHindi: 'इ', shiftHindi: 'ठ', desc: 'स्वर इ / मूर्धन्य ठ' },
    { code: 'KeyN', engKey: 'n', normalHindi: 'द', shiftHindi: 'छ', desc: 'पूर्ण द / स्पर्श वर्ण छ' },
    { code: 'KeyM', engKey: 'm', normalHindi: 'उ', shiftHindi: 'ड', desc: 'स्वर उ / मूर्धन्य ड' },
    { code: 'Comma', engKey: ',', normalHindi: 'ए', shiftHindi: 'ढ', desc: 'स्वर ए / मूर्धन्य ढ' },
    { code: 'Period', engKey: '.', normalHindi: 'ण्', shiftHindi: 'झ', desc: 'आधा ण् (.k से ण) / वर्ण झ' },
    { code: 'Slash', engKey: '/', normalHindi: 'ध्', shiftHindi: 'घ्', desc: 'आधा ध् (/k से ध) / आधा घ् (?k से घ)' },
    {
      code: 'ShiftRight',
      engKey: 'Shift',
      normalHindi: 'Shift',
      shiftHindi: '⇧',
      width: 'w-24 sm:w-28',
      isSpecial: true,
      desc: 'Shift कुंजी (दायाँ)',
    },
  ],

  // ROW 5: Bottom Modifier Row (Ctrl, win, Alt, Space, Alt, win, Menu, Ctrl)
  [
    { code: 'ControlLeft', engKey: 'Ctrl', normalHindi: 'Ctrl', shiftHindi: '', width: 'w-14 sm:w-16', isSpecial: true, desc: 'Control कुंजी' },
    { code: 'MetaLeft', engKey: 'win', normalHindi: 'win', shiftHindi: '', width: 'w-12 sm:w-14', isSpecial: true, desc: 'Windows कुंजी' },
    { code: 'AltLeft', engKey: 'Alt', normalHindi: 'Alt', shiftHindi: '', width: 'w-12 sm:w-14', isSpecial: true, desc: 'Alt कुंजी' },
    { code: 'Space', engKey: 'Space', normalHindi: '', shiftHindi: '', width: 'flex-1 min-w-[200px]', isSpecial: true, desc: 'Spacebar (स्पेस बार)' },
    { code: 'AltRight', engKey: 'Alt', normalHindi: 'Alt', shiftHindi: '', width: 'w-12 sm:w-14', isSpecial: true, desc: 'Alt कुंजी' },
    { code: 'MetaRight', engKey: 'win', normalHindi: 'win', shiftHindi: '', width: 'w-12 sm:w-14', isSpecial: true, desc: 'Windows कुंजी' },
    { code: 'ContextMenu', engKey: 'Menu', normalHindi: '📄', shiftHindi: '', width: 'w-12 sm:w-14', isSpecial: true, desc: 'Menu कुंजी' },
    { code: 'ControlRight', engKey: 'Ctrl', normalHindi: 'Ctrl', shiftHindi: '', width: 'w-14 sm:w-16', isSpecial: true, desc: 'Control कुंजी' },
  ],
];

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  activeKey: propActiveKey,
  isShiftActive: propShiftActive = false,
}) => {
  const [altSearch, setAltSearch] = useState('');
  const [manualShift, setManualShift] = useState(false);
  const [selectedKeyInfo, setSelectedKeyInfo] = useState<KeyData | null>(null);
  const [showQwertyHints, setShowQwertyHints] = useState(true);

  // Live Test Typing Box state
  const [testInput, setTestInput] = useState('');
  const [testActiveKey, setTestActiveKey] = useState('');
  const [testShiftActive, setTestShiftActive] = useState(false);

  const effectiveShift = propShiftActive || manualShift || testShiftActive;
  const currentActive = propActiveKey || testActiveKey;

  const handleTestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTestActiveKey(e.key);
    setTestShiftActive(e.shiftKey);

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
  };

  const filteredAltCodes = ALT_CODES_REFERENCE.filter(
    (item) =>
      item.code.toLowerCase().includes(altSearch.toLowerCase()) ||
      item.char.includes(altSearch) ||
      item.description.toLowerCase().includes(altSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans select-text">
      {/* Official Header Strip matching Screenshot 2026-10-12 10.07.01 PM.png exactly */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-sm text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-wide">
          Standard की–बोर्ड एवं DevLys 010 फॉन्ट का प्रयोग किया जायेगा।
        </h1>
        <h2 className="text-lg sm:text-xl font-serif font-semibold text-slate-800 tracking-wider">
          Hindi Keyboard
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          राजस्थान कर्मचारी चयन बोर्ड (RSMSSB) कनिष्ठ सहायक / लिपिक ग्रेड-II आधिकारिक परीक्षा लेआउट
        </p>

        {/* Action Controls & Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setManualShift(!manualShift)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all shadow-sm ${
              effectiveShift
                ? 'bg-blue-700 text-white border-blue-800'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {effectiveShift ? '⇧ Shift ON (शीर्ष वर्ण सक्रिय)' : '⇧ Shift OFF (निचले वर्ण सक्रिय)'}
          </button>

          <button
            onClick={() => setShowQwertyHints(!showQwertyHints)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>{showQwertyHints ? 'QWERTY कुंजियाँ छिपाएँ' : 'QWERTY कुंजियाँ दिखाएँ'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>प्रिंट / PDF सेव करें</span>
          </button>
        </div>
      </div>

      {/* Authentic Keyboard Chassis matching Screenshot 2026-10-12 10.07.01 PM.png */}
      <div className="bg-white p-3 sm:p-5 md:p-7 rounded-[32px] border-2 border-slate-700 shadow-xl overflow-x-auto">
        <div className="min-w-[840px] space-y-2">
          {OFFICIAL_KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 justify-center">
              {row.map((k) => {
                const isActive =
                  currentActive &&
                  (currentActive.toLowerCase() === k.engKey.toLowerCase() ||
                    currentActive === k.code ||
                    (k.code === 'Space' && (currentActive === ' ' || currentActive === 'Space')));

                const isSpecial = Boolean(k.isSpecial);
                const isSpace = k.code === 'Space';

                return (
                  <button
                    key={k.code}
                    type="button"
                    onClick={() => setSelectedKeyInfo(k)}
                    className={`${k.width || 'w-13 sm:w-14'} h-14 sm:h-16 rounded-xl border border-slate-400 bg-white transition-all text-center flex flex-col justify-between p-1 shadow-2xs hover:border-slate-800 hover:shadow-xs cursor-pointer relative ${
                      isActive
                        ? 'ring-3 ring-blue-600 border-blue-600 bg-blue-50/50 scale-98'
                        : ''
                    } ${isSpecial && !isSpace ? 'bg-slate-50 justify-center items-center' : ''}`}
                    title={k.desc || `${k.engKey} key`}
                  >
                    {!isSpecial && !isSpace ? (
                      <>
                        {/* Top: Shift Character (शीर्ष वर्ण) */}
                        <div
                          className={`text-base sm:text-lg leading-tight font-serif font-bold ${
                            effectiveShift
                              ? 'text-blue-700 scale-105 font-extrabold'
                              : 'text-slate-800'
                          }`}
                        >
                          {k.shiftHindi}
                        </div>

                        {/* Bottom: Normal Character (निचला वर्ण) */}
                        <div
                          className={`text-base sm:text-lg leading-tight font-serif font-bold ${
                            !effectiveShift
                              ? 'text-slate-900 font-extrabold'
                              : 'text-slate-700'
                          }`}
                        >
                          {k.normalHindi}
                        </div>

                        {/* Optional QWERTY Key Reference badge in corner */}
                        {showQwertyHints && (
                          <div className="absolute right-1 bottom-0.5 text-[8px] font-mono text-slate-400">
                            {k.engKey}
                          </div>
                        )}
                      </>
                    ) : isSpace ? (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400 font-sans">
                        Spacebar
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center leading-tight">
                        <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">
                          {k.normalHindi}
                        </span>
                        {k.shiftHindi && (
                          <span className="text-[11px] text-slate-600 font-serif font-medium mt-0.5">
                            {k.shiftHindi}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Selected Key Details Card */}
        {selectedKeyInfo && !selectedKeyInfo.isSpecial && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-300 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-blue-200 text-blue-900">
                Key [{selectedKeyInfo.engKey.toUpperCase()}]
              </span>
              <div>
                <span className="text-slate-700">निचला वर्ण (बिना Shift): </span>
                <strong className="text-base text-slate-900 font-serif mr-4">
                  {selectedKeyInfo.normalHindi}
                </strong>
                <span className="text-slate-700">शीर्ष वर्ण (Shift के साथ): </span>
                <strong className="text-base text-blue-800 font-serif mr-4">
                  {selectedKeyInfo.shiftHindi}
                </strong>
                {selectedKeyInfo.desc && (
                  <span className="text-slate-500">({selectedKeyInfo.desc})</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedKeyInfo(null)}
              className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1"
            >
              ✕ बंद करें
            </button>
          </div>
        )}

        {/* Official Guideline Tip */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-300">
          <Info className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>कुंजी नियम:</strong> प्रत्येक बटन पर ऊपर स्थित वर्ण <strong>Shift</strong> के साथ प्राप्त होता है (जैसे [d] = क, [Shift + d] = क्, [Shift + a] = । पूर्णविराम)। संख्या पंक्ति पर १, २, ३, ४, ५, ६, ७, ८, ९, ० अंकित हैं। [3] पर Shift = रु, [0] पर Shift = द्ध, [-] पर Shift = ऋ।
          </span>
        </div>
      </div>

      {/* Live Interactive Typing Sandbox Box */}
      <div className="bg-white p-6 rounded-2xl border-2 border-blue-200 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">
              🎯 लाइव की-बोर्ड परीक्षण (Live Layout Practice Sandbox)
            </h3>
          </div>
          {testInput && (
            <button
              onClick={() => setTestInput('')}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500">
          यहाँ अपने कीबोर्ड से कुछ भी टाइप करें। यह इनपुट स्वचालित रूप से आधिकारिक DevLys 010 लेआउट में रूपांतरित होता है और ऊपर संबंधित कुंजी को हाइलाइट करता है:
        </p>

        <div className="relative">
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            onKeyDown={handleTestKeyDown}
            onKeyUp={handleTestKeyUp}
            placeholder="यहाँ टाइप करें (जैसे dsoy = केवल, jktLFkku = राजस्थान)..."
            className="w-full py-3.5 px-4 text-xl font-serif border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 shadow-inner"
          />
        </div>

        {testInput && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">टाइप किया गया पाठ: </span>
              <strong className="text-sm font-serif text-slate-900">{testInput}</strong>
            </div>
            <div className="text-slate-400 font-mono">
              लंबाई: {testInput.length} वर्ण
            </div>
          </div>
        )}
      </div>

      {/* Alt Codes Table */}
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <KeyboardIcon className="w-5 h-5 text-blue-700" />
              <span>DevLys 010 महत्वपूर्ण Alt Codes (विशेष संयुक्ताक्षर)</span>
            </h4>
            <p className="text-xs text-slate-500">
              परीक्षा में पूछे जाने वाले विशेष अक्षरों के NumPad Alt Codes (Alt + 0XXX)
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="खोजें (e.g. 0216, क्र, द्व, ट्ट)..."
              value={altSearch}
              onChange={(e) => setAltSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {filteredAltCodes.map((item) => (
            <div
              key={item.code}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-blue-50/80 hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center shadow-2xs"
            >
              <span className="text-2xl font-bold text-slate-900 font-serif mb-1">
                {item.char}
              </span>
              <span className="text-xs font-mono font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-slate-300">
                {item.code}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 truncate max-w-full font-sans">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
