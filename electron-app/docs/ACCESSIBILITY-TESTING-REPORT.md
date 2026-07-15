# CareConnect Desktop - Accessibility Testing Report

**Assignment 9 - SWEN 661**
**Date:** 2026-07-09
**Tester:** Ryan Morris (QA Lead)
**Application:** CareConnect Desktop (Electron + React)
**Standard:** WCAG 2.1 Level AA

---

## 1. Executive Summary

Comprehensive accessibility testing was conducted on the CareConnect desktop application using three methods: automated scanning with axe DevTools, manual screen reader testing with NVDA (Windows), and keyboard-only navigation testing. Twelve accessibility issues were identified across WCAG 2.1 Level AA criteria. All identified issues have been resolved. Test coverage remains above 60% (202 tests across 19 suites), exceeding the minimum requirement.

---

## 2. Testing Methodology

### 2.1 Automated Accessibility Testing (axe DevTools)

axe DevTools browser extension was used to scan all views of the application:
- Today's Plan view (default)
- Care Team view
- All dialog states (Task Detail, Settings, Help, Emergency, New Reminder, Confirmation)
- High contrast and dark mode variants

### 2.2 Screen Reader Testing (NVDA)

NVDA screen reader (Windows) was used to verify:
- All interactive elements are announced with correct names, roles, and states
- Landmark navigation functions correctly (banner, navigation, main, complementary)
- Dialog focus management and modal behavior
- Live region announcements for status changes
- Heading hierarchy navigation

### 2.3 Keyboard Navigation Testing

All application functionality was tested using keyboard-only input:
- Tab/Shift+Tab navigation order
- Skip link functionality
- Keyboard shortcuts (Ctrl+N, Ctrl+S, Ctrl+F, Ctrl+1, Ctrl+2, Ctrl+,, F1, F2)
- Enter/Space activation of interactive elements
- Escape to close dialogs and search
- Form field navigation within dialogs

---

## 3. Issues Identified and Resolved

### Issue 1: Invalid HTML Nesting in TaskList

| Field | Value |
|-------|-------|
| WCAG Criterion | 4.1.1 Parsing |
| Severity | Moderate |
| Component | `TaskList.jsx` |
| Description | `<p>` elements nested inside `<button>` elements, which is invalid HTML. Block-level elements inside phrasing content can cause unpredictable screen reader behavior. |
| Resolution | Replaced `<p>` with `<span>` elements styled with `display: block` via CSS. |

### Issue 2: StatsRow Lacks Semantic Grouping

| Field | Value |
|-------|-------|
| WCAG Criterion | 1.3.1 Info and Relationships |
| Severity | Moderate |
| Component | `StatsRow.jsx` |
| Description | Statistics cards were plain `<div>` elements. Screen readers could not associate numeric values with their labels or convey the grouping relationship. |
| Resolution | Added `role="group"` with descriptive `aria-label` attributes to the stats container and each stat card (e.g., `aria-label="Tasks done: 2 of 5"`). Visual-only values marked with `aria-hidden="true"` to prevent double-reading. |

### Issue 3: HelperCard Buttons Lack Contextual Labels

| Field | Value |
|-------|-------|
| WCAG Criterion | 2.4.6 Headings and Labels, 4.1.2 Name, Role, Value |
| Severity | Serious |
| Component | `CareTeamPage.jsx` (HelperCard) |
| Description | "Edit" and "Remove" buttons had no contextual information about which helper they operate on. When multiple helper cards are present, a screen reader user cannot distinguish between them. |
| Resolution | Added `aria-label` attributes that include the helper name (e.g., `aria-label="Edit Sarah Johnson"`, `aria-label="Remove Robert Chen"`). |

### Issue 4: Form Error Messages Not Linked to Inputs

| Field | Value |
|-------|-------|
| WCAG Criterion | 3.3.1 Error Identification |
| Severity | Serious |
| Component | `NewAppointmentDialog.jsx` |
| Description | When validation errors appear, they have `role="alert"` for announcement but the corresponding input fields did not reference the error via `aria-describedby`. Screen readers would announce the error as a page-level alert but not associate it with the specific field. |
| Resolution | Added `id` attributes to error message elements and conditional `aria-describedby` attributes on inputs that reference the error when present. |

### Issue 5: Active Navigation Button Missing ARIA State

| Field | Value |
|-------|-------|
| WCAG Criterion | 4.1.2 Name, Role, Value |
| Severity | Moderate |
| Component | `AppHeader.jsx` |
| Description | The active view button (Today's Plan or Care Team) had visual styling but no programmatic indicator for assistive technology. |
| Resolution | Added `aria-current="true"` to the active navigation button. |

### Issue 6: Document Title Not Updated on View Change

| Field | Value |
|-------|-------|
| WCAG Criterion | 2.4.2 Page Titled |
| Severity | Moderate |
| Component | `App.jsx` |
| Description | The document title remained "CareConnect" when switching between Today's Plan and Care Team views. Users relying on assistive technology had no indication of the current view from the page title. |
| Resolution | Added a `useEffect` hook that updates `document.title` to reflect the active view (e.g., "Today's Plan - CareConnect", "Care Team - CareConnect"). |

### Issue 7: Active Toolbar Button Outline Conflicts with Focus Indicator

| Field | Value |
|-------|-------|
| WCAG Criterion | 2.4.7 Focus Visible |
| Severity | Moderate |
| Component | `app.css` |
| Description | The `.toolbar-btn--active` CSS class applied the same `outline` style as the `:focus-visible` indicator, making it impossible to distinguish whether a button is active, focused, or both. |
| Resolution | Replaced the active-state outline with an `inset box-shadow` underline effect, keeping the `:focus-visible` outline unobstructed. |

### Issue 8: Task Detail Dialog Lacks Semantic Structure

| Field | Value |
|-------|-------|
| WCAG Criterion | 1.3.1 Info and Relationships |
| Severity | Moderate |
| Component | `TaskDetailDialog.jsx` |
| Description | Task details (Status, Type, Time, Location, Notes) were presented as `<p>` elements inside `<div>` containers, with no semantic relationship between labels and values. Screen readers treated them as unrelated paragraphs. |
| Resolution | Converted to a `<dl>` (definition list) structure using `<dt>` for labels and `<dd>` for values. This provides native semantics via `term` and `definition` ARIA roles. |

### Issue 9: Emergency Confirmed State Missing Status Role

| Field | Value |
|-------|-------|
| WCAG Criterion | 4.1.3 Status Messages |
| Severity | Moderate |
| Component | `EmergencyDialog.jsx` |
| Description | When the emergency countdown completes and help is confirmed, the confirmation message was not announced to assistive technology as a status update. |
| Resolution | Added `role="status"` to the confirmed-phase container, ensuring the "Help Is On The Way" message is announced by screen readers without requiring focus. |

### Issue 10: HeroCard and HelperCard Cause NVDA Double-Reading

| Field | Value |
|-------|-------|
| WCAG Criterion | 4.1.2 Name, Role, Value |
| Severity | Serious |
| Component | `HeroCard.jsx`, `CareTeamPage.jsx` (HelperCard) |
| Description | Cards used `role="button"` with `aria-labelledby` pointing to child elements. NVDA would announce both the accessible name and all visible child text, resulting in confusing double-read output that sounded like "code structure." The hero card's location was also not conveyed in a single focusable announcement. |
| Resolution | Replaced `aria-labelledby` with a single `aria-label` that includes all relevant info (name, time, location for hero card; name, role, availability, phone for helper cards). Marked all visual child content as `aria-hidden="true"` to eliminate double-reading. |

### Issue 11: Informational Dialogs Announced as Forms by NVDA

| Field | Value |
|-------|-------|
| WCAG Criterion | 1.3.1 Info and Relationships |
| Severity | Minor |
| Component | `TaskDetailDialog.jsx`, `CompletionDialog.jsx`, `HelpDialog.jsx`, `SavePlanConfirmationDialog.jsx`, `CareTeamPage.jsx` (HelperDetailDialog) |
| Description | Read-only dialogs (task detail, completion, help, etc.) used `<form method="dialog">` as a wrapper, causing NVDA to announce "form" when entering the dialog even though no form inputs were present. |
| Resolution | Replaced `<form method="dialog">` with `<div>` in all informational dialogs. Dialogs with actual inputs (settings, new reminder, helper forms) retain their `<form>` elements. |

### Issue 12: StatsRow Verbose Screen Reader Output

| Field | Value |
|-------|-------|
| WCAG Criterion | 4.1.2 Name, Role, Value |
| Severity | Minor |
| Component | `StatsRow.jsx` |
| Description | Each stat card used `role="group"` with `aria-label`, but the child text labels repeated the same information, causing redundant NVDA output. |
| Resolution | Changed the container to `role="status"` with a single `aria-label` summarizing all stats. Marked all child content `aria-hidden="true"` so NVDA reads one clean announcement. |

---

## 4. Keyboard Navigation Verification

| Action | Shortcut | Result |
|--------|----------|--------|
| Skip to main content | Tab (first focus) | PASS - Skip link is first focusable element |
| New reminder | Ctrl+N | PASS |
| Save plan | Ctrl+S | PASS |
| Search tasks | Ctrl+F | PASS - Focus moves to search input |
| Today's Plan view | Ctrl+1 | PASS |
| Care Team view | Ctrl+2 | PASS |
| Settings | Ctrl+, | PASS |
| Help / Shortcuts | F1 | PASS |
| Emergency help | F2 | PASS |
| Close dialog / search | Escape | PASS |
| Activate hero card | Enter or Space | PASS |
| Tab through toolbar | Tab / Shift+Tab | PASS - All 7 buttons reachable |
| Tab through task list | Tab | PASS |
| Navigate form fields | Tab | PASS |
| Close dialog via X button | Tab to close + Enter | PASS |

---

## 5. Screen Reader Testing Notes (NVDA)

### Landmarks
- Banner landmark ("CareConnect") announced on entry
- Navigation landmark ("CareConnect toolbar") announced with all buttons
- Main landmark accessible via skip link
- Complementary landmark ("Plan summary") announced for sidebar

### Dialogs
- All dialogs announced by heading when opened
- Focus trapped within modal dialogs
- Close button announced as "Close, button"
- Escape key dismisses all dialogs

### Live Regions
- Task completion announcements read via `aria-live="polite"` region
- Save confirmations and cancellations announced
- Emergency countdown provides `aria-label` updates each second

### Content Structure
- Heading navigation (H key) follows logical hierarchy: h1 > h2
- Task list announced as "Task list, list" with item count
- Definition list in task detail read as term-definition pairs
- Stats announced as a single status: "Tasks done: X of Y. Pending: Z."
- Hero card reads one clean announcement including title, time, and location
- Helper cards read one clean announcement including name, role, availability, and phone

---

## 6. Test Coverage Report

```
File                             | % Stmts | % Branch | % Funcs | % Lines
---------------------------------|---------|----------|---------|--------
All files                        |   89.87 |    81.62 |   87.75 |   91.35
 electron-app                    |   88.77 |    89.13 |   77.77 |   88.29
  main.js                        |   87.77 |    89.13 |      75 |   87.50
  preload.js                     |     100 |      100 |     100 |     100
 electron-app/src                |   90.37 |    82.85 |   87.50 |   89.65
  App.jsx                        |   89.59 |    80.95 |   86.36 |   88.75
  data.js                        |     100 |      100 |     100 |     100
  planExport.js                  |     100 |      100 |     100 |     100
 electron-app/src/components     |   89.91 |    80.19 |   91.07 |   93.31
  AppHeader.jsx                  |     100 |      100 |     100 |     100
  CareTeamPage.jsx               |   90.51 |    78.26 |   88.88 |   93.96
  CompletionDialog.jsx           |   91.66 |       75 |     100 |     100
  EmergencyDialog.jsx            |   94.73 |    87.87 |   91.66 |   93.75
  HelpDialog.jsx                 |      80 |       80 |     100 |     100
  HeroCard.jsx                   |     100 |    87.50 |     100 |     100
  NewAppointmentDialog.jsx       |   77.94 |    66.66 |      85 |   83.33
  SavePlanConfirmationDialog.jsx |   91.66 |       75 |     100 |     100
  SearchBar.jsx                  |     100 |      100 |     100 |     100
  SettingsDialog.jsx             |   90.90 |       90 |   88.88 |   94.73
  Sidebar.jsx                    |     100 |      100 |     100 |     100
  StatsRow.jsx                   |     100 |      100 |     100 |     100
  TaskDetailDialog.jsx           |     100 |    90.90 |     100 |     100
  TaskList.jsx                   |     100 |    86.66 |     100 |     100
```

**Test Suites:** 19 passed, 19 total
**Tests:** 202 passed, 202 total (20 WCAG accessibility tests)

---

## 7. AI Declaration

AI tools (GitHub Copilot / Cursor) were used to assist with identifying WCAG 2.1 Level AA accessibility gaps, implementing fixes, and writing accessibility-focused test cases. All AI-generated suggestions were reviewed, tested, validated, and modified as necessary before submission.
