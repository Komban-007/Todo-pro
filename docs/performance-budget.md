---
agent-notes: { ctx: "Performance budget for Todo Pro web app", deps: [docs/adrs/0003-react-vite-localstorage-todo-pro.md], state: active, last: "archie@2026-07-24" }
---

# Performance Budget: Todo Pro

**Date:** 2026-07-24
**Target:** Client-Side Web Application

## Latency & Responsiveness Targets
- **Initial Load Time (FCP):** < 800ms
- **Time to Interactive (TTI):** < 1.2s
- **Task Interaction Response (Click/Check/Add):** < 50ms (Immediate UI update)
- **Drag-and-Drop Frame Rate:** Stable 60 FPS animation

## Bundle Size Targets
- **Total Gzipped JS Bundle:** < 150 KB
- **Total CSS Asset Size:** < 30 KB
- **Lighthouse Performance Score:** ≥ 95 / 100
