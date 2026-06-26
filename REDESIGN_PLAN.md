# Premium Redesign Execution Plan

## Tooling Gate

- Node is managed with `fnm`; this branch pins Node in `.node-version`.
- Taste Skill v2 is installed as `.agents/skills/design-taste-frontend`.
- Vercel Web Interface Guidelines are installed as `.agents/skills/web-design-guidelines`.
- Impeccable is installed as `.cursor/skills/impeccable`, with `.cursor/hooks.json` enabling the pre-edit detector hook.
- Before UI implementation, run Impeccable context and read the relevant command references:
  - `node .cursor/skills/impeccable/scripts/context.mjs`
  - `.cursor/skills/impeccable/reference/brand.md`
  - command-specific references such as `shape.md`, `animate.md`, `audit.md`, and `polish.md`

## Design Read

Reading this as: premium consumer brand landing for buyers of bath-bomb gifts and personal rituals, with a tactile cinematic luxury language, leaning toward Tailwind v4 plus native CSS rather than a third-party design system.

Taste Skill v2 dials for implementation:

- `DESIGN_VARIANCE: 8`
- `MOTION_INTENSITY: 6`
- `VISUAL_DENSITY: 3`

## Constraints

- Start implementation only after this setup commit.
- Use `origin/test/hero-tablet-logo-preview` as the base branch lineage.
- Preserve checkout state, validation, AmoCRM payloads, Turnstile, legal modals, Yandex.Metrica goals, SEO metadata, static export, and GitHub Pages compatibility.
- Do not use temporary Figma MCP asset URLs in code. Use stable local assets under `public/images/`.
- Do not change the old plan file under the user `.cursor/plans` directory.

## Implementation Sequence

1. Audit the current page, header, checkout modal, content mapping, assets, and globals with Taste Skill v2, Impeccable, and Vercel guidelines open as working checklists.
2. Choose the art direction from local assets and product goals, not from the old layout. Document the scene, palette strategy, typography strategy, motion strategy, and what gets deliberately rejected.
3. Recompose the homepage around a new luxury experience while keeping `HomeModal`, `HeroVideoModal`, structured data, and checkout state wiring intact.
4. Update shared UI surfaces: header, logo treatment, buttons, section primitives, modal shell, focus rings, reduced-motion behavior, touch ergonomics, and contrast.
5. Polish checkout visuals without changing business logic or submission contracts.
6. Run quality checks: `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` if UI routing/static export is affected.
7. Run final design audits with Impeccable and Vercel Web Interface Guidelines, then fix actionable issues before shipping.

## Stop Point

This file is a setup and execution plan. The redesign implementation must start in a later step after the setup commit exists.
