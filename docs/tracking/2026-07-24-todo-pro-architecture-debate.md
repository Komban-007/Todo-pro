---
agent-notes: { ctx: "Architecture debate tracking for ADR 0003", deps: [docs/adrs/0003-react-vite-localstorage-todo-pro.md], state: active, last: "wei@2026-07-24" }
---

# Architecture Debate: ADR 0003 (React + Vite + LocalStorage)

**Date:** 2026-07-24
**Target:** [ADR 0003](file:///c:/Users/kamalesh/OneDrive/Desktop/AI%20course/Todo%20Pro/docs/adrs/0003-react-vite-localstorage-todo-pro.md)
**Challenger:** Wei
**Respondent:** Archie
**Status:** Resolved

## Debate Log

### Round 1: Data Loss & LocalStorage Quota
* **Wei:** Relying solely on `localStorage` leaves users vulnerable to complete data loss if browser cache/data is cleared. `localStorage` also has a 5MB storage limit per domain.
* **Archie:** For a text-based Todo app, 5MB holds tens of thousands of tasks, making quota a non-issue for MVP. To mitigate data loss risk, we will build a 1-click JSON Data Backup (Export & Import) feature directly into the UI settings.

### Round 2: Notification & Reminder Reliability
* **Wei:** Desktop notifications using `setInterval` only trigger when the application tab is active in the browser window.
* **Archie:** We acknowledge this limitation for client-only MVP. We will handle missed reminders on app focus/re-open by comparing current time against due timestamps, displaying a "Missed / Overdue Reminders" summary banner on load.

## Resolution
The architecture decision in ADR 0003 is **Accepted** with mitigations:
1. Include JSON Backup/Export in MVP.
2. Include Overdue/Missed Reminder catch-up logic on app focus.
