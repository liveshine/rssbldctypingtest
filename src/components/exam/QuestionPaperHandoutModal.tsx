import React from 'react';
import { EfficiencyTask, CandidateInfo } from '../../types/exam';
import { X, Printer, FileText, CheckCircle2 } from 'lucide-react';

interface QuestionPaperHandoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: EfficiencyTask[];
  candidate: CandidateInfo;
  paperTitle: string;
}

export const QuestionPaperHandoutModal: React.FC<QuestionPaperHandoutModalProps> = ({
  isOpen,
  onClose,
  tasks,
  candidate,
  paperTitle,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300 font-serif">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between font-sans">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">
              आधिकारिक दक्षता प्रश्न पत्र (Official Physical Question Paper Handout)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Handout</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Sheet Content */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-900 bg-amber-50/20">
          {/* Header matching official Rajasthan Staff Selection Board Paper */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <h1 className="text-xl font-bold tracking-wide">
              राजस्थान कर्मचारी चयन बोर्ड, जयपुर
            </h1>
            <h2 className="text-sm font-semibold text-slate-700 mt-0.5">
              लिपिक ग्रेड-II / कनिष्ठ सहायक संयुक्त सीधी भर्ती परीक्षा (Phase-II)
            </h2>
            <div className="text-xs font-bold text-blue-900 mt-1 uppercase font-sans">
              दक्षता परीक्षण प्रश्न पत्र ({paperTitle})
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-sans mt-3 border-t border-slate-300 pt-2 text-slate-700">
              <div>
                समय: <strong>10 मिनट</strong>
              </div>
              <div>
                पूर्णांक: <strong>25 अंक</strong>
              </div>
              <div>
                न्यूनतम अर्हक अंक: <strong>9 अंक (36%)</strong>
              </div>
            </div>
          </div>

          {/* Candidate Info Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans bg-slate-50 p-3 rounded border border-slate-300">
            <div>
              अभ्यर्थी का नाम: <strong>{candidate.name}</strong>
            </div>
            <div>
              रोल नंबर: <strong className="font-mono">{candidate.rollNo}</strong>
            </div>
            <div>
              सिस्टम संख्या: <strong>{candidate.systemNo}</strong>
            </div>
            <div>
              परीक्षण आईडी: <strong>{candidate.testId}</strong>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="text-xs bg-slate-100 p-3 rounded border border-slate-200 font-sans leading-relaxed text-slate-700">
            <strong>महत्वपूर्ण निर्देश:</strong> कंप्यूटर स्क्रीन पर उपलब्ध दस्तावेज़ में दिए गए 15 प्रश्नों के अनुसार ही फॉर्मेटिंग करें। पूछे गए कार्य के अतिरिक्त अन्य कोई अनधिकृत बदलाव अथवा टेक्स्ट डिलीट न करें। कट-कॉपी-पेस्ट व राइट क्लिक पूर्णतः प्रतिबंधित है।
          </div>

          {/* Questions List */}
          <div className="space-y-3 font-sans">
            <h3 className="text-sm font-bold border-b border-slate-300 pb-1 text-slate-800">
              प्रश्न सूची (Tasks List):
            </h3>

            <div className="space-y-2.5">
              {tasks.map((t, idx) => (
                <div
                  key={t.id}
                  className={`p-3 rounded border text-xs flex items-start justify-between gap-3 ${
                    t.isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900">
                      {t.instructionHindi}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {t.instructionEnglish}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="font-mono font-bold text-blue-800">
                      [{t.marks} अंक]
                    </span>
                    {t.isCompleted && (
                      <span className="flex items-center gap-0.5 text-emerald-700 text-[10px] font-bold mt-0.5 justify-end">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>पूर्ण</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Invigilator Signature Section matching Page 2 */}
          <div className="pt-6 border-t-2 border-dashed border-slate-400 flex justify-between items-end text-xs font-sans text-slate-700">
            <div>
              <div className="w-40 border-b border-slate-700 mb-1" />
              <span>परीक्षार्थी के हस्ताक्षर (Candidate Signature)</span>
            </div>

            <div className="text-right">
              <div className="w-40 border-b border-slate-700 mb-1 ml-auto" />
              <span>वीक्षक के हस्ताक्षर (Invigilator Signature)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-2.5 flex justify-end font-sans">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
