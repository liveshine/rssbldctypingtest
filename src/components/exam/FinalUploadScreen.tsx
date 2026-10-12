import React from 'react';
import { CandidateInfo, FullExamScorecard } from '../../types/exam';
import { CheckCircle2, Award, FileCheck } from 'lucide-react';

interface FinalUploadScreenProps {
  candidate: CandidateInfo;
  scorecard: FullExamScorecard;
  onViewScorecard: () => void;
  onRestartExam: () => void;
}

export const FinalUploadScreen: React.FC<FinalUploadScreenProps> = ({
  candidate,
  scorecard,
  onViewScorecard,
  onRestartExam,
}) => {
  return (
    <div className="max-w-3xl mx-auto my-8 bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-4 px-6 text-center border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wide">
          राजस्थान कर्मचारी चयन बोर्ड, जयपुर (RSMSSB)
        </h1>
        <p className="text-xs text-slate-300">
          कनिष्ठ सहायक / लिपिक ग्रेड-II संयुक्त सीधी भर्ती परीक्षा (Phase-II)
        </p>
      </div>

      <div className="p-8 space-y-8">
        {/* Candidate Details matching Screen 8 */}
        <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-4">
          <div>
            Name : <strong className="text-slate-900">{candidate.name || 'XXXX XXXX'}</strong>
          </div>
          <div>
            Roll No. : <strong className="font-mono text-slate-900">{candidate.rollNo || '000000'}</strong>
          </div>
        </div>

        {/* Upload Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Final Uploading Screen
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold text-base pt-1">
            <CheckCircle2 className="w-5 h-5" />
            <span>Your Files Uploaded Successfully</span>
          </div>
        </div>

        {/* 4 Papers Checklist matching Screen 8 */}
        <div className="max-w-md mx-auto bg-slate-50 border border-slate-300 rounded-xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Hindi Typing Speed Test (हिन्दी टंकण)</span>
            <span className="ml-auto text-xs font-mono text-blue-700 font-bold">
              {scorecard.paper1HindiSpeed?.marksObtained.toFixed(2)} / 25.0 M
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>English Typing Speed Test (अंग्रेजी टंकण)</span>
            <span className="ml-auto text-xs font-mono text-blue-700 font-bold">
              {scorecard.paper2EnglishSpeed?.marksObtained.toFixed(2)} / 25.0 M
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Hindi Efficiency Test (हिन्दी दक्षता)</span>
            <span className="ml-auto text-xs font-mono text-blue-700 font-bold">
              {scorecard.paper3HindiEfficiency?.marksObtained.toFixed(2)} / 25.0 M
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>English Efficiency Test (अंग्रेजी दक्षता)</span>
            <span className="ml-auto text-xs font-mono text-blue-700 font-bold">
              {scorecard.paper4EnglishEfficiency?.marksObtained.toFixed(2)} / 25.0 M
            </span>
          </div>
        </div>

        {/* Official Board Stamp & Signature matching Screen 8 */}
        <div className="text-center pt-4 border-t border-slate-200">
          <div className="font-serif italic text-2xl text-slate-700 tracking-wider mb-1 font-semibold select-none">
            Dr. B. C. Badhal
          </div>
          <div className="font-bold text-sm text-slate-900">
            (Dr. B. C. Badhal)
          </div>
          <div className="text-xs text-slate-600">Secretary</div>
          <div className="text-xs font-semibold text-slate-800">
            Rajasthan Staff Selection Board, Jaipur
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={onViewScorecard}
            className="px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors uppercase tracking-wider flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>View Detailed Scorecard (अंक तालिका)</span>
          </button>

          <button
            onClick={onRestartExam}
            className="px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors uppercase tracking-wider"
          >
            New Mock Session
          </button>
        </div>
      </div>
    </div>
  );
};
