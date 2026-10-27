# Portfolio Architectural Changelog & Verification Punch-List

## Executive Summary
This release transitions the portfolio from a monolithic HTML/CSS implementation with ad-hoc styling into an enterprise **design-token-driven architecture** (`tokens.css`), supported by a dynamic **Theme Registry** (`theme-registry.js`) and unified data layer (`src/data/*`).

---

## Before vs. After Summary

| Feature / Area | Before Refactor | After Refactor (Phase 0 – Phase 2) |
| :--- | :--- | :--- |
| **Theme Engine** | 5 loosely styled color buttons + Minecraft overhaul injected inline. | Modular **Design Tokens** (`tokens.css`) + 5 dedicated scoped stylesheets (`obsidian.css`, `apple.css`, `aws.css`, `netflix.css`, `minecraft.css`). |
| **Asset Loading** | All styles and scripts evaluated on page load. | Default **Obsidian** loads with 0 extra requests. Other themes lazy-load CSS on demand upon selection. |
| **Theme Switcher** | Static flex row of buttons with no ARIA states. | Keyboard-accessible menu (`role="menu"`, `ArrowUp/Down`, `Escape`, `Enter`) with swatch previews and toast announcement. |
| **URL Theme Sharing** | Theme state only retained in localStorage. | Supports `?theme=<id>` URL query parameter (e.g. `?theme=apple`, `?theme=aws`, `?theme=netflix`, `?theme=minecraft`). |
| **Hero Name Layout** | Name wrapped into 3 lines leaving stranded "H." on line 3. | Responsive `clamp()` typography with `white-space: nowrap` on `Sharma H.` and WCAG AA contrast. |
| **Sticky Nav Clipping** | Status badge and section titles clipped under sticky nav. | `scroll-margin-top: calc(var(--nav-height) + 1.5rem)` and proper hero top-padding. |
| **India Flag Emoji** | Rendered as unstyled "IN" or broken glyphs on Windows. | Sharp, authentic inline vector SVG (`<svg viewBox="0 0 18 12">`). |
| **Public Phone Number** | Raw personal phone number exposed on web & terminal. | Completely removed from public contact section, terminal help text, and metadata. |
| **Skills Grid** | Arbitrary percentage bars (`85% Node.js`, empty grid cells). | **3 Grouped Tiers**: Core Competencies, Working Knowledge, Exploring & Research. No percentages; zero orphan cells. |
| **Experience Timeline** | Single-sided vertical list leaving the right half empty. | **Balanced 2-Column Grid**: Industry & Leadership (Left) vs. Education & Technical Milestones (Right). |
| **Accessibility (A11y)**| Missing input labels; modal focus leaked to background. | Dedicated `<label>` and ARIA attributes for form inputs; `role="dialog"`, `aria-modal="true"`, and focus trapping in project modal. |
| **Social / SEO Meta**  | Missing OpenGraph image and Twitter card preview. | Added `og:image` (1200x630px high-res card), `twitter:card`, and schema markup. |
| **Minecraft Theme**    | Heavy always-on particles and SFX auto-prompt. | **Diet Mode**: Muted-by-default audio, reduced VFX, hotbar auto-collapses under 600px, hidden easter-egg toggle. |

---

## Detailed Theme Deliverables

### 1. Obsidian Dark (`obsidian`) — Default
- Deep obsidian-slate palette (`#090d13`), cyan electric accents (`#38bdf8`), Syne display typography, Space Mono telemetry blocks.
- Performance: Zero additional network requests on initial visit.

### 2. Apple Glass (`apple`)
- Frosted glassmorphism with `backdrop-filter: blur(20px) saturate(180%)`.
- Specular 1px inner highlights (`inset 0 1px 0 rgba(255,255,255,0.18)`), 20–26px soft radii, San Francisco-style system typography with tight tracking (`-0.025em`).
- Floating pill dock navigation and bento-grid card structures with spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Graceful `@supports not (backdrop-filter)` solid translucent fallback.

### 3. AWS Cloud Console (`aws`)
- Squid-ink navy navigation bar (`#232F3E`), Amazon orange accents (`#FF9900`), and telemetry status chips.
- Persistent breadcrumb header (`AWS Console :: Home > EC2 / Projects > MGU.One`).
- Faux service search shortcut (`Ctrl+K / ⌘K`) and `Region: ap-south-1` active telemetry badge.
- Interactive terminal restyled as AWS CloudShell.

### 4. Netflix Cinematic (`netflix`)
- Pitch-dark background (`#141414`) with Netflix Red (`#E50914`) brand accents.
- Hero billboard with dual action buttons: `▶ Play Demo` and `ℹ More Info`.
- Horizontal scrolling project carousels with hover-zoom card scaling on desktop; degrades gracefully to vertical stack on mobile.
- "Who's Watching?" profile selector modal (Recruiter, Engineer, Adventurer) with skip functionality.

### 5. Minecraft AIBridge (`minecraft`) — Diet Mode
- Streamlined retro 8-bit aesthetic with Press Start 2P headers and readable monospace body text.
- Tactile 3D beveled button press states (`transform: translateY(3px)`).
- Scroll XP progress bar with level up celebrations (Level 0 → 30).
- Fixed 9-slot inventory hotbar that automatically collapses under 600px width on mobile.
- Synthesized Web Audio sound effects muted by default behind an explicit audio toggle.
- Respects `prefers-reduced-motion` by disabling particle loops and entity bobbing.

---

## Verification & Punch-List of Remaining `TODO(verify)`

All claims across `public/index.html`, `public/resume.html`, and `src/data/*` were cross-checked against verifiable sources. No metrics were invented.

### Verified Facts
- **MGU.One**: Paper API 1.21.4, Java 17, Bukkit Async Workers, FileGuard sandbox, 20.0 TPS stability (verified in `resume.html`).
- **Codex Backend (Akanksha Charitable Trust)**: Jan 2026 – Jul 2026, Hardened JWT token validation, FCM streak push notification service, Firestore indexing (verified in `resume.html`).
- **O~Bele / Payaswini**: Agricultural tool rental marketplace, verified operator workflow with 4-hour confirmation SLA, Node.js & Express REST APIs (verified in `resume.html`).
- **Academic Credentials**: VCET Puttur (Affiliated with VTU), B.E. Computer Science, 3rd Year (Sem 5), CGPA 7.4 / 10.0 (verified in `resume.html`).

### Remaining `TODO(verify)` Punch-List
1. `src/data/projectsData.js`:
   - `E-Library Management System`: Marked `{ label: 'Catalog Indexing', value: 'Compound Text Index' } /* TODO(verify): benchmark latency */`. Benchmark real query execution time on a populated MongoDB collection before publishing millisecond latency numbers.
   - `Cells AMS`: Verify production database schema engine (PostgreSQL / MySQL / SQLite) before adding formal relational transaction TPS metrics.
2. `Live URLs`:
   - Verify deployment status of `https://mgu.one` and `https://codex.akanksha.org` prior to recruiter outreach.

---

## Screenshot Deliverables (`/docs/screenshots/`)

All screenshots were programmatically captured via Puppeteer headless browser:
- `obsidian-hero.png`, `obsidian-projects.png`, `obsidian-skills.png`, `obsidian-contact.png`
- `apple-hero.png`, `apple-projects.png`, `apple-skills.png`, `apple-contact.png`
- `aws-hero.png`, `aws-projects.png`, `aws-skills.png`, `aws-contact.png`
- `netflix-hero.png`, `netflix-projects.png`, `netflix-skills.png`, `netflix-contact.png`
- `minecraft-hero.png`, `minecraft-projects.png`, `minecraft-skills.png`, `minecraft-contact.png`
- `obsidian-mobile-390px.png`, `apple-mobile-390px.png`
