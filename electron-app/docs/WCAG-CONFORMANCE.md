# CareConnect Desktop - WCAG 2.1 Level AA Conformance Documentation

**Application:** CareConnect Desktop v2.0.0
**Standard:** WCAG 2.1 Level AA
**Date:** 2026-07-09
**Evaluator:** Ryan Morris

---

## Conformance Assessment

### Principle 1: Perceivable

| Criterion | Level | Status | Implementation |
|-----------|-------|--------|----------------|
| 1.1.1 Non-text Content | A | Conforming | Decorative icons use `aria-hidden="true"`. Interactive elements have text labels. Logo has visible text fallback. |
| 1.2.1 Audio-only and Video-only | A | N/A | Application contains no audio or video content. |
| 1.2.2 Captions | A | N/A | No multimedia content. |
| 1.2.3 Audio Description | A | N/A | No multimedia content. |
| 1.2.4 Captions (Live) | AA | N/A | No live media. |
| 1.2.5 Audio Description | AA | N/A | No multimedia content. |
| 1.3.1 Info and Relationships | A | Conforming | Semantic HTML landmarks (banner, nav, main, complementary). Definition lists for task details. Form labels via `htmlFor`/`id`. Fieldsets with legends for settings groups. Stats row uses `role="group"` with descriptive labels. |
| 1.3.2 Meaningful Sequence | A | Conforming | DOM order matches visual order. Skip link, header, sidebar, main content follow logical reading order. |
| 1.3.3 Sensory Characteristics | A | Conforming | Instructions reference labels, not position or appearance. Keyboard shortcuts listed by name. |
| 1.3.4 Orientation | AA | Conforming | Application is responsive; layout adapts via CSS grid and media queries. No orientation lock. |
| 1.3.5 Identify Input Purpose | AA | Conforming | Form inputs use descriptive labels. Phone field uses semantic labeling. |
| 1.4.1 Use of Color | A | Conforming | Status uses both color and text labels ("Pending"/"Done"). Availability badges include text alongside color indicators. |
| 1.4.2 Audio Control | A | N/A | No automatic audio. |
| 1.4.3 Contrast (Minimum) | AA | Conforming | Default theme: #141414 on #f0ebe2 (contrast 13.5:1). High contrast mode uses #000000/#ffffff. Dark mode uses #f4f6fb on #0f1115. All combinations exceed 4.5:1 for normal text and 3:1 for large text. |
| 1.4.4 Resize Text | AA | Conforming | Large text setting scales to 125%. All text uses relative units (rem). Layout remains functional at 200% zoom. |
| 1.4.5 Images of Text | AA | Conforming | No images of text. All text is rendered as styled HTML text with Atkinson Hyperlegible font. |
| 1.4.10 Reflow | AA | Conforming | Responsive CSS grid layout. Media queries at 1024px and 720px breakpoints ensure content reflows without horizontal scrolling. |
| 1.4.11 Non-text Contrast | AA | Conforming | Form inputs have visible borders (2px solid). Buttons have distinct borders. Focus indicators use 3px solid outline. All meet 3:1 contrast. |
| 1.4.12 Text Spacing | AA | Conforming | Uses relative units for spacing. Design tokens define consistent spacing scale. No content clipped when text spacing is adjusted. |
| 1.4.13 Content on Hover or Focus | AA | Conforming | No hover-triggered content overlays. Keyboard shortcuts button uses `aria-haspopup="dialog"` to indicate its behavior. |

### Principle 2: Operable

| Criterion | Level | Status | Implementation |
|-----------|-------|--------|----------------|
| 2.1.1 Keyboard | A | Conforming | All functionality available via keyboard. Toolbar buttons, task items, hero card, dialogs, and forms are all keyboard-operable. Shortcuts: Ctrl+N/S/F, Ctrl+1/2, Ctrl+,, F1, F2, Escape. |
| 2.1.2 No Keyboard Trap | A | Conforming | Focus is managed within dialogs but can be dismissed with Escape. Tab cycles naturally through page content. |
| 2.1.4 Character Key Shortcuts | A | Conforming | All keyboard shortcuts require modifier keys (Ctrl) or function keys (F1/F2). No single-character shortcuts. |
| 2.2.1 Timing Adjustable | A | Partially Conforming | Emergency countdown (10 seconds) can be canceled but not extended. This is intentional for the emergency use case. |
| 2.2.2 Pause, Stop, Hide | A | Conforming | Reduce motion setting and `prefers-reduced-motion` media query disable all animations and transitions. |
| 2.3.1 Three Flashes | A | Conforming | No flashing content. Emergency countdown updates once per second. Reduce motion setting available. |
| 2.4.1 Bypass Blocks | A | Conforming | Skip link ("Skip to main content") appears on first Tab press, targets `#main-content`. |
| 2.4.2 Page Titled | A | Conforming | Document title updates dynamically: "Today's Plan - CareConnect" and "Care Team - CareConnect". |
| 2.4.3 Focus Order | A | Conforming | Tab order follows logical visual sequence: skip link, toolbar buttons, sidebar tasks, main content, floating shortcuts button. |
| 2.4.4 Link Purpose | A | Conforming | Phone links use tel: protocol with visible phone numbers. Skip link text is descriptive. |
| 2.4.5 Multiple Ways | AA | Conforming | Navigation via toolbar buttons, keyboard shortcuts, and skip link. |
| 2.4.6 Headings and Labels | AA | Conforming | Heading hierarchy: h1 (CareConnect), h2 (page titles, dialog titles), h3 (helper names, hero card task). All form fields have associated labels. |
| 2.4.7 Focus Visible | AA | Conforming | Global `:focus-visible` style: 3px solid outline with 2px offset. Active toolbar state uses box-shadow instead of outline to avoid conflict. High contrast mode adjusts focus ring color. |

### Principle 3: Understandable

| Criterion | Level | Status | Implementation |
|-----------|-------|--------|----------------|
| 3.1.1 Language of Page | A | Conforming | `<html lang="en">` set in index.html. |
| 3.1.2 Language of Parts | AA | N/A | Application content is entirely in English. |
| 3.2.1 On Focus | A | Conforming | No context changes on focus. Search opens explicitly via button click or Ctrl+F. |
| 3.2.2 On Input | A | Conforming | Settings dialog previews changes but requires explicit Save. No automatic form submission. |
| 3.2.3 Consistent Navigation | AA | Conforming | Toolbar remains in fixed position across all views. Same buttons in same order. |
| 3.2.4 Consistent Identification | AA | Conforming | Close buttons consistently use X with `aria-label="Close"`. Primary actions use consistent button styling. |
| 3.3.1 Error Identification | A | Conforming | Form validation errors use `role="alert"` for announcement. Error messages linked to inputs via `aria-describedby`. Invalid fields marked with `aria-invalid="true"`. |
| 3.3.2 Labels or Instructions | A | Conforming | Required fields indicated with `aria-required="true"`. Placeholder text provides format examples (e.g., "e.g. 2:00 PM"). |
| 3.3.3 Error Suggestion | AA | Conforming | Error messages describe required action: "Title is required", "Time is required", "Location is required". |
| 3.3.4 Error Prevention | AA | Conforming | Destructive actions (remove helper, discard unsaved changes) require confirmation dialogs. Save button disabled until required fields are complete. |

### Principle 4: Robust

| Criterion | Level | Status | Implementation |
|-----------|-------|--------|----------------|
| 4.1.1 Parsing | A | Conforming | Valid HTML structure. Fixed invalid `<p>` nesting inside `<button>` elements (replaced with `<span>`). No duplicate IDs. |
| 4.1.2 Name, Role, Value | A | Conforming | All interactive elements have accessible names. Buttons use visible text or `aria-label`. Dialogs labeled via `aria-labelledby`. Active navigation uses `aria-current="true"`. Helper action buttons include helper name in `aria-label`. |
| 4.1.3 Status Messages | AA | Conforming | `aria-live="polite"` region announces task completions, save results, and view changes. Emergency confirmed state uses `role="status"`. Countdown updates use `aria-label`. |

---

## Accessibility Features Summary

### Built-in Settings
- **Large text (125%):** Scales all text using relative units
- **High contrast mode:** Maximizes foreground/background contrast ratios
- **Dark theme:** Reduces overall brightness with maintained contrast
- **Reduce motion:** Disables all CSS animations and transitions
- **Atkinson Hyperlegible font:** Always active for readability

### Assistive Technology Support
- **Screen readers:** Tested with NVDA. All landmarks, headings, live regions, and ARIA attributes function correctly.
- **Keyboard navigation:** Full application functionality accessible without a mouse.
- **Skip link:** Bypasses repetitive toolbar navigation.

### System Preferences
- `prefers-reduced-motion: reduce` media query honored independent of in-app setting.
