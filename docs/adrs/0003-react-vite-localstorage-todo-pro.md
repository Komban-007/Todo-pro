---
agent-notes: { ctx: "ADR 0003 React + Vite + LocalStorage architecture", deps: [AGENTS.md, docs/product-context.md], state: active, last: "archie@2026-07-24" }
---

# 0003. React + Vite + LocalStorage Architecture for Todo Pro

**Status:** Accepted
**Date:** 2026-07-24
**Deciders:** Archie, Sato, Pat, Wei

## Context
Todo Pro is designed as a simple, high-performance, intelligent task management application. Key MVP requirements include:
1. Zero-lag user interface with drag-and-drop task reordering.
2. Due dates, recurring tasks, and reliable browser reminders.
3. Light/Dark mode with a clean Apple Notes / Google Tasks inspired visual design.
4. Fast time-to-market without initial backend complexity.

## Decision
We will build Todo Pro as a client-side single-page web application using:
- **Framework & Build Tool:** React 18 + Vite for high-speed HMR, lightweight bundle size, and component-based UI architecture.
- **Styling:** Vanilla CSS design system with CSS custom properties (variables) for theme switching (Light/Dark mode) and glassmorphism styling.
- **State & Persistence:** React State (`useContext` / custom hooks) paired with browser `localStorage` for offline-first data persistence and immediate load speeds.
- **Drag-and-Drop:** Native HTML5 Drag and Drop API or `@hello-pangea/dnd` for smooth task list reordering.
- **Reminders:** Browser `Notification` API with Web Workers / `setInterval` check loop for scheduled notifications.

## Consequences
### Positive
- Instant application boot and UI feedback with zero network latency.
- Simple, self-contained architecture easy to build and test via TDD.
- Zero server hosting/database cost for MVP.

### Negative / Trade-offs
- LocalStorage is bound to a single browser/device (no multi-device sync until backend integration).
- Browser notification permissions must be granted by the user; fallback to in-app banners when blocked.

## Alternatives Considered
- **Plain Vanilla JS:** Lower abstraction cost, but state management for drag-and-drop and complex task reordering becomes cumbersome.
- **Fullstack Next.js + DB:** High initial setup overhead and server deployment requirements not needed for client-first MVP.
