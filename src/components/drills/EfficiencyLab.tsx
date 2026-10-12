import React, { useState } from 'react';
import { EfficiencyTestRunner } from '../exam/EfficiencyTestRunner';
import { ExcelEfficiencyRunner } from '../exam/ExcelEfficiencyRunner';
import { EfficiencyTestResult, CandidateInfo, DocumentState, ExcelSpreadsheetState } from '../../types/exam';
import { Award, CheckCircle, RotateCcw, FileText, FileSpreadsheet } from 'lucide-react';

export const EfficiencyLab: React.FC = () => {
  const [software, setSoftware] = useState<'word' | 'excel'>('word');
  const [lang, setLang] = useState<'hindi_efficiency' | 'english_efficiency'>('hindi_efficiency');
  const [lastResult, setLastResult] = useState<EfficiencyTestResult | null>(null);
  const [sessionKey, setSessionKey] = useState(1);

  const candidate: CandidateInfo = {
    rollNo: '740732',
    name: 'CANDIDATE',
    testId: '3',
    category: 'General/OBC',
    systemNo: 'C-042',
  };

  const handleFinishWord = (result: EfficiencyTestResult, state: DocumentState) => {
    setLastResult(result);
  };

  const handleFinishExcel = (result: EfficiencyTestResult, state: ExcelSpreadsheetState) => {
    setLastResult(result);
  };

  const handleReset = () => {
    setLastResult(null);
    setSessionKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            दक्षता प्रयोगशाला (Efficiency Lab - MS Word &amp; MS Excel 2013)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            आधिकारिक 15 दक्षता प्रश्नों का वास्तविक MS Word एवं Excel सिमुलेटर पर अभ्यास करें
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Software Mode Selector */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden text-xs font-semibold">
            <button
              onClick={() => {
                setSoftware('word');
                handleReset();
              }}
              className={`px-3 py-2 flex items-center gap-1.5 transition-colors ${
                software === 'word'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>MS Word 2013</span>
            </button>
            <button
              onClick={() => {
                setSoftware('excel');
                handleReset();
              }}
              className={`px-3 py-2 flex items-center gap-1.5 transition-colors ${
                software === 'excel'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>MS Excel 2013</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden text-xs font-semibold">
            <button
              onClick={() => {
                setLang('hindi_efficiency');
                handleReset();
              }}
              className={`px-3 py-2 transition-colors ${
                lang === 'hindi_efficiency'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => {
                setLang('english_efficiency');
                handleReset();
              }}
              className={`px-3 py-2 transition-colors ${
                lang === 'english_efficiency'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {lastResult && (
        <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="font-bold text-sm text-emerald-950">
                दक्षता मूल्यांकन पूर्ण (Evaluation Completed)
              </h3>
              <p className="text-xs text-emerald-800">
                आपने <strong>{lastResult.completedTasksCount} / {lastResult.totalTasksCount}</strong> कार्य सफलतापूर्वक पूर्ण किए ({software.toUpperCase()} Mode)।
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl font-bold font-mono text-emerald-900">
              {lastResult.marksObtained.toFixed(2)} / 25.0 Marks
            </div>
            <span
              className={`text-xs font-semibold ${
                lastResult.isQualified ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {lastResult.isQualified ? 'अर्हक अंक (≥9.0) प्राप्त' : 'न्यूनतम अर्हता 9.0 से कम'}
            </span>
          </div>
        </div>
      )}

      {/* Render selected runner */}
      {software === 'word' ? (
        <EfficiencyTestRunner
          key={`word-${sessionKey}`}
          paperType={lang}
          durationMinutes={10}
          candidate={candidate}
          onFinishTest={handleFinishWord}
        />
      ) : (
        <ExcelEfficiencyRunner
          key={`excel-${sessionKey}`}
          paperType={lang}
          durationMinutes={10}
          candidate={candidate}
          onFinishTest={handleFinishExcel}
        />
      )}
    </div>
  );
};
