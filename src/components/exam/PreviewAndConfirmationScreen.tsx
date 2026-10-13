import React, { useState, useEffect } from 'react';
import { CandidateInfo } from '../../types/exam';

interface PreviewAndConfirmationScreenProps {
  candidate: CandidateInfo;
  paperTitle: string;
  typedContent: string;
  onConfirm: () => void;
}

export const PreviewAndConfirmationScreen: React.FC<PreviewAndConfirmationScreenProps> = ({
  candidate,
  paperTitle,
  typedContent,
  onConfirm,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(54); // 00:00:54 matching Screenshot 5
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
    <div className="w-full max-w-5xl mx-auto my-4 font-sans select-text">
      {/* Top Details & Preview Header matching Screenshot 4 */}
      <div className="bg-white border-2 border-slate-300 p-6 shadow-md rounded mb-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 text-xs text-slate-700">
          <div className="flex items-center gap-6">
            <div>
              Roll No. : <strong className="font-mono text-slate-900">{candidate.rollNo || '000000'}</strong>
            </div>
            <div>
              Name : <strong className="text-slate-900">{candidate.name || 'XXXX XXXX'}</strong>
            </div>
          </div>

          <div className="text-right">
            <span>Remaining Time : </span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {formatTimer(secondsLeft)}
            </span>
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-xl font-serif font-bold text-slate-800">
            {paperTitle} Preview
          </h2>
          <div className="text-sm font-serif font-semibold text-slate-600">
            {paperTitle.includes('Hindi') ? 'हिन्दी टंकित सामग्री पूर्वावलोकन' : 'English Typed Content Preview'}
          </div>
        </div>

        {/* Read-Only Typed Content Box matching Screenshot 4 */}
        <div className="border border-slate-400 p-5 min-h-[140px] max-h-56 overflow-y-auto text-sm leading-relaxed text-slate-800 bg-slate-50 font-serif rounded-xs">
          {typedContent ? (
            typedContent
          ) : (
            <span className="text-slate-400 italic">
              (कोई सामग्री टंकित नहीं की गई)
            </span>
          )}
        </div>
      </div>

      {/* Confirmation Box matching Screenshot 5 */}
      <div className="border-2 border-slate-400 bg-white p-6 shadow-md rounded max-w-2xl mx-auto space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-serif font-bold tracking-wider text-slate-800 border-b border-slate-200 pb-1">
            CONFIRMATION
          </h3>
        </div>

        <div className="text-center text-xs text-slate-600 space-y-0.5">
          <p>Please enter your password and confirm your typed content.</p>
          <p className="italic text-slate-500 font-semibold">Note : Here editing is not permitted.</p>
        </div>

        {errorMsg && (
          <div className="text-xs text-red-600 text-center font-semibold bg-red-50 p-1.5 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleApprove} className="space-y-4 pt-2">
          <div className="flex items-center justify-center gap-4 text-xs">
            <span className="font-semibold text-slate-700">Enter Password :</span>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="px-2 py-1.5 border border-slate-500 rounded-xs text-sm font-mono w-44 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-1.5 bg-[#475569] hover:bg-[#334155] text-white font-bold rounded-xs text-xs uppercase tracking-wider border border-slate-600 shadow-xs"
            >
              Click To Approve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
