# Incomplete i18n Migrations - Audit Report

**Date:** 2025-10-23
**Discovery:** Session 12 - Submitted.jsx review revealed systematic partial migrations

---

## Root Cause Analysis

### Why We Missed These Issues

Looking at **Session 1** notes in `collecting_translation_plan.md` (lines 642-658), Session 1 claimed to have fully migrated 13 files including `Submitted.jsx` and `Collect.jsx`. However, the migration was **only partial**.

**What Session 1 did:**
- ✅ Added `useTranslation` hook and `const { t } = useTranslation()`
- ✅ Migrated error/success toast messages (`error.*` and `success.*`)
- ❌ **Left table column headers hardcoded** (strings like 'Method', 'Site', etc.)
- ❌ **Left page-specific `language.pages.*` references** (titles, toolbar text, button text)

**Why this happened:**
- Session 1 focused on **critical runtime issues** (error/success messages that would break without migration)
- Session assumed table headers and page text could be done later
- Files were marked as "migrated" even though they still had `language.*` imports and hardcoded strings
- **No `language` import was removed**, so runtime errors didn't occur - the partial migration was silent

---

## Files with Hardcoded Table Headers

**Pattern:** All files have `useTranslation` hook but use hardcoded strings for table `Header` properties.

### 1. ✅ Submitted.jsx (FIXED)
**Location:** `src/components/pages/Submitted/Submitted.jsx`
**Status:** Fixed in Session 12
**Hardcoded headers:** 8 (Method, Site, Management Regime, Sample Unit #, Size, Depth (m), Sample Date, Observers)

### 2. ❌ Collect.jsx
**Location:** `src/components/pages/Collect/Collect.jsx`
**Status:** Incomplete migration
**Issues:**
- 8 hardcoded table headers (identical to Submitted.jsx)
- 4 `language.pages.collectTable.*` references:
  - Line 69: `useDocumentTitle` uses `language.pages.collectTable.title` and `language.title.mermaid`
  - Line 397: `PageUnavailable` uses `language.pages.collectTable.noDataMainText`
  - Line 415: `<H2>` uses `language.pages.collectTable.title`
  - Line 420: Toolbar uses `language.pages.collectTable.filterToolbarText`

**Hardcoded headers (lines 103-141):**
```javascript
Header: 'Method',
Header: 'Site',
Header: 'Management Regime',
Header: 'Sample Unit #',
Header: 'Size',
Header: 'Depth (m)',
Header: 'Sample Date',
Header: 'Observers',
```

### 3. ❌ ManagementRegimes.jsx
**Location:** `src/components/pages/ManagementRegimes/ManagementRegimes.jsx`
**Status:** Incomplete migration
**Issues:**
- 8+ hardcoded table headers
- 6 `language.pages.managementRegimeTable.*` references:
  - Line 76: `useDocumentTitle`
  - Line 361: Copy button text
  - Line 376: No data main text
  - Line 380: Copy button text (duplicate context)
  - Line 465: Page title `<H2>`
  - Line 468: Toolbar filter text

**Hardcoded headers (lines 122-157+):**
```javascript
Header: 'Management Regime Name',
Header: 'Secondary Name',
Header: 'Year Est.',
Header: 'Compliance',
Header: 'Open Access',
Header: 'Access Restrictions',
Header: 'Periodic Closure',
Header: 'Size Limits',
```

### 4. ❌ Sites.jsx
**Location:** `src/components/pages/Sites/Sites.jsx`
**Status:** Incomplete migration
**Issues:**
- 4+ hardcoded table headers
- Multiple `language.pages.siteTable.*` references (needs full grep)

**Hardcoded headers (lines 122-137+):**
```javascript
Header: 'Name',
Header: 'Reef Type',
Header: 'Reef Zone',
Header: 'Exposure',
```

### 5. ❌ Users.jsx
**Location:** `src/components/pages/Users/Users.jsx`
**Status:** Incomplete migration
**Issues:**
- 4+ hardcoded table headers
- Multiple `language.pages.userTable.*` references (needs full grep)

**Hardcoded headers (lines 384-467+):**
```javascript
Header: 'Name',
Header: 'Email',
Header: 'Unsubmitted Sample Units',
Header: 'Remove From Project',
```

### 6. ❌ UsersAndTransects.jsx
**Location:** `src/components/pages/UsersAndTransects/UsersAndTransects.jsx`
**Status:** Incomplete migration
**Issues:**
- 3+ hardcoded table headers
- `language.pages.*` references (needs full grep)

**Hardcoded headers (lines 200-216):**
```javascript
Header: 'Site',
Header: 'Method',
Header: () => <HeaderCenter>Submitted</HeaderCenter>,
```

### 7. ❌ ManagementRegimesOverview.jsx
**Location:** `src/components/pages/ManagementRegimesOverview/ManagementRegimesOverview.jsx`
**Status:** Incomplete migration
**Issues:**
- 2+ hardcoded table headers
- `language.pages.*` references (needs full grep)

**Hardcoded headers (lines 136-142):**
```javascript
Header: 'Site',
Header: 'Method',
```

### 8. ❌ Gfcr.jsx
**Location:** `src/components/pages/gfcrPages/Gfcr/Gfcr.jsx`
**Status:** Should be complete (Session 6), but has hardcoded headers
**Issues:**
- 3 hardcoded table headers (despite Session 6 claiming GFCR complete)

**Hardcoded headers (lines 96-106):**
```javascript
Header: 'Title',
Header: 'Type',
Header: 'Reporting Date',
```

---

## Files with `language.*` References Despite Having `useTranslation`

**Total:** 16 files have both `useTranslation` hook and `language.*` references.

### Session 1 Files (Claimed as "Migrated")

1. **Collect.jsx** - 4 language references (detailed above)
2. **ManagementRegimes.jsx** - 6 language references (detailed above)
3. **Sites.jsx** - Unknown count (needs analysis)
4. **Users.jsx** - Unknown count (needs analysis)
5. **UsersAndTransects.jsx** - Unknown count (needs analysis)
6. **CopySitesModal.jsx** - 3 language references:
   - Line 360: `language.pages.copySiteTable.filterToolbarText`
   - Line 382: `language.pages.copySiteTable.copyButtonText`
   - Line 392: `language.pages.copySiteTable.title`
7. **CopyManagementRegimesModal.jsx** - Unknown count (needs analysis)
8. **ManagementRegime.jsx** (single page) - Unknown count
9. **Site.jsx** (single page) - Unknown count
10. **ResolveDuplicateSiteButtonAndModal.jsx** - Unknown count

### Other Files with Mixed State

11. **NavMenu.jsx** - Unknown count
12. **NewOrganizationModal.jsx** - Unknown count
13. **ProjectInfo.jsx** - Unknown count
14. **SubmittedFishBelt.jsx** - Unknown count
15. **ProfileModal.jsx** - Unknown count
16. **ProjectCard.jsx** - Unknown count

---

## Common Patterns Found

### Pattern 1: Page Title in useDocumentTitle
```javascript
// ❌ Current (incomplete)
useDocumentTitle(`${language.pages.collectTable.title} - ${language.title.mermaid}`)

// ✅ Should be
useDocumentTitle(`${t('collect_table.title')} - ${t('app_title')}`)
```

### Pattern 2: Hardcoded Table Headers
```javascript
// ❌ Current (incomplete)
const tableColumns = useMemo(
  () => [
    { Header: 'Method', accessor: 'method', sortType: reactTableNaturalSort },
    // ...
  ],
  [],
)

// ✅ Should be
const tableColumns = useMemo(
  () => [
    { Header: t('method'), accessor: 'method', sortType: reactTableNaturalSort },
    // ...
  ],
  [t], // Important: add t to dependencies
)
```

### Pattern 3: Page Unavailable / No Data Text
```javascript
// ❌ Current (incomplete)
<PageUnavailable mainText={language.pages.collectTable.noDataMainText} />

// ✅ Should be
<PageUnavailable mainText={t('collect_table.no_data_main_text')} />
```

### Pattern 4: Toolbar Filter Text
```javascript
// ❌ Current (incomplete)
<ToolbarSection
  name={language.pages.collectTable.filterToolbarText}
  // ...
/>

// ✅ Should be
<ToolbarSection
  name={t('collect_table.filter_toolbar_text')}
  // ...
/>
```

### Pattern 5: Button Text
```javascript
// ❌ Current (incomplete)
<IconCopy /> {language.pages.managementRegimeTable.copyManagementRegimeButtonText}

// ✅ Should be
<IconCopy /> {t('management_regime_table.copy_button_text')}
```

---

## Required Translation Keys to Add

Based on the patterns found, each table page needs these keys in `translation.json`:

### For Collect.jsx (collect_table section):
```json
"collect_table": {
  "title": "Collecting",
  "filter_toolbar_text": "Filter this table by method, site, management regime, or observer",
  "no_data_main_text": "This project has no sample units in collecting yet."
}
```

Plus shared header keys (already exist): `method`, `site`, `management_regime`, `sample_unit_number`, `size`, `depth_m`, `sample_date`, `observers`

### For ManagementRegimes.jsx (management_regime_table section):
```json
"management_regime_table": {
  "title": "Management Regimes",
  "filter_toolbar_text": "Filter this table by name, compliance, or rules",
  "no_data_main_text": "This project has no management regimes yet.",
  "copy_button_text": "Copy Management Regimes"
}
```

Plus new header keys:
```json
"management_regime_name": "Management Regime Name",
"secondary_name": "Secondary Name",
"year_established": "Year Est.",
"compliance": "Compliance",
"open_access": "Open Access",
"access_restrictions": "Access Restrictions",
"periodic_closure": "Periodic Closure",
"size_limits": "Size Limits",
```

### For Sites.jsx (site_table section):
```json
"site_table": {
  "title": "Sites",
  "filter_toolbar_text": "Filter this table by site name or attributes",
  "no_data_main_text": "This project has no sites yet.",
  "copy_button_text": "Copy Sites"
}
```

Plus new header keys:
```json
"name": "Name",
"reef_type": "Reef Type",
"reef_zone": "Reef Zone",
"exposure": "Exposure",
```

### For Users.jsx (user_table section):
Updates needed (already has some keys from Session 9)

### For Gfcr.jsx (gfcr_table section):
```json
"title_column": "Title",
"type_column": "Type",
"reporting_date_column": "Reporting Date",
```

---

## Proposed Fix Strategy

### Phase 1: Complete Session 1 Files (High Priority)
Fix the 7 files that were claimed as "migrated" in Session 1 but are incomplete:

1. **Collect.jsx** - Same pattern as Submitted.jsx (8 headers + 4 language refs)
2. **ManagementRegimes.jsx** - 8+ headers + 6 language refs
3. **Sites.jsx** - 4+ headers + language refs
4. **Users.jsx** - 4+ headers + language refs
5. **UsersAndTransects.jsx** - 3+ headers + language refs
6. **CopySitesModal.jsx** - 3 language refs
7. **CopyManagementRegimesModal.jsx** - Unknown count

### Phase 2: Fix GFCR File (Medium Priority)
8. **Gfcr.jsx** - Should have been complete in Session 6, fix 3 headers

### Phase 3: Fix Other Mixed-State Files (Medium Priority)
9. **ManagementRegimesOverview.jsx** - 2+ headers
10. **ManagementRegime.jsx** - Single page
11. **Site.jsx** - Single page
12. **ResolveDuplicateSiteButtonAndModal.jsx**

### Phase 4: Check Remaining Files (Low Priority)
13. **NavMenu.jsx**
14. **NewOrganizationModal.jsx**
15. **ProjectInfo.jsx**
16. **SubmittedFishBelt.jsx**
17. **ProfileModal.jsx**
18. **ProjectCard.jsx**

---

## Verification Checklist

For each file being fixed:

- [ ] Read file to understand all `language.*` references
- [ ] Add all missing translation keys to `translation.json`
- [ ] Replace hardcoded `Header: 'String'` with `Header: t('key')`
- [ ] Replace all `language.pages.*` with `t('...')`
- [ ] Update `useMemo` dependencies to include `[t]` where table columns use `t()`
- [ ] Verify no `language` import remains
- [ ] Verify no hardcoded English strings remain in UI code
- [ ] Verify `translation.json` is valid JSON after edits

---

## Success Metrics

**Complete when:**
- ✅ All 16 files have zero `language.*` references
- ✅ All table headers use `t()` translations
- ✅ All new translation keys added to `translation.json`
- ✅ `translation.json` is valid JSON
- ✅ Manual spot-check: tables and pages render with correct text
- ✅ Update `collecting_translation_plan.md` Session notes to reflect reality

---

## Estimated Effort

- **Phase 1:** 2-3 hours (7 files, similar complexity to Submitted.jsx)
- **Phase 2:** 15 minutes (1 file, simple)
- **Phase 3:** 1-2 hours (6 files, varied complexity)
- **Phase 4:** 1-2 hours (6 files, unknown complexity)

**Total:** 4-7 hours to complete all incomplete migrations

---

## Lessons Learned

1. **Partial migrations are silent failures** - If `language` import remains, no runtime errors occur
2. **Session completion criteria were unclear** - "Migrated" should mean "100% complete, no language.* references"
3. **Need better verification** - Should have grepped for `language\.` in "migrated" files
4. **Table headers were overlooked** - Focus on toast messages missed structural UI text
5. **Need systematic file review** - Should verify each file completely before marking done

---

## Next Steps

1. Review this audit with user
2. Get approval for fix strategy
3. Execute Phase 1 (Session 1 files) systematically
4. Update `collecting_translation_plan.md` with Session 12+ notes
5. Add verification step to future migration sessions: `grep -n "language\." <file>` must return 0 results
