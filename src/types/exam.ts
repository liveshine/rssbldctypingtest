export type ExamPaperType =
  | 'hindi_speed'
  | 'english_speed'
  | 'hindi_efficiency'
  | 'english_efficiency';

export type ExamFlowPhase =
  | 'login'
  | 'peripheral_check'
  | 'paper_1_speed'
  | 'paper_1_preview'
  | 'paper_2_speed'
  | 'paper_2_preview'
  | 'paper_3_efficiency'
  | 'paper_3_confirm'
  | 'paper_4_efficiency'
  | 'paper_4_confirm'
  | 'final_upload'
  | 'scorecard';

export interface CandidateInfo {
  rollNo: string;
  name: string;
  testId: string;
  category: 'General/OBC' | 'SC/ST';
  systemNo: string;
}

export interface KeystrokeWarning {
  tokenIndex: number;
  word: string;
  issueType: 'repeated_matra' | 'wrong_sequence' | 'case_mismatch' | 'redundant_aa_matra';
  description: string;
}

export interface SpeedTestResult {
  paperType: 'hindi_speed' | 'english_speed';
  totalWordsTarget: number;
  typedWordsCount: number;
  correctWordsCount: number;
  incorrectWordsCount: number;
  omittedWordsCount: number;
  grossWpm: number;
  netWpm: number;
  accuracyPercentage: number;
  marksObtained: number; // Max 25
  isQualified: boolean; // >= 9.0 marks
  typedContent: string;
  timeSpentSeconds: number;
  keystrokeWarnings?: KeystrokeWarning[];
}

export interface EfficiencyTask {
  id: number;
  instructionHindi: string;
  instructionEnglish: string;
  marks: number; // e.g. 1.66 marks each, total 25
  isCompleted: boolean;
  category: 'font' | 'paragraph' | 'page' | 'table' | 'editing' | 'advanced' | 'formula' | 'cell_format';
  hint?: string;
}

export interface EfficiencyTestResult {
  paperType: 'hindi_efficiency' | 'english_efficiency';
  softwareMode: 'word' | 'excel';
  completedTasksCount: number;
  totalTasksCount: number;
  marksObtained: number; // Max 25
  isQualified: boolean; // >= 9.0 marks
  timeSpentSeconds: number;
  taskResults: { id: number; passed: boolean; marks: number }[];
  snapshotSummary?: string;
}

export interface FullExamScorecard {
  candidate: CandidateInfo;
  paper1HindiSpeed?: SpeedTestResult;
  paper2EnglishSpeed?: SpeedTestResult;
  paper3HindiEfficiency?: EfficiencyTestResult;
  paper4EnglishEfficiency?: EfficiencyTestResult;
  totalMarksObtained: number; // Max 100
  isOverallQualified: boolean; // Must score >= 9 in each of the 4 papers
  completedAt: string;
}

export interface DocumentParagraphStyle {
  id: string;
  text: string;
  fontSize: number; // pt (default 12 or 14)
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  color: string;
  highlightColor: string; // e.g. 'yellow', 'none'
  alignment: 'left' | 'center' | 'right' | 'justify';
  lineSpacing: number; // 1.0, 1.15, 1.5, 2.0
  marginTop: number;
  marginBottom: number;
  indentLeft: number;
  subscript?: boolean;
  superscript?: boolean;
}

export interface DocumentTableStyle {
  hasTable: boolean;
  rows: number;
  cols: number;
  hasBorder: boolean;
  borderStyle: 'solid' | 'dashed' | 'none';
  headerBackground: string;
  cells: string[][];
}

export interface DocumentState {
  title: string;
  titleStyle: Partial<DocumentParagraphStyle>;
  paragraphs: DocumentParagraphStyle[];
  pageMargin: 'normal' | 'narrow' | 'wide';
  headerText: string;
  footerText: string;
  table: DocumentTableStyle;
}

// MS Excel 2013 State Structures
export interface ExcelCellData {
  value: string;
  formula?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  fontSize?: number;
  bgColor?: string;
  color?: string;
  format?: 'general' | 'currency' | 'number';
  border?: boolean;
}

export interface ExcelSpreadsheetState {
  title: string;
  selectedCell: string; // e.g. "B2"
  grid: Record<string, ExcelCellData>; // Key: "A1", "B2", etc.
  rows: number;
  cols: string[]; // ["A", "B", "C", "D", "E"]
}
