import React, { useState, useEffect } from 'react';
import { KeyboardVisualizer } from '../KeyboardVisualizer';
import { mapKeystrokeToHindi, combineDevLysSequence } from '../../utils/remingtonEngine';
import { Clock, Eye, EyeOff, FastForward } from 'lucide-react';

interface PeripheralCheckScreenProps {
  onComplete: () => void;
}

export const PeripheralCheckScreen: React.FC<PeripheralCheckScreenProps> = ({ onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes
  const [activeLang, setActiveLang] = useState<'hindi' | 'english'>('hindi');
  const [typedText, setTypedText] = useState('');
  const [showKeyboardMap, setShowKeyboardMap] = useState(true);
  const [lastKeyPressed, setLastKeyPressed] = useState('');
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onComplete]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `00:${String(mins).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setLastKeyPressed(e.key);
    setIsShiftPressed(e.shiftKey);

    if (activeLang === 'hindi') {
      if (e.key === 'Backspace') {
        e.preventDefault();
        setTypedText((prev) => (prev.length <= 1 ? '' : prev.slice(0, -1)));
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        const hindiChar = mapKeystrokeToHindi(e.key, e.shiftKey) || e.key;
        setTypedText((prev) => combineDevLysSequence(prev, hindiChar));
      }
    }
  };

  const handleKeyUp = () => {
    setIsShiftPressed(false);
  };

  return (
    <div className="max-w-5xl mx-auto my-6 bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden font-sans">
      {/* Top Header bar matching official screenshot */}
      <div className="border-b border-slate-300 p-4 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Practice Test / अभ्यास परीक्षण
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Remaining Time : </span>
            <span className="font-mono font-bold text-red-600 text-sm">
              {formatTimer(secondsLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Skip Button */}
          <button
            onClick={onComplete}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded shadow-sm flex items-center gap-1 transition-colors"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Skip Practice Test</span>
          </button>

          {/* Language Selector tabs matching official UI */}
          <div className="flex items-center border border-slate-400 rounded overflow-hidden">
            <button
              onClick={() => {
                setActiveLang('english');
                setTypedText('');
              }}
              className={`px-4 py-1.5 text-xs font-bold transition-colors ${
                activeLang === 'english'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setActiveLang('hindi');
                setTypedText('');
              }}
              className={`px-4 py-1.5 text-xs font-bold transition-colors ${
                activeLang === 'hindi'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Hindi
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="text-sm font-semibold text-slate-700">
          In this page check your English &amp; Hindi keyboard.
        </div>

        {/* Practice Test Typing Area */}
        <div className="relative">
          <textarea
            value={typedText}
            onChange={(e) => activeLang === 'english' && setTypedText(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder={
              activeLang === 'hindi'
                ? 'की-बोर्ड जांचें (DevLys 010 Remington लेआउट सक्रिय है - टाइप करके देखें)...'
                : 'Type here to verify your English keyboard...'
            }
            rows={5}
            className="w-full p-4 border-2 border-slate-400 rounded-lg focus:outline-none focus:border-blue-600 text-base leading-relaxed font-sans"
            autoFocus
          />
          <div className="text-right text-[11px] text-slate-500 mt-1">
            Typing Mode: <span className="font-semibold text-slate-800 uppercase">{activeLang} (DevLys 010)</span>
          </div>
        </div>

        {/* Toggle on-screen keyboard view */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <div className="text-xs text-slate-600">
            {activeLang === 'hindi' && 'Remington GAIL लेआउट पर सभी कुंजियों का परीक्षण करें।'}
          </div>
          <button
            onClick={() => setShowKeyboardMap(!showKeyboardMap)}
            className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
          >
            {showKeyboardMap ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showKeyboardMap ? 'Hide Keyboard Map' : 'Show Keyboard Map'}</span>
          </button>
        </div>

        {showKeyboardMap && (
          <div className="pt-2">
            <KeyboardVisualizer activeKey={lastKeyPressed} isShiftActive={isShiftPressed} />
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            onClick={onComplete}
            className="px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors uppercase tracking-wider"
          >
            Start Official Speed Test (प्रारंभ करें)
          </button>
        </div>
      </div>
    </div>
  );
};
