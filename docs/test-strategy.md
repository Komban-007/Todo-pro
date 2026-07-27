---
agent-notes: { ctx: "Test strategy for Todo Pro web app", deps: [AGENTS.md, docs/adrs/0003-react-vite-localstorage-todo-pro.md], state: active, last: "tara@2026-07-24" }
---

# Test Strategy: Todo Pro

**Date:** 2026-07-24
**Lead:** Tester Tara
**Target Coverage:** ≥ 90% logic coverage, 100% core domain model coverage.

## Testing Pyramid

### 1. Unit Testing (Vitest + React Testing Library)
- **Domain & Utilities:** Test task state transitions, recurrence calculations, date formatting, and filter sorting logic.
- **LocalStorage Storage Layer:** Mock browser `localStorage` to verify serialization, error recovery, and import/export integrity.
- **Notification Manager:** Mock Web `Notification` constructor to verify reminder triggers and permission handling.

### 2. Component Testing (Vitest + React Testing Library)
- **Task Input Component:** Form validation, keyboard events (Enter to submit), due-date picker.
- **Task List & Item Component:** Checkbox toggle, editing, deletion, priority tagging.
- **Filter & Search Bar:** Real-time query filtering, category tabs (All, Today, Upcoming, Completed).

### 3. Integration & E2E Testing (Playwright / Cypress or React Integration)
- End-to-end user workflows: Create task → drag reorder → set reminder → complete task → clear completed.

## Test Data Approach
- Deterministic mock task generator for standard unit and UI tests.
- Date/time mocking via Vitest fake timers (`vi.useFakeTimers()`) to validate reminder triggering without flaky time delays.
