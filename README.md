# cypress-test-kong ✅

**Cypress end-to-end tests for Kong Gateway Manager** — this repository provides a small, TypeScript-based Cypress test suite and CI workflow for exercising the Kong Manager UI and its HTTP APIs.

---

## 🚀 Purpose

- Provide reliable E2E coverage for key Kong Manager flows (service creation, route creation, basic UI smoke checks).
- Demonstrate a robust, CI-friendly Cypress setup with TypeScript, typed custom commands, and resilient selectors.

## 🧩 Repository structure

- `cypress/`
  - `e2e/` — Cypress specs (TypeScript `.ts` files)
    - `Services/` — service-related tests (e.g., `testService.cy.ts`)
    - `Routes/` — route-related tests (e.g., `testRoute.cy.ts`)
    - `performance/` — frontend performance and web-vitals checks (e.g., `webVital.cy.ts`)
  - `fixtures/` — test data and payload templates (`common.json`, `createService.json`, ...)
  - `support/` — shared support files and typed helpers
    - `e2e.ts` — global hooks and common intercepts
    - `command.ts` — typed custom `Cypress.Commands` (API helpers)
    - `selectors.ts` — centralized UI selectors
    - `testData.ts` — typed constants wrapping fixtures and env overrides
- `cypress.config.ts` — Cypress configuration (TypeScript)
- `tsconfig.json` — TypeScript configuration for tests and support files
- `.github/workflows/cypress.yml` — GitHub Actions workflow to run tests with Docker
- `docker-compose.yaml` — local service stack used by CI and local runs (starts Kong stack)  

> Note: Tests are organized by functional area under `cypress/e2e/` to make it easy to run subsets (e.g., `npx cypress run --spec "cypress/e2e/Services/**"`).

---

## 🛠️ Prerequisites

- Node.js (v18+ recommended)
- npm
- Docker & Docker Compose (for the CI workflow or local dockerized runs)

---

## 📥 Setup (local development)

1. Install dependencies:

```bash
npm install
```

2. Run TypeScript check:

```bash
npx tsc --noEmit
```

3. Start the application stack locally:

```bash
docker-compose up -d
# wait for the app to be ready and accessible at the URL defined in cypress.config.ts (default BASE_URL)
```

4. Open Cypress in interactive mode:

```bash
npx cypress open
```

or run the suite headless:

```bash
npx cypress run --headless
```

> Tip: Running the tests against a local docker-compose stack mirrors CI and reduces environment-related flakiness.

5. Stop the application stack:

```bash
docker-compose down
# wait for the app to be ready and accessible at the URL defined in cypress.config.ts (default BASE_URL)
```

---

## 🧪 Folder structure explained

- `cypress/e2e/` — organized by feature area (Services, Routes, etc). Run a subset by `--spec` or open individual specs in the runner.

- `cypress/fixtures/` — canonical test data and request payload templates
  - `common.json` — shared values (e.g., `serviceUrl`, `serviceTag`, `serviceDefaultReadTimeout`)
  - `createService.json` — base payload used to create services in tests
  - Use fixtures to keep payloads consistent and to make it easy to override values in tests.

- `cypress/support/testData.ts` — typed layer exposing constants like `SERVICE_URL`, `SERVICE_TAG`, and `SERVICE_DEFAULT_READ_TIMEOUT` (these read from fixtures and allow `CYPRESS_*` env overrides).

- `cypress/support/e2e.ts` — global hooks and common intercepts. Tests inherit this setup by default; tests can opt out by defining their own hooks.

- `cypress/support/selectors.ts` — centralized, `data-testid` driven selectors to reduce fragility and duplication.

- `cypress/support/command.ts` — typed `Cypress.Commands` for common API operations (e.g., `cy.apiCreateService`, `cy.apiDeleteService`, `cy.apiDeleteRoute`). Prefer API helpers for setup/cleanup where UI flows are flaky.

- `cypress/performance/` — contains frontend performance checks (e.g., `webVital.cy.ts`). These tests measure page load metrics (Page Load Time, FCP, LCP) via the `window.performance` API and assert thresholds. Metrics are captured in the page `onLoad` and read back by Cypress via `cy.window()` (no Cypress commands should be used inside page callbacks).

---

## 🧭 Design decisions (notes)

- TypeScript for test files and support code: better safety and discoverability.
- Centralized selectors (`selectors.ts`) to split test logic flow and presentation.
- Split test data for reuse and management.
- Prefer API helpers for stable setup/cleanup.
- Tests use `cy.intercept()` to assert API requests payload and response.
- Covers data driven test by generating parameter combinations including border values. Random/Negative ones can be also added later.
- Single html report output by `cypress-mochawesome-reporter` plugin. Report will be written to `cypress/reports` folder
- Include web frontend performance measurement, and it could be combined with other performance/load tests.
- **Authentication and authorization should also be tested, but not implemented due to licence restriction.**

---

## ♻️ CI (GitHub Actions)

- The workflow `cypress.yml` spins up the docker-compose stack, waits for the app to be ready, runs `npx tsc --noEmit` then `npx cypress run --headless`, uploads artifacts (screenshots & reports), and tears down the stack.
- If you add new environment variables or change the compose services, update the workflow accordingly.
