# Portfolio audit — 20 October 2026

Scope: Impeccable technical audit, followed by the approved fixes and polish. Baseline commit `6a8ac71`. Preserve Silver & sapphire, existing illustrations, walkthrough content and default desktop hover loops.

## Baseline

Integrity verdict: coherent, distinctive editorial portfolio; no redesign needed. Sample data is labeled, contributions are distinguished from personal work, and the diagram explains the actual service. Native disclosures, useful project copy and restrained color hierarchy are strengths.

| Dimension | Score / 4 | Evidence |
| --- | ---: | --- |
| Accessibility | 2 | Missing wordmark names, low-contrast skip link and captions, no keyboard motion stop |
| Performance | 3 | Small static assets; avoidable per-frame DOM writes and chained font discovery |
| Theming | 3 | Main semantic text pairs pass; skip-link color bypasses tokens |
| Responsive | 3 | Mobile layout fits; several compact controls need larger targets |
| Integrity | 4 | Established visual identity, factual copy, explicit illustrative data |

15/20 is a scoped engineering assessment, not a WCAG certification.

## Verified findings

1. **P1 — Dark-mode skip link is unreadable.** `dist/styles.css:2` sets white text on `var(--ink)`, which resolves to #edf5ff in dark mode (~1.1:1). Keyboard users lose the navigation shortcut. WCAG 1.4.3. Use the inverse theme token for text; preserve visible focus and sufficient stacking order.
2. **P1 — No keyboard-accessible way to stop the tool marquee.** `dist/styles.css:72–103` loops two rows indefinitely. Hover pauses them, but the region contains no focusable control. OS reduced motion works, but does not replace an on-page pause mechanism. WCAG 2.2.2. Add one compact page motion control, honor OS preference, retain default loops and thumbnails.
3. **P1 — Three tool names disappear from the accessibility tree.** `dist/index.html:28`, `dist/styles.css:96`: LangGraph, Deep Agents and LangSmith images have empty alt text while their text labels are display:none. Give full wordmark images meaningful alt text; retain decorative empty alts for images paired with visible names. WCAG 1.1.1.
4. **P2 — Caption opacity weakens contrast.** `.visual-caption` uses the correct muted token but opacity .65. Light mode computes #52657b over #e4eaf0, compositing to approximately #8594a4 (~2.6:1). Dark captions are also weakened. WCAG 1.4.3. Remove opacity and use the existing muted token.
5. **P2 — Compact touch controls.** Measured mobile theme toggle 36×42px, tags 40px high; chart region controls use 8–9px type and 3–4px padding. Increase primary controls to 44px and compact chart targets to at least 28–32px with readable labels. 44px is a usability target, not a claim that WCAG 2.5.8 requires 44px; spacing exceptions need contextual evaluation.
6. **P2 — Avoidable animation DOM writes.** `dist/walkthroughs.js:233–267`: badge and four notes-state labels are rewritten every frame; repeated selectors run in the animation loop. Cache references and write only changed values. No measured frame-rate regression claimed.
7. **P3 — Font discovery and asset sizing.** `dist/styles.css:1` imports Google Fonts through CSS; tool images lack intrinsic HTML dimensions. Expose the same font stylesheet directly in the head with preconnects; declare existing logo aspect ratios to stabilize loading. Preserve typography and logo proportions.

8. **P2 — Tooltip closes during keyboard focus scrolling.** `dist/app.js` dismisses all tooltips on every scroll, including the scroll caused by moving focus to a tag. Reposition the focused explanation instead; keep Escape and pointer dismissal. WCAG 1.4.13.
9. **P2 — Interactive chart has an aria-hidden ancestor.** `dist/index.html` hides the illustrative playback from assistive technology, including its usable BI region controls. Expose the BI after scene only while visible; keep the other illustrative scenes represented by their static descriptions. WCAG 4.1.2.

## Detector triage

One bundled detector pass was run. Legacy CSS produced 9 contrast, 31 small-type, 6 padding, 4 leading and several style warnings. Rendered cascade verification takes precedence: overridden legacy colors, rounded-border warnings, chosen Instrument Serif hero, two requested marquees and established diagram geometry are not reasons to redesign. Some deliberately compact, noninteractive illustration annotations remain; functional controls and captions take priority.

## Method and limits

Source review plus rendered DOM/AX and keyboard checks in the in-app Chromium browser, desktop and 390px mobile baseline. Responsive and interaction verification will be repeated after fixes. No external screen-reader session, physical touch device, Safari/Firefox run, throttled network benchmark or full WCAG conformance audit performed. Hidden simulated application content is intentionally illustrative and is accompanied by accessible static story descriptions.

## Fix verification

All nine verified findings addressed in v21. No P0 findings. No open P1 findings in the tested scope.

- Wordmarks have accessible names and all 42 logo instances declare intrinsic dimensions.
- Skip-link theme tokens produce strong contrast in both modes. Caption opacity is now 1.
- Motion preference persists across reload, pauses both rows, provides keyboard scrolling, and disables automatic previews. Device reduced-motion settings remain authoritative; explicit previews complete once.
- 44px theme/tag/copy controls; chart controls 28px desktop / 32px mobile with 11px labels.
- Focused explanations survive focus-induced scrolling; Escape dismisses them. Native disclosures preserve challenge and contribution.
- BI chart buttons are exposed during the visible after scene; keyboard selection updates the insight and pauses the loop while exploring it.
- Desktop looping verified; notes completed with the expected overview, two bullets and latest update/action. No animation-story or illustration changes.
- Checked 320px, 390px and 1135px layouts, both themes. No document horizontal overflow. JavaScript syntax, local assets, unique IDs and whitespace checks pass. Browser console: no errors.
- Cached animation references and unchanged-text guards replace per-frame label rewrites. Font discovery begins directly from HTML. No performance score or frame-rate claim without benchmarking.

Post-fix scoped scores: Accessibility 3/4, Performance 3/4, Theming 4/4, Responsive 3/4, Integrity 4/4 (17/20). Remaining uncertainty is cross-browser, assistive-technology and physical-device validation, not a known visual defect. Full audit report is intentionally kept outside the deployed static directory.

## Follow-up — restored hover interaction
The global motion toggle was removed at the owner’s request. Its saved pause preference is discarded, so it cannot disable project hover playback. Tool rows remain pausable by hover and keyboard focus, with OS reduced-motion support. Desktop previews show contextual Pause/Resume and Show thumbnail controls only during active hover/focus; mobile controls remain unchanged. This supersedes the global-toggle recommendation above.
