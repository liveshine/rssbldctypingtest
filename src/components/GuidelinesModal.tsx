import React from 'react';
import { X, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-300">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">राजस्थान कर्मचारी चयन बोर्ड, जयपुर (RSMSSB)</h2>
            <p className="text-xs text-slate-300">
              लिपिक ग्रेड-II / कनिष्ठ सहायक संयुक्त सीधी भर्ती परीक्षा - फेज-II दिशानिर्देश
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-800 leading-relaxed">
          {/* Summary Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-900 border-b border-slate-200">
              परीक्षा संरचना (4 भाग - कुल 100 अंक)
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">प्रश्न पत्र</th>
                  <th className="p-2.5">विषय</th>
                  <th className="p-2.5">समय</th>
                  <th className="p-2.5">अंक</th>
                  <th className="p-2.5">अर्हता हेतु न्यूनतम अंक (Passing)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-medium">1</td>
                  <td className="p-2.5">हिन्दी टंकण गति परीक्षण (Speed Test)</td>
                  <td className="p-2.5">10 मिनट</td>
                  <td className="p-2.5">25</td>
                  <td className="p-2.5 font-semibold text-blue-700">9 अंक (36%)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">2</td>
                  <td className="p-2.5">अंग्रेजी टंकण गति परीक्षण (Speed Test)</td>
                  <td className="p-2.5">10 मिनट</td>
                  <td className="p-2.5">25</td>
                  <td className="p-2.5 font-semibold text-blue-700">9 अंक (36%)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">3</td>
                  <td className="p-2.5">हिन्दी दक्षता परीक्षण (Efficiency Test - MS Word)</td>
                  <td className="p-2.5">10 मिनट</td>
                  <td className="p-2.5">25</td>
                  <td className="p-2.5 font-semibold text-blue-700">9 अंक (36%)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">4</td>
                  <td className="p-2.5">अंग्रेजी दक्षता परीक्षण (Efficiency Test - MS Word)</td>
                  <td className="p-2.5">10 मिनट</td>
                  <td className="p-2.5">25</td>
                  <td className="p-2.5 font-semibold text-blue-700">9 अंक (36%)</td>
                </tr>
              </tbody>
            </table>
            <div className="p-2.5 bg-amber-50 text-amber-900 text-[11px] border-t border-amber-200">
              * अनुसूचित जाति/अनुसूचित जनजाति (SC/ST) संवर्ग के अभ्यर्थियों को न्यूनतम अंकों में 5% छूट (शिथिलीकरण) उपलब्ध होगा।
            </div>
          </div>

          {/* Speed Test Guidelines */}
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              (क) टंकण गति परीक्षण नियम (Speed Test Rules)
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              <li>
                <strong>परिच्छेद शब्द सीमा:</strong> अंग्रेजी में 500 शब्द तथा हिन्दी में 400 शब्द दिए जाएंगे।
              </li>
              <li>
                <strong>अंकन पद्धति:</strong> अंग्रेजी में प्रत्येक सही शब्द पर <strong>0.05 अंक</strong> तथा हिन्दी में प्रत्येक सही शब्द पर <strong>0.0625 अंक</strong> निर्धारित होंगे।
              </li>
              <li>
                <strong>फॉन्ट नियम:</strong> अंग्रेजी के लिए प्रचलित फॉन्ट तथा हिन्दी टाइपिंग के लिए <strong>Standard की-बोर्ड एवं DevLys 010 फॉन्ट (Remington Layout)</strong> का प्रयोग किया जाएगा।
              </li>
              <li className="text-red-700 font-semibold bg-red-50 p-2 rounded border border-red-200">
                <AlertTriangle className="w-4 h-4 inline mr-1 text-red-600" />
                अत्यंत महत्वपूर्ण Back-Space नियम: टंकण गति परीक्षण में यदि किसी शब्द में गलती होती है, तो Back-Space का उपयोग केवल उसी शब्द को सुधारने के लिए किया जा सकता है, जब तक Enter/Space-Bar का उपयोग नहीं किया गया है। एक बार Space/Enter दबाने पर Back-Space पिछले शब्दों के लिए काम नहीं करेगा!
              </li>
              <li>
                गलत वर्ण, शब्द या अंक, छूटे हुए शब्द, अनुचित पुनरावृत्ति, गलत विराम चिन्ह, तथा अनावश्यक मात्राओं के अंक नहीं दिए जाएंगे।
              </li>
            </ul>
          </div>

          {/* Efficiency Test Guidelines */}
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              (ख) दक्षता परीक्षण नियम (Efficiency Test Rules)
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
              <li>
                दक्षता परीक्षण <strong>MS Word 2013 एवं MS Excel 2013</strong> में आयोजित किया जाता है।
              </li>
              <li>
                इसमें पैराग्राफ फॉर्मेटिंग, पेजिंग, हेडर-फुटर, फॉन्ट, टेबल बॉर्डर, स्पेसिंग, फाइंड व रिप्लेस इत्यादि से संबंधित <strong>15 अलग-अलग प्रश्न</strong> दिए जाते हैं।
              </li>
              <li>
                दक्षता परीक्षा के दौरान Cut-Copy-Paste, Right Mouse Click, Select All, तथा Function Keys (F1-F12) <strong>प्रतिबंधित</strong> रहेंगी।
              </li>
              <li>
                गलती सुधारने हेतु केवल <strong>Ctrl+Z (Undo)</strong> तथा Back-Space की अनुमति है।
              </li>
              <li>
                स्क्रीन पर पहले से उपलब्ध पैराग्राफ/टेबल में पूछे गए टास्क के अतिरिक्त कोई भी नया टेक्स्ट टाइप या डिलीट करने पर अंक काट लिए जाएंगे।
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            समझ गया / बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
