# PlaywrightDemo — Enterprise QA Automation Reference

[![QA Automation | UI + API](https://github.com/pradyumnavissapragada/PlaywrightDemo/actions/workflows/playwright.yml/badge.svg)](https://github.com/pradyumnavissapragada/PlaywrightDemo/actions/workflows/playwright.yml)

A **reviewable, practical** Playwright + TypeScript reference framework for Senior SDET / Automation Lead interviews. The browser suite exercises a real published [QA engineering portfolio](https://pradyumnavissapragada.github.io/pradyumna.github.io/); the API suite exercises a **local deterministic demonstration API** implementing a transparent release-readiness policy.

**Maturity:** implementation candidate. Do not describe this repository as production-hardened or claim a green pipeline before CI is observed.

## Architecture

```text
Playwright test runner
├── tests/ui/                  Cross-browser portfolio workflows
│   └── pages/                 Page Object Model
├── tests/api/                 Local REST contract + boundary tests
│   └── src/api/               Typed API client
├── fixtures/                  Typed reusable Playwright fixtures
├── src/mock-api/              Stateless release-readiness HTTP demo
├── playwright.config.ts       Projects, retries, tracing, reporting
├── docs/TEST-STRATEGY.md      Scope, risks, constraints, exit criteria
└── .github/workflows/         CI, JUnit + HTML report artifacts
```

## Start locally

Requires Node.js 22+ and npm.

```bash
npm install
npx playwright install --with-deps chromium firefox webkit
npm run typecheck
npm run test:list
npm test
npm run test:report
```

Focused commands: `npm run test:api`, `npm run test:ui`, `npm run test:smoke`. Override `PORTFOLIO_BASE_URL` for your own permitted website preview; default targets public GitHub Pages. The isolated demo API starts automatically on port 4173.

## Reports & GitHub Actions

Each push/PR runs TypeScript validation and UI/API suites. The workflow uploads JUnit, HTML and trace/screenshots/video evidence after the run. Check [Actions](https://github.com/pradyumnavissapragada/PlaywrightDemo/actions) for actual results and download `playwright-reports` from a completed run. Do not quote test counts until the run is verified.

## Test design decisions

- Page objects encapsulate domain workflows, not raw locators in tests.
- Dependency-injected typed fixtures hide test setup.
- Four policy boundaries include 85% vs >85%, critical defects and advisory coverage.
- API demo is local and stateless, avoiding secrets or third-party rate limits.
- UI suite opens P-Bot **without submitting prompts** or consuming AI credits.
- CI permissions are limited to read; reports are retained for 14 days.

## Reproducibility & hardening backlog

The initial review branch does **not** include a generated `package-lock.json` because package registry access was unavailable during authoring. Generate and commit it using `npm install` in an environment with registry access, then replace the workflow's `npm install` with `npm ci`. Pin CI action SHAs, add ESLint, dependency scanning, controlled test data, accessibility coverage, and evidence-backed performance baselines before presenting this as enterprise production-ready.

See [test strategy](docs/TEST-STRATEGY.md) for scope, entry/exit criteria and known limitations.
