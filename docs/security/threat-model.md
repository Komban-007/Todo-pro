---
agent-notes: { ctx: "Initial threat model for Todo Pro client app", deps: [docs/adrs/0003-react-vite-localstorage-todo-pro.md], state: active, last: "pierrot@2026-07-24" }
---

# Threat Model: Todo Pro

**Date:** 2026-07-24
**Lead:** Pierrot
**Scope:** Client-Side Single Page Application (React + Vite + LocalStorage)

## Trust Boundaries & Data Flow
- **Boundary 1:** User Input (Form fields, quick-add input) → Application State.
- **Boundary 2:** Application State → Browser LocalStorage (`DOMStorage`).
- **Boundary 3:** Application State → Browser Notification API.

## Threat Analysis (STRIDE)

| Threat Type | Risk Scenario | Mitigation Strategy |
|---|---|---|
| **Spoofing** | Unauthenticated user accessing device | Client app relies on OS/browser user account isolation. |
| **Tampering** | XSS injected via user task titles/descriptions rendered in DOM | React automatic JSX HTML escaping + DOMPurify on any rich text rendering. |
| **Repudiation** | User accidentally deletes task and claims app lost data | Soft delete / Trash bin confirmation before permanent removal. |
| **Information Disclosure** | LocalStorage data read by malicious third-party browser extensions | Keep data local; document browser extension risk in safety guidelines. |
| **Denial of Service** | Maliciously large JSON import crashing browser tab | Validate JSON schema and set maximum import file size limit (10MB). |
| **Elevation of Privilege** | Arbitrary script execution via notification titles | Sanitize text strings passed into `new Notification(title, options)`. |
