/**
 * Official Remington GAIL (DevLys 010 / Kruti Dev 010) Standard Keyboard Engine
 * Standardized for Rajasthan Staff Selection Board (RSSB / RSMSSB) LDC & Junior Assistant Examinations.
 *
 * Implements:
 * 1. Standard Remington GAIL 47-key DevLys 010 specification
 * 2. Complete 4-column Windows NumPad Alt-Code Decoder (Alt+0161 to Alt+0243)
 * 3. Bidirectional Ligature Assembler (supports both Remington key combinations and Alt-codes)
 * 4. Paden Ra ('्र' / z) and Reph ('र्' / Shift+Z) phonetic clustering
 * 5. Strict RSSB Speed Test scoring formula (0.0625 marks/word Hindi, 0.05 marks/word English)
 * 6. Single-Word Backspace rule enforcement and Keystroke Auditing
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
 * Standard DevLys 010 / Remington GAIL layout mapping.
 * Matches 1:1 the official RSMSSB "Standard की-बोर्ड एवं DevLys 010 फॉन्ट" circular.
 */
export const REMINGTON_KEY_MAP: Record<string, { normal: string; shift: string }> = {
  // Row 1: Number Row
  '`': { normal: '‘', shift: '~' },
  '1': { normal: '१', shift: '!' },
  '2': { normal: '२', shift: '/' },
  '3': { normal: '३', shift: 'रु' },
  '4': { normal: '४', shift: '+' },
  '5': { normal: '५', shift: ':' },
  '6': { normal: '६', shift: '‘' },
  '7': { normal: '७', shift: '-' },
  '8': { normal: '८', shift: "'" },
  '9': { normal: '९', shift: ';' },
  '0': { normal: '०', shift: 'द्ध' },
  '-': { normal: '.', shift: 'ऋ' },
  '=': { normal: 'त्र', shift: '़' },

  // Row 2: QWERTY Row
  'q': { normal: 'ु', shift: 'फ' },
  'w': { normal: 'ू', shift: 'ॅ' },
  'e': { normal: 'म', shift: 'म्' },
  'r': { normal: 'त', shift: 'त्' },
  't': { normal: 'ज', shift: 'ज्' },
  'y': { normal: 'ल', shift: 'ल्' },
  'u': { normal: 'न', shift: 'न्' },
  'i': { normal: 'प', shift: 'प्' },
  'o': { normal: 'व', shift: 'व्' },
  'p': { normal: 'च', shift: 'च्' },
  '[': { normal: 'ख्', shift: 'क्ष्' },
  ']': { normal: ',', shift: 'द्व' },
  '\\': { normal: '?', shift: 'द्य' },

  // Row 3: Home Row
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
  "'": { normal: 'श्', shift: 'ष्' },

  // Row 4: Shift Row
  'z': { normal: '्र', shift: 'र्' }, // z -> ्र (Paden Ra), Shift+z -> र् (Reph)
  'x': { normal: 'ग', shift: 'ग्' },
  'c': { normal: 'ब', shift: 'ब्' },
  'v': { normal: 'अ', shift: 'ट' },
  'b': { normal: 'इ', shift: 'ठ' },
  'n': { normal: 'द', shift: 'छ' },
  'm': { normal: 'उ', shift: 'ड' },
  ',': { normal: 'ए', shift: 'ढ' },
  '.': { normal: 'ण्', shift: 'झ' },
  '/': { normal: 'ध्', shift: 'घ्' },
  ' ': { normal: ' ', shift: ' ' },
};

/**
 * Direct mapping for characters when browser keyboard event delivers
 * shifted symbols directly (e.g. e.key === '!' or e.key === 'Q')
 */
export const SHIFTED_SYMBOL_MAP: Record<string, string> = {
  '~': '~',
  '!': '!',
  '@': '/',
  '#': 'रु',
  '$': '+',
  '%': ':',
  '^': '‘',
  '&': '-',
  '*': "'",
  '(': ';',
  ')': 'द्ध',
  '_': 'ऋ',
  '+': '़',

  'Q': 'फ',
  'W': 'ॅ',
  'E': 'म्',
  'R': 'त्',
  'T': 'ज्',
  'Y': 'ल्',
  'U': 'न्',
  'I': 'प्',
  'O': 'व्',
  'P': 'च्',
  '{': 'क्ष्',
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
  '>': 'झ',
  '?': 'घ्',
};

/**
 * Full 4-Column Official Windows NumPad Alt-Code Lookup Map
 * Supports both 4-digit (e.g. "0216") and 3-digit without leading zero (e.g. "216")
 */
export const ALT_CODES_MAP: Record<string, string> = {
  // Column 1
  '0161': 'ॅ',
  '0165': 'ञ',
  '0170': '^',
  '0182': 'फ्',
  '0183': 'ऽ', // Avagraha
  '0184': 'ृ',
  '0187': '÷',
  '0188': '(',
  '0189': ')',

  // Column 2
  '0190': '=',
  '00191': '[',
  '0191': '[',
  '0192': ']',
  '0197': 'ॐ',
  '0204': 'द्ध',
  '0205': 'द्',
  '0206': 'द्व',
  '0207': 'ड्ढ',
  '02012': 'ङ्ग',
  '0212': 'ङ्ग',

  // Column 3
  '0216': 'क्र',
  '0217': 'त्र',
  '0218': '=',
  '0220': '्र',
  '0221': 'फ्र',
  '0222': '़', // Nukta
  '0223': '·',
  '0224': 'ष्ठ',
  '0225': 'ह्य',
  '0226': 'हृ',

  // Column 4
  '0227': 'ह्म',
  '0228': 'क्त',
  '0229': '०',
  '0233': 'श्र',
  '0243': 'स्त्र',

  // Alternate representations without leading 0 for fast typing
  '161': 'ॅ',
  '165': 'ञ',
  '170': '^',
  '182': 'फ्',
  '183': 'ऽ',
  '184': 'ृ',
  '187': '÷',
  '188': '(',
  '189': ')',
  '190': '=',
  '191': '[',
  '192': ']',
  '197': 'ॐ',
  '204': 'द्ध',
  '205': 'द्',
  '206': 'द्व',
  '207': 'ड्ढ',
  '212': 'ङ्ग',
  '216': 'क्र',
  '217': 'त्र',
  '218': '=',
  '220': '्र',
  '221': 'फ्र',
  '222': '़',
  '223': '·',
  '224': 'ष्ठ',
  '225': 'ह्य',
  '226': 'हृ',
  '227': 'ह्म',
  '228': 'क्त',
  '229': '०',
  '233': 'श्र',
  '243': 'स्त्र',
};

/**
 * Alt Code reference list for UI display matching image 7891dd73d03827530134e15ab51729ed.jpg
 */
export const ALT_CODES_REFERENCE = [
  { code: 'Alt+0216', char: 'क्र', description: 'क + ्र (पदेन र)' },
  { code: 'Alt+0217', char: 'त्र', description: 'त + र (छात्र, पत्र)' },
  { code: 'Alt+0228', char: 'क्त', description: 'क + त (भक्त, शक्ति)' },
  { code: 'Alt+0206', char: 'द्व', description: 'द + व (द्वितीया, द्वार)' },
  { code: 'Alt+0204', char: 'द्ध', description: 'द + ध (शुद्ध, युद्ध)' },
  { code: 'Alt+0205', char: 'द्', description: 'द हलन्त (उद्घाटन)' },
  { code: 'Alt+0170', char: '^', description: 'घातांक / द्य' },
  { code: 'Alt+0161', char: 'ॅ', description: 'चंद्र बिंदु / अर्ध चंद्र' },
  { code: 'Alt+0165', char: 'ञ', description: 'ञ वर्ण' },
  { code: 'Alt+0182', char: 'फ्', description: 'फ हलन्त' },
  { code: 'Alt+0183', char: 'ऽ', description: 'अवग्रह चिह्न' },
  { code: 'Alt+0184', char: 'ृ', description: 'ऋ की मात्रा' },
  { code: 'Alt+0197', char: 'ॐ', description: 'ॐ पवित्र प्रतीक' },
  { code: 'Alt+0221', char: 'फ्र', description: 'फ + र (फ्रांस, फ्री)' },
  { code: 'Alt+0222', char: '़', description: 'नुक्ता चिह्न' },
  { code: 'Alt+0224', char: 'ष्ठ', description: 'ष + ठ (श्रेष्ठ)' },
  { code: 'Alt+0225', char: 'ह्य', description: 'ह + य (सह्य)' },
  { code: 'Alt+0226', char: 'हृ', description: 'ह + ऋ (हृदय)' },
  { code: 'Alt+0227', char: 'ह्म', description: 'ह + म (ब्राह्मण)' },
  { code: 'Alt+0233', char: 'श्र', description: 'श + र (श्रीमती)' },
  { code: 'Alt+0243', char: 'स्त्र', description: 'स + त + र (स्त्री)' },
];

/**
 * Decodes an Alt-code string into its corresponding Devanagari character
 */
export function decodeAltCode(code: string): string | null {
  const clean = code.replace(/^Alt\+/i, '').replace(/\D/g, '');
  return ALT_CODES_MAP[clean] || null;
}

/**
 * Maps a single keystroke to DevLys 010 Remington Hindi character.
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
 * Official Remington GAIL Devanagari Sequence Assembler
 *
 * Implements full Remington typewriter logic:
 * 1. Half-consonant + aa-matra 'k' (ा) -> Full consonant
 *    (e.g., क् + ा -> क, ख् + ा -> ख, म् + ा -> म, etc.)
 * 2. Vowel combinations (अ + ा -> आ, आ + े -> ओ, आ + ै -> औ, इ + र् -> ई, उ + ू -> ऊ, ए + े -> ऐ)
 * 3. Chhoti-i ('ि' / f): Works both before consonant (typewriter style) and after consonant
 * 4. Paden Ra ('्र' / z):
 *    - Consonant + '्र' -> क्र, प्र, ग्र, ब्र, ट्र, ड्र, त्र, etc.
 *    - '्र' + Consonant -> क्र, प्र, etc.
 * 5. Reph ('र्' / Shift+Z):
 *    - Consonant + 'र्' -> र्म, र्क, etc.
 *    - 'र्' + Consonant -> र्म, र्क, etc.
 * 6. Remington Ligature Combinations:
 *    - क् + त -> क्त
 *    - त् + र -> त्र
 *    - द् + व -> द्व
 *    - द् + ध -> द्ध
 *    - द् + य -> द्य
 *    - श् + र -> श्र
 *    - स् + त्र -> स्त्र
 */
export function combineDevLysSequence(previousText: string, nextChar: string): string {
  if (!previousText) return nextChar;

  // RULE 1: Half-letter + aa-matra 'ा' -> Full letter
  if (nextChar === 'ा') {
    // Vowel combination: अ + ा -> आ
    if (previousText.endsWith('अ')) {
      return previousText.slice(0, -1) + 'आ';
    }

    const HALF_TO_FULL: Record<string, string> = {
      'ख्': 'ख',
      'क्ष्': 'क्ष',
      'ण्': 'ण',
      'ध्': 'ध',
      'घ्': 'घ',
      'थ्': 'थ',
      'भ्': 'भ',
      'श्': 'श',
      'ष्': 'ष',
      'क्': 'क',
      'ग्': 'ग',
      'ब्': 'ब',
      'म्': 'म',
      'त्': 'त',
      'ज्': 'ज',
      'ल्': 'ल',
      'न्': 'न',
      'प्': 'प',
      'व्': 'व',
      'च्': 'च',
      'स्': 'स',
      'झ': 'झ',
    };

    for (const [half, full] of Object.entries(HALF_TO_FULL)) {
      if (previousText.endsWith(half)) {
        return previousText.slice(0, -half.length) + full;
      }
      // If candidate typed prefix ि before half-letter then added aa-matra (e.g. f ' k -> शि)
      if (previousText.endsWith(half + 'ि')) {
        return previousText.slice(0, -(half.length + 1)) + full + 'ि';
      }
    }
  }

  // RULE 2: Vowel combinations
  if (nextChar === 'े' && previousText.endsWith('आ')) {
    return previousText.slice(0, -1) + 'ओ';
  }
  if (nextChar === 'ै' && previousText.endsWith('आ')) {
    return previousText.slice(0, -1) + 'औ';
  }
  if (nextChar === 'े' && previousText.endsWith('ए')) {
    return previousText.slice(0, -1) + 'ऐ';
  }
  if (nextChar === 'ू' && previousText.endsWith('उ')) {
    return previousText.slice(0, -1) + 'ऊ';
  }
  if (nextChar === 'र्' && previousText.endsWith('इ')) {
    return previousText.slice(0, -1) + 'ई';
  }

  // RULE 3: Chhoti i matra 'ि' (Key f)
  // Remington typewriter style: 'ि' typed BEFORE consonant -> reorders after consonant (e.g. ि + क -> कि)
  if (previousText.endsWith('ि') && !/[\u0915-\u0939]ि$/.test(previousText)) {
    const isConsonant = /^[\u0915-\u0939]/.test(nextChar);
    if (isConsonant) {
      return previousText.slice(0, -1) + nextChar + 'ि';
    }
  }

  // RULE 4: Paden Ra ('्र' / Key z)
  // Sub-rule 4A: Consonant + '्र' -> Combines into paden cluster
  if (nextChar === '्र') {
    // If previous ends with special consonants
    if (previousText.endsWith('क')) return previousText.slice(0, -1) + 'क्र';
    if (previousText.endsWith('प')) return previousText.slice(0, -1) + 'प्र';
    if (previousText.endsWith('ग')) return previousText.slice(0, -1) + 'ग्र';
    if (previousText.endsWith('ब')) return previousText.slice(0, -1) + 'ब्र';
    if (previousText.endsWith('ट')) return previousText.slice(0, -1) + 'ट्र';
    if (previousText.endsWith('ठ')) return previousText.slice(0, -1) + 'ठ्र';
    if (previousText.endsWith('ड')) return previousText.slice(0, -1) + 'ड्र';
    if (previousText.endsWith('द')) return previousText.slice(0, -1) + 'द्र';
    if (previousText.endsWith('त')) return previousText.slice(0, -1) + 'त्र';
    if (previousText.endsWith('भ')) return previousText.slice(0, -1) + 'भ्र';
    if (previousText.endsWith('म')) return previousText.slice(0, -1) + 'म्र';
    if (previousText.endsWith('श')) return previousText.slice(0, -1) + 'श्र';
    if (previousText.endsWith('व')) return previousText.slice(0, -1) + 'व्र';
    if (previousText.endsWith('च')) return previousText.slice(0, -1) + 'च्र';
    if (previousText.endsWith('ज')) return previousText.slice(0, -1) + 'ज्र';
    if (previousText.endsWith('फ')) return previousText.slice(0, -1) + 'फ्र';
    if (previousText.endsWith('स')) return previousText.slice(0, -1) + 'स्र';
    if (previousText.endsWith('ह')) return previousText.slice(0, -1) + 'ह्र';
  }

  // Sub-rule 4B: '्र' typed BEFORE consonant -> reorders into paden cluster
  if (previousText.endsWith('्र') && /^[\u0915-\u0939]/.test(nextChar)) {
    if (nextChar === 'क') return previousText.slice(0, -1) + 'क्र';
    if (nextChar === 'प') return previousText.slice(0, -1) + 'प्र';
    if (nextChar === 'ग') return previousText.slice(0, -1) + 'ग्र';
    if (nextChar === 'ब') return previousText.slice(0, -1) + 'ब्र';
    if (nextChar === 'ट') return previousText.slice(0, -1) + 'ट्र';
    if (nextChar === 'ड') return previousText.slice(0, -1) + 'ड्र';
    if (nextChar === 'त') return previousText.slice(0, -1) + 'त्र';
    return previousText.slice(0, -1) + nextChar + '्र';
  }

  // RULE 5: Reph ('र्' / Shift+Z)
  // Handles both mechanical typewriter order (consonant + Z -> र्म)
  // and modern Remington GAIL order (Z + consonant -> र्म)
  if (nextChar === 'र्') {
    if (previousText.endsWith('इ')) {
      return previousText.slice(0, -1) + 'ई';
    }
    if (previousText.endsWith('द्ध')) {
      return previousText.slice(0, -2) + 'र्द्ध';
    }

    // Attach Reph to the preceding consonant cluster if appropriate
    const match = previousText.match(
      /([\u0915-\u0939](?:[\u094d][\u0915-\u0939])*(?:[\u093f\u0940\u0941\u0942\u0947\u0948\u0901\u0902\u0903\u0943]?))$/
    );
    if (match) {
      const cluster = match[1];
      const prefix = previousText.slice(0, -cluster.length);
      return prefix + 'र्' + cluster;
    }
  }

  // If candidate typed 'र्' first, then typed consonant (Remington GAIL order):
  if (previousText.endsWith('र्') && /^[\u0915-\u0939]/.test(nextChar)) {
    return previousText + nextChar;
  }

  // RULE 6: Common Remington Ligature Combinations
  // क् + त -> क्त
  if (previousText.endsWith('क्') && nextChar === 'त') {
    return previousText.slice(0, -2) + 'क्त';
  }
  // त् + र -> त्र
  if (previousText.endsWith('त्') && nextChar === 'र') {
    return previousText.slice(0, -2) + 'त्र';
  }
  // द् + व -> द्व
  if (previousText.endsWith('द') && nextChar === 'व') {
    return previousText.slice(0, -1) + 'द्व';
  }
  // द् + ध -> द्ध
  if (previousText.endsWith('द') && (nextChar === 'ध' || nextChar === 'घ्')) {
    return previousText.slice(0, -1) + 'द्ध';
  }
  // द् + य -> द्य
  if (previousText.endsWith('द') && nextChar === 'य') {
    return previousText.slice(0, -1) + 'द्य';
  }
  // श् + र -> श्र
  if (previousText.endsWith('श्') && nextChar === 'र') {
    return previousText.slice(0, -2) + 'श्र';
  }
  // स् + त्र -> स्त्र
  if (previousText.endsWith('स्') && nextChar === 'त्र') {
    return previousText.slice(0, -2) + 'स्त्र';
  }

  return previousText + nextChar;
}

/**
 * Tokenizes text into words
 */
export function tokenizeWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Normalizes Devanagari text for strict RSSB exam word comparison.
 * Handles Unicode precomposed vs decomposed nuktas, DevLys '.' vs '-',
 * purnaviram variants, and zero-width joiners.
 */
export function normalizeHindiWord(w: string): string {
  if (!w) return '';
  return w
    .normalize('NFC')
    .replace(/[\u200C\u200D]/g, '') // remove zero-width joiners/non-joiners
    .replace(/[\.\-–—]/g, '-')
    .replace(/[\u093C]/g, '') // strip optional nukta for forgiving matching
    .replace(/[।\.,;:\-–—\?!'"]/g, '')
    .trim();
}

/**
 * Checks for redundant / repeated matras or bad key sequences
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

  const areWordsEquivalent = (typed: string, target: string): boolean => {
    if (typed === target) return true;
    const normTyped = normalizeHindiWord(typed);
    const normTarget = normalizeHindiWord(target);
    if (normTyped.length > 0 && normTyped === normTarget) return true;

    // Direct string comparison without punctuation
    const stripPunct = (s: string) => s.replace(/[।\.,;:\-–—\?!'"]/g, '');
    const sTyped = stripPunct(typed);
    const sTarget = stripPunct(target);
    return sTyped.length > 0 && sTyped === sTarget;
  };

  for (let i = 0; i < typedCount; i++) {
    if (i < totalWordsTarget && areWordsEquivalent(typedWords[i], targetWords[i])) {
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
