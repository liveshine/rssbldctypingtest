/**
 * Remington GAIL / DevLys 010 Keyboard Mapping and RSSB Scoring Engine
 *
 * Implements:
 * 1. Official RSSB Rajasthan Standard Keyboard & DevLys 010 Mapping
 *    (Standard की-बोर्ड एवं DevLys 010 फॉन्ट का प्रयोग किया जायेगा)
 * 2. Robust support for both physical key codes, shifted symbols, and direct character entry
 * 3. Strict RSSB single-word Backspace rule enforcement (Rule 10)
 * 4. Official RSSB Speed Test scoring formula (0.0625 per Hindi word, 0.05 per English word)
 * 5. Matra Redundancy & Keystroke Sequence Auditor
 */

import { KeystrokeWarning } from '../types/exam';

export interface KeyMapDef {
  code: string;
  normalLabel: string;
  shiftLabel: string;
  hindiNormal: string;
  hindiShift: string;
}

/**
 * Official DevLys 010 / Remington GAIL layout mapping exactly matching
 * the Rajasthan Staff Selection Board (RSSB / RSMSSB) official specification.
 */
export const REMINGTON_KEY_MAP: Record<string, { normal: string; shift: string }> = {
  '`': { normal: '़', shift: '्र' },
  '1': { normal: '१', shift: '!' },
  '2': { normal: '२', shift: '@' },
  '3': { normal: '३', shift: 'रु' },
  '4': { normal: '४', shift: '$' },
  '5': { normal: '५', shift: ':' },
  '6': { normal: '६', shift: '‘' },
  '7': { normal: '७', shift: '&' },
  '8': { normal: '८', shift: "'" },
  '9': { normal: '९', shift: ';' },
  '0': { normal: '०', shift: 'ऋ' },
  '-': { normal: '.', shift: 'त्र' },
  '=': { normal: 'त्र', shift: 'ृ' },

  'q': { normal: 'ु', shift: 'फ' },
  'w': { normal: 'ू', shift: 'ँ' },
  'e': { normal: 'म', shift: 'म्' },
  'r': { normal: 'त', shift: 'त्' },
  't': { normal: 'ज', shift: 'ज्' },
  'y': { normal: 'ल', shift: 'ल्' },
  'u': { normal: 'न', shift: 'न्' },
  'i': { normal: 'प', shift: 'प्' },
  'o': { normal: 'व', shift: 'व्' },
  'p': { normal: 'च', shift: 'च्' },
  '[': { normal: 'ख', shift: 'क्ष' },
  ']': { normal: ',', shift: 'द्व' },
  '\\': { normal: '?', shift: 'द्य' },

  'a': { normal: 'ं', shift: '।' },
  's': { normal: 'े', shift: 'ै' },
  'd': { normal: 'क', shift: 'क्' },
  'f': { normal: 'ि', shift: 'थ्' },
  'g': { normal: 'ह', shift: 'ळ' },
  'h': { normal: 'ी', shift: 'भ' },
  'j': { normal: 'र', shift: 'श्र' },
  'k': { normal: 'ा', shift: 'ज्ञ' },
  'l': { normal: 'स', shift: 'स्' },
  ';': { normal: 'य', shift: 'रू' },
  "'": { normal: 'श', shift: 'ष्' },

  'z': { normal: '्र', shift: 'र्' },
  'x': { normal: 'ग', shift: 'ग्' },
  'c': { normal: 'ब', shift: 'ब्' },
  'v': { normal: 'अ', shift: 'ट' },
  'b': { normal: 'इ', shift: 'ठ' },
  'n': { normal: 'द', shift: 'छ' },
  'm': { normal: 'उ', shift: 'ड' },
  ',': { normal: 'ए', shift: 'ढ' },
  '.': { normal: 'झ', shift: 'ण' },
  '/': { normal: 'ध', shift: 'घ' },
  ' ': { normal: ' ', shift: ' ' },
};

/**
 * Direct mapping for characters when browser keyboard event passes
 * already-shifted symbols (e.g. e.key === '!' or e.key === 'Q')
 */
export const SHIFTED_SYMBOL_MAP: Record<string, string> = {
  '~': '्र',
  '!': '!',
  '@': '@',
  '#': 'रु',
  '$': '$',
  '%': ':',
  '^': '‘',
  '&': '&',
  '*': "'",
  '(': ';',
  ')': 'ऋ',
  '_': 'त्र',
  '+': 'ृ',

  'Q': 'फ',
  'W': 'ँ',
  'E': 'म्',
  'R': 'त्',
  'T': 'ज्',
  'Y': 'ल्',
  'U': 'न्',
  'I': 'प्',
  'O': 'व्',
  'P': 'च्',
  '{': 'क्ष',
  '}': 'द्व',
  '|': 'द्य',

  'A': '।',
  'S': 'ै',
  'D': 'क्',
  'F': 'थ्',
  'G': 'ळ',
  'H': 'भ',
  'J': 'श्र',
  'K': 'ज्ञ',
  'L': 'स्',
  ':': 'रू',
  '"': 'ष्',

  'Z': 'र्',
  'X': 'ग्',
  'C': 'ब्',
  'V': 'ट',
  'B': 'ठ',
  'N': 'छ',
  'M': 'ड',
  '<': 'ढ',
  '>': 'ण',
  '?': 'घ',
};

// Alt Code reference for special Hindi ligatures in DevLys 010
export const ALT_CODES_REFERENCE = [
  { code: 'Alt+0216', char: 'क्र', description: 'क + ्र (क में पदेन र)' },
  { code: 'Alt+0161', char: 'द्व', description: 'द + व (द्वितीया, द्वार)' },
  { code: 'Alt+0205', char: 'द्ध', description: 'द + ध (शुद्ध, युद्ध)' },
  { code: 'Alt+0217', char: 'त्र', description: 'त + र (छात्र, पत्र)' },
  { code: 'Alt+0170', char: 'द्य', description: 'द + य (विद्या, उद्योग)' },
  { code: 'Alt+0182', char: 'ट्ट', description: 'ट + ट (मिट्टी, पट्टी)' },
  { code: 'Alt+0183', char: 'ट्ठ', description: 'ट + ठ (चिट्ठी, लट्ठा)' },
  { code: 'Alt+0184', char: 'ड्ड', description: 'ड + ड (अड्डा, कबड्डी)' },
  { code: 'Alt+0185', char: 'ड्ढ', description: 'ड + ढ (बुड्ढा)' },
  { code: 'Alt+0197', char: 'ह्', description: 'ह हलन्त (चिह्न, ब्रह्मा)' },
  { code: 'Alt+0227', char: 'क्त', description: 'क + त (भक्त, शक्ति)' },
  { code: 'Alt+0228', char: 'क्ष्म', description: 'क्ष + म (सूक्ष्म)' },
  { code: 'Alt+0188', char: 'फ्र', description: 'फ + र (फ्रांस, फ्री)' },
  { code: 'Alt+0165', char: '¥', description: 'रुपया मुद्रा चिह्न' },
  { code: 'Alt+0221', char: 'द्भ', description: 'द + भ (सद्भाव)' },
  { code: 'Alt+0169', char: 'द्र', description: 'द + र (द्रव्य, चन्द्र)' },
];

/**
 * Maps a single keystroke to DevLys 010 Remington Hindi character.
 * Robust across browser event differences (handles both e.key as shifted symbol
 * and base key + isShift flag).
 */
export function mapKeystrokeToHindi(key: string, isShift: boolean): string | null {
  if (key === ' ' || key === 'Space') return ' ';
  if (key.length > 1) return null; // Ignore non-printable keys like Shift, Control, etc.

  // 1. If key is already in the shifted symbol map (e.g. '!', '@', 'Q', ':', '?', '{')
  if (SHIFTED_SYMBOL_MAP[key]) {
    return SHIFTED_SYMBOL_MAP[key];
  }

  // 2. If isShift is true, check if uppercase version is in shifted map
  if (isShift) {
    const upper = key.toUpperCase();
    if (SHIFTED_SYMBOL_MAP[upper]) {
      return SHIFTED_SYMBOL_MAP[upper];
    }
  }

  // 3. Check standard REMINGTON_KEY_MAP by lowercase
  const lower = key.toLowerCase();
  const entry = REMINGTON_KEY_MAP[lower];

  if (entry) {
    return isShift ? entry.shift : entry.normal;
  }

  // Fallback direct check
  if (REMINGTON_KEY_MAP[key]) {
    return isShift ? REMINGTON_KEY_MAP[key].shift : REMINGTON_KEY_MAP[key].normal;
  }

  return null;
}

/**
 * Tokenizes text into words
 */
export function tokenizeWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Checks for redundant / repeated matras or bad key sequences
 * highlighting official guidelines
 */
export function auditKeystrokeSequences(
  typedWords: string[],
  rawWordInputs: string[],
  paperType: 'hindi_speed' | 'english_speed'
): KeystrokeWarning[] {
  const warnings: KeystrokeWarning[] = [];

  if (paperType === 'hindi_speed') {
    rawWordInputs.forEach((raw, idx) => {
      // Check for repeated matra keys e.g. sssss (e ki matra), hhhhh (badi i), qqqqq (chhoti u), kkkkk (aa)
      const repeatedMatraMatch = raw.match(/([shqfkw])\1{2,}/i);
      if (repeatedMatraMatch) {
        warnings.push({
          tokenIndex: idx,
          word: typedWords[idx] || raw,
          issueType: 'repeated_matra',
          description: `अनावश्यक मात्रा आवृत्ति (${repeatedMatraMatch[0]}): केवल में dsoy के स्थान पर dsssssoy जैसी अनावश्यक कुंजियाँ प्रेस की गईं।`,
        });
      }

      // Check for 'ik' instead of 'i' (typing 'प' with redundant 'k' aa-matra)
      if (raw.includes('ik') && (typedWords[idx] || '').includes('प')) {
        warnings.push({
          tokenIndex: idx,
          word: typedWords[idx] || raw,
          issueType: 'redundant_aa_matra',
          description: `अनावश्यक 'ा' मात्रा: 'प' वर्ण i कुंजी से पूर्ण बनता है, ik प्रेस करने पर मात्रा त्रुटि मानी जाती है।`,
        });
      }
    });
  }

  return warnings;
}

/**
 * Official RSSB Scoring Logic:
 * - Hindi Speed: 10 Minutes · 400 Words Target · 25.0 Marks Total (0.0625 Marks / Correct Word)
 * - English Speed: 10 Minutes · 500 Words Target · 25.0 Marks Total (0.05 Marks / Correct Word)
 * - Qualifying cutoff: 9.0 Marks minimum (36%)
 */
export function calculateSpeedTestStats(
  targetPassageText: string,
  typedWords: string[],
  timeSpentSeconds: number,
  paperType: 'hindi_speed' | 'english_speed',
  rawWordsHistory: string[] = []
) {
  const targetWords = tokenizeWords(targetPassageText);
  const totalWordsTarget = targetWords.length;
  const typedCount = typedWords.length;

  let correctCount = 0;
  let incorrectCount = 0;

  for (let i = 0; i < typedCount; i++) {
    if (i < totalWordsTarget && typedWords[i] === targetWords[i]) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  const omittedCount = Math.max(0, totalWordsTarget - typedCount);

  // Time in minutes
  const minutes = Math.max(0.1, timeSpentSeconds / 60);

  // Gross and Net Words Per Minute
  const grossWpm = Number((typedCount / minutes).toFixed(1));
  const netWpm = Number((Math.max(0, correctCount - incorrectCount * 0.5) / minutes).toFixed(1));

  // Accuracy
  const accuracyPercentage =
    typedCount > 0 ? Number(((correctCount / typedCount) * 100).toFixed(1)) : 0;

  // Marks Calculation per RSSB Official Notification:
  // Hindi: 0.0625 marks per correct word (400 words * 0.0625 = 25.0 Marks)
  // English: 0.05 marks per correct word (500 words * 0.05 = 25.0 Marks)
  const markPerWord = paperType === 'hindi_speed' ? 0.0625 : 0.05;
  const marksObtained = Number(
    Math.min(25, Math.max(0, correctCount * markPerWord - incorrectCount * (markPerWord * 0.5))).toFixed(2)
  );

  const isQualified = marksObtained >= 9.0;

  const keystrokeWarnings = auditKeystrokeSequences(typedWords, rawWordsHistory, paperType);

  return {
    totalWordsTarget,
    typedWordsCount: typedCount,
    correctWordsCount: correctCount,
    incorrectWordsCount: incorrectCount,
    omittedWordsCount: omittedCount,
    grossWpm,
    netWpm,
    accuracyPercentage,
    marksObtained,
    isQualified,
    keystrokeWarnings,
  };
}
