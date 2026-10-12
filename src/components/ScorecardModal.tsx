import React from 'react';
import { FullExamScorecard } from '../types/exam';
import { X, Award, CheckCircle, AlertOctagon, Printer, RotateCcw, AlertTriangle } from 'lucide-react';

interface ScorecardModalProps {
  isOpen: boolean;
  scorecard: FullExamScorecard;
  onClose: () => void;
  onRestart: () => void;
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({
  isOpen,
  scorecard,
  onClose,
  onRestart,
}) => {
  if (!isOpen) return null;

  const p1 = scorecard.paper1HindiSpeed;
  const p2 = scorecard.paper2EnglishSpeed;
  const p3 = scorecard.paper3HindiEfficiency;
  const p4 = scorecard.paper4EnglishEfficiency;

  const totalMarks = (
    (p1?.marksObtained || 0) +
    (p2?.marksObtained || 0) +
    (p3?.marksObtained || 0) +
    (p4?.marksObtained || 0)
  ).toFixed(2);

  const isAllQualified =
    (p1?.isQualified ?? false) &&
    (p2?.isQualified ?? false) &&
    (p3?.isQualified ?? false) &&
    (p4?.isQualified ?? false);

  const allWarnings = [
    ...(p1?.keystrokeWarnings || []),
    ...(p2?.keystrokeWarnings || []),
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-400" />
            <div>
              <h2 className="text-base font-bold">
                RSMSSB LDC Phase-II Official Examination Result Card
              </h2>
              <p className="text-xs text-slate-300">
                लिपिक ग्रेड-II / कनिष्ठ सहायक परीक्षा अंक तालिका (100 अंक)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-800">
          {/* Candidate Profile Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Candidate Name</span>
              <strong className="text-slate-900 text-sm font-semibold">
                {scorecard.candidate.name || 'DEMO CANDIDATE'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Roll Number</span>
              <strong className="text-slate-900 text-sm font-mono font-semibold">
                {scorecard.candidate.rollNo || '740732'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Exam Category</span>
              <strong className="text-slate-900 text-sm font-semibold">
                {scorecard.candidate.category}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Overall Status</span>
              <span
                className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded ${
                  isAllQualified
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isAllQualified ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertOctagon className="w-3.5 h-3.5" />}
                {isAllQualified ? 'QUALIFIED (उत्तीर्ण)' : 'NOT QUALIFIED (अनुत्तीर्ण)'}
              </span>
            </div>
          </div>

          {/* Detailed Paper by Paper Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">पेपर / विषय</th>
                  <th className="p-3">गति (Gross / Net WPM)</th>
                  <th className="p-3">शुद्धता (Accuracy)</th>
                  <th className="p-3">कुल शब्द / टास्क</th>
                  <th className="p-3 text-right">प्राप्तांक (Max 25)</th>
                  <th className="p-3 text-center">स्थिति (Cutoff: 9.0)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Paper 1 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">
                    Paper 1: हिन्दी टंकण गति (DevLys 010)
                  </td>
                  <td className="p-3 font-mono">
                    {p1 ? `${p1.grossWpm} / ${p1.netWpm} WPM` : 'N/A'}
                  </td>
                  <td className="p-3 font-mono">
                    {p1 ? `${p1.accuracyPercentage}%` : 'N/A'}
                  </td>
                  <td className="p-3">
                    {p1 ? `${p1.correctWordsCount} / ${p1.totalWordsTarget} शब्द` : 'N/A'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-blue-700 text-sm">
                    {p1 ? p1.marksObtained.toFixed(2) : '0.00'}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        p1?.isQualified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p1?.isQualified ? 'Pass' : 'Fail (<9.0)'}
                    </span>
                  </td>
                </tr>

                {/* Paper 2 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">
                    Paper 2: अंग्रेजी टंकण गति (English Speed)
                  </td>
                  <td className="p-3 font-mono">
                    {p2 ? `${p2.grossWpm} / ${p2.netWpm} WPM` : 'N/A'}
                  </td>
                  <td className="p-3 font-mono">
                    {p2 ? `${p2.accuracyPercentage}%` : 'N/A'}
                  </td>
                  <td className="p-3">
                    {p2 ? `${p2.correctWordsCount} / ${p2.totalWordsTarget} शब्द` : 'N/A'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-blue-700 text-sm">
                    {p2 ? p2.marksObtained.toFixed(2) : '0.00'}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        p2?.isQualified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p2?.isQualified ? 'Pass' : 'Fail (<9.0)'}
                    </span>
                  </td>
                </tr>

                {/* Paper 3 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">
                    Paper 3: हिन्दी दक्षता परीक्षा ({p3?.softwareMode === 'excel' ? 'MS Excel' : 'MS Word'})
                  </td>
                  <td className="p-3 text-slate-500 font-mono">-</td>
                  <td className="p-3 text-slate-500 font-mono">-</td>
                  <td className="p-3">
                    {p3 ? `${p3.completedTasksCount} / ${p3.totalTasksCount} टास्क` : 'N/A'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-blue-700 text-sm">
                    {p3 ? p3.marksObtained.toFixed(2) : '0.00'}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        p3?.isQualified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p3?.isQualified ? 'Pass' : 'Fail (<9.0)'}
                    </span>
                  </td>
                </tr>

                {/* Paper 4 */}
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">
                    Paper 4: अंग्रेजी दक्षता परीक्षा ({p4?.softwareMode === 'excel' ? 'MS Excel' : 'MS Word'})
                  </td>
                  <td className="p-3 text-slate-500 font-mono">-</td>
                  <td className="p-3 text-slate-500 font-mono">-</td>
                  <td className="p-3">
                    {p4 ? `${p4.completedTasksCount} / ${p4.totalTasksCount} टास्क` : 'N/A'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-blue-700 text-sm">
                    {p4 ? p4.marksObtained.toFixed(2) : '0.00'}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        p4?.isQualified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p4?.isQualified ? 'Pass' : 'Fail (<9.0)'}
                    </span>
                  </td>
                </tr>

                {/* Grand Total Row */}
                <tr className="bg-slate-100 font-bold">
                  <td colSpan={4} className="p-3 text-slate-900 text-sm text-right">
                    Grand Total Marks (कुल प्राप्तांक out of 100):
                  </td>
                  <td className="p-3 text-right text-base text-blue-800 font-mono">
                    {totalMarks} / 100.0
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        isAllQualified
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {isAllQualified ? 'QUALIFIED' : 'DISQUALIFIED'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Keystroke Warnings / Audit */}
          {allWarnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  आधिकारिक कीस्ट्रोक / मात्रा त्रुटि ऑडिट (Page 2 Redundant Keystroke Report):
                </span>
              </div>
              <ul className="text-xs text-amber-800 space-y-1 list-disc pl-5">
                {allWarnings.map((w, i) => (
                  <li key={i}>{w.description}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Official Evaluation Footnote */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-blue-900">
              बोर्ड नियम मूल्यांकन टिप्पणी (Official RSSB Evaluation Criteria):
            </div>
            <p>
              1. अभ्यर्थी को चारों प्रश्न पत्रों में पृथक-पृथक न्यूनतम 9 अंक (36%) प्राप्त करना अनिवार्य है। किसी भी एक पेपर में 9 से कम अंक होने पर संपूर्ण परीक्षा में अनुत्तीर्ण माना जाएगा।
            </p>
            <p>
              2. हिन्दी टंकण में 400 शब्द (0.0625 अंक प्रति सही शब्द) तथा अंग्रेजी में 500 शब्द (0.05 अंक प्रति सही शब्द) के आधार पर गणना की गई है।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <button
            onClick={onRestart}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Mock Test</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Scorecard</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
