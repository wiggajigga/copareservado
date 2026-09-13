# Copa Reservado

## Git workflow

- Work directly on `master` — no feature branches.
- Check `git branch` before committing. The repo has been left in detached
  HEAD by earlier worktree sessions; commits made there never reach `master`,
  `git push origin master` reports "Everything up-to-date", and `git gc` can
  discard them. Recover with `git checkout -B master <sha>` after confirming
  `git merge-base --is-ancestor master HEAD`.
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

## Data layer

`data/` holds one file per edition. `copa.js` defines the registry and must
load first; each `<år>.js` calls `COPA.register({...})`. Schema and rules are
in `data/README.md`.

```html
<script src="/data/copa.js"></script>
<script src="/data/2026.js"></script>
```

- `COPA.get(år)`, `COPA.alle()`, `COPA.spilte()`, `COPA.spillere()`
- `COPA.honourBoard()` returns `{aar, vinner, titler}` newest first and
  reproduces the hardcoded board in `index.html` exactly. When `index.html`
  is made data-driven, generate from this rather than editing markup.
- Missing data is `null`, never a guess. `status: 'ferdig'` is what puts a
  year on the honour board.
- Prices are per player including shared buggy.

Backlog: `index.html` and `leaderboard/` still carry their own copies of the
data. Migrate them onto `COPA` once 2021–2024 courses and results are filled in.

## Year pages

`<år>/index.html` is the planning page for an edition, rendered from
`data/<år>.js`. No hardcoded course data in the markup.

Voting runs on Supabase. `supabase/schema.sql` creates the table and its
policies; `<år>/config.js` holds the project URL and anon key. The anon key
belongs in the client — access is controlled by the policies, not by secrecy.
With the config empty the page renders the courses and hides the voting
columns, so it is always safe to ship.

## Working over the device bridge

Commands run in an isolated Linux VM that has no GitHub credentials and cannot
delete files, so `git push` must be run from a normal terminal, and stale
`.git/index.lock` files have to be moved aside rather than removed.
