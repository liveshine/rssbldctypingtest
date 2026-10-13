import React, { useState, useEffect } from 'react';
import {
  DocumentState,
  EfficiencyTask,
  EfficiencyTestResult,
  CandidateInfo,
} from '../../types/exam';
import {
  INITIAL_HINDI_DOC_STATE,
  OFFICIAL_HINDI_EFFICIENCY_TASKS,
  OFFICIAL_ENGLISH_EFFICIENCY_TASKS,
} from '../../data/officialData';
import {
  Clock,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Search,
  Replace,
  Table as TableIcon,
  HelpCircle,
  Undo,
  FileText,
  CheckCircle2,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Highlighter,
  PaintBucket,
  Printer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface EfficiencyTestRunnerProps {
  paperType: 'hindi_efficiency' | 'english_efficiency';
  durationMinutes?: number;
  candidate?: CandidateInfo;
  onFinishTest: (result: EfficiencyTestResult, state: DocumentState) => void;
}

export const EfficiencyTestRunner: React.FC<EfficiencyTestRunnerProps> = ({
  paperType,
  durationMinutes = 10,
  candidate = {
    rollNo: '740732',
    name: 'CANDIDATE',
    testId: '3',
    category: 'General/OBC',
    systemNo: 'C-042',
  },
  onFinishTest,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [docState, setDocState] = useState<DocumentState>(INITIAL_HINDI_DOC_STATE);
  const [history, setHistory] = useState<DocumentState[]>([INITIAL_HINDI_DOC_STATE]);
  const [selectedTarget, setSelectedTarget] = useState<'title' | 'p1' | 'p2' | 'p3' | 'p4' | 'table'>('p1');
  const [activeRibbonTab, setActiveRibbonTab] = useState<'home' | 'insert' | 'page_layout' | 'view'>('home');
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findWord, setFindWord] = useState('');
  const [replaceWord, setReplaceWord] = useState('');
  const [isHandoutVisible, setIsHandoutVisible] = useState(true);

  const initialTasks =
    paperType === 'hindi_efficiency'
      ? OFFICIAL_HINDI_EFFICIENCY_TASKS
      : OFFICIAL_ENGLISH_EFFICIENCY_TASKS;

  const [tasks, setTasks] = useState<EfficiencyTask[]>(initialTasks);

  // Timer countdown
  useEffect(() => {
    if (isTestFinished) return;
    if (secondsLeft <= 0) {
      handleFinalSubmission();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, isTestFinished]);

  // Evaluate tasks whenever document state changes
  useEffect(() => {
    evaluateTasks(docState);
  }, [docState]);

  const updateDocWithHistory = (updater: (prev: DocumentState) => DocumentState) => {
    setDocState((current) => {
      const next = updater(current);
      setHistory((prev) => [...prev.slice(-15), next]);
      return next;
    });
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const prevHistory = [...history];
      prevHistory.pop();
      const previousState = prevHistory[prevHistory.length - 1];
      setHistory(prevHistory);
      setDocState(previousState);
    }
  };

  const evaluateTasks = (doc: DocumentState) => {
    const updated = tasks.map((task) => {
      let isDone = false;
      const p1 = doc.paragraphs.find((p) => p.id === 'p1');
      const p2 = doc.paragraphs.find((p) => p.id === 'p2');
      const p3 = doc.paragraphs.find((p) => p.id === 'p3');
      const p4 = doc.paragraphs.find((p) => p.id === 'p4');

      switch (task.id) {
        case 1:
          isDone = Boolean(p1 && Math.abs(p1.lineSpacing - 1.5) < 0.05);
          break;
        case 2:
          isDone = Boolean(p2 && p2.fontSize >= 16 && p2.bold);
          break;
        case 3:
          isDone = Boolean(p3 && p3.alignment === 'justify');
          break;
        case 4:
          isDone = Boolean(doc.titleStyle.underline);
          break;
        case 5:
          isDone = doc.paragraphs.some(
            (p) => p.highlightColor === '#fef08a' || p.highlightColor === 'yellow'
          );
          break;
        case 6:
          isDone = Boolean(p1 && (p1.color.toLowerCase() === '#1e3a8a' || p1.color.toLowerCase() === '#1d4ed8'));
          break;
        case 7:
          isDone = Boolean(p2 && p2.italic);
          break;
        case 8:
          isDone = Boolean(p4 && p4.indentLeft >= 20);
          break;
        case 9:
          isDone = doc.pageMargin === 'narrow';
          break;
        case 10:
          isDone = Boolean(doc.headerText && doc.headerText.trim().length > 3);
          break;
        case 11:
          isDone = Boolean(doc.footerText && doc.footerText.trim().length > 2);
          break;
        case 12:
          isDone = Boolean(doc.table.hasBorder);
          break;
        case 13:
          isDone = Boolean(doc.table.headerBackground && doc.table.headerBackground !== '#ffffff');
          break;
        case 14:
          isDone = doc.paragraphs.some((p) => p.text.includes('मुम्बई') || p.text.includes('assistant'));
          break;
        case 15:
          isDone = Boolean(p3 && p3.strikethrough);
          break;
        default:
          isDone = false;
      }
      return { ...task, isCompleted: isDone };
    });
    setTasks(updated);
  };

  const handleFinalSubmission = () => {
    if (isTestFinished) return;
    setIsTestFinished(true);

    const completed = tasks.filter((t) => t.isCompleted);
    const marksObtained = Number(
      completed.reduce((acc, curr) => acc + curr.marks, 0).toFixed(2)
    );
    const timeSpent = durationMinutes * 60 - Math.max(0, secondsLeft);

    const result: EfficiencyTestResult = {
      paperType,
      softwareMode: 'word',
      completedTasksCount: completed.length,
      totalTasksCount: tasks.length,
      marksObtained: Math.min(25, marksObtained),
      isQualified: marksObtained >= 9.0,
      timeSpentSeconds: timeSpent,
      taskResults: tasks.map((t) => ({
        id: t.id,
        passed: t.isCompleted,
        marks: t.isCompleted ? t.marks : 0,
      })),
      snapshotSummary: `MS Word 2013 Document (${completed.length}/15 Tasks Passed, Marks: ${marksObtained})`,
    };

    onFinishTest(result, docState);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `00:${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const applyParagraphFormat = (key: keyof DocumentState['paragraphs'][0], value: any) => {
    if (selectedTarget === 'title') {
      updateDocWithHistory((prev) => ({
        ...prev,
        titleStyle: {
          ...prev.titleStyle,
          [key]: value,
        },
      }));
      return;
    }

    updateDocWithHistory((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.map((p) => {
        if (p.id === selectedTarget) {
          return { ...p, [key]: value };
        }
        return p;
      }),
    }));
  };

  const toggleStyle = (styleKey: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    if (selectedTarget === 'title') {
      const current = Boolean(docState.titleStyle[styleKey]);
      applyParagraphFormat(styleKey, !current);
      return;
    }
    const targetPara = docState.paragraphs.find((p) => p.id === selectedTarget);
    if (targetPara) {
      applyParagraphFormat(styleKey, !targetPara[styleKey]);
    }
  };

  const handleFindAndReplace = () => {
    if (!findWord.trim()) return;
    updateDocWithHistory((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.map((p) => ({
        ...p,
        text: p.text.split(findWord).join(replaceWord),
      })),
    }));
    setShowFindReplace(false);
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const currentTotalMarks = tasks
    .filter((t) => t.isCompleted)
    .reduce((acc, t) => acc + t.marks, 0)
    .toFixed(2);

  return (
    <div className="w-full max-w-[1600px] mx-auto my-2 font-sans select-text">
      {/* Official Top Institutional Header matching Screenshots */}
      <div className="bg-slate-100 border-2 border-slate-300 rounded-t-lg px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Left: Candidate Identification */}
        <div className="flex items-center gap-4 text-xs text-slate-700 font-mono">
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-slate-300 shadow-xs">
            <span className="text-slate-500">Roll No:</span>
            <strong className="text-slate-900 font-bold">{candidate.rollNo}</strong>
          </div>
          <div className="hidden sm:block">
            <span className="text-slate-500">Name:</span>{' '}
            <strong className="text-slate-900">{candidate.name}</strong>
          </div>
          <div className="hidden lg:block text-slate-500">
            Seat: <strong>{candidate.systemNo || 'C-042'}</strong>
          </div>
        </div>

        {/* Center: Title & Remaining Time Box */}
        <div className="text-center">
          <h1 className="text-lg md:text-xl font-serif font-bold text-slate-900 tracking-wide">
            {paperType === 'hindi_efficiency'
              ? 'दक्षता परीक्षा (MS Word 2013) / Hindi Efficiency Test'
              : 'English Efficiency Exam (MS Word 2013)'}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mt-0.5 bg-white border border-slate-400 rounded text-xs font-mono shadow-inner">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-slate-600 font-medium">Remaining Time :</span>
            <span
              className={`font-bold text-sm tabular-nums tracking-wider ${
                secondsLeft <= 60 ? 'text-red-600 animate-pulse' : 'text-blue-900'
              }`}
            >
              {formatTimer(secondsLeft)}
            </span>
          </div>
        </div>

        {/* Right: Submit Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFinalSubmission}
            className="px-5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold uppercase tracking-wide shadow-md transition-colors"
          >
            Submit Paper
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Handout Sheet (Always Visible on Left) & Right MS Word 2013 Workspace */}
      <div className="flex flex-col lg:flex-row gap-3 items-start mt-2">
        {/* LEFT SIDE: Official Physical Question Paper Handout Sheet (Permanently Visible) */}
        <div className="w-full lg:w-[380px] xl:w-[410px] shrink-0 bg-white border-2 border-slate-300 rounded-lg shadow-lg flex flex-col h-[760px] sticky top-2 font-serif overflow-hidden">
          {/* Sheet Header */}
          <div className="p-3 bg-amber-50/60 border-b border-slate-300 text-center space-y-1 shrink-0">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans border-b border-slate-200 pb-1">
              <span>राजस्थान कर्मचारी चयन बोर्ड, जयपुर</span>
              <button
                onClick={() => window.print()}
                className="hover:text-slate-900 flex items-center gap-0.5 text-[10px] font-semibold text-slate-600"
                title="Print Question Paper"
              >
                <Printer className="w-3 h-3" />
                <span>Print</span>
              </button>
            </div>

            <h2 className="text-sm font-bold text-slate-900">
              दक्षता प्रश्न पत्र (Physical Handout Sheet)
            </h2>
            <div className="text-[11px] text-blue-900 font-sans font-semibold">
              समय: 10 मिनट · पूर्णांक: 25 अंक · न्यूनतम अर्हक: 9 अंक
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-1.5 text-xs font-sans flex items-center justify-between mt-1">
              <span className="text-slate-700 font-medium">लाइव प्राप्तांक:</span>
              <span className="font-bold text-blue-900 font-mono">
                {currentTotalMarks} / 25.0 M ({completedCount}/15 पूर्ण)
              </span>
            </div>
          </div>

          {/* Questions List Container with Independent Smooth Scroll */}
          <div className="p-3 overflow-y-auto space-y-2 flex-1 font-sans text-xs bg-slate-50/50">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-2.5 rounded border transition-all ${
                  task.isCompleted
                    ? 'bg-emerald-50 border-emerald-400 text-slate-900 shadow-xs ring-1 ring-emerald-300'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-slate-900 leading-snug">
                    <span className="inline-block bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[10px] font-bold mr-1">
                      प्र.{task.id}
                    </span>
                    {task.instructionHindi}
                  </div>
                  {task.isCompleted ? (
                    <span className="shrink-0 flex items-center gap-0.5 text-emerald-800 font-bold text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      +{task.marks} M
                    </span>
                  ) : (
                    <span className="shrink-0 text-slate-500 font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">
                      [{task.marks} M]
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 mt-1 pl-6">
                  {task.instructionEnglish}
                </div>

                {task.hint && (
                  <div className="mt-1.5 text-[10px] text-blue-800 bg-blue-50/80 p-1.5 rounded border border-blue-200 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 shrink-0 text-blue-600" />
                    <span>{task.hint}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sheet Bottom Invigilator Signature Section */}
          <div className="p-2.5 bg-slate-100 border-t border-slate-200 text-[10px] font-sans text-slate-600 flex justify-between items-center shrink-0">
            <div>परीक्षार्थी: <strong>{candidate.rollNo}</strong></div>
            <div className="text-right italic">वीक्षक हस्ताक्षर (हस्ताक्षरित)</div>
          </div>
        </div>

        {/* RIGHT SIDE: Full MS Word 2013 Classic Window Container */}
        <div className="flex-1 min-w-0 bg-[#DFE2E8] border-2 border-[#8E97A6] rounded-lg shadow-xl overflow-hidden text-slate-900">
          {/* Ribbon Tabs Row matching Screenshot */}
          <div className="bg-[#E4E8EE] border-b border-[#B8C0CC] px-2 flex items-center gap-1 text-xs select-none pt-1">
            <div className="px-3 py-1 text-xs font-medium text-slate-600 border-r border-[#B8C0CC] mr-1">
              File
            </div>
            <button
              onClick={() => setActiveRibbonTab('home')}
              className={`px-4 py-1.5 font-medium transition-colors border-t-2 ${
                activeRibbonTab === 'home'
                  ? 'bg-[#F2F4F7] text-slate-900 border-blue-600 font-semibold'
                  : 'text-slate-700 border-transparent hover:bg-slate-200'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveRibbonTab('insert')}
              className={`px-4 py-1.5 font-medium transition-colors border-t-2 ${
                activeRibbonTab === 'insert'
                  ? 'bg-[#F2F4F7] text-slate-900 border-blue-600 font-semibold'
                  : 'text-slate-700 border-transparent hover:bg-slate-200'
              }`}
            >
              Insert
            </button>
            <button
              onClick={() => setActiveRibbonTab('page_layout')}
              className={`px-4 py-1.5 font-medium transition-colors border-t-2 ${
                activeRibbonTab === 'page_layout'
                  ? 'bg-[#F2F4F7] text-slate-900 border-blue-600 font-semibold'
                  : 'text-slate-700 border-transparent hover:bg-slate-200'
              }`}
            >
              Page Layout
            </button>
            <button
              onClick={() => setActiveRibbonTab('view')}
              className={`px-4 py-1.5 font-medium transition-colors border-t-2 ${
                activeRibbonTab === 'view'
                  ? 'bg-[#F2F4F7] text-slate-900 border-blue-600 font-semibold'
                  : 'text-slate-700 border-transparent hover:bg-slate-200'
              }`}
            >
              View
            </button>

            <div className="ml-auto flex items-center gap-2 pr-2 text-slate-600">
              <button
                onClick={handleUndo}
                title="Undo (Ctrl+Z)"
                className="p-1 hover:bg-slate-300 rounded"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-slate-500 font-mono">
                Target: <strong className="text-slate-800 uppercase">{selectedTarget}</strong>
              </span>
            </div>
          </div>

          {/* Ribbon Groups Strip matching Screenshot 2026-10-12 9.39.37 PM.png */}
          <div className="bg-[#F2F4F7] border-b border-[#B8C0CC] p-1.5 flex items-stretch gap-2 text-xs overflow-x-auto min-h-[92px]">
            {activeRibbonTab === 'home' && (
              <>
                {/* 1. Font Group */}
                <div className="flex flex-col justify-between pr-3 border-r border-[#B8C0CC] shrink-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <select
                        className="bg-white border border-[#ABADB3] rounded px-1.5 py-0.5 text-xs font-serif w-32 shadow-inner"
                        onChange={(e) => applyParagraphFormat('fontFamily', e.target.value)}
                        defaultValue="Kruti Dev 010"
                      >
                        <option value="Kruti Dev 010">Kruti Dev 010</option>
                        <option value="DevLys 010">DevLys 010</option>
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                      </select>

                      <select
                        className="bg-white border border-[#ABADB3] rounded px-1 py-0.5 text-xs w-14 font-sans shadow-inner"
                        onChange={(e) => applyParagraphFormat('fontSize', Number(e.target.value))}
                        defaultValue="15"
                      >
                        {[10, 11, 12, 14, 15, 16, 18, 20, 24, 28, 36].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          const cur = docState.paragraphs.find((p) => p.id === selectedTarget)?.fontSize || 14;
                          applyParagraphFormat('fontSize', cur + 1);
                        }}
                        className="px-1.5 py-0.5 bg-white hover:bg-slate-200 border border-[#ABADB3] rounded text-[11px] font-bold"
                        title="Grow Font Size"
                      >
                        A^
                      </button>
                      <button
                        onClick={() => {
                          const cur = docState.paragraphs.find((p) => p.id === selectedTarget)?.fontSize || 14;
                          applyParagraphFormat('fontSize', Math.max(8, cur - 1));
                        }}
                        className="px-1.5 py-0.5 bg-white hover:bg-slate-200 border border-[#ABADB3] rounded text-[11px]"
                        title="Shrink Font Size"
                      >
                        A_
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleStyle('bold')}
                        className="p-1 hover:bg-[#D5D9E0] rounded border border-transparent hover:border-[#ABADB3] text-slate-800 font-bold"
                        title="Bold (Ctrl+B)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleStyle('italic')}
                        className="p-1 hover:bg-[#D5D9E0] rounded border border-transparent hover:border-[#ABADB3] text-slate-800"
                        title="Italic (Ctrl+I)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleStyle('underline')}
                        className="p-1 hover:bg-[#D5D9E0] rounded border border-transparent hover:border-[#ABADB3] text-slate-800"
                        title="Underline (Ctrl+U)"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleStyle('strikethrough')}
                        className="p-1 hover:bg-[#D5D9E0] rounded border border-transparent hover:border-[#ABADB3] text-slate-800"
                        title="Strikethrough"
                      >
                        <Strikethrough className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-[1px] h-4 bg-slate-300 mx-0.5" />

                      <div className="flex items-center gap-0.5 bg-white border border-[#ABADB3] rounded px-1 py-0.5">
                        <Highlighter className="w-3 h-3 text-amber-600" />
                        <button
                          onClick={() => applyParagraphFormat('highlightColor', '#fef08a')}
                          className="w-3 h-3 bg-yellow-300 border border-slate-400 rounded-xs"
                          title="Yellow Highlight"
                        />
                        <button
                          onClick={() => applyParagraphFormat('highlightColor', 'none')}
                          className="text-[9px] text-slate-500 hover:text-slate-800 px-0.5"
                          title="Remove Highlight"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center gap-0.5 bg-white border border-[#ABADB3] rounded px-1 py-0.5">
                        <span className="font-serif font-bold text-xs underline decoration-red-600">A</span>
                        <button
                          onClick={() => applyParagraphFormat('color', '#000000')}
                          className="w-3 h-3 bg-black rounded-xs"
                          title="Black Color"
                        />
                        <button
                          onClick={() => applyParagraphFormat('color', '#1e3a8a')}
                          className="w-3 h-3 bg-blue-900 rounded-xs"
                          title="Dark Blue Color"
                        />
                        <button
                          onClick={() => applyParagraphFormat('color', '#b91c1c')}
                          className="w-3 h-3 bg-red-700 rounded-xs"
                          title="Red Color"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center -mb-0.5">Font</div>
                </div>

                {/* 2. Paragraph Group */}
                <div className="flex flex-col justify-between pr-3 border-r border-[#B8C0CC] shrink-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-[#D5D9E0] rounded" title="Bullets">
                        <List className="w-3.5 h-3.5 text-slate-700" />
                      </button>
                      <button className="p-1 hover:bg-[#D5D9E0] rounded" title="Numbering">
                        <ListOrdered className="w-3.5 h-3.5 text-slate-700" />
                      </button>
                      <button
                        onClick={() => {
                          const p = docState.paragraphs.find((x) => x.id === selectedTarget);
                          if (p) applyParagraphFormat('indentLeft', Math.max(0, p.indentLeft - 20));
                        }}
                        className="p-1 hover:bg-[#D5D9E0] rounded"
                        title="Decrease Indent"
                      >
                        <Outdent className="w-3.5 h-3.5 text-slate-700" />
                      </button>
                      <button
                        onClick={() => {
                          const p = docState.paragraphs.find((x) => x.id === selectedTarget);
                          if (p) applyParagraphFormat('indentLeft', p.indentLeft + 20);
                        }}
                        className="p-1 hover:bg-[#D5D9E0] rounded"
                        title="Increase Indent"
                      >
                        <Indent className="w-3.5 h-3.5 text-slate-700" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => applyParagraphFormat('alignment', 'left')}
                        className="p-1 hover:bg-[#D5D9E0] rounded"
                        title="Align Left"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => applyParagraphFormat('alignment', 'center')}
                        className="p-1 hover:bg-[#D5D9E0] rounded"
                        title="Center"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => applyParagraphFormat('alignment', 'right')}
                        className="p-1 hover:bg-[#D5D9E0] rounded"
                        title="Align Right"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => applyParagraphFormat('alignment', 'justify')}
                        className="p-1 hover:bg-[#D5D9E0] rounded text-blue-800 font-bold"
                        title="Justify"
                      >
                        <AlignJustify className="w-3.5 h-3.5" />
                      </button>

                      <select
                        className="bg-white border border-[#ABADB3] rounded px-1 py-0.5 text-xs font-sans shadow-inner"
                        onChange={(e) => applyParagraphFormat('lineSpacing', Number(e.target.value))}
                        defaultValue="1.15"
                      >
                        <option value="1.0">1.0</option>
                        <option value="1.15">1.15</option>
                        <option value="1.5">1.5</option>
                        <option value="2.0">2.0</option>
                      </select>

                      <button
                        onClick={() =>
                          updateDocWithHistory((prev) => ({
                            ...prev,
                            table: { ...prev.table, headerBackground: '#e2e8f0' },
                          }))
                        }
                        className="p-1 hover:bg-[#D5D9E0] rounded"
                        title="Shading"
                      >
                        <PaintBucket className="w-3.5 h-3.5 text-slate-700" />
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center -mb-0.5">Paragraph</div>
                </div>

                {/* 3. Editing Group */}
                <div className="flex flex-col justify-between pr-3 shrink-0">
                  <div className="space-y-0.5">
                    <button
                      onClick={() => setShowFindReplace(true)}
                      className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-[#D5D9E0] rounded text-xs text-slate-800 w-full"
                    >
                      <Search className="w-3 h-3 text-blue-600" />
                      <span>Find</span>
                    </button>
                    <button
                      onClick={() => setShowFindReplace(true)}
                      className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-[#D5D9E0] rounded text-xs text-slate-800 w-full"
                    >
                      <Replace className="w-3 h-3 text-blue-600" />
                      <span>Replace</span>
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center -mb-0.5">Editing</div>
                </div>
              </>
            )}

            {activeRibbonTab === 'insert' && (
              <div className="flex items-center gap-6 p-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs">Header:</span>
                  <input
                    type="text"
                    placeholder="RSMSSB LDC 2024"
                    value={docState.headerText}
                    onChange={(e) =>
                      updateDocWithHistory((prev) => ({ ...prev, headerText: e.target.value }))
                    }
                    className="px-2 py-1 bg-white border border-[#ABADB3] rounded text-xs w-48 shadow-inner"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs">Footer:</span>
                  <input
                    type="text"
                    placeholder="Page 1"
                    value={docState.footerText}
                    onChange={(e) =>
                      updateDocWithHistory((prev) => ({ ...prev, footerText: e.target.value }))
                    }
                    className="px-2 py-1 bg-white border border-[#ABADB3] rounded text-xs w-48 shadow-inner"
                  />
                </div>

                <div className="flex items-center gap-2 border-l border-[#B8C0CC] pl-4">
                  <TableIcon className="w-4 h-4 text-slate-700" />
                  <button
                    onClick={() =>
                      updateDocWithHistory((prev) => ({
                        ...prev,
                        table: { ...prev.table, hasBorder: true, borderStyle: 'solid' },
                      }))
                    }
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-[#ABADB3] rounded text-xs font-semibold"
                  >
                    Apply All Borders
                  </button>
                </div>
              </div>
            )}

            {activeRibbonTab === 'page_layout' && (
              <div className="flex items-center gap-4 p-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs">Margins:</span>
                  <button
                    onClick={() => updateDocWithHistory((prev) => ({ ...prev, pageMargin: 'normal' }))}
                    className={`px-3 py-1 rounded border text-xs font-semibold ${
                      docState.pageMargin === 'normal'
                        ? 'bg-blue-100 border-blue-600 text-blue-900 shadow-xs'
                        : 'bg-white border-[#ABADB3] text-slate-700'
                    }`}
                  >
                    Normal (1 inch)
                  </button>
                  <button
                    onClick={() => updateDocWithHistory((prev) => ({ ...prev, pageMargin: 'narrow' }))}
                    className={`px-3 py-1 rounded border text-xs font-semibold ${
                      docState.pageMargin === 'narrow'
                        ? 'bg-blue-100 border-blue-600 text-blue-900 shadow-xs'
                        : 'bg-white border-[#ABADB3] text-slate-700'
                    }`}
                  >
                    Narrow (0.5 inch)
                  </button>
                </div>
              </div>
            )}

            {activeRibbonTab === 'view' && (
              <div className="flex items-center gap-4 p-2 text-xs text-slate-700">
                <span>View Mode: Print Layout</span>
                <span>·</span>
                <span>Ruler: Checked ✓</span>
                <span>·</span>
                <span>Zoom: 100%</span>
              </div>
            )}
          </div>

          {/* Find & Replace Popover */}
          {showFindReplace && (
            <div className="bg-amber-50 border-b border-amber-300 px-4 py-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold text-amber-900">Find &amp; Replace:</span>
              <input
                type="text"
                placeholder="Find (e.g. बम्बई)..."
                value={findWord}
                onChange={(e) => setFindWord(e.target.value)}
                className="px-2 py-1 bg-white border border-amber-400 rounded text-xs w-36 font-sans"
              />
              <span className="text-amber-800">with:</span>
              <input
                type="text"
                placeholder="Replace (e.g. मुम्बई)..."
                value={replaceWord}
                onChange={(e) => setReplaceWord(e.target.value)}
                className="px-2 py-1 bg-white border border-amber-400 rounded text-xs w-36 font-sans"
              />
              <button
                onClick={handleFindAndReplace}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold"
              >
                Replace All
              </button>
              <button
                onClick={() => setShowFindReplace(false)}
                className="px-2 py-1 text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          )}

          {/* Horizontal Ruler matching Screenshot */}
          <div className="bg-[#EAECEF] border-b border-[#C2C7D0] h-6 flex items-center px-12 text-[10px] text-slate-500 font-mono select-none">
            <div className="flex-1 flex justify-between px-8 relative">
              <div className="absolute left-0 top-0 bottom-0 w-2 border-r border-slate-400" />
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
              <div className="absolute right-0 top-0 bottom-0 w-2 border-l border-slate-400" />
            </div>
          </div>

          {/* Document Body Area with Vertical Ruler and Page Sheet */}
          <div className="flex bg-[#8D96A5] min-h-[600px] max-h-[720px] overflow-y-auto relative">
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

            {/* Central A4/Letter Paper Container */}
            <div className="flex-1 p-6 flex justify-center overflow-x-auto">
              <div
                className={`bg-white shadow-2xl border border-slate-300 w-full transition-all font-serif ${
                  docState.pageMargin === 'narrow' ? 'p-6 max-w-4xl' : 'p-10 max-w-3xl'
                } min-h-[700px]`}
              >
                <div className="border-b border-slate-200 pb-1 mb-6 text-xs text-slate-400 flex justify-between font-sans">
                  <span>{docState.headerText || ''}</span>
                  <span></span>
                </div>

                <div
                  onClick={() => setSelectedTarget('title')}
                  style={{
                    fontSize: `${docState.titleStyle.fontSize || 16}px`,
                    fontWeight: docState.titleStyle.bold ? 'bold' : 'normal',
                    fontStyle: docState.titleStyle.italic ? 'italic' : 'normal',
                    textDecoration: docState.titleStyle.underline ? 'underline' : 'none',
                    textAlign: docState.titleStyle.alignment || 'center',
                    color: docState.titleStyle.color || '#000000',
                  }}
                  className={`py-1.5 px-3 mb-6 rounded cursor-pointer transition-all ${
                    selectedTarget === 'title' ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  {docState.title}
                </div>

                <div className="space-y-4 text-justify">
                  {docState.paragraphs.map((p, idx) => {
                    const isSelected = selectedTarget === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedTarget(p.id as any)}
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
                        className={`p-2 rounded cursor-pointer leading-relaxed transition-all ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50/40 shadow-xs' : 'hover:bg-slate-50'
                        }`}
                      >
                        {p.text}
                      </div>
                    );
                  })}
                </div>

                {docState.table.hasTable && (
                  <div
                    onClick={() => setSelectedTarget('table')}
                    className={`mt-6 p-2 rounded cursor-pointer transition-all ${
                      selectedTarget === 'table' ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
                    }`}
                  >
                    <table
                      className={`w-full text-xs text-left ${
                        docState.table.hasBorder ? 'border-collapse border border-slate-700' : ''
                      }`}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: docState.table.headerBackground || '#ffffff',
                          }}
                        >
                          {docState.table.cells[0].map((h, i) => (
                            <th
                              key={i}
                              className={`p-2 font-bold ${
                                docState.table.hasBorder ? 'border border-slate-700' : 'p-1'
                              }`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {docState.table.cells.slice(1).map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-2 ${
                                docState.table.hasBorder ? 'border border-slate-700' : 'p-1'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-t border-slate-200 pt-2 mt-12 text-xs text-slate-400 flex justify-between font-sans">
                <span>{docState.footerText || ''}</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#2B579A] text-white px-4 py-1 flex items-center justify-between text-[11px] font-sans">
          <div className="flex items-center gap-4">
            <span>PAGE 1 OF 1</span>
            <span>384 WORDS</span>
            <span>HINDI (INDIA)</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Active: {selectedTarget.toUpperCase()}</span>
            <span>·</span>
            <span>100% Zoom</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
