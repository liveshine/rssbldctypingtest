import React, { useState, useEffect, useRef } from 'react';
import { SpeedTestResult, CandidateInfo } from '../../types/exam';
import {
  calculateSpeedTestStats,
  mapKeystrokeToHindi,
  tokenizeWords,
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setActiveKey(e.key);
    setIsShiftActive(e.shiftKey);

    // Prevent prohibited shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (['c', 'v', 'a', 'x', 'z', 'y'].includes(e.key.toLowerCase())) {
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

    // STRICT RSSB BACKSPACE RULE:
    // Backspace works within the current word input box.
    // If currentWordInput is empty, Backspace is locked!
    if (e.key === 'Backspace') {
      if (currentWordInput.length === 0) {
        e.preventDefault();
      } else {
        setCurrentRawKeystrokes((prev) => prev.slice(0, -1));
      }
      return;
    }

    // Hindi Remington Layout Handling
    if (paperType === 'hindi_speed') {
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setCurrentRawKeystrokes((prev) => prev + e.key);
        const mappedChar = mapKeystrokeToHindi(e.key, e.shiftKey) || e.key;
        setCurrentWordInput((prev) => prev + mappedChar);
      }
    }
  };

  const handleKeyUp = () => {
    setIsShiftActive(false);
  };

  const currentWordIndex = typedWords.length;
  const isTimeCritical = secondsLeft <= 60;
  const timeElapsedMinutes = (durationMinutes * 60 - secondsLeft) / 60;
  const grossWpmLive =
    timeElapsedMinutes > 0 ? Math.round(typedWords.length / timeElapsedMinutes) : 0;

  return (
    <div
      onContextMenu={handleContextMenu}
      className="w-full max-w-7xl mx-auto my-2 bg-white rounded-lg shadow-xl border-2 border-slate-300 overflow-hidden font-sans select-none"
    >
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

        {/* Right: Actions (Change Paragraph & Submit Paper) */}
        <div className="flex items-center gap-2">
          {onSwitchPassage && (
            <button
              onClick={onSwitchPassage}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-blue-400 rounded shadow-xs flex items-center gap-1.5 transition-colors"
              title="Get a new unseen random paragraph from 100+ bank"
            >
              <Shuffle className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">New Paragraph</span>
              <span className="sm:hidden">New</span>
            </button>
          )}

          <button
            onClick={handleFinalSubmission}
            className="px-5 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-md transition-colors uppercase tracking-wider"
          >
            Submit Paper
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Active Passage Title & Details Strip */}
        <div className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 font-serif">
              पैराग्राफ शीर्षक: {passageTitle}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              लक्ष्य:{' '}
              <strong className="text-slate-900">
                {paperType === 'hindi_speed' ? '400 शब्द' : '500 शब्द'}
              </strong>{' '}
              (पूर्णांक 25.0)
            </span>
            <button
              onClick={() => setShowKeyboardMap(!showKeyboardMap)}
              className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 text-xs"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{showKeyboardMap ? 'Hide DevLys Map' : 'DevLys 010 Map'}</span>
            </button>
          </div>
        </div>

        {/* Top Text Passage Box matching Screenshot 3 & Page 5 */}
        <div
          className="border-2 border-slate-400 rounded-sm p-5 bg-slate-50 h-56 md:h-64 overflow-y-auto text-lg md:text-xl leading-relaxed text-slate-800 font-serif tracking-normal shadow-inner"
          style={{ lineHeight: '2.0' }}
        >
          {targetWords.map((word, index) => {
            let statusClass = 'text-slate-800';
            const isCurrent = index === currentWordIndex;

            if (index < typedWords.length) {
              const isMatch = typedWords[index] === word;
              statusClass = isMatch
                ? 'bg-emerald-100 text-emerald-950 font-medium px-1 rounded-xs'
                : 'bg-red-100 text-red-950 line-through px-1 rounded-xs decoration-red-700';
            } else if (isCurrent) {
              statusClass =
                'bg-blue-200 text-blue-950 font-bold px-1.5 py-0.5 rounded ring-2 ring-blue-600 shadow-xs';
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeWordRef : null}
                className={`inline-block mr-2 my-0.5 transition-colors ${statusClass}`}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Live Metrics and RSSB Rule 10 Notification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 border border-slate-300 rounded px-3 py-2">
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
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              {paperType === 'hindi_speed'
                ? 'कीबोर्ड: DevLys 010 (Remington GAIL) स्वचालित मैपिंग सक्रिय'
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
