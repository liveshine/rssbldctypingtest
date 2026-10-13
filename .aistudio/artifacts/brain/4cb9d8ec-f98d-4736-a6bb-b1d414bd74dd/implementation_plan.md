# Standard DevLys 010 (Remington GAIL) Architecture & Engine Overhaul

Replace the existing custom typing map with the official Rajasthan Staff Selection Board (RSMSSB/RSSB) **Standard Remington GAIL (DevLys 010 / Kruti Dev 010)** keyboard mapping and keystroke conversion engine across all exam and drill interfaces.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified and confirmed for this overhaul:
> - **Layout Standard**: Official **Remington GAIL (DevLys 010 / Kruti Dev 010)** as standardized by RSSB/RSMSSB for Rajasthan LDC Clerk Grade-II & Junior Assistant exams.
> - **Special Ligatures & Characters**: Dual support for both mechanical Remington key combinations (e.g., `d` + `z` $\to$ `क्र`, `Shift+D` + `k` $\to$ `क`) and official Windows NumPad Alt codes (`Alt+0216` $\to$ `क्र`, `Alt+0228` $\to$ `क्त`, `Alt+0161` $\to$ `ॅ`, `Alt+0217` $\to$ `त्र`, etc.).
> - **Implementation Scope**: Full replacement across the core typing engine (`remingtonEngine.ts`), keyboard visualizer (`KeyboardVisualizer.tsx`), exam typing runner (`SpeedTestRunner.tsx`), and practice arena (`SpeedDrillArena.tsx`).

---

## 1. Overview & Core Concept

- **What It Does**: Upgrades the entire simulator's Hindi input architecture to strictly adhere to the official Remington GAIL standard. Candidates can type Hindi using standard DevLys 010 / Kruti Dev 010 finger positions, standard shift rules, authentic matra sequences, and NumPad Alt codes.
- **Target Audience**: Candidates preparing for the Rajasthan RSSB/RSMSSB LDC Clerk Grade-II / Junior Assistant Phase II skill test who require 100% faithful exam-day keyboard parity.
- **Key Value**: Eliminates discrepancies between real DevLys 010 typewriter behavior and web-based input, ensuring seamless muscle-memory transfer for candidates.

---

## 2. User Experience & Visual Design

- **Visual Chart & Visualizer Layout**:
  - Exact 1:1 match with the standard `KRUTIDEV KEYBOARD (HINDI FONT)` reference poster.
  - Alphanumeric keys display the 4-quadrant split:
    - **Top-Left**: Shift Hindi character (e.g., `फ`, `ॅ`, `म्`, `त्`, `ज्ञ`, `श्र`, `।`, `ै`, `र्`).
    - **Bottom-Left**: Normal Hindi character (e.g., `ु`, `ू`, `म`, `त`, `ा`, `र`, `ं`, `े`, `्र`).
    - **Top-Right**: Shift English key / symbol (`Q`, `W`, `E`, `R`, `Z`, `!`, `@`, `#`).
    - **Bottom-Right**: Normal English key / symbol (`q`, `w`, `e`, `r`, `z`, `1`, `2`, `3`).
  - `Z` key: Upper-Left is **र्** (Reph), Lower-Left is **्र** (Paden Ra), Upper-Right is **Z**, Lower-Right is **z**.
  - Special function keys: `Tab` (`|⟵ ⟶|`), `Caps Lock`, `Enter`, `Shift` (`⇧`), `Backspace` (`⟵`), `space` (lowercase centered), `win` (roman serif font), and hardware context menu key.
  - Complete 4-column standard NumPad Alt Code table (`ALT + 0161` through `ALT + 0243`) displayed in clean typography below the chassis.
- **Interactive Feedback**:
  - Real-time active key depression highlights in red/blue on the visualizer when physical keys are pressed during test sessions.
  - Smooth DevLys keystroke sequence combination (half letters + aa-matra `k` $\to$ full consonants; prefix chhoti-i `f` $\to$ attached vowel matra).
  - Alt-code buffer recognition: typing `Alt` + 4-digit code directly outputs the corresponding DevLys 010 ligature without breaking input flow.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Standard Remington GAIL vs. Remington CBI**
  - *Chosen Approach*: Official Remington GAIL (DevLys 010).
  - *Why*: Explicitly required by the RSSB Rajasthan government notification: *"Standard की-बोर्ड एवं DevLys 010 फॉन्ट का प्रयोग किया जायेगा"*.
- **Decision 2: Keystroke Combination & Matra Attachment Architecture**
  - *Chosen Approach*: Multi-stage phonetic assembler in `remingtonEngine.ts`:
    1. Base Key Mapping (`REMINGTON_KEY_MAP` and `SHIFTED_SYMBOL_MAP`).
    2. Ligature Assembler (`combineDevLysSequence`): handles half-consonant + `k` $\to$ full letter; `f` (ि) + consonant $\to$ consonant + ि; `Shift+Z` (र्) and `z` (्र) positioning.
    3. NumPad Alt-Code Decoder: listens for `Alt` keydown + numeric sequence (`0161`–`0243`) and injects the corresponding Devanagari character.
  - *Why*: Browser standard inputs do not natively understand DevLys font code points in Unicode mode; the assembler bridges native keyboard events into Devanagari Unicode with 100% Remington fidelity.
- **Decision 3: Zero-Disruption Rollout Across All Modes**
  - *Chosen Approach*: Centralized in `src/utils/remingtonEngine.ts` and uniformly imported by `SpeedTestRunner.tsx`, `SpeedDrillArena.tsx`, and `KeyboardVisualizer.tsx`.
  - *Why*: Prevents any state drift between exam simulation mode and practice drill mode.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User Keystroke Input Event                       │
│                   (KeyboardEvent: key, code, shift, alt)               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Remington GAIL Standard Engine (remingtonEngine.ts)      │
│  ┌──────────────────────┐  ┌─────────────────────┐  ┌────────────────┐ │
│  │ Standard DevLys 010  │  │  Ligature Sequence  │  │ NumPad AltCode │ │
│  │ Primary Key Map      │  │  Assembler          │  │ Decoder        │ │
│  │ (z=्र, Z=र्, d=क,...)│  │  (half+k, f+cons...)│  │ (Alt+0216=क्र) │ │
│  └──────────────────────┘  └─────────────────────┘  └────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ SpeedTestRunner  │       │ SpeedDrillArena  │       │KeyboardVisualizer│
│ (Exam Paper 1)   │       │ (Practice Bank)  │       │ (Exact Poster)   │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

### Data Structures & Map Tables to be Standardized:

1. **`REMINGTON_KEY_MAP`**: Complete 47-key specification for standard DevLys 010 / Kruti Dev 010.
2. **`SHIFTED_SYMBOL_MAP`**: Complete shifted symbol fallback for browser keyboard variations.
3. **`ALT_CODES_MAP`**: Full 4-column dictionary for special Hindi ligatures:
   - `0161` $\to$ `ॅ`, `0165` $\to$ `ञ`, `0170` $\to$ `^`, `0182` $\to$ `फ्`, `0183` $\to$ `ऽ`, `0184` $\to$ `ृ`, `0187` $\to$ `÷`, `0188` $\to$ `(`, `0189` $\to$ `)`
   - `0190` $\to$ `=`, `0191` $\to$ `[`, `0192` $\to$ `]`, `0197` $\to$ `ॐ`, `0204` $\to$ `द्ध`, `0205` $\to$ `द्`, `0206` $\to$ `द्व`, `0207` $\to$ `ड्ढ`, `02012` $\to$ `ङ्ग`
   - `0216` $\to$ `क्र`, `0217` $\to$ `त्र`, `0218` $\to$ `=`, `0220` $\to$ `्र`, `0221` $\to$ `फ्र`, `0222` $\to$ `़`, `0223` $\to$ `·`, `0224` $\to$ `ष्ठ`, `0225` $\to$ `ह्य`, `0226` $\to$ `हृ`
   - `0227` $\to$ `ह्म`, `0228` $\to$ `क्त`, `0229` $\to$ `०`, `0233` $\to$ `श्र`, `0243` $\to$ `स्त्र`
4. **Assembler Rules (`combineDevLysSequence`)**:
   - `Half-Consonant` + `k` (`ा`) $\to$ `Full Consonant`
   - `अ` + `k` (`ा`) $\to$ `आ`
   - Standalone `f` (`ि`) followed by consonant $\to$ `Consonant` + `ि`
   - `र्` (Reph) attachment to syllable consonants
   - `्र` (Paden Ra) attachment to consonants

---

## 5. Verification Plan

1. **Automated Verification**: Run `compile_applet` and `lint_applet` to confirm 0 build errors.
2. **Typing Test Verification**:
   - Test regular word input (`dsoy` $\to$ `केवल`, `jktLFkku` $\to$ `राजस्थान`).
   - Test Z key: `z` produces `्र` (e.g. `d` + `z` $\to$ `क्र`), Shift+Z (`Z`) produces `र्` (e.g. `d` + `Z` + `e` $\to$ `कर्म`).
   - Test Alt codes: `Alt+0216` outputs `क्र`, `Alt+0217` outputs `त्र`, `Alt+0228` outputs `क्त`.
3. **Visual Alignment**: Verify `KeyboardVisualizer` accurately renders all 5 rows and the 4-column Alt code table matching the official poster.
