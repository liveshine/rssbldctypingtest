import React, { useState } from 'react';
import {
  HINDI_PASSAGES_BANK,
  ENGLISH_PASSAGES_BANK,
  PassageItem,
  getNextPassage,
} from '../../data/passagesBank';
import { SpeedTestRunner } from '../exam/SpeedTestRunner';
import { PassagesBankModal } from '../PassagesBankModal';
import { SpeedTestResult } from '../../types/exam';
import { Play, RotateCcw, Award, AlertTriangle, Shuffle, Library, ChevronRight } from 'lucide-react';

export const SpeedDrillArena: React.FC = () => {
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [currentPassage, setCurrentPassage] = useState<PassageItem>(HINDI_PASSAGES_BANK[0]);
  const [durationMins, setDurationMins] = useState<number>(5);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<SpeedTestResult | null>(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const passages =
    language === 'hindi' ? HINDI_PASSAGES_BANK : ENGLISH_PASSAGES_BANK;

  const handlePickRandomPassage = () => {
    const next = getNextPassage(language);
    setCurrentPassage(next);
  };

  const handleLanguageChange = (lang: 'hindi' | 'english') => {
    setLanguage(lang);
    const next = getNextPassage(lang);
    setCurrentPassage(next);
  };

  const handleFinish = (result: SpeedTestResult) => {
    setLastResult(result);
    setIsRunning(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans">
      {!isRunning ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  टंकण गति अभ्यास क्षेत्र (Speed Drills Arena)
                </h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  100+ Passages Bank
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                प्रत्येक बार नया पैराग्राफ पाएं · DevLys 010 Remington लेआउट, RSSB बैकस्पेस नियम एवं मात्रा ऑडिट
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsBankModalOpen(true)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5"
              >
                <Library className="w-3.5 h-3.5 text-blue-700" />
                <span>100+ Passages Library</span>
              </button>

              <button
                onClick={() => {
                  setLastResult(null);
                  setIsRunning(true);
                }}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors uppercase tracking-wider flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Drill (शुरू करें)</span>
              </button>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Language Selection */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                1. भाषा चुनें (Select Language)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleLanguageChange('hindi')}
                  className={`p-3 rounded-lg border text-xs font-bold transition-all text-center ${
                    language === 'hindi'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  हिन्दी (DevLys 010)
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                    {HINDI_PASSAGES_BANK.length} पैराग्राफ
                  </span>
                </button>
                <button
                  onClick={() => handleLanguageChange('english')}
                  className={`p-3 rounded-lg border text-xs font-bold transition-all text-center ${
                    language === 'english'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  English
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                    {ENGLISH_PASSAGES_BANK.length} Passages
                  </span>
                </button>
              </div>
            </div>

            {/* Timer Selection */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                2. समय अवधि चुनें (Duration)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 5, 10].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDurationMins(mins)}
                    className={`py-3 rounded-lg border text-xs font-bold transition-all text-center ${
                      durationMins === mins
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mins} Min
                    <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                      {mins === 10 ? 'आधिकारिक' : 'त्वरित'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Passage Selection with Random Shuffle */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. सक्रिय पैराग्राफ
                </label>
                <button
                  onClick={handlePickRandomPassage}
                  title="Pick a new random unseen passage"
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 hover:underline"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>नया पैराग्राफ (Shuffle)</span>
                </button>
              </div>

              <select
                value={currentPassage.id}
                onChange={(e) => {
                  const p = passages.find((x) => x.id === e.target.value);
                  if (p) setCurrentPassage(p);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                {passages.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.category}] {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Last Result Showcase */}
          {lastResult && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>अभ्यास परिणाम (Drill Performance Summary)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      handlePickRandomPassage();
                      setIsRunning(true);
                    }}
                    className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Next New Passage</span>
                  </button>
                  <button
                    onClick={() => setIsRunning(true)}
                    className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Same</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Gross Speed</span>
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    {lastResult.grossWpm}{' '}
                    <span className="text-xs font-sans font-normal text-slate-500">WPM</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Net Speed</span>
                  <span className="text-2xl font-bold text-blue-700 font-mono">
                    {lastResult.netWpm}{' '}
                    <span className="text-xs font-sans font-normal text-slate-500">WPM</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Accuracy (शुद्धता)</span>
                  <span className="text-2xl font-bold text-emerald-700 font-mono">
                    {lastResult.accuracyPercentage}%
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">प्राप्तांक (Marks / 25)</span>
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    {lastResult.marksObtained.toFixed(2)}
                  </span>
                  <span
                    className={`block text-[10px] font-semibold mt-0.5 ${
                      lastResult.isQualified ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {lastResult.isQualified ? 'Qualifying (≥9.0)' : 'Below 9.0 Cutoff'}
                  </span>
                </div>
              </div>

              {lastResult.keystrokeWarnings && lastResult.keystrokeWarnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>मात्रा / कीस्ट्रोक चेतावनी (Page 2 Keystroke Redundancy Detected):</span>
                  </div>
                  <ul className="text-xs text-amber-800 space-y-1 list-disc pl-5">
                    {lastResult.keystrokeWarnings.map((w, idx) => (
                      <li key={idx}>{w.description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Current Passage Preview */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
                  {currentPassage.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {currentPassage.title}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                ~{currentPassage.wordCount} शब्द
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 font-serif">
              {currentPassage.text}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsRunning(false)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              ← Back to Drill Settings
            </button>
            <div className="text-xs text-slate-500">
              Drill: <strong className="text-slate-800 uppercase">{language}</strong> · {durationMins} Minutes · {currentPassage.title}
            </div>
          </div>

          <SpeedTestRunner
            paperType={language === 'hindi' ? 'hindi_speed' : 'english_speed'}
            passageTitle={currentPassage.title}
            passageText={currentPassage.text}
            durationMinutes={durationMins}
            candidate={{
              rollNo: '740732',
              name: 'CANDIDATE',
              testId: '3',
              category: 'General/OBC',
              systemNo: 'C-042',
            }}
            onSwitchPassage={() => {
              const next = getNextPassage(language, currentPassage.id);
              setCurrentPassage(next);
            }}
            onFinishTest={handleFinish}
          />
        </div>
      )}

      {/* 100+ Passages Bank Browser Modal */}
      <PassagesBankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onSelectPassage={(p) => {
          setLanguage(p.language);
          setCurrentPassage(p);
        }}
      />
    </div>
  );
};
