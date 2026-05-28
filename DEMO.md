# RPI Kit Demo

This document defines the demo project used to showcase the RPI Kit workflow in action.

The demo has two parts:

1. **Base project** — a simple app built by an AI agent *without* the kit (single prompt, no workflow).
2. **Feature addition** — a new feature added *with* the kit, demonstrating the Research → Plan → Implement cycle.

---

## Part 1 — Base Project

### What it is

A single-page Mermaid diagram visualizer. The user pastes Mermaid code into a textarea, clicks **Render**, and sees the diagram rendered inline. No build step. No framework. One file.

### Build prompt

> Build a self-contained `index.html` file — no build step, no npm, no frameworks.
>
> The page should have three elements:
> - A `<textarea>` where the user types or pastes Mermaid diagram code.
> - A **Render** button that renders the diagram.
> - A preview panel below the button that displays the rendered diagram.
>
> Use the Mermaid CDN to load the library:
> ```
> https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js
> ```
>
> On page load, pre-populate the textarea with a simple flowchart example and render it immediately.
>
> Style the page cleanly: dark background, light text, monospace textarea, centered layout. The preview panel should have a white or light background so diagrams are legible.
>
> No external CSS libraries. Inline everything in the single HTML file.

---

## Part 2 — Feature Addition via RPI Kit

### What we are adding

**Shareable URL** — when the user clicks a **Copy Link** button, the current diagram is encoded into the URL fragment (`#...`) and the full URL is copied to the clipboard. When someone opens that URL, the diagram is automatically loaded and rendered.

This is a self-contained, fully testable feature with a clear outcome: a URL that reproduces a diagram exactly.

### Why this feature works well as a demo

- **Research phase has real questions** — encoding strategy, URL length limits, browser API details. These are genuine decisions, not invented ones.
- **Plan phase produces atomic tasks** — each step is independently testable.
- **Implement phase is short** — the change is roughly 20–30 lines of JavaScript, so the demo doesn't get lost in implementation noise.
- **The feature is visually obvious** — the audience can see it working immediately.

### Research questions

The research phase should answer these before any plan is written:

1. What encoding strategy should be used to store diagram text in a URL fragment? (plain `encodeURIComponent`, Base64, or compressed with pako/deflate?)
2. What is the practical URL length limit across major browsers and common sharing surfaces (Slack, GitHub, email clients)?
3. Does Mermaid's CDN bundle expose a stable programmatic API, or does rendering need to go through the DOM?
4. What is the correct browser API for reading and writing the URL fragment without triggering a page reload?
5. What is the Clipboard API for writing to the clipboard, and does it require a secure context (HTTPS)?

### Proposed plan (draft — to be confirmed after research)

| # | Task | Acceptance criterion |
|---|------|----------------------|
| 1 | On page load, read the URL fragment; if present, decode it, populate the textarea, and render the diagram | Opening a URL with a valid fragment shows the correct diagram without user interaction |
| 2 | Add a **Copy Link** button next to the Render button | Button is visible and correctly positioned in the layout |
| 3 | On click, encode the current textarea content into the URL fragment and write it to `location.hash` | The page URL updates in the browser address bar |
| 4 | Copy the full updated URL to the clipboard | A success message or visual feedback confirms the copy |
| 5 | If the encoded URL exceeds a safe length threshold, show a warning instead of copying | User is informed when the diagram is too large to share via URL |

### Project folder

```
.rpi/projects/YYYYMMDD-shareable-url/
  research.md
  plan.md
  SIGNOFF
```

Run the scaffolder to create it:

```bash
bash ~/.copilot/skills/rpi-workflow/scripts/rpi-new.sh "Shareable URL"
```
