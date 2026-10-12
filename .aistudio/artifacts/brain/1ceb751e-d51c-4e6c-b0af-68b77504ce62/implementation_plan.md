# Comprehensive Audit & Feature Enhancement: RSSB LDC Phase II Simulator

An updated, high-fidelity implementation plan to audit and enrich the simulator against all 8 pages of the official Rajasthan Staff Selection Board (RSSB / RSMSSB) Jaipur notification (dated 12-12-2024) and all 7 uploaded exam screenshots.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on our re-audit of the official PDF notification and your answers:

- **Confirmed Decision 1 (MS Excel 2013 Engine)**: As explicitly mandated on Page 2 of the notification (*"दक्षता परीक्षण MS WORD 2013 एवं MS EXCEL 2013 में दोनों भाषाओं में करायी जायेगी"*), we are adding a full **MS Excel 2013 Spreadsheet Simulator** alongside MS Word 2013, with real formula calculations (`=SUM`, `=AVERAGE`, `=MAX`, `=MIN`, `=COUNT`), cell formatting, grid styling, and 15 auto-checked spreadsheet tasks.
- **Confirmed Decision 2 (Question Paper Display)**: As mandated on Page 2 (*"दक्षता परीक्षण का प्रश्न पत्र अभ्यर्थियों को परीक्षा के समय अलग से दिया जायेगा"*), we will provide both a **Docked Side Question Panel** and a toggleable **Physical Question Paper Handout View** (replicating the official printed exam sheet distributed by invigilators).
- **Confirmed Decision 3 (Screenshot 7 Confirmation Screen)**: Recreate the exact **Efficiency Exam Confirmation Screen** (Screenshot 7 / Page 8) showing the candidate details, password input, and the formatted document/sheet preview beneath it.
- **Confirmed Decision 4 (Hindi Keystroke Redundancy Inspector)**: Implement the specific error-audit mechanism highlighted in Page 2 regarding invisible repeated matras (e.g. `dsssssoy` vs `dsoy`, `ik` vs `i`), alerting candidates to redundant keystrokes.

---

## 1. Overview & Core Concept

### What It Delivers
A complete, airtight simulation of the RSMSSB LDC Phase-II exam environment matching all 8 pages and 7 screenshots with zero functional gaps:
1. **Login & Peripheral Check Screens (Screens 1 & 2)**: Exact layout, guidelines, timer, and keyboard test box.
2. **Speed Tests (Paper 1 & Paper 2)**:
   - Hindi (400 words, 0.0625 mark/w, DevLys 010 Remington GAIL engine).
   - English (500 words, 0.05 mark/w).
   - Strict Rule 10 single-word backspace locking (locks once Space/Enter is pressed).
   - Complete keystroke logger that audits invisible matra redundancies (`dsssssoy`).
3. **Speed Test Preview & Password Confirmation Screens (Screens 4 & 5)**: Candidate verification and password authorization.
4. **Efficiency Tests (Paper 3 & Paper 4)**:
   - **MS Word 2013 Simulation**: Full Ribbon (Home, Page Layout, Insert, View), 15 tasks, paragraph formatting, table styling, header/footer, find/replace.
   - **MS Excel 2013 Simulation**: Formula bar, grid cells (A1:E8), mathematical formulas, formatting, borders, cell fill, alignment, 15 spreadsheet tasks.
   - **Physical Question Paper Handout Mode**: Toggleable printable paper sheet matching the official handout described in Page 2.
5. **Efficiency Confirmation Screen (Screenshot 7 / Page 8)**: Authenticated password submission with document review.
6. **Final Uploading Screen & Scorecard (Screens 8 & 9)**: 4-paper upload checklist, Secretary Dr. B. C. Badhal signature, and comprehensive 100-mark evaluation with 9.0 per-paper cutoff check.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Official Full Exam Sequence (100 Marks · 40 Mins)**:
   - **Step 1**: Login Screen (User ID, Password, Guidelines checkbox).
   - **Step 2**: Peripheral Check (02:00 timer, Hindi Remington & English check, skip button).
   - **Step 3**: Paper 1 Hindi Speed Test (10:00 timer, DevLys 010, strict backspace rule).
   - **Step 4**: Paper 1 Preview & Password Confirmation (01:00 timer).
   - **Step 5**: Paper 2 English Speed Test (10:00 timer, 500 words target).
   - **Step 6**: Paper 2 Preview & Password Confirmation (01:00 timer).
   - **Step 7**: Paper 3 Hindi Efficiency Exam (Choice of MS Word 2013 or MS Excel 2013, 15 tasks, live scoring, question paper sheet view).
   - **Step 8**: Paper 3 Efficiency Confirmation Screen (Screenshot 7 / Page 8).
   - **Step 9**: Paper 4 English Efficiency Exam (MS Word / Excel 2013, 15 tasks).
   - **Step 10**: Paper 4 Efficiency Confirmation Screen.
   - **Step 11**: Final Uploading Screen (Secretary signature badge & upload checklist).
   - **Step 12**: Official 100-Mark Scorecard with per-paper 9.0 passing evaluation.

2. **Standalone Training Modules**:
   - **Speed Drills Arena**: Configurable timers (2, 5, 10 min), custom passages, Hindi DevLys / English, with instant Keystroke Inspector analyzing redundant matras.
   - **Word 2013 Efficiency Lab**: Unrestricted formatting practice with hints and instant auto-grader.
   - **Excel 2013 Efficiency Lab**: Interactive spreadsheet training on formulas, formatting, and tables.
   - **DevLys 010 Remington Visual Keyboard**: Interactive QWERTY-to-Hindi mapping and Alt-codes dictionary.

---

## 3. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
├────────────────────────────────────────────────────────────────────────┤
│ Header: Top Bar Contract (Wordmark · 5 Single-Line Links · Action CTA) │
├────────────────────────────────────────────────────────────────────────┤
│                             ROUTED VIEWS                               │
│ ┌─────────────────────────┬─────────────────────────┬────────────────┐ │
│ │   Full Official Exam    │   Speed Drills Arena    │ Efficiency Lab │ │
│ │   (12-Step Lifecycle)   │   + Keystroke Audit     │ (Word & Excel) │ │
│ └────────────┬────────────┴────────────┬────────────┴───────┬────────┘ │
│              │                         │                    │          │
│              ▼                         ▼                    ▼          │
│ ┌────────────────────────┐ ┌──────────────────────┐ ┌────────────────┐ │
│ │ Exam Steps             │ │ TypingEngine         │ │ Word 2013 Sim  │ │
│ │ 1. LoginScreen         │ │ • DevLys 010 Map     │ │ + 15 Tasks     │ │
│ │ 2. PeripheralCheck     │ │ • Strict Backspace   │ ├────────────────┤ │
│ │ 3. SpeedTestRunner     │ │ • Keystroke Logger   │ │ Excel 2013 Sim │ │
│ │ 4. PreviewConfirm      │ │ • Redundancy Audit   │ │ • Grid & Math  │ │
│ │ 5. EfficiencyRunner    │ └──────────────────────┘ │ • 15 Tasks     │ │
│ │ 6. EfficiencyConfirm   │                          ├────────────────┤ │
│ │ 7. FinalUploadScreen   │                          │ Question Paper │ │
│ │ 8. ScorecardModal      │                          │ Handout Modal  │ │
│ └────────────────────────┘                          └────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Specific Implementation Steps

1. **Excel 2013 Spreadsheet Engine (`src/components/exam/ExcelEfficiencyRunner.tsx`)**:
   - Replicate Excel 2013 ribbon: Home (Font, Alignment, Number format, Cells, AutoSum), Insert, Page Layout.
   - Working formula evaluator: `=SUM(C2:C5)`, `=AVERAGE(D2:D5)`, `=MAX`, `=MIN`, `=COUNT`.
   - 15 official Excel tasks (e.g. Calculate Total with formula, Bold header row, Apply currency symbol `₹` or `Rs.`, Border lines, Center align text, Apply yellow fill).
   - Auto-check engine validating cell values, formulas, and visual formatting.

2. **Question Paper Handout Modal (`src/components/exam/QuestionPaperHandoutModal.tsx`)**:
   - Renders the official physical question paper sheet distributed during the exam (*"दक्षता परीक्षण का प्रश्न पत्र अभ्यर्थियों को परीक्षा के समय अलग से दिया जायेगा"*).
   - Formatted with official header, signature line for invigilator, and numbered tasks.

3. **Efficiency Exam Confirmation Screen (`src/components/exam/EfficiencyConfirmScreen.tsx`)**:
   - Exactly matches Screenshot 7 / Page 8 with title "हिन्दी दक्षता परीक्षा Confirmation Screen", remaining time counter, password authorization, and read-only view of the finished work.

4. **Keystroke Redundancy & Invisible Matra Auditor (`src/utils/remingtonEngine.ts`)**:
   - Tracks raw keystrokes vs target tokens.
   - Detects repeated matras (like `dsssssoy`) and wrong sequence (like `ik` for `i`), displaying detailed warnings in the score breakdown.

5. **Navigation & Lab Enhancements in `App.tsx`**:
   - Add Excel efficiency tab in the Lab, allowing users to toggle between MS Word 2013 and MS Excel 2013.
   - Wire all new screens seamlessly into the 100-mark official flow.

6. **Build Verification**:
   - Compile and lint using `compile_applet` and `lint_applet` to confirm zero errors.
