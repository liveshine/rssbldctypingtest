import React, { useState } from 'react';
import { Header } from './components/Header';
import { GuidelinesModal } from './components/GuidelinesModal';
import { ScorecardModal } from './components/ScorecardModal';
import { PassagesBankModal } from './components/PassagesBankModal';
import { KeyboardVisualizer } from './components/KeyboardVisualizer';
import { SpeedDrillArena } from './components/drills/SpeedDrillArena';
import { EfficiencyLab } from './components/drills/EfficiencyLab';
import { OfflineIndicator } from './components/OfflineIndicator';

// Official Exam Flow screens
import { LoginScreen } from './components/exam/LoginScreen';
import { PeripheralCheckScreen } from './components/exam/PeripheralCheckScreen';
import { SpeedTestRunner } from './components/exam/SpeedTestRunner';
import { PreviewAndConfirmationScreen } from './components/exam/PreviewAndConfirmationScreen';
import { EfficiencyTestRunner } from './components/exam/EfficiencyTestRunner';
import { ExcelEfficiencyRunner } from './components/exam/ExcelEfficiencyRunner';
import { EfficiencyConfirmScreen } from './components/exam/EfficiencyConfirmScreen';
import { FinalUploadScreen } from './components/exam/FinalUploadScreen';

import {
  CandidateInfo,
  ExamFlowPhase,
  FullExamScorecard,
  SpeedTestResult,
  EfficiencyTestResult,
  DocumentState,
  ExcelSpreadsheetState,
} from './types/exam';
import {
  INITIAL_HINDI_DOC_STATE,
  INITIAL_EXCEL_STATE,
} from './data/officialData';
import {
  getNextPassage,
  HINDI_PASSAGES_BANK,
  ENGLISH_PASSAGES_BANK,
  PassageItem,
} from './data/passagesBank';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'exam' | 'drills' | 'efficiency' | 'keyboard' | 'guidelines'>('exam');
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [isPassagesBankOpen, setIsPassagesBankOpen] = useState(false);

  // Candidate Information
  const [candidate, setCandidate] = useState<CandidateInfo>({
    rollNo: '740732',
    name: 'DEEPAK SHARMA',
    testId: '3',
    category: 'General/OBC',
    systemNo: 'C-042',
  });

  // Official Exam Sequence Phase
  const [examPhase, setExamPhase] = useState<ExamFlowPhase>('login');
  const [efficiencySoftware, setEfficiencySoftware] = useState<'word' | 'excel'>('word');

  // Dynamic Exam Passages picked fresh every session from 100+ bank
  const [activeHindiPassage, setActiveHindiPassage] = useState<PassageItem>(HINDI_PASSAGES_BANK[0]);
  const [activeEnglishPassage, setActiveEnglishPassage] = useState<PassageItem>(ENGLISH_PASSAGES_BANK[0]);

  // Stored Session Results
  const [paper1Result, setPaper1Result] = useState<SpeedTestResult | undefined>(undefined);
  const [paper2Result, setPaper2Result] = useState<SpeedTestResult | undefined>(undefined);
  const [paper3Result, setPaper3Result] = useState<EfficiencyTestResult | undefined>(undefined);
  const [paper4Result, setPaper4Result] = useState<EfficiencyTestResult | undefined>(undefined);

  // Stored Snapshots for Confirmation Screen Preview
  const [savedDocState, setSavedDocState] = useState<DocumentState>(INITIAL_HINDI_DOC_STATE);
  const [savedExcelState, setSavedExcelState] = useState<ExcelSpreadsheetState>(INITIAL_EXCEL_STATE);

  // Composite Scorecard
  const scorecard: FullExamScorecard = {
    candidate,
    paper1HindiSpeed: paper1Result,
    paper2EnglishSpeed: paper2Result,
    paper3HindiEfficiency: paper3Result,
    paper4EnglishEfficiency: paper4Result,
    totalMarksObtained: Number(
      (
        (paper1Result?.marksObtained || 0) +
        (paper2Result?.marksObtained || 0) +
        (paper3Result?.marksObtained || 0) +
        (paper4Result?.marksObtained || 0)
      ).toFixed(2)
    ),
    isOverallQualified: Boolean(
      paper1Result?.isQualified &&
      paper2Result?.isQualified &&
      paper3Result?.isQualified &&
      paper4Result?.isQualified
    ),
    completedAt: new Date().toLocaleDateString('hi-IN'),
  };

  const startNewExamSession = () => {
    // Pick fresh unseen passages every time!
    const newHindi = getNextPassage('hindi');
    const newEnglish = getNextPassage('english');
    setActiveHindiPassage(newHindi);
    setActiveEnglishPassage(newEnglish);

    setPaper1Result(undefined);
    setPaper2Result(undefined);
    setPaper3Result(undefined);
    setPaper4Result(undefined);
    setCurrentTab('exam');
    setExamPhase('login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
        onOpenPassagesBank={() => setIsPassagesBankOpen(true)}
        onStartFullExam={startNewExamSession}
        isExamRunning={examPhase !== 'login'}
      />

      {/* Main App Container */}
      <main className="flex-1 pb-12">
        {/* TAB 1: Official Exam Flow Sequence */}
        {currentTab === 'exam' && (
          <div className="px-4 py-2">
            {/* Phase 1: Login Screen (Screen 1) */}
            {examPhase === 'login' && (
              <LoginScreen
                candidate={candidate}
                setCandidate={setCandidate}
                onLogin={() => setExamPhase('paper_1_speed')}
                onPeripheralCheck={() => setExamPhase('peripheral_check')}
              />
            )}

            {/* Phase 2: Peripheral Check (Screen 2) */}
            {examPhase === 'peripheral_check' && (
              <PeripheralCheckScreen
                onComplete={() => setExamPhase('paper_1_speed')}
              />
            )}

            {/* Phase 3: Paper 1 - Hindi Typing Speed Test (Screen 3) */}
            {examPhase === 'paper_1_speed' && (
              <SpeedTestRunner
                paperType="hindi_speed"
                passageTitle={activeHindiPassage.title}
                passageText={activeHindiPassage.text}
                durationMinutes={10}
                candidate={candidate}
                onSwitchPassage={() => {
                  const next = getNextPassage('hindi', activeHindiPassage.id);
                  setActiveHindiPassage(next);
                }}
                onFinishTest={(res) => {
                  setPaper1Result(res);
                  setExamPhase('paper_1_preview');
                }}
              />
            )}

            {/* Phase 4: Paper 1 - Preview & Confirmation Screen (Screen 4 & 5) */}
            {examPhase === 'paper_1_preview' && (
              <PreviewAndConfirmationScreen
                candidate={candidate}
                paperTitle="Hindi Typing Speed Test"
                typedContent={paper1Result?.typedContent || ''}
                onConfirm={() => setExamPhase('paper_2_speed')}
              />
            )}

            {/* Phase 5: Paper 2 - English Typing Speed Test (Screen 3) */}
            {examPhase === 'paper_2_speed' && (
              <SpeedTestRunner
                paperType="english_speed"
                passageTitle={activeEnglishPassage.title}
                passageText={activeEnglishPassage.text}
                durationMinutes={10}
                candidate={candidate}
                onSwitchPassage={() => {
                  const next = getNextPassage('english', activeEnglishPassage.id);
                  setActiveEnglishPassage(next);
                }}
                onFinishTest={(res) => {
                  setPaper2Result(res);
                  setExamPhase('paper_2_preview');
                }}
              />
            )}

            {/* Phase 6: Paper 2 - Preview & Confirmation Screen */}
            {examPhase === 'paper_2_preview' && (
              <PreviewAndConfirmationScreen
                candidate={candidate}
                paperTitle="English Typing Speed Test"
                typedContent={paper2Result?.typedContent || ''}
                onConfirm={() => setExamPhase('paper_3_efficiency')}
              />
            )}

            {/* Phase 7: Paper 3 - Hindi Efficiency Test (Screen 7: MS Word or MS Excel) */}
            {examPhase === 'paper_3_efficiency' && (
              <div className="space-y-3">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between bg-white px-4 py-2.5 rounded-lg border border-slate-300 text-xs">
                  <div className="text-slate-700">
                    <strong>पेपर 3: हिन्दी दक्षता परीक्षा</strong> · सॉफ्टवेयर चुनें (MS Word 2013 अथवा MS Excel 2013):
                  </div>
                  <div className="flex items-center gap-1 border border-slate-300 rounded overflow-hidden">
                    <button
                      onClick={() => setEfficiencySoftware('word')}
                      className={`px-3 py-1 font-semibold transition-colors ${
                        efficiencySoftware === 'word' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      MS Word 2013
                    </button>
                    <button
                      onClick={() => setEfficiencySoftware('excel')}
                      className={`px-3 py-1 font-semibold transition-colors ${
                        efficiencySoftware === 'excel' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      MS Excel 2013
                    </button>
                  </div>
                </div>

                {efficiencySoftware === 'word' ? (
                  <EfficiencyTestRunner
                    paperType="hindi_efficiency"
                    durationMinutes={10}
                    candidate={candidate}
                    onFinishTest={(res, doc) => {
                      setPaper3Result(res);
                      setSavedDocState(doc);
                      setExamPhase('paper_3_confirm');
                    }}
                  />
                ) : (
                  <ExcelEfficiencyRunner
                    paperType="hindi_efficiency"
                    durationMinutes={10}
                    candidate={candidate}
                    onFinishTest={(res, xl) => {
                      setPaper3Result(res);
                      setSavedExcelState(xl);
                      setExamPhase('paper_3_confirm');
                    }}
                  />
                )}
              </div>
            )}

            {/* Phase 8: Paper 3 - Dedicated Efficiency Confirmation Screen (Screenshot 7 / Page 8) */}
            {examPhase === 'paper_3_confirm' && (
              <EfficiencyConfirmScreen
                candidate={candidate}
                paperTitle="हिन्दी दक्षता परीक्षा (Hindi Efficiency)"
                softwareMode={efficiencySoftware}
                docState={savedDocState}
                excelState={savedExcelState}
                onConfirm={() => setExamPhase('paper_4_efficiency')}
              />
            )}

            {/* Phase 9: Paper 4 - English Efficiency Test */}
            {examPhase === 'paper_4_efficiency' && (
              <div className="space-y-3">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between bg-white px-4 py-2.5 rounded-lg border border-slate-300 text-xs">
                  <div className="text-slate-700">
                    <strong>Paper 4: English Efficiency Exam</strong> · Select Software (MS Word or MS Excel 2013):
                  </div>
                  <div className="flex items-center gap-1 border border-slate-300 rounded overflow-hidden">
                    <button
                      onClick={() => setEfficiencySoftware('word')}
                      className={`px-3 py-1 font-semibold transition-colors ${
                        efficiencySoftware === 'word' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      MS Word 2013
                    </button>
                    <button
                      onClick={() => setEfficiencySoftware('excel')}
                      className={`px-3 py-1 font-semibold transition-colors ${
                        efficiencySoftware === 'excel' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      MS Excel 2013
                    </button>
                  </div>
                </div>

                {efficiencySoftware === 'word' ? (
                  <EfficiencyTestRunner
                    paperType="english_efficiency"
                    durationMinutes={10}
                    candidate={candidate}
                    onFinishTest={(res, doc) => {
                      setPaper4Result(res);
                      setSavedDocState(doc);
                      setExamPhase('paper_4_confirm');
                    }}
                  />
                ) : (
                  <ExcelEfficiencyRunner
                    paperType="english_efficiency"
                    durationMinutes={10}
                    candidate={candidate}
                    onFinishTest={(res, xl) => {
                      setPaper4Result(res);
                      setSavedExcelState(xl);
                      setExamPhase('paper_4_confirm');
                    }}
                  />
                )}
              </div>
            )}

            {/* Phase 10: Paper 4 - Efficiency Confirmation Screen */}
            {examPhase === 'paper_4_confirm' && (
              <EfficiencyConfirmScreen
                candidate={candidate}
                paperTitle="English Efficiency Exam"
                softwareMode={efficiencySoftware}
                docState={savedDocState}
                excelState={savedExcelState}
                onConfirm={() => setExamPhase('final_upload')}
              />
            )}

            {/* Phase 11: Final Uploading Screen (Screen 8) */}
            {examPhase === 'final_upload' && (
              <FinalUploadScreen
                candidate={candidate}
                scorecard={scorecard}
                onViewScorecard={() => setIsScorecardOpen(true)}
                onRestartExam={startNewExamSession}
              />
            )}
          </div>
        )}

        {/* TAB 2: Speed Drills Arena */}
        {currentTab === 'drills' && <SpeedDrillArena />}

        {/* TAB 3: Word & Excel 2013 Efficiency Lab */}
        {currentTab === 'efficiency' && <EfficiencyLab />}

        {/* TAB 4: DevLys 010 Keyboard Map */}
        {currentTab === 'keyboard' && (
          <div className="max-w-6xl mx-auto px-4 py-6">
            <KeyboardVisualizer />
          </div>
        )}
      </main>

      {/* 100+ Passages Bank Browser Modal */}
      <PassagesBankModal
        isOpen={isPassagesBankOpen}
        onClose={() => setIsPassagesBankOpen(false)}
        onSelectPassage={(p) => {
          if (p.language === 'hindi') {
            setActiveHindiPassage(p);
          } else {
            setActiveEnglishPassage(p);
          }
          setCurrentTab('drills');
        }}
      />

      {/* Official Guidelines Modal */}
      <GuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      {/* Official Scorecard Modal */}
      <ScorecardModal
        isOpen={isScorecardOpen}
        scorecard={scorecard}
        onClose={() => setIsScorecardOpen(false)}
        onRestart={startNewExamSession}
      />

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />
    </div>
  );
}
