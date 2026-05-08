# Copa Reservado

## Git workflow

- Work directly on `master` — no feature branches.
- Commit and push to `master` immediately.
- Do not create pull requests for this project.

## Design conventions

### Color palette

| Role | Value | Usage |
|------|-------|-------|
| Background | `#f0f0f0` | Page background |
| Gold accent | `#d4af37` | Stars, year display, divider gradients, champion badge |
| Body text | `#333` | Winner names, primary content |
| Secondary text | `#666` | Year labels in honour board |
| Muted text | `#999` | Section titles (Honour Board) |
| Divider grey | `#ccc` | Gradient endpoints on decorative lines |

Gold (`#d4af37`) is the signature accent — use it for anything championship-related.
Decorative lines use `linear-gradient(to right, #ccc, #d4af37, #ccc)`.

### Typography

| Element | Font | Fallback | Weight |
|---------|------|----------|--------|
| Title, section headings, year display | Microgramma | Arial, sans-serif | normal / 600 |
| Year labels, winner names, champion badge | Courier New | monospace | 300–400 |
| Body / countdown | Arial | sans-serif | normal |

Font file: `fonts/Microgramma Normal.ttf` (local, loaded via `@font-face`).
Microgramma is used for brand elements; Courier New for data.

### Sizing

All font sizes use `vw` units for fluid scaling:
- Title: `5vw` (mobile: `8vw`)
- Countdown: `4vw` (mobile: `6vw`)
- Body/sections: `2.5vw` (mobile: `4–4.5vw`)
- Stars: `1vw` (mobile: `2.2vw`)

Breakpoint: `600px` (single media query).

### Structure

Single `index.html` with all CSS inline in `<style>` and JS inline in `<script>`.
No external dependencies or build tools.

Page sections top-to-bottom:
1. **Title** — "COPA RESERVADO" + "Est. 2021"
2. **Countdown** — JS timer targeting next edition tee-off (UTC timestamp)
3. **Honour Board** — CSS Grid (4-column: year, divider, name, stars), newest first
4. **Champion badge** — Current year's winner with full name

### Honour Board conventions

- Winners listed newest-first by year
- Stars (★) represent cumulative titles at that point in time
- Winner names use initials in the grid, full name in the champion badge
- Each row: `champion-row` with `display: contents` for flat grid layout
