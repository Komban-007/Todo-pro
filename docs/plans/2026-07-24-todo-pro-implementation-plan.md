---
agent-notes: { ctx: "Implementation plan for Todo Pro MVP", deps: [docs/adrs/0003-react-vite-localstorage-todo-pro.md, docs/test-strategy.md, docs/product-context.md], state: active, last: "pat@2026-07-24" }
---

# Implementation Plan: Todo Pro MVP

## Goal
Build a clean, high-performance, intelligent task management web application (Todo Pro) focused on simplicity, drag-and-drop task reordering, due dates, recurring tasks, reliable reminders, and dark/light mode themes.

## User Stories & Acceptance Criteria

### Story 1: Task Management Core (Add, Edit, Delete, Complete)
- **As a** personal productivity user,
- **I want to** quickly create, edit, complete, and delete tasks,
- **So that** I can track my daily responsibilities without hassle.
- **Acceptance Criteria:**
  1. Input bar allows adding a task with title, priority (P1/P2/P3), category/tag, and due date.
  2. Clicking task checkbox toggles completion state with smooth strikethrough animation.
  3. Editing a task updates the title/date inline or via modal.
  4. Deleting a task removes it cleanly with confirmation option.

### Story 2: Drag-and-Drop Reordering & Category Filtering
- **As a** user organizing my day,
- **I want to** drag and drop tasks to reorder them and filter by status,
- **So that** I can focus on my highest-priority items first.
- **Acceptance Criteria:**
  1. User can drag any task card vertically to reorder its priority in the list.
  2. Order is immediately saved to LocalStorage.
  3. Filter tabs allow viewing: **All**, **Today**, **Upcoming**, and **Completed** tasks.
  4. Real-time search bar filters tasks by title or tag.

### Story 3: Due Dates, Recurring Tasks & Browser Reminders
- **As a** busy user,
- **I want to** set due dates, recurring schedules, and receive browser notifications,
- **So that** I never miss an important deadline.
- **Acceptance Criteria:**
  1. Recurring options: Daily, Weekly, Custom days. When completed, next due date auto-calculates.
  2. Browser Notification API triggers alert when due time arrives.
  3. On application load, overdue/missed reminders trigger an alert banner.

### Story 4: Theme & Data Portability (Backup/Restore)
- **As a** user who values aesthetic and data safety,
- **I want to** toggle light/dark modes and backup/restore my data,
- **So that** I can customize my experience and protect my tasks.
- **Acceptance Criteria:**
  1. One-click toggle between Dark Mode and Light Mode with persistent user preference.
  2. Settings option to export tasks as `todo-pro-backup.json`.
  3. Import JSON backup restores tasks seamlessly.

---

## Architecture Gate Items
- **[COMPLETED] ADR 0003**: React + Vite + LocalStorage architecture. Debated with Wei and accepted.

---

## Approach & Sprint Roadmap

### Sprint 1: Foundation & Core Tasks
1. Scaffold React + Vite project setup with Vitest and React Testing Library (`npm create vite@latest`).
2. Implement CSS Design System (variables, light/dark themes, Apple-inspired glassmorphism styles).
3. Build Task Model, LocalStorage persistence service, and state hooks with TDD.
4. Build Task List UI, Task Input form, and inline editing.

### Sprint 2: Drag & Drop, Reminders, Backup & Polish
1. Integrate Drag-and-Drop task reordering (`@hello-pangea/dnd` or HTML5 DnD).
2. Implement Recurring Task calculator and Web Notification reminder manager.
3. Add Search, Filter tabs (**Today**, **Upcoming**, **Completed**).
4. Implement JSON Backup Export/Import & Overdue reminder banner.
5. End-to-end verification and performance auditing (Lighthouse target ≥ 95).

---

## Personas Involved
- **Pat (Product Lead):** Acceptance criteria enforcement and scope boundary control.
- **Archie (Architect):** State model, LocalStorage adapter contract, ADR governance.
- **Dani (UX/Design):** CSS design tokens, light/dark themes, accessibility, glassmorphism UI.
- **Tara (QA/TDD):** Vitest test suite, reminder timer mocks, coverage verification.
- **Sato (SDE):** React implementation & component refactoring.
- **Pierrot (Security):** XSS DOM sanitization & JSON import safety checks.
- **Grace (Coordinator):** Sprint board tracking and done-gate validation.

---

## Acceptance Verification Plan
- Unit & Component tests: `npm run test` (Vitest coverage target ≥ 90%).
- Production build validation: `npm run build`.
- Manual verification of Drag and Drop, Reminders, Theme toggle, and JSON backup export/import.
