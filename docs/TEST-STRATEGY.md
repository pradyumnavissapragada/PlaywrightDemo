# Test strategy and release criteria

## Scope
UI suite: portfolio homepage, major page sections, interactive Quality Lab, and P-Bot shell. No AI message is submitted, so test runs do **not** consume OpenAI API credits.

API suite: deterministic local HTTP release-readiness demo with a typed client, boundary-value checks, negative-input validation and clear contract assertions.

## Test design
- **Risk-based:** homepage and Quality Lab are smoke paths; bot shell and anchor navigation are functional checks.
- **Test levels:** API contract and rules run independently of browser tests.
- **Coverage:** Chromium, Firefox and WebKit each execute the UI tests. API tests execute once.
- **Isolation:** each browser test receives an isolated Playwright context; API server is stateless.
- **Observability:** JUnit XML for CI, Playwright HTML report, screenshots/videos/traces on failure.
- **Failure policy:** any CI test failure or TypeScript failure blocks the gate. Do not infer production release readiness solely from this suite.
- **Reruns:** one CI retry helps diagnose intermittent failures, but retries are not silently counted as proof of stability.

## Decision policy demo
Regression percentage must be **strictly above 85%** and open critical defects equal zero for QA_SIGNOFF. Critical-path coverage below 80% is advisory in this intentionally simplified policy. This is a **demonstration of a configurable team policy**, not an ISTQB-mandated universal threshold or production release approval.

## Evidence required before resume claims
Record baseline, target, measurement period, sample size and data source for claimed percentage improvements. A successful CI run proves this repo ran; it does not establish improvements in previous employers' systems.

## Known limitations
UI checks call a public deployed website and are subject to availability, access controls and content changes. No authentication, secrets, destructive operations or live AI generation are tested. Mock API does not assert parity with the deployed Quality Lab. Add contract tests against a real owned backend only after endpoint and access authorization exist.
