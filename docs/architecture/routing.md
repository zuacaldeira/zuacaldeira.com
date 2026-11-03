# Routing and prerender

Every page exists once per language under its prefix (`/en/...`, `/de/...`, `/pt/...`),
and the build prerenders each one to static HTML. The language comes from the URL, not
from the browser. Examples: `docs/examples/home.md`, section 1 (HOME-PAGE-nn).

```mermaid
flowchart LR
    R["app.routes.ts<br/>one route tree per language"] --> P["ng build<br/>prerender every static path"]
    P --> EN["/en/home/index.html<br/>html lang=en"]
    P --> DE["/de/home/index.html<br/>html lang=de"]
    P --> PT["/pt/home/index.html<br/>html lang=pt"]
    P --> ROOT["/index.html<br/>English home, no redirect (D1)"]
    FR["/fr/home"] -.->|"nginx: 404 + 404.html; router: ** (D32)"| NF["404 page, English (D9)"]
    OLD["/home, /about, ..."] -.->|nginx 301 (D2)| EN
```

Acceptance tests read the built HTML: `frontend/acceptance/*.test.mjs`, run with
`npm run build && npm run acceptance` in `frontend/`.
