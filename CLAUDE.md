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
  services/         # ThemeService, ContentService, I18nService
  models/           # TypeScript interfaces (including i18n.ts)
  i18n/             # Translation files: en.ts, pt.ts, de.ts, fr.ts
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

**I18nService** (`services/i18n.service.ts`)
- Signal-based language switching (`language` signal + computed `translations`)
- SSR-safe, persists to `localStorage`, auto-detects browser language

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

## Internationalization (i18n)

**I18nService** (`services/i18n.service.ts`)
- Signal-based language switching with computed `translations` signal
- SSR-safe with `isPlatformBrowser` guard
- Persists preference to `localStorage` (`zc-lang` key)
- Auto-detects browser language on first visit
- `language` signal holds current `Language`, `translations` signal holds current `Translations` object

**Type-safe translations** via the `Translations` interface in `models/i18n.ts`
- Supported languages: `'en' | 'pt' | 'de' | 'fr'` (English and Portuguese implemented, German and French fall back to English)
- Translation files live in `src/app/i18n/` — one file per language exporting a `Translations` object
- Covers all sections: nav, hero, about, research, work, paedagogik, running, contact, footer, common labels
- Content arrays (`roleCards`, `projects`, `facharbeiten`) are also translated

## Testing

**Vitest** via `@angular/build:unit-test` — run with `npm test`.

- Test files use `*.spec.ts` convention, colocated with source files
- Vitest globals enabled (`describe`, `it`, `expect`, `vi` available without imports)
- `tsconfig.spec.json` extends base config with `vitest/globals` types
- CI runs tests before build in `.github/workflows/deploy.yml`

**Test patterns:**
- Services: use `TestBed.inject()` with `PLATFORM_ID` override for SSR tests
- Components with logic: use `TestBed.createComponent()` with `NO_ERRORS_SCHEMA` to skip template resolution of child components
- Components with router: add `provideRouter([])` to providers
- `window.matchMedia`: must be mocked in `beforeEach` (jsdom doesn't provide it)
- `localStorage`: leaks between test files — explicitly set language/theme in tests rather than assuming defaults
- Input components (`@Input`): set inputs before `detectChanges()`

**Coverage:** 27 test files, 150 tests covering App component, all 3 services, all 22 components, and app routes.

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
- Runs `npm test` before build — tests must pass for deploy to proceed
- Builds with `ng build --configuration production`
- Copies `home/index.html` → root `index.html` for GitHub Pages
- Uploads `dist/zuacaldeira-com/browser/` as Pages artifact
- **CNAME**: `zuacaldeira.com`
- Node 22 in CI
