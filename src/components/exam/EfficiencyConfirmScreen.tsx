import React, { useState, useEffect } from 'react';
import { CandidateInfo, DocumentState, ExcelSpreadsheetState } from '../../types/exam';

interface EfficiencyConfirmScreenProps {
  candidate: CandidateInfo;
  paperTitle: string;
  softwareMode: 'word' | 'excel';
  docState?: DocumentState;
  excelState?: ExcelSpreadsheetState;
  onConfirm: () => void;
}

export const EfficiencyConfirmScreen: React.FC<EfficiencyConfirmScreenProps> = ({
  candidate,
  paperTitle,
  softwareMode,
  docState,
  excelState,
  onConfirm,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(44); // 00:00:44 from screenshot
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (secondsLeft <= 0) {
      onConfirm();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onConfirm]);

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setErrorMsg('कृपया अनुमोदन हेतु पासवर्ड दर्ज करें।');
      return;
    }
    setErrorMsg('');
    onConfirm();
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `00:${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto my-2 font-sans select-none">
      {/* Top Title matching Screenshot 2026-10-12 9.41.38 PM.png */}
      <div className="text-center py-2">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 tracking-wide">
          हिन्दी दक्षता परीक्षा Confirmation Screen
        </h1>
      </div>

      {/* Confirmation Box matching Screenshot 2026-10-12 9.41.38 PM.png */}
      <div className="border-2 border-slate-400 bg-white shadow-md p-4 mb-3 max-w-4xl mx-auto rounded-xs">
        <h2 className="text-xl font-serif font-semibold text-slate-700 text-center mb-1">
          Efficiency Exam Confirmation Screen
        </h2>

        <div className="text-center text-xs text-slate-600 mb-3 space-y-0.5">
          <p>Please enter your password and confirm your work.</p>
          <p className="italic text-slate-500">Note : here editing is not permitted.</p>
        </div>

        {errorMsg && (
          <div className="text-center text-xs text-red-600 mb-2 font-semibold">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleApprove}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 pt-1"
        >
          <div className="flex items-center gap-1.5">
            <span>Remaining Time :</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {formatTimer(secondsLeft)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>Enter Password :</span>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="px-2 py-1 border border-slate-500 rounded-xs text-sm font-mono w-36 bg-white focus:outline-none"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="px-5 py-1 bg-[#475569] hover:bg-[#334155] text-white font-bold rounded-xs text-xs uppercase tracking-wider border border-slate-600 shadow-xs"
          >
            Confirm
          </button>
        </form>
      </div>

      {/* Document Canvas Preview underneath matching Screenshot */}
      <div className="bg-[#DFE2E8] border-2 border-[#8E97A6] rounded shadow-xl overflow-hidden">
        {/* Horizontal Ruler */}
        <div className="bg-[#EAECEF] border-b border-[#C2C7D0] h-6 flex items-center px-12 text-[10px] text-slate-500 font-mono">
          <div className="flex-1 flex justify-between px-8 relative">
            <span>1</span>
            <span>·</span>
            <span>2</span>
            <span>·</span>
            <span>3</span>
            <span>·</span>
            <span>4</span>
            <span>·</span>
            <span>5</span>
            <span>·</span>
            <span>6</span>
            <span>·</span>
            <span>7</span>
          </div>
        </div>

        {/* Paper Sheet Preview */}
        <div className="flex bg-[#8D96A5] min-h-[550px] max-h-[650px] overflow-y-auto">
          {/* Vertical Ruler on Left */}
          <div className="w-8 bg-[#EAECEF] border-r border-[#C2C7D0] shrink-0 flex flex-col justify-between py-12 text-[10px] text-slate-500 font-mono items-center select-none">
            <span>1</span>
            <span>·</span>
            <span>2</span>
            <span>·</span>
            <span>3</span>
            <span>·</span>
            <span>4</span>
            <span>·</span>
            <span>5</span>
          </div>

          <div className="flex-1 p-6 md:p-8 flex justify-center overflow-x-auto">
            <div className="bg-white shadow-2xl border border-slate-300 w-full max-w-3xl p-12 min-h-[650px] font-serif">
              {docState && (
                <>
                  <div
                    style={{
                      fontSize: `${docState.titleStyle.fontSize || 16}px`,
                      fontWeight: docState.titleStyle.bold ? 'bold' : 'normal',
                      fontStyle: docState.titleStyle.italic ? 'italic' : 'normal',
                      textDecoration: docState.titleStyle.underline ? 'underline' : 'none',
                      textAlign: docState.titleStyle.alignment || 'center',
                    }}
                    className="mb-6"
                  >
                    {docState.title}
                  </div>

                  <div className="space-y-4 text-justify">
                    {docState.paragraphs.map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: `${p.fontSize}px`,
                          fontWeight: p.bold ? 'bold' : 'normal',
                          fontStyle: p.italic ? 'italic' : 'normal',
                          textDecoration: p.strikethrough
                            ? 'line-through'
                            : p.underline
                            ? 'underline'
                            : 'none',
                          textAlign: p.alignment,
                          lineHeight: p.lineSpacing,
                          color: p.color,
                          backgroundColor:
                            p.highlightColor !== 'none' ? p.highlightColor : undefined,
                          paddingLeft: `${p.indentLeft}px`,
                        }}
                      >
                        {p.text}
                      </div>
                    ))}
                  </div>

                  {docState.table.hasTable && (
                    <div className="mt-6">
                      <table
                        className={`w-full text-xs text-left ${
                          docState.table.hasBorder ? 'border-collapse border border-slate-700' : ''
                        }`}
                      >
                        <thead>
                          <tr style={{ backgroundColor: docState.table.headerBackground }}>
                            {docState.table.cells[0].map((h, i) => (
                              <th key={i} className="p-2 font-bold border border-slate-700">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {docState.table.cells.slice(1).map((r, rIdx) => (
                            <tr key={rIdx}>
                              {r.map((c, cIdx) => (
                                <td key={cIdx} className="p-2 border border-slate-700">
                                  {c}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
