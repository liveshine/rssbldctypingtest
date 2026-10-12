import React, { useState } from 'react';
import {
  HINDI_PASSAGES_BANK,
  ENGLISH_PASSAGES_BANK,
  PassageItem,
  getSeenPassageIds,
} from '../data/passagesBank';
import { X, Search, BookOpen, CheckCircle, Play, Shuffle } from 'lucide-react';

interface PassagesBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage: (passage: PassageItem) => void;
}

export const PassagesBankModal: React.FC<PassagesBankModalProps> = ({
  isOpen,
  onClose,
  onSelectPassage,
}) => {
  const [lang, setLang] = useState<'hindi' | 'english'>('hindi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const seenIds = getSeenPassageIds();
  const bank = lang === 'hindi' ? HINDI_PASSAGES_BANK : ENGLISH_PASSAGES_BANK;

  const categories = ['all', ...Array.from(new Set(bank.map((p) => p.category)))];

  const filtered = bank.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalCount = HINDI_PASSAGES_BANK.length + ENGLISH_PASSAGES_BANK.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300 font-sans">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-base font-bold">
                100+ आधिकारिक पैराग्राफ लाइब्रेरी (Exam Passages Bank)
              </h2>
              <p className="text-xs text-slate-300">
                कुल {totalCount} पैराग्राफ उपलब्ध ({HINDI_PASSAGES_BANK.length} हिन्दी ~400 शब्द · {ENGLISH_PASSAGES_BANK.length} अंग्रेजी ~500 शब्द)
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

        {/* Filters Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Language Selector */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden font-semibold">
            <button
              onClick={() => {
                setLang('hindi');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 transition-colors ${
                lang === 'hindi' ? 'bg-blue-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              हिन्दी पैराग्राफ ({HINDI_PASSAGES_BANK.length})
            </button>
            <button
              onClick={() => {
                setLang('english');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 transition-colors ${
                lang === 'english' ? 'bg-blue-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              English Passages ({ENGLISH_PASSAGES_BANK.length})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">श्रेणी (Category):</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'सभी श्रेणियां (All Categories)' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="खोजें (e.g. प्रताप, संविधान, solar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Passages List Grid */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((item) => {
              const isSeen = seenIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-slate-500 font-semibold">
                          ~{item.wordCount} शब्द
                        </span>
                        {isSeen && (
                          <span
                            title="Previously practiced"
                            className="flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>अभ्यास पूर्ण</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-serif">
                      {item.text}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      ID: {item.id}
                    </span>
                    <button
                      onClick={() => {
                        onSelectPassage(item);
                        onClose();
                      }}
                      className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Start Practice</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              कोई पैराग्राफ नहीं मिला। कृपया अन्य खोज शब्द का प्रयास करें।
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-600">
          <div>
            कुल <strong>{filtered.length}</strong> पैराग्राफ प्रदर्शित · प्रत्येक परीक्षा सत्र में स्वचालित रूप से नया पैराग्राफ चुना जाता है।
          </div>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-semibold transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
