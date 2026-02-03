# Dependency Upgrade Matrix

Visual reference for upgrade order and dependencies between packages.

## Upgrade Dependency Graph

```
Phase 1: Foundation
├── styled-components (v5 → v6) ──┐
├── Node version verification      ├─→ BLOCKS → Phase 3 (React 19)
└── Remove Webpack (if unused)    ┘

Phase 2: Testing
├── MSW (0.27 → 2.x) ──────────────┬─→ ENABLES → All subsequent testing
└── fake-indexeddb (3.x → 6.x)     ┘

Phase 3: Core Libraries
├── React 19 ←─── REQUIRES ──── styled-components v6
├── Formik + Yup ←─ INDEPENDENT ─→ Can run in parallel with React
└── Dexie 4.x ←──── INDEPENDENT ─→ Can run in parallel with React

Phase 4: Remaining
├── date-fns (replace moment) ←── INDEPENDENT
├── @auth0/auth0-react ←────────── INDEPENDENT
├── MapLibre ←──────────────────── INDEPENDENT (but risky)
└── Other dependencies ←────────── INDEPENDENT
```

## Critical Path

**These MUST be done in order:**

1. styled-components v5 → v6
2. MSW 0.27 → 2.x
3. React 18 → 19 (depends on styled-components v6)

**Everything else can be done independently** (but testing infrastructure should be done early).

---

## Package Interdependencies

### Tier 1: Foundational (Must fix first)

| Package | Current | Target | Blocks | Difficulty | Priority |
|---------|---------|--------|--------|------------|----------|
| styled-components | ^5 (forced) | ^6 | React 19 | Medium | CRITICAL |
| MSW | 0.27.0 | 2.x | All testing | High | CRITICAL |
| Node | v24.10.0? | v20.x LTS | All deps | Low | HIGH |

### Tier 2: Core Framework

| Package | Current | Target | Depends On | Difficulty | Priority |
|---------|---------|--------|------------|------------|----------|
| react | 18.2.0 | 19.0.0 | styled-components v6 | Medium | HIGH |
| react-dom | 18.2.0 | 19.0.0 | styled-components v6 | Medium | HIGH |
| react-router-dom | 6.19.0 | 7.9.6 | - | Low | MEDIUM |
| typescript | 5.3.2 | 5.7.x  | - | Low | MEDIUM |

### Tier 3: Forms & Validation

| Package | Current | Target | Depends On | Difficulty | Priority |
|---------|---------|--------|------------|------------|----------|
| formik | 2.2.9 | 2.4.x | - | Low | HIGH |
| yup | 0.32.9 | 1.x.x | - | Medium | HIGH |

### Tier 4: Data & Storage

| Package        | Current | Target | Depends On | Difficulty | Priority |
|----------------|---------|--------|------------|------------|----------|
| dexie          | 3.0.3   | 4.x.x  | fake-indexeddb | Medium     | HIGH |
| fake-indexeddb | 3.1.2   | 6.x.x  | - | Low        | MEDIUM |
| axios          | 1.12.2  | 1.7.x  | - | Low        | LOW |
| vite-plugin-pwa  | 0.21.1  | 1.2.x  | - | ?          | LOW |

### Tier 5: UI & Styling

| Package | Current | Target | Depends On | Difficulty | Priority |
|---------|---------|--------|------------|------------|----------|

### Tier 6: Maps

| Package | Current | Target | Depends On | Difficulty | Priority |
|---------|---------|--------|------------|------------|----------|
| maplibre-gl | 1.14.0 | 5.x.x | - | Very High | MEDIUM |
| mapbox-gl | 1.0.0 | 3.x.x | - | High | LOW |

### Tier 7: i18n

### Tier 8: Authentication

| Package | Current | Target | Depends On | Difficulty | Priority |
|---------|---------|--------|------------|------------|----------|
| @auth0/auth0-react | 1.2.0 | 2.11.0 | - | Medium | MEDIUM |

### Tier 9: Utilities & Misc

| Package | Current | Target            | Depends On | Difficulty | Priority |
|---------|--------|-------------------|------------|------------|----------|
| moment | 2.29.3 | REMOVE → date-fns | - | Medium     | MEDIUM |

| uuid | 8.3.2  | 10.x.x            | - | Low        | LOW |
| jest-environment-jsdom | 29.7.0 | 30.2.0 | - | Low        | LOW |

### Tier 10: Build Tools

| Package | Current | Target | Depends On | Difficulty | Priority |
|---------|---------|--------|------------|------------|----------|
| vite | 7.1.11 | Latest 7.x | - | Low | LOW |
| @vitejs/plugin-react-swc | 3.8.0 | Latest 3.x | - | Low | LOW |
| @swc/core | 1.11.9 | Latest 1.x | - | Low | LOW |

---

## Parallel Upgrade Opportunities

These upgrades can be done simultaneously (in separate branches):

### Parallel Group A (After Phase 1 & 2)
- React 19
- Formik + Yup
- Dexie 4.x
- date-fns (moment replacement)

### Parallel Group B (Lower priority)
- @auth0/auth0-react
- axios

### Parallel Group C (Defer if needed)
- MapLibre (very risky)
- ~~react-table v8 (complete API rewrite)~~
- ~~@mui/material v6~~

---

## Breaking Change Severity

### 🔴 Critical Breaking Changes

| Package | Version Jump | Breaking Changes | Impact |
|---------|--------------|------------------|--------|
| MSW | 0.27 → 2.x | Complete API redesign | ALL tests |
| yup | 0.32 → 1.x | Validation behavior changes | ALL forms |
| React | 18 → 19 | JSX, hooks, batching | Entire app |
| Dexie | 3 → 4 | TypeScript, array mutability | Offline storage |
| maplibre-gl | 1.14 → 5.x | 4 major versions! | Maps |

### 🟡 Moderate Breaking Changes

| Package | Version Jump | Breaking Changes | Impact |
|---------|--------------|------------------|--------|
| styled-components | 5 → 6        | css prop, attrs, theme | Styling |
| @auth0/auth0-react | 1 → 2        | Provider API | Authentication |
| moment → date-fns | N/A          | Entire API different | Date handling |

### 🟢 Minor Breaking Changes

| Package | Version Jump | Breaking Changes | Impact |
|---------|--------------|------------------|--------|
| formik | 2.2 → 2.4 | Minor improvements | Forms |
| react-router-dom | 6.19 → 6.28 | Mostly additive | Routing |
| TypeScript | 5.3 → 5.7 | Type improvements | Build |

---

## Risk Matrix

| Package | Business Impact | Technical Risk | Upgrade Effort | Overall Risk |
|---------|----------------|----------------|----------------|--------------|
| MSW | Low (dev only) | High | High           | MEDIUM |
| React | Critical | Medium | Medium         | HIGH |
| styled-components | Critical | Low | Low            | MEDIUM |
| Dexie | Critical | Medium | Medium         | HIGH |
| yup | Critical | Medium | Medium         | HIGH |
| formik | Critical | Low | Low            | MEDIUM |
| maplibre-gl | High | Very High | Very High      | VERY HIGH |
| @auth0/auth0-react | Critical | Medium | Medium         | HIGH |
| moment → date-fns | Medium | Low | Medium         | LOW |

**Legend:**
- **Business Impact:** How critical is this to core functionality?
- **Technical Risk:** How likely is it to break things?
- **Upgrade Effort:** How much work is required?
- **Overall Risk:** Combined assessment

---

## Recommended Upgrade Sequence

Based on dependencies and risk:

### 1
1. ✅ Fix styled-components (Phase 1)
	- Migrate globalStyles.js to a SCSS file in styles/
2. ✅ Verify Node version (Phase 1)
3. ✅ Remove Webpack if unused (Phase 1)
4. ✅ Upgrade MSW (Phase 2)
5. ✅ Fix all tests (Phase 2)

### 2
6. ✅ Upgrade React 19 (Phase 3a)
7. ✅ Upgrade Formik + Yup (Phase 3b) - can parallel with #6
8. ✅ Upgrade Dexie (Phase 3c) - can parallel with #6

### 3
9. ✅ Replace moment with date-fns (Phase 4)
11. ✅ Upgrade @auth0/auth0-react (Phase 4)
12. ✅ Update remaining low-risk packages (Phase 4)
13. ✅ Full regression testing

### Future / Separate Initiative
- MapLibre 1.14 → 5.x (requires dedicated effort)

---

## Version Compatibility Matrix

### React Ecosystem

| React | TypeScript | styled-components | react-router |
|-------|------------|-------------------|--------------|
| 19.x  | 5.3+       | 6.x+              | 6.x+         |
| 18.x  | 5.x+       | 5.x+              | 6.x+         |

### Testing Ecosystem

| MSW  | Jest | @testing-library/react | fake-indexeddb |
|------|------|------------------------|----------------|
| 2.x  | 29.x | 16.x                   | 6.x            |
| 1.x  | 29.x | 14.x                   | 4.x            |
| 0.x  | 27.x | 12.x                   | 3.x            |

### Forms Ecosystem

| formik | yup  | React |
|--------|------|-------|
| 2.4.x  | 1.x  | 16.8+ |
| 2.2.x  | 0.32 | 16.8+ |

### Data Ecosystem

| Dexie | fake-indexeddb | TypeScript |
|-------|----------------|------------|
| 4.x   | 6.x            | 5.x        |
| 3.x   | 3-4.x          | 4.x        |

---

## Package Manager Compatibility

### Yarn Version

**Current:** 1.22.22 (Yarn Classic)
**Latest:** 4.x.x (Yarn Berry)

**Recommendation:** STAY on Yarn 1.x for this upgrade
- Yarn Berry introduces significant changes
- PnP mode would require extensive testing
- Defer Yarn upgrade to separate initiative

### Node Version Compatibility

| Node LTS | Support Until | Recommended |
|----------|---------------|-------------|
| 20.x     | April 2026    | ✅ YES      |
| 22.x     | April 2027    | ✅ YES      |
| 18.x     | April 2025    | ⚠️ EOL soon |
| 24.x     | N/A           | ❌ Doesn't exist |

**Current:** v24.10.0 (likely typo in .nvmrc)
**Recommended:** v20.x (stable LTS)

---

## Test Coverage Impact

| Upgrade | Tests Affected | Estimated Fixes |
|---------|----------------|-----------------|
| MSW | ~145 test files | 100+ files |
| React 19 | All component tests | 20-30 files |
| Formik + Yup | Form tests | 30-40 files |
| Dexie | Offline/storage tests | 20-30 files |
| styled-components | Minimal | 0-5 files |
| date-fns | Date display/calc tests | 10-20 files |
| Others | Minimal | 5-10 files |

**Total Estimated Test Updates:** 185-240 files (out of ~145 test files, many will need multiple changes)

---

## Quick Reference Commands

```bash
# Check current versions
yarn list --pattern "react|styled-components|msw|dexie|yup"

# Check for outdated packages
~~yarn outdated~~

# Check specific package versions
yarn why <package-name>

# Audit dependencies
~~yarn audit~~

# Install specific version
yarn add <package>@<version>

# Install and update dependencies
yarn install

# Run tests
yarn test

# Build project
yarn build
```

---

## Emergency Rollback Points

Each phase creates a rollback tag:

```bash
# Phase 1 complete
git tag upgrade-phase1-complete

# Phase 2 complete
git tag upgrade-phase2-complete

# Phase 3 complete
git tag upgrade-phase3-complete

# Phase 4 complete
git tag upgrade-phase4-complete

# Rollback to specific phase
git reset --hard upgrade-phase2-complete
yarn install
```

---

## Success Metrics

Track these metrics before and after each phase:

| Metric | Baseline | Target | Current |
|--------|----------|--------|---------|
| Test Pass Rate | ____% | 100% | ____% |
| Build Time | ____s | < +20% | ____s |
| Bundle Size | ____MB | < +15% | ____MB |
| Test Suite Time | ____s | < +30% | ____s |
| Lighthouse Score | ____ | ≥ baseline | ____ |
| Security Vulns | ____ | 0 critical | ____ |
| TypeScript Errors | ____ | ≤ baseline | ____ |

---

## Contact & Resources
**External Resources:**
- [React 19 Docs](https://react.dev/)
- [MSW v2 Docs](https://mswjs.io/)
- [Dexie Docs](https://dexie.org/)
- [Yup Docs](https://github.com/jquense/yup)
- [date-fns Docs](https://date-fns.org/)

---

**Last Updated:** 2026-02-02
**Version:** 1.1
