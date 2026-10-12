import React from 'react';
import { Award, BookOpen, CheckCircle, FileText, Keyboard, Play, Library } from 'lucide-react';

interface HeaderProps {
  currentTab: 'exam' | 'drills' | 'efficiency' | 'keyboard' | 'guidelines';
  setCurrentTab: (tab: 'exam' | 'drills' | 'efficiency' | 'keyboard' | 'guidelines') => void;
  onOpenGuidelines: () => void;
  onOpenPassagesBank: () => void;
  onStartFullExam: () => void;
  isExamRunning?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenGuidelines,
  onOpenPassagesBank,
  onStartFullExam,
  isExamRunning,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6 h-16">
        {/* Zone 1: Single wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
            RS
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-white whitespace-nowrap">
              RSMSSB LDC Skill Portal
            </span>
            <div className="text-[11px] text-slate-400 font-mono -mt-0.5">
              Phase-II (100 Marks · 100+ Passages)
            </div>
          </div>
        </div>

        {/* Zone 2: Single-line navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          <button
            onClick={() => setCurrentTab('exam')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'exam' ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Official Exam</span>
          </button>

          <button
            onClick={() => setCurrentTab('drills')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'drills' ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Speed Drills</span>
          </button>

          <button
            onClick={() => setCurrentTab('efficiency')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'efficiency' ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Efficiency Lab</span>
          </button>

          <button
            onClick={onOpenPassagesBank}
            className="text-slate-300 hover:text-white whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <Library className="w-4 h-4 text-emerald-400" />
            <span>100+ Passages</span>
          </button>

          <button
            onClick={() => setCurrentTab('keyboard')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentTab === 'keyboard' ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>DevLys 010 Map</span>
          </button>

          <button
            onClick={onOpenGuidelines}
            className="text-slate-300 hover:text-white whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Official Rules</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartFullExam}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isExamRunning ? 'Return to Exam' : 'Start Full Mock (100 M)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
