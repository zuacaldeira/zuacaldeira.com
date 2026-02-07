# CLAUDE.md — zuacaldeira.com

This is a personal website for Zu Caldeira, built with Angular 21 and deployed to GitHub Pages.

## Build & Dev Commands

```bash
npm start          # Dev server at http://localhost:4200
npm run build      # Production build (prerendered SSR output)
npm test           # Run tests (Vitest)
npm run watch      # Dev build with file watching
npm run serve:ssr:zuacaldeira-com  # Serve SSR build locally
```

Build output: `dist/zuacaldeira-com/browser/` (prerendered static HTML).

## Architecture

- **Angular 21** with SSR prerendering (`@angular/ssr`), no runtime server — all routes prerendered to static HTML
- **Standalone components** throughout (no NgModules)
- **Lazy-loaded routes** via `loadComponent()` in `app.routes.ts`
- **No backend** — all content lives in `ContentService` as typed readonly arrays

### Folder Layout

```
src/app/
  common/           # Shared UI: navigation/, footer/, theme-toggle/, section-header/
  pages/            # Route components: home/, about/, research/, work/, paedagogik/, running/, contact/
  services/         # ThemeService, ContentService
  models/           # TypeScript interfaces
```

## Routing

Routes defined in `src/app/app.routes.ts`. All lazy-loaded:
- `/` redirects to `/home`
- `/home`, `/about`, `/research`, `/work`, `/paedagogik`, `/running`, `/contact`

Server routes in `src/app/app.routes.server.ts` use `RenderMode.Prerender` for all paths (`**`).

## Key Services

**ThemeService** (`services/theme.service.ts`)
- Signal-based dark mode toggle
- SSR-safe with `isPlatformBrowser` guard
- Persists preference to `localStorage`
- Toggles `.dark-theme` class on `<html>`

**ContentService** (`services/content.service.ts`)
- Static data provider — typed readonly arrays, no HTTP calls
- All site content (projects, experiences, etc.) defined inline

## Component Patterns

**ZcPage** (`common/navigation/zc-page/zc-page.ts`)
- Responsive layout wrapper used by all page components
- Uses `BreakpointObserver` to switch between `ZcNavMobile` and `ZcNavDesktop`

**General conventions:**
- All components are standalone (no NgModules)
- Component styles use plain CSS (`.css` files)
- SCSS is only used for the Material theme (`src/material-theme.scss`)

## Styling

**Design tokens** — CSS custom properties prefixed `--zc-*` defined in `src/styles.css`:
- Colors: `--zc-text-heading`, `--zc-bg-warm`, `--zc-accent`, etc.
- Spacing: `--zc-space-2` through `--zc-space-24`
- Typography: Inter font family (`--zc-font-heading`, `--zc-font-body`)

**Material 3 theme** — `src/material-theme.scss`:
- Primary: `mat.$cyan-palette`
- Tertiary: `mat.$violet-palette`
- Typography: Inter
- Dark theme via `.dark-theme` class on `<html>`

## TypeScript

Strict mode with all extra checks enabled (`tsconfig.json`):
- `strict`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- Angular: `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`
- Target: ES2022, TypeScript ~5.9

## Formatting

Prettier config is in `package.json`:
- `printWidth: 100`
- `singleQuote: true`
- HTML files use `angular` parser

## Deployment

- **GitHub Actions** (`.github/workflows/deploy.yml`) triggers on push to `main`
- Builds with `ng build --configuration production`
- Copies `home/index.html` → root `index.html` for GitHub Pages
- Uploads `dist/zuacaldeira-com/browser/` as Pages artifact
- **CNAME**: `zuacaldeira.com`
- Node 22 in CI
