import React, { useState } from 'react';
import { CandidateInfo } from '../../types/exam';

interface LoginScreenProps {
  candidate: CandidateInfo;
  setCandidate: React.Dispatch<React.SetStateAction<CandidateInfo>>;
  onLogin: () => void;
  onPeripheralCheck: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  candidate,
  setCandidate,
  onLogin,
  onPeripheralCheck,
}) => {
  const [password, setPassword] = useState('123456');
  const [hasAgreed, setHasAgreed] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate.rollNo.trim()) {
      setErrorMessage('कृपया मान्य Roll No दर्ज करें।');
      return;
    }
    if (!hasAgreed) {
      setErrorMessage('कृपया दिशानिर्देशों की सहमति चेकबॉक्स पर टिक करें।');
      return;
    }
    setErrorMessage('');
    onLogin();
  };

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden font-sans">
      {/* Top Banner */}
      <div className="bg-slate-800 text-white py-3 px-6 text-center border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wide">
          राजस्थान कर्मचारी चयन बोर्ड, जयपुर (RSMSSB)
        </h1>
        <p className="text-xs text-slate-300">
          लिपिक ग्रेड-II / कनिष्ठ सहायक सीधी भर्ती परीक्षा (Phase-II)
        </p>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Login</h2>

        <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto">
          {errorMessage && (
            <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200 text-center">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center gap-4">
            <label className="w-28 text-sm font-semibold text-slate-700 text-right">
              User Id :
            </label>
            <input
              type="text"
              value={candidate.rollNo}
              onChange={(e) => setCandidate({ ...candidate, rollNo: e.target.value })}
              className="flex-1 px-3 py-1.5 border border-slate-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-sm font-mono"
              placeholder="e.g. 740732"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-28 text-sm font-semibold text-slate-700 text-right">
              Password :
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-sm font-mono"
            />
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <input
              type="checkbox"
              id="guidelines-agree"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="guidelines-agree" className="text-xs text-slate-700 select-none cursor-pointer">
              I have read below mentioned guidelines
            </label>
          </div>

          <div className="flex items-center justify-center gap-4 pt-3">
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-white bg-slate-700 hover:bg-slate-800 rounded shadow-sm transition-colors uppercase tracking-wider"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={onPeripheralCheck}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-600 hover:bg-slate-700 rounded shadow-sm transition-colors uppercase tracking-wider"
            >
              Peripheral Check
            </button>
          </div>
        </form>

        {/* Official Guidelines Box matching Screen 1 */}
        <div className="mt-8 border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
          <div className="bg-slate-200 px-4 py-2 border-b border-slate-300 font-bold text-xs text-slate-800">
            Guidelines:
          </div>
          <div className="p-4 max-h-48 overflow-y-auto text-xs text-slate-700 space-y-2">
            <p>• The Clock has been set to the server time.</p>
            <p>• You have to type the content of speed test in given space only.</p>
            <p>• No formatting or any type of line spacing is required in the speed test.</p>
            <p>• Notified Font is already selected by the software, so font change is not allowed in speed test.</p>
            <p>• Backspace will work ONLY for the active word until Enter/Space-Bar is pressed.</p>
            <p>• Candidates must obtain at least 9 marks (36%) in each of the 4 papers to qualify.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
