# cypress-test-kong ✅

**Cypress end-to-end tests for Kong Gateway Manager** — this repository provides a small, TypeScript-based Cypress test suite and CI workflow for exercising the Kong Manager UI and its HTTP APIs.

---

## 🚀 Purpose

- Provide reliable E2E coverage for key Kong Manager flows (service creation, route creation, basic UI smoke checks).
- Demonstrate a robust, CI-friendly Cypress setup with TypeScript, typed custom commands, and resilient selectors.

## 🧩 Repository structure

- `cypress/`
  - `e2e/` — Cypress specs (TypeScript `.ts` files)
  - `support/` — shared support files and typed commands (`e2e.ts`, `command.ts`, `selectors.ts`)
- `cypress.config.ts` — Cypress configuration (TypeScript)
- `tsconfig.json` — TypeScript configuration for tests and support files
- `.github/workflows/cypress.yml` — GitHub Actions workflow to run tests with docker-compose
- `docker-compose.yaml` — local service stack used by CI and local runs (starts Kong stack)

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

## 🧪 Test design & important files

- `cypress/support/e2e.ts` — global hooks and common intercepts. Tests inherit this setup by default; tests can opt out if needed.
- `cypress/support/selectors.ts` — centralized, data-testid-driven selectors to reduce fragility.
- `cypress/support/command.ts` — typed `Cypress.Commands` for common API operations (e.g., `cy.apiCreateService`, `cy.apiDeleteService`, `cy.apiDeleteRoute`). Prefer API helpers for setup/cleanup where UI flows are flaky.
- Tests use `cy.intercept()` to assert API requests (e.g., asserting the body of a create-route request).

---

## ♻️ CI (GitHub Actions)

- The workflow `cypress.yml` spins up the docker-compose stack, waits for the app to be ready, runs `npx tsc --noEmit` then `npx cypress run --headless`, uploads artifacts (screenshots & reports), and tears down the stack.
- If you add new environment variables or change the compose services, update the workflow accordingly.

---

## 🧭 Design decisions (notes)

- TypeScript for test files and support code: better safety and discoverability for custom commands and intercept assertions.
- Centralized selectors (`selectors.ts`) to avoid brittle tests that depend on presentation changes.
- Prefer API helpers for setup/cleanup where the UI is flaky — this makes CI runs more stable and faster.

