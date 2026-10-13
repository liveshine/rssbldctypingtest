import React, { useState, useEffect, useRef } from 'react';
import { SpeedTestResult, CandidateInfo } from '../../types/exam';
import {
  calculateSpeedTestStats,
  mapKeystrokeToHindi,
  combineDevLysSequence,
  tokenizeWords,
  ALT_CODES_MAP,
  ALT_CODES_REFERENCE,
} from '../../utils/remingtonEngine';
import { KeyboardVisualizer } from '../KeyboardVisualizer';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Shuffle,
  Keyboard,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SpeedTestRunnerProps {
  paperType: 'hindi_speed' | 'english_speed';
  passageTitle: string;
  passageText: string;
  durationMinutes?: number;
  candidate?: CandidateInfo;
  onFinishTest: (result: SpeedTestResult) => void;
  onSwitchPassage?: () => void;
}

export const SpeedTestRunner: React.FC<SpeedTestRunnerProps> = ({
  paperType,
  passageTitle,
  passageText,
  durationMinutes = 10,
  candidate = {
    rollNo: '740732',
    name: 'CANDIDATE',
    testId: '3',
    category: 'General/OBC',
    systemNo: 'C-042',
  },
  onFinishTest,
  onSwitchPassage,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [rawWordsHistory, setRawWordsHistory] = useState<string[]>([]);
  const [currentWordInput, setCurrentWordInput] = useState('');
  const [currentRawKeystrokes, setCurrentRawKeystrokes] = useState('');
  const [showKeyboardMap, setShowKeyboardMap] = useState(false);
  const [activeKey, setActiveKey] = useState('');
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const targetWords = useRef(tokenizeWords(passageText)).current;
  const altBufferRef = useRef('');

  // Reset words if passageText changes (e.g. user clicked switch passage)
  useEffect(() => {
    setTypedWords([]);
    setRawWordsHistory([]);
    setCurrentWordInput('');
    setCurrentRawKeystrokes('');
    inputRef.current?.focus();
  }, [passageText]);

  // Timer countdown
  useEffect(() => {
    if (isTestFinished) return;

    if (secondsLeft <= 0) {
      handleFinalSubmission();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isTestFinished]);

  // Auto-scroll passage view to keep active word visible
  useEffect(() => {
    if (activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [typedWords.length]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `00:${String(mins).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  };

  const handleFinalSubmission = () => {
    if (isTestFinished) return;
    setIsTestFinished(true);

    const finalWords = [...typedWords];
    const finalRaw = [...rawWordsHistory];

    if (currentWordInput.trim()) {
      finalWords.push(currentWordInput.trim());
      finalRaw.push(currentRawKeystrokes || currentWordInput.trim());
    }

    const timeSpent = durationMinutes * 60 - Math.max(0, secondsLeft);
    const stats = calculateSpeedTestStats(
      passageText,
      finalWords,
      timeSpent,
      paperType,
      finalRaw
    );

    const fullTypedContent = finalWords.join(' ');

    const result: SpeedTestResult = {
      paperType,
      totalWordsTarget: stats.totalWordsTarget,
      typedWordsCount: stats.typedWordsCount,
      correctWordsCount: stats.correctWordsCount,
      incorrectWordsCount: stats.incorrectWordsCount,
      omittedWordsCount: stats.omittedWordsCount,
      grossWpm: stats.grossWpm,
      netWpm: stats.netWpm,
      accuracyPercentage: stats.accuracyPercentage,
      marksObtained: stats.marksObtained,
      isQualified: stats.isQualified,
      typedContent: fullTypedContent,
      timeSpentSeconds: timeSpent,
      keystrokeWarnings: stats.keystrokeWarnings,
    };

    onFinishTest(result);
  };

  const handleInsertLigature = (char: string, label: string) => {
    if (isTestFinished) return;
    setCurrentWordInput((prev) => combineDevLysSequence(prev, char));
    setCurrentRawKeystrokes((prev) => prev + `[${label}]`);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setActiveKey(e.key);
    setIsShiftActive(e.shiftKey);

    // Allow standard text selection shortcuts (Ctrl+A, Ctrl+C)
    // Only prevent paste into the typing test box
    if (e.ctrlKey || e.metaKey) {
      if (['v'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return;
      }
    }

    // Spacebar or Enter completes the active word
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (currentWordInput.trim().length > 0) {
        setTypedWords((prev) => [...prev, currentWordInput.trim()]);
        setRawWordsHistory((prev) => [...prev, currentRawKeystrokes || currentWordInput.trim()]);
        setCurrentWordInput('');
        setCurrentRawKeystrokes('');
      }
      return;
    }

    // STRICT RSSB BACKSPACE RULE (Rule 10):
    // Backspace works within the current word input box.
    // Once currentWordInput is empty (or after Space/Enter submits word), Backspace is locked!
    if (e.key === 'Backspace') {
      if (currentWordInput.length === 0) {
        e.preventDefault();
        return;
      }
      if (paperType === 'hindi_speed') {
        e.preventDefault();
        setCurrentRawKeystrokes((prev) => prev.slice(0, -1));
        setCurrentWordInput((prev) => (prev.length <= 1 ? '' : prev.slice(0, -1)));
        return;
      } else {
        setCurrentRawKeystrokes((prev) => prev.slice(0, -1));
      }
      return;
    }

    // Hindi Remington Layout & Alt-code Handling
    if (paperType === 'hindi_speed') {
      // 1. Windows NumPad Alt-Code Decoder (Alt + Digits)
      if (e.altKey || e.key === 'Alt') {
        const digitMatch = e.code.match(/^(?:Numpad|Digit)([0-9])$/);
        const digit = digitMatch ? digitMatch[1] : (/^[0-9]$/.test(e.key) ? e.key : null);
        if (digit !== null) {
          e.preventDefault();
          altBufferRef.current += digit;
          const decoded = ALT_CODES_MAP[altBufferRef.current];
          if (decoded && altBufferRef.current.length >= 4) {
            setCurrentWordInput((prev) => combineDevLysSequence(prev, decoded));
            setCurrentRawKeystrokes((prev) => prev + `[Alt+${altBufferRef.current}]`);
            altBufferRef.current = '';
          }
          return;
        }
      }

      // 2. Direct Devanagari character input (if IME or OS passes it directly)
      if (/^[\u0900-\u097F]/.test(e.key)) {
        e.preventDefault();
        setCurrentRawKeystrokes((prev) => prev + e.key);
        setCurrentWordInput((prev) => combineDevLysSequence(prev, e.key));
        return;
      }

      // 3. Standard Remington GAIL Key Mapping
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setCurrentRawKeystrokes((prev) => prev + e.key);
        const mappedChar = mapKeystrokeToHindi(e.key, e.shiftKey) || e.key;
        setCurrentWordInput((prev) => combineDevLysSequence(prev, mappedChar));
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsShiftActive(e.shiftKey);

    // If Alt was released and we have accumulated digits in buffer (e.g. 0216, 216)
    if (e.key === 'Alt' || (!e.altKey && altBufferRef.current.length > 0)) {
      if (altBufferRef.current) {
        const decoded = ALT_CODES_MAP[altBufferRef.current];
        if (decoded) {
          setCurrentWordInput((prev) => combineDevLysSequence(prev, decoded));
          setCurrentRawKeystrokes((prev) => prev + `[Alt+${altBufferRef.current}]`);
        }
        altBufferRef.current = '';
      }
    }
  };

  const currentWordIndex = typedWords.length;
  const isTimeCritical = secondsLeft <= 60;
  const timeElapsedMinutes = (durationMinutes * 60 - secondsLeft) / 60;
  const grossWpmLive =
    timeElapsedMinutes > 0 ? Math.round(typedWords.length / timeElapsedMinutes) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto my-2 bg-white rounded-lg shadow-xl border-2 border-slate-300 overflow-hidden font-sans select-text">
      {/* Official Top Institutional Header matching Screenshot 3 & 5 */}
      <div className="bg-slate-100 border-b-2 border-slate-300 px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Candidate Identification */}
        <div className="flex items-center gap-4 text-xs text-slate-700 font-mono">
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-slate-300 shadow-xs">
            <User className="w-3.5 h-3.5 text-blue-700" />
            <span>Roll No: </span>
            <strong className="text-slate-900 font-bold">{candidate.rollNo}</strong>
          </div>
          <div className="hidden sm:block">
            <span>Name: </span>
            <strong className="text-slate-900">{candidate.name}</strong>
          </div>
          <div className="hidden lg:block text-slate-500">
            Seat: <strong>{candidate.systemNo || 'C-042'}</strong>
          </div>
        </div>

        {/* Center: Exam Paper Title & Remaining Time Box */}
        <div className="text-center">
          <h2 className="text-base md:text-lg font-bold font-serif text-slate-900 tracking-tight">
            {paperType === 'hindi_speed'
              ? 'Hindi Typing Speed Test / हिन्दी टंकण गतिपरीक्षा'
              : 'English Typing Speed Test / अंग्रेजी टंकण गतिपरीक्षा'}
          </h2>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mt-0.5 bg-white border border-slate-400 rounded text-xs font-mono shadow-inner">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-slate-600 font-medium">Remaining Time :</span>
            <span
              className={`font-bold text-sm tabular-nums tracking-wider ${
                isTimeCritical ? 'text-red-600 animate-pulse' : 'text-blue-900'
              }`}
            >
              {formatTimer(secondsLeft)}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {paperType === 'hindi_speed' && (
            <button
              onClick={() => setShowKeyboardMap(!showKeyboardMap)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors shadow-xs"
              title="Toggle DevLys 010 Remington Layout"
            >
              <Keyboard className="w-3.5 h-3.5 text-blue-600" />
              <span>{showKeyboardMap ? 'कीबोर्ड छिपाएं' : 'कीबोर्ड लेआउट'}</span>
            </button>
          )}

          {onSwitchPassage && (
            <button
              onClick={onSwitchPassage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              title="Next Random Exam Passage"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">नया गद्यांश</span>
            </button>
          )}

          <button
            onClick={handleFinalSubmission}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Submit Exam</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="p-6 space-y-6">
        {/* Exam Instructions Banner matching Official Guidelines */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs bg-blue-50/70 border border-blue-200 rounded px-4 py-2 text-blue-900 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[11px] bg-blue-200/60 px-2 py-0.5 rounded">
              Official Standard
            </span>
            <span>
              {paperType === 'hindi_speed'
                ? 'Standard की-बोर्ड एवं DevLys 010 फॉन्ट (Remington GAIL Layout) · 400 शब्द लक्ष्य · 25 अंक'
                : 'English Speed Test (US Standard Layout) · 500 Words Target · 25 Marks'}
            </span>
          </div>

          <div className="font-mono text-[11px] text-blue-800">
            Passage: <strong>{passageTitle}</strong> (~{targetWords.length} words)
          </div>
        </div>

        {/* Target Passage Reading Canvas matching Official Exam Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>मूल गद्यांश (Original Passage to Type) :</span>
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              Active Word Index: {currentWordIndex + 1} / {targetWords.length}
            </span>
          </div>

          <div className="p-6 bg-slate-50 border-2 border-slate-300 rounded-sm max-h-56 overflow-y-auto leading-loose text-lg font-serif text-slate-800 select-none shadow-inner">
            <p className="flex flex-wrap gap-x-2 gap-y-1">
              {targetWords.map((word, idx) => {
                const isTyped = idx < currentWordIndex;
                const isActive = idx === currentWordIndex;

                let wordStyle = 'text-slate-800';
                if (isTyped) {
                  wordStyle = 'text-slate-400 line-through decoration-slate-300';
                } else if (isActive) {
                  wordStyle =
                    'text-blue-950 font-bold bg-amber-200 px-1 rounded ring-2 ring-blue-600 shadow-xs';
                }

                return (
                  <span
                    key={idx}
                    ref={isActive ? activeWordRef : null}
                    className={`transition-colors duration-150 inline-block ${wordStyle}`}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
          </div>
        </div>

        {/* Live Typing Statistics Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium border-y border-slate-200 py-2.5 px-2 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <span className="text-slate-700">
              Type Progress:{' '}
              <strong className="text-blue-900 font-mono text-sm">
                {typedWords.length}
              </strong>{' '}
              / {targetWords.length} words
            </span>

            <span className="text-slate-700">
              Live Speed:{' '}
              <strong className="text-slate-900 font-mono">
                {grossWpmLive} WPM
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-900 bg-amber-100/70 border border-amber-300 px-3 py-1 rounded text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              आरएसएसबी नियम 10: शब्द टाइप करने के बाद Space दबाते ही Backspace लॉक हो जाता है
            </span>
          </div>
        </div>

        {/* Input Box matching Screenshot */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Type here (नीचे टाइप करें) :
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={currentWordInput}
              onChange={(e) => {
                if (paperType === 'english_speed') {
                  setCurrentWordInput(e.target.value);
                  setCurrentRawKeystrokes(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              placeholder={
                paperType === 'hindi_speed'
                  ? 'वर्तमान शब्द टाइप करें और Space दबाएं...'
                  : 'Type current word and press Space...'
              }
              className="w-full py-4 px-5 border-2 border-blue-600 rounded-sm focus:outline-none focus:ring-4 focus:ring-blue-100 text-2xl font-serif font-medium text-slate-900 bg-white shadow-inner tracking-wide"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            {paperType === 'hindi_speed' && currentWordInput && (
              <div className="absolute right-3 top-3.5 text-xs bg-blue-50 text-blue-900 px-2.5 py-1 rounded border border-blue-200 font-mono">
                Active: <span className="font-serif font-bold text-sm">{currentWordInput}</span>
              </div>
            )}
          </div>

          {/* Quick Ligature & Alt-Code Helper Bar for Hindi Typing Test */}
          {paperType === 'hindi_speed' && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>क्विक लिगेचर्स / ऑल्ट कोड (Click to insert or type Alt+Code):</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">
                  DevLys 010 (Remington GAIL)
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {ALT_CODES_REFERENCE.slice(0, 12).map((ref) => (
                  <button
                    key={ref.code}
                    type="button"
                    onClick={() => handleInsertLigature(ref.char, ref.code)}
                    title={`${ref.code}: ${ref.description}`}
                    className="px-2.5 py-1 bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50 rounded text-xs font-serif text-slate-800 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <span className="font-bold text-sm text-blue-950">{ref.char}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {ref.code.replace('Alt+', '')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>
              {paperType === 'hindi_speed'
                ? 'कीबोर्ड: DevLys 010 (Remington GAIL) मानक मैपिंग व ऑल्ट कोड सक्रिय'
                : 'Keyboard: Standard US QWERTY layout'}
            </span>
            <span className="text-slate-400">
              Press [Space] or [Enter] to submit word
            </span>
          </div>
        </div>

        {/* Optional Collapsible Remington Visualizer */}
        {showKeyboardMap && (
          <div className="pt-2 border-t border-slate-200">
            <KeyboardVisualizer activeKey={activeKey} isShiftActive={isShiftActive} />
          </div>
        )}
      </div>
    </div>
  );
};
