import React, { useState } from 'react';
import { ALT_CODES_REFERENCE, mapKeystrokeToHindi } from '../utils/remingtonEngine';
import { Search, Info, Keyboard as KeyboardIcon, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface KeyboardVisualizerProps {
  activeKey?: string;
  isShiftActive?: boolean;
}

interface KeyData {
  code: string;
  normalHindi: string;
  shiftHindi: string;
  engKey: string;
  width?: string;
  desc?: string;
}

export const KEYBOARD_ROWS: KeyData[][] = [
  // Row 1: Number Row (` to Backspace) matching official Hindi Keyboard image
  [
    { code: 'Backquote', engKey: '`', normalHindi: '़', shiftHindi: '्र', desc: 'नुक्ता (़) / पदेन र (्र)' },
    { code: 'Digit1', engKey: '1', normalHindi: '१', shiftHindi: '!', desc: 'संख्या १ / !' },
    { code: 'Digit2', engKey: '2', normalHindi: '२', shiftHindi: '@', desc: 'संख्या २ / @' },
    { code: 'Digit3', engKey: '3', normalHindi: '३', shiftHindi: 'रु', desc: 'संख्या ३ / रु' },
    { code: 'Digit4', engKey: '4', normalHindi: '४', shiftHindi: '$', desc: 'संख्या ४ / $' },
    { code: 'Digit5', engKey: '5', normalHindi: '५', shiftHindi: ':', desc: 'संख्या ५ / :' },
    { code: 'Digit6', engKey: '6', normalHindi: '६', shiftHindi: '‘', desc: 'संख्या ६ / ‘' },
    { code: 'Digit7', engKey: '7', normalHindi: '७', shiftHindi: '&', desc: 'संख्या ७ / &' },
    { code: 'Digit8', engKey: '8', normalHindi: '८', shiftHindi: "'", desc: "संख्या ८ / '" },
    { code: 'Digit9', engKey: '9', normalHindi: '९', shiftHindi: ';', desc: 'संख्या ९ / ;' },
    { code: 'Digit0', engKey: '0', normalHindi: '०', shiftHindi: 'ऋ', desc: 'संख्या ० / ऋषि ऋ' },
    { code: 'Minus', engKey: '-', normalHindi: '.', shiftHindi: 'त्र', desc: 'पूर्णविराम बिन्दु (.) / त्र' },
    { code: 'Equal', engKey: '=', normalHindi: 'त्र', shiftHindi: 'ृ', desc: 'त्र / ऋ की मात्रा (ृ)' },
    { code: 'Backspace', engKey: 'Backspace', normalHindi: 'Backspace ⟵', shiftHindi: 'Backspace ⟵', width: 'w-24', desc: 'बैकस्पेस (Backspace)' },
  ],
  // Row 2: QWERTY Row (Tab to \) matching official Hindi Keyboard image
  [
    { code: 'Tab', engKey: 'Tab', normalHindi: 'Tab ↹', shiftHindi: 'Tab ↹', width: 'w-16', desc: 'टैब (Tab)' },
    { code: 'KeyQ', engKey: 'q', normalHindi: 'ु', shiftHindi: 'फ', desc: 'ह्रस्व उ की मात्रा (ु) / फ' },
    { code: 'KeyW', engKey: 'w', normalHindi: 'ू', shiftHindi: 'ँ', desc: 'दीर्घ ऊ की मात्रा (ू) / चन्द्रबिन्दु (ँ)' },
    { code: 'KeyE', engKey: 'e', normalHindi: 'म', shiftHindi: 'म्', desc: 'पूर्ण म / आधा म्' },
    { code: 'KeyR', engKey: 'r', normalHindi: 'त', shiftHindi: 'त्', desc: 'पूर्ण त / आधा त्' },
    { code: 'KeyT', engKey: 't', normalHindi: 'ज', shiftHindi: 'ज्', desc: 'पूर्ण ज / आधा ज्' },
    { code: 'KeyY', engKey: 'y', normalHindi: 'ल', shiftHindi: 'ल्', desc: 'पूर्ण ल / आधा ल्' },
    { code: 'KeyU', engKey: 'u', normalHindi: 'न', shiftHindi: 'न्', desc: 'पूर्ण न / आधा न्' },
    { code: 'KeyI', engKey: 'i', normalHindi: 'प', shiftHindi: 'प्', desc: 'पूर्ण प / आधा प्' },
    { code: 'KeyO', engKey: 'o', normalHindi: 'व', shiftHindi: 'व्', desc: 'पूर्ण व / आधा व्' },
    { code: 'KeyP', engKey: 'p', normalHindi: 'च', shiftHindi: 'च्', desc: 'पूर्ण च / आधा च्' },
    { code: 'BracketLeft', engKey: '[', normalHindi: 'ख', shiftHindi: 'क्ष', desc: 'पूर्ण ख / संयुक्त वर्ण क्ष' },
    { code: 'BracketRight', engKey: ']', normalHindi: ',', shiftHindi: 'द्व', desc: 'अल्पविराम (,) / संयुक्त वर्ण द्व' },
    { code: 'Backslash', engKey: '\\', normalHindi: '?', shiftHindi: 'द्य', width: 'w-14', desc: 'प्रश्नवाचक (?) / संयुक्त वर्ण द्य' },
  ],
  // Row 3: Home Row (Caps Lock to Enter) matching official Hindi Keyboard image
  [
    { code: 'CapsLock', engKey: 'Caps Lock', normalHindi: 'Caps Lock', shiftHindi: 'Caps Lock', width: 'w-20', desc: 'कैप्स लॉक' },
    { code: 'KeyA', engKey: 'a', normalHindi: 'ं', shiftHindi: '।', desc: 'अनुस्वार बिन्दु (ं) / पूर्णविराम (।)' },
    { code: 'KeyS', engKey: 's', normalHindi: 'े', shiftHindi: 'ै', desc: 'ए की मात्रा (े) / ऐ की मात्रा (ै)' },
    { code: 'KeyD', engKey: 'd', normalHindi: 'क', shiftHindi: 'क्', desc: 'पूर्ण क / आधा क्' },
    { code: 'KeyF', engKey: 'f', normalHindi: 'ि', shiftHindi: 'थ्', desc: 'ह्रस्व इ की मात्रा (ि) / आधा थ्' },
    { code: 'KeyG', engKey: 'g', normalHindi: 'ह', shiftHindi: 'ळ', desc: 'पूर्ण ह / मूर्धन्य ळ' },
    { code: 'KeyH', engKey: 'h', normalHindi: 'ी', shiftHindi: 'भ', desc: 'दीर्घ ई की मात्रा (ी) / पूर्ण भ' },
    { code: 'KeyJ', engKey: 'j', normalHindi: 'र', shiftHindi: 'श्र', desc: 'पूर्ण र / संयुक्त वर्ण श्र' },
    { code: 'KeyK', engKey: 'k', normalHindi: 'ा', shiftHindi: 'ज्ञ', desc: 'आ की मात्रा (ा) / संयुक्त वर्ण ज्ञ' },
    { code: 'KeyL', engKey: 'l', normalHindi: 'स', shiftHindi: 'स्', desc: 'पूर्ण स / आधा स्' },
    { code: 'Semicolon', engKey: ';', normalHindi: 'य', shiftHindi: 'रू', desc: 'पूर्ण य / दीर्घ रू' },
    { code: 'Quote', engKey: "'", normalHindi: 'श', shiftHindi: 'ष्', desc: 'तालव्य श / मूर्धन्य ष्' },
    { code: 'Enter', engKey: 'Enter', normalHindi: 'Enter ↵', shiftHindi: 'Enter ↵', width: 'w-22', desc: 'एंटर (Enter)' },
  ],
  // Row 4: Shift Row (Shift to Shift) matching official Hindi Keyboard image
  [
    { code: 'ShiftLeft', engKey: 'Shift', normalHindi: 'Shift ⇧', shiftHindi: 'Shift ⇧', width: 'w-24', desc: 'शिफ्ट (Shift)' },
    { code: 'KeyZ', engKey: 'z', normalHindi: '्र', shiftHindi: 'र्', desc: 'पदेन र (्र) / रेफ र (र्)' },
    { code: 'KeyX', engKey: 'x', normalHindi: 'ग', shiftHindi: 'ग्', desc: 'पूर्ण ग / आधा ग्' },
    { code: 'KeyC', engKey: 'c', normalHindi: 'ब', shiftHindi: 'ब्', desc: 'पूर्ण ब / आधा ब्' },
    { code: 'KeyV', engKey: 'v', normalHindi: 'अ', shiftHindi: 'ट', desc: 'स्वर अ / मूर्धन्य ट' },
    { code: 'KeyB', engKey: 'b', normalHindi: 'इ', shiftHindi: 'ठ', desc: 'स्वर इ / मूर्धन्य ठ' },
    { code: 'KeyN', engKey: 'n', normalHindi: 'द', shiftHindi: 'छ', desc: 'पूर्ण द / स्पर्श वर्ण छ' },
    { code: 'KeyM', engKey: 'm', normalHindi: 'उ', shiftHindi: 'ड', desc: 'स्वर उ / मूर्धन्य ड' },
    { code: 'Comma', engKey: ',', normalHindi: 'ए', shiftHindi: 'ढ', desc: 'स्वर ए / मूर्धन्य ढ' },
    { code: 'Period', engKey: '.', normalHindi: 'झ', shiftHindi: 'ण', desc: 'वर्ण झ / मूर्धन्य ण' },
    { code: 'Slash', engKey: '/', normalHindi: 'ध', shiftHindi: 'घ', desc: 'पूर्ण ध / पूर्ण घ' },
    { code: 'ShiftRight', engKey: 'Shift', normalHindi: 'Shift ⇧', shiftHindi: 'Shift ⇧', width: 'w-24', desc: 'शिफ्ट (Shift)' },
  ],
  // Row 5: Modifier Row matching official Hindi Keyboard image
  [
    { code: 'ControlLeft', engKey: 'Ctrl', normalHindi: 'Ctrl', shiftHindi: 'Ctrl', width: 'w-14', desc: 'कंट्रोल' },
    { code: 'MetaLeft', engKey: 'Win', normalHindi: 'win', shiftHindi: 'win', width: 'w-12', desc: 'विंडोज' },
    { code: 'AltLeft', engKey: 'Alt', normalHindi: 'Alt', shiftHindi: 'Alt', width: 'w-12', desc: 'ऑल्ट' },
    { code: 'Space', engKey: 'Space', normalHindi: 'Spacebar (स्पेस बार)', shiftHindi: 'Spacebar (स्पेस बार)', width: 'flex-1', desc: 'स्पेस बार' },
    { code: 'AltRight', engKey: 'Alt', normalHindi: 'Alt', shiftHindi: 'Alt', width: 'w-12', desc: 'ऑल्ट' },
    { code: 'MetaRight', engKey: 'Win', normalHindi: 'win', shiftHindi: 'win', width: 'w-12', desc: 'विंडोज' },
    { code: 'ContextMenu', engKey: 'Menu', normalHindi: '📄', shiftHindi: '📄', width: 'w-10', desc: 'मेन्यू' },
    { code: 'ControlRight', engKey: 'Ctrl', normalHindi: 'Ctrl', shiftHindi: 'Ctrl', width: 'w-14', desc: 'कंट्रोल' },
  ],
];

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  activeKey: propActiveKey,
  isShiftActive: propShiftActive = false,
}) => {
  const [altSearch, setAltSearch] = useState('');
  const [manualShift, setManualShift] = useState(false);
  const [selectedKeyInfo, setSelectedKeyInfo] = useState<KeyData | null>(null);

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
      return; // allow normal backspace in test box
    }

    if (e.key === ' ' || e.key === 'Space') {
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      const hindiChar = mapKeystrokeToHindi(e.key, e.shiftKey) || e.key;
      setTestInput((prev) => prev + hindiChar);
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
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Official Heading matching the RSSB Official Circular */}
      <div className="text-center space-y-1">
        <div className="inline-block px-4 py-1 bg-amber-50 border border-amber-300 rounded-full text-xs font-semibold text-amber-900 shadow-xs">
          Standard की–बोर्ड एवं DevLys 010 फॉन्ट का प्रयोग किया जायेगा।
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 tracking-wide">
          Hindi Keyboard (DevLys 010 / Remington GAIL)
        </h2>
        <p className="text-xs text-slate-500">
          राजस्थान कर्मचारी चयन बोर्ड (RSMSSB) कनिष्ठ सहायक / लिपिक ग्रेड-II आधिकारिक परीक्षा लेआउट
        </p>
      </div>

      {/* Authentic Keyboard Chassis matching Screenshot 2026-10-12 10.07.01 PM.png */}
      <div className="bg-slate-100 p-4 md:p-6 rounded-3xl border-4 border-slate-300 shadow-2xl relative select-none">
        {/* Shift Toggle & Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">
              Shift स्थिति:
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                effectiveShift
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-white'
              }`}
            >
              {effectiveShift ? 'Shift ON (शीर्ष वर्ण सक्रिय)' : 'Shift OFF (निचले वर्ण सक्रिय)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setManualShift(!manualShift)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all shadow-sm ${
                effectiveShift
                  ? 'bg-blue-700 text-white border-blue-800'
                  : 'bg-white text-slate-800 border-slate-400 hover:bg-slate-50'
              }`}
            >
              {effectiveShift ? '⇧ Shift बंद करें' : '⇧ Shift चालू करें'}
            </button>
          </div>
        </div>

        {/* Keyboard Keys Layout */}
        <div className="space-y-2 overflow-x-auto pb-2">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 justify-center min-w-[780px]">
              {row.map((k) => {
                const isSpecial = [
                  'Backspace',
                  'Tab',
                  'CapsLock',
                  'Enter',
                  'ShiftLeft',
                  'ShiftRight',
                  'ControlLeft',
                  'ControlRight',
                  'AltLeft',
                  'AltRight',
                  'MetaLeft',
                  'MetaRight',
                  'ContextMenu',
                ].includes(k.code);
                const isSpace = k.code === 'Space';

                const isActive =
                  currentActive &&
                  (currentActive.toLowerCase() === k.engKey.toLowerCase() ||
                    currentActive === k.code ||
                    (k.code === 'Space' && (currentActive === ' ' || currentActive === 'Space')));

                return (
                  <button
                    key={k.code}
                    type="button"
                    onClick={() => setSelectedKeyInfo(k)}
                    className={`${k.width || 'w-12'} h-14 flex flex-col items-center justify-between p-1 rounded-lg border-2 text-center transition-all select-none shadow-sm cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300 scale-95 shadow-inner'
                        : isSpecial
                        ? 'bg-slate-200 border-slate-300 text-slate-800 text-[11px] font-semibold justify-center hover:bg-slate-300'
                        : isSpace
                        ? 'bg-white border-slate-300 text-slate-600 text-xs justify-center font-medium shadow-inner hover:border-blue-400'
                        : 'bg-white border-slate-300 text-slate-900 hover:border-blue-500 hover:shadow-md'
                    }`}
                    title={k.desc || `${k.engKey} key`}
                  >
                    {!isSpecial && !isSpace ? (
                      <>
                        {/* Top: Shift Character */}
                        <div
                          className={`text-sm md:text-base leading-none font-bold font-serif ${
                            effectiveShift
                              ? 'text-blue-700 font-extrabold scale-110'
                              : 'text-slate-500 font-medium'
                          }`}
                        >
                          {k.shiftHindi}
                        </div>

                        {/* Bottom: Normal Character */}
                        <div
                          className={`text-sm md:text-base leading-none font-bold font-serif ${
                            !effectiveShift
                              ? 'text-slate-900 font-extrabold scale-110'
                              : 'text-slate-400 font-normal'
                          }`}
                        >
                          {k.normalHindi}
                        </div>

                        {/* QWERTY Key reference in tiny font */}
                        <div className="text-[9px] text-slate-400 font-mono leading-none">
                          {k.engKey}
                        </div>
                      </>
                    ) : (
                      <span className="font-semibold text-slate-700">{k.normalHindi}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Selected Key Details Card */}
        {selectedKeyInfo && !['Backspace', 'Tab', 'CapsLock', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'ContextMenu', 'Space'].includes(selectedKeyInfo.code) && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-300 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-blue-200 text-blue-900">
                Key [{selectedKeyInfo.engKey.toUpperCase()}]
              </span>
              <div>
                <span className="text-slate-700">बिना Shift (सामान्य): </span>
                <strong className="text-base text-slate-900 font-serif mr-4">
                  {selectedKeyInfo.normalHindi}
                </strong>
                <span className="text-slate-700">Shift के साथ: </span>
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
              className="text-slate-400 hover:text-slate-700 text-xs"
            >
              ✕ बंद करें
            </button>
          </div>
        )}

        {/* Help Tip */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-300 shadow-xs">
          <Info className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>कुंजी नियम:</strong> प्रत्येक बटन पर ऊपर स्थित वर्ण <strong>Shift</strong> के साथ प्राप्त होता है (जैसे [d] = क, [Shift + d] = क्)। [q] = ु, [Shift + q] = फ। संख्या पंक्ति पर १, २, ३, ४, ५, ६, ७, ८, ९, ० अंकित हैं।
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
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-blue-50/80 hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center shadow-xs"
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
