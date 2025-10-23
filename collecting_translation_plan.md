# **Comprehensive Plan: Full i18n Implementation for MERMAID Webapp**

## **Executive Summary**

This plan outlines the **completion** of the i18next-based internationalization migration for the MERMAID webapp. Migration **is already in progress** with significant work complete.

### **Current Progress:**
- ✅ **~855 lines of translations migrated** to `translation.json` (~710+ keys)
- ✅ **76+ files already using `useTranslation` hook** (~90%+ complete)
- ✅ **Image Classification feature 100% migrated** (source of truth for patterns)
- ✅ **ALL Collect Record Forms COMPLETE** (Sessions 1-5) 🎉
- ✅ **ALL GFCR Forms F1-F7 COMPLETE** (Sessions 6-8) 🎉
- ✅ **Trans component pattern established** for JSX-returning helper functions
- ✅ **Validation infrastructure 100% migrated** (Session 4)
- ⚠️ **~5-10 files still use `language.jsx`** for supporting components only

### **Remaining Work:**
- Complete migration of **~5 GFCR supporting components** (FinanceSolutions, Investments, Revenues, etc.)
- Update **~5-10 remaining files** still importing `language.jsx` (supporting components)
- Run tests and fix any failures
- **CRITICAL:** Fix MethodsFilterDropDown hardcoded protocol names
- Remove `language.jsx` after verifying no usage

**Scope:** Complete webapp (Collecting, Submitted, Sites, Management Regimes, Project Info, GFCR, etc.)

**Approach:** Phased incremental migration by component category, following **existing patterns** as source of truth

**Estimated Remaining Effort:** 1-2 hours (reduced from initial 15-20 hours)

---

## **1. Current State Analysis**

### **Existing i18n Infrastructure**
✅ **Already in place:**
- i18next v25.2.0 and react-i18next v15.5.2 installed
- i18n configuration at `i18n.ts` with lazy-loading support
- Vite plugin `vite-plugin-i18next-loader` configured
- Jest mocking configured in `src/setupTests.js` (returns keys as-is)
- **~590 lines in `src/locales/en/translation.json`** (~460+ keys)
- **63+ files already using `useTranslation` hook**
- **Image Classification feature FULLY migrated** (source of truth)
- **ALL Collect Record Form components COMPLETE** (Sessions 1-5)
- **Trans component pattern established** (Session 3)
- **Validation infrastructure FULLY migrated** (Session 4)

### **Files Already Migrated (63+ files total)**

**Pre-Session (26 files - Image Classification + Fish Belt):**
- Image Classification feature (13 files) - COMPLETE
- FishBeltForm.jsx, FishBeltObservationTable.jsx, FishBeltTransectInputs.jsx
- BenthicLitForm.jsx, BenthicPhotoQuadratForm.jsx, BenthicPhotoQuadratTransectInputs.jsx
- BenthicPitForm.jsx, BleachingForm.jsx
- Additional form components already using i18n

**Session 1 (13 files):**
- Site.jsx, ManagementRegime.jsx, ManagementRegimes.jsx
- CopySitesModal.jsx, CopyManagementRegimesModal.jsx
- ResolveDuplicateSiteButtonAndModal.jsx, ResolveDuplicateMRButtonAndModal.jsx
- CollectRecordsCount.jsx
- Users.jsx, UsersAndTransects.jsx
- Collect.jsx, Submitted.jsx
- SubmittedFishBelt.jsx

**Session 2 (9 files):**
- SubmittedBenthicPit.jsx, SubmittedBenthicLit.jsx, SubmittedBenthicPhotoQuadrat.jsx
- SubmittedBleaching.jsx, SubmittedHabitatComplexity.jsx
- GraphsAndMaps.jsx, FishFamilies.jsx
- ManagementRegimesOverview.jsx, DataSharing.jsx
- useCollectRecordValidation.js

**Session 3 (5 files - ALL TRANSECT INPUTS):**
- SampleEventInputs.jsx
- BenthicLitTransectInputs.jsx (established Trans pattern)
- BenthicPitTransectInputs.jsx
- HabitatComplexityTransectInputs.jsx
- BleachingTransectInputs.jsx

### **Remaining Files (~5-10 files)**

**✅ Collect Record Form Pages (COMPLETE - Sessions 1-5):**
- ✅ CollectRecordFormPage.jsx
- ✅ HabitatComplexityForm.jsx
- ✅ All ObservationTables (BenthicLit, BenthicPit, BenthicPhotoQuadrat, HabitatComplexity, ColoniesBleached, PercentCover, FishBelt)
- ✅ All TransectInputs (BenthicLit, BenthicPit, BenthicPhotoQuadrat, HabitatComplexity, Bleaching, FishBelt, SampleEvent)
- ✅ ObservationValidationInfo.jsx
- ✅ RecordLevelValidationInfo.jsx
- ✅ All validation infrastructure migrated

**✅ GFCR Pages (COMPLETE - Sessions 6-8):**
- ✅ Gfcr.jsx, GfcrIndicatorSet.jsx, GfcrIndicatorSetNav.jsx
- ✅ NewIndicatorSetModal.jsx
- ✅ FinanceSolutionModal.jsx, InvestmentModal.jsx, RevenueModal.jsx
- ✅ F1Form.jsx through F7Form.jsx (all 7 forms complete)
- 🎯 FinanceSolutions.jsx, Investments.jsx, Revenues.jsx (supporting components - remaining)
- 🎯 ReportTitleAndDateForm.jsx, IndicatorSetTitle.jsx (supporting components - remaining)

**Supporting Components (~15 files):**
- DeleteProjectButton.jsx
- NewUserModal.jsx, RemoveUserModal.jsx
- TransferSampleUnitsModal.jsx
- UserRolesInfoModal.jsx
- DataSharingInfoModal.jsx
- FilterSearchToolbar.jsx
- Various input components
- Map components
- Sample unit popups

### **Legacy System Sections Still in Use**

From `language.jsx` (1,583 lines total):
- **apiDataTableNames** - **DO NOT TRANSLATE** (internal API identifiers)
- **helperText** - ~50+ field descriptions (8 JSX-returning functions)
- **tooltipText** - ~15+ contextual help (2 JSX-returning functions)
- **pages.*** - Page-specific content (~20+ sections still to migrate)
- **deleteRecord*** - Delete confirmation messages
- **GFCR sections** - ~200+ strings (~60 JSX-returning helper functions)

---

## **2. Translation File Structure**

### **Single Namespace Approach**

Using a **single translation file** with hierarchical organization (max 2-3 levels deep):

**File:** `src/locales/en/translation.json`

**Naming Conventions (from existing patterns):**
1. **Use snake_case for most keys:** `add_row`, `save_changes`, `sample_time_info`
2. **EXCEPTION - Protocol names use lowercase compound:** `fishbelt`, `benthiclit`, `benthicpqt` (NOT `fish_belt`)
3. **Helper text pattern:** Field name + `_info` suffix (e.g., `depth` field has `depth_info` helper text)
4. **Hierarchical with max 2-3 levels:** `image_classification.annotation.confirm`
5. **Descriptive names:** `projects.data_unavailable` not `projects.error1`
6. **Pluralization suffixes:** `classifier_guesses_one` and `classifier_guesses_other`
7. **No text in keys:** `buttons.cancel` not `buttons.Cancel`
8. **Context in naming:** Group by feature/page (`projects.errors.*` not `errors.projects.*`)

### **Current Sections in translation.json:**
- `buttons` - 16 keys (add_row, save, cancel, etc.)
- `protocol_titles` - 6 keys (fishbelt, benthiclit, etc.)
- `image_classification` - ~50+ keys (COMPLETE)
- `projects` - ~30+ keys (CRUD, errors, success)
- `sample_units` - error messages
- `fish_belt_observations`, `benthic_observations`, `taxonomies`
- Transect fields (~30 keys with `*_info` pattern)
- `exports`, `forms`, `toasts`, `loading`, `map_tooling`, `offline`, `search`
- `gfcr` - 5 keys (basic structure)
- `error` - ~40+ keys (Sessions 1-3)
- `success` - ~20+ keys (Sessions 1-3)
- `submitted_form` - 3 keys (Session 2)
- `management_regimes_overview` - 4 keys (Session 2)
- `data_sharing` - 4 keys (Session 2)
- `collect_record` - form section titles (Session 3)
- Site, management, sample_date fields (Session 3)

---

## **3. Critical Migration Issues & Patterns**

### **Issue 1: MethodsFilterDropDown Hardcoded Array** ⚠️ CRITICAL

**Problem:** `src/components/MethodsFilterDropDown/MethodsFilterDropDown.jsx:42-49` has hardcoded array

**Solution:**
```javascript
import { useTranslation } from 'react-i18next'

const MethodsFilterDropDown = ({ ... }) => {
  const { t } = useTranslation()

  const methods = [
    t('protocol_titles.fishbelt'),
    t('protocol_titles.benthicpit'),
    t('protocol_titles.benthiclit'),
    t('protocol_titles.benthicpqt'),
    t('protocol_titles.bleachingqc'),
    t('protocol_titles.habitatcomplexity'),
  ]
}
```

### **Issue 2: JSX Helper Text Migration Pattern** ⚠️ ESTABLISHED ✅

**Solution:** Use `Trans` component with component interpolation (pattern established in Session 3)

```javascript
// translation.json
{
  "reef_slope_info": "The slope of the reef where the survey was conducted. Refer to <a>this PDF</a> for guidance."
}

// Component (following BenthicLitTransectInputs.jsx pattern)
import { Trans } from 'react-i18next'
import { HelperTextLink } from '../components/generic/links'

<Trans
  i18nKey="reef_slope_info"
  components={{
    a: <HelperTextLink href="https://..." target="_blank" />
  }}
/>
```

**Reference implementation:** `src/components/pages/collectRecordFormPages/BenthicLitForm/BenthicLitTransectInputs.jsx`

### **Issue 3: Status Label Styling**

**Solution:** Keep internal constants untranslated, only translate display text:
```javascript
// collectConstants.js - DO NOT translate these
export const VALIDATION_STATUS = {
  error: 'error',    // Internal constant
  ok: 'ok',
  stale: 'stale',
  warning: 'warning',
}

// translation.json
{
  "validation_status": {
    "errors": "Errors",
    "ok": "Ready to submit",
    "saved": "Saved",
    "warnings": "Warnings"
  }
}

// Component usage
const statusLabel = t(`validation_status.${VALIDATION_STATUS.error}`)
```

---

## **4. Migration Strategy (Remaining Phases)**

### **✅ Phase: Collect Record Forms (COMPLETE - Sessions 1-5)**

**Status:** ALL DONE! 🎉

**Completed files:**
- ✅ CollectRecordFormPage.jsx
- ✅ All observation tables (7 files)
- ✅ All transect inputs (7 files)
- ✅ ObservationValidationInfo.jsx, RecordLevelValidationInfo.jsx
- ✅ Created new `src/library/getValidationMessage.js` utility
- ✅ Updated `src/library/validationMessageHelpers.jsx` to use i18n
- ✅ All validation infrastructure migrated

**Content migrated:**
- ✅ Form field labels and helper texts
- ✅ All validation messages (~85 validation types)
- ✅ Section headers and tooltips
- ✅ JSX-returning helper functions (using Trans component)

### **Phase: GFCR Pages** (~15 files) - NEXT PRIORITY

**Files:**
- GFCR main pages, indicator sets, forms, modals

**Content:**
- ~200+ strings
- ~60 JSX-returning helper functions (use Trans pattern)
- Finance/investment/revenue options

### **Phase: Supporting Components** (~15 files)

**Files:**
- Modals (Delete, New User, Transfer, etc.)
- Input components
- Map components

**Content:**
- Delete confirmations
- Modal content
- Form labels

---

## **5. Test Strategy**

### **Current Setup**
```javascript
// src/setupTests.js
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,  // Returns the key unchanged
    i18n: { changeLanguage: () => new Promise(() => {}), language: 'en' },
  }),
  Trans: ({ children }) => children,
}))
```

### **Approach**
- **Use data-testids** for stable, language-agnostic tests
- **Minimal test changes** - most tests already work with key-based mocking
- Update tests only when specific text assertions fail

---

## **6. Source of Truth: Existing Patterns**

**IMPORTANT:** Use these as reference implementations:

1. **Trans Component with Links:** `BenthicLitTransectInputs.jsx` (Session 3)
2. **Pluralization:** `image_classification.annotation.unclassified_points_*`
3. **Helper Text `_info` Suffix:** `depth`, `depth_info`
4. **Error/Success with Interpolation:** `error.save_online_sync_error` with `{ itemType }`
5. **Protocol Titles:** `protocol_titles.fishbelt` (lowercase compound)
6. **Nested Structure:** `image_classification.annotation.confirm` (max 3 levels)

**Reference Files:**
- All ImageClassification components (13 files)
- BenthicLitTransectInputs.jsx (Trans pattern)
- Site.jsx (error/success patterns)
- Projects.jsx (CRUD patterns)

---

## **7. Acceptance Criteria**

### **Must Complete:**
- [ ] All ~1,583 lines of language.jsx migrated
- [ ] All ~40 remaining files updated to use t()
- [ ] MethodsFilterDropDown uses i18n protocol names
- [ ] All JSX helper functions use Trans component
- [ ] All tests passing
- [ ] language.jsx file deleted
- [ ] No linting errors

### **Manual Testing:**
- [ ] All pages render correctly
- [ ] All forms work correctly
- [ ] Filtering by protocol works
- [ ] All 6 protocol forms - data entry and validation
- [ ] GFCR workflows
- [ ] All CRUD operations

---

## **Session 6: 2025-10-22 (GFCR PHASE STARTED!)**

### **KEY ACHIEVEMENT: Complete GFCR Translation Structure Added ✅**

Added comprehensive GFCR translations to `translation.json` - the largest single translation addition in the project!

### **Files Migrated (5 files):**
1. **GfcrIndicatorSetNav.jsx** - Navigation component
2. **Gfcr.jsx** - Main GFCR table page
3. **GfcrIndicatorSet.jsx** - Indicator set detail page
4. **GfcrGenericTable.jsx** - Generic table component (no changes needed)
5. **NewIndicatorSetModal.jsx** - Create indicator set modal (with Trans components)

### **Translation Keys Added (~250+ keys):**

**New sections in `translation.json`:**
1. **`gfcr.*`** - GFCR table and base content (~15 keys)
   - `table.*` - Table UI strings
   - `finance_solutions_table.*`, `investments_table.*`, `revenues_table.*`
   - PDF link, Allen Coral Atlas link, 2X Criteria link

2. **`gfcr_modals.*`** - All modal content (~70+ keys)
   - `new_indicator_set.*` - Create indicator set modal
   - `finance_solution.*` - Finance solution modal (20+ keys with helpers)
   - `investment.*` - Investment modal (8+ keys with helpers)
   - `revenue.*` - Revenue modal (10+ keys with helpers)

3. **`gfcr_indicator_set.*`** - F1-F7 forms content (~140+ keys)
   - Title, total, demographics fields
   - F1 heading and field (coral reef extent)
   - F2 headings and 6 fields (conservation/management)
   - F3 headings and 6 fields (restoration)
   - F4 headings, 3 fields, and calc UI (reef health)
   - F5 headings and 6 fields (communities)
   - F6 heading and field (livelihoods)
   - F7 headings and 4 fields (climate response)
   - Each field has extensive helper text with links

4. **`gfcr_nav.*`** - Navigation labels (~12 keys)
   - Fund indicators heading, F1-F7 labels, F8/F9/F10 heading

### **Translation File Stats:**
- Before Session 6: 590 lines, ~460+ keys
- After Session 6: **~850 lines, ~710+ keys** (+260 lines, +250 keys)
- **Largest single session addition!**

### **Patterns Applied:**
```jsx
// 1. Standard translations
const { t } = useTranslation()
{t('gfcr.table.title')}

// 2. Navigation items
{t('gfcr_nav.f1')}

// 3. Complex helper text with Trans
<Trans
  i18nKey="gfcr_indicator_set.indicator_set_title_helper"
  components={{
    a: <HelperTextLink href="https://..." target="_blank" />
  }}
/>

// 4. Modal structure
t('gfcr_modals.new_indicator_set.title')
t('gfcr_modals.finance_solution.name_helper')
```

### **Remaining GFCR Work (14 files):**
1. **Modals** (3 files):
   - FinanceSolutionModal.jsx
   - InvestmentModal.jsx
   - RevenueModal.jsx

2. **F1-F7 Forms** (7 files):
   - F1Form.jsx through F7Form.jsx

3. **Supporting Components** (4 files):
   - FinanceSolutions.jsx
   - Investments.jsx
   - Revenues.jsx
   - ReportTitleAndDateForm.jsx

4. **Helper** (1 file):
   - IndicatorSetTitle.jsx

**Next Session Priority:** Complete remaining modals → F1-F7 forms → supporting components

---

## **Session 7: 2025-10-22 (GFCR MODALS + F1-F2 FORMS COMPLETE)**

### **KEY ACHIEVEMENT: All GFCR Modals Migrated + F1-F2 Forms Complete ✅**

Completed migration of all 3 GFCR modals and 2 indicator set forms, establishing clear patterns for remaining work.

### **Files Migrated (5 files):**
1. **FinanceSolutionModal.jsx** - Finance solution CRUD modal with complex fields
2. **InvestmentModal.jsx** - Investment CRUD modal
3. **RevenueModal.jsx** - Revenue CRUD modal
4. **F1Form.jsx** - Coral reef extent (simple form with 1 field)
5. **F2Form.jsx** - Conservation and management (8 fields with Allen Coral Atlas links)

### **Translation Keys Added (1 new key):**
- `placeholders.select` - "Choose..." (for dropdown placeholders)

### **Patterns Applied:**

**Modal Pattern:**
```javascript
// Import
import { useTranslation, Trans } from 'react-i18next'
import { HelperTextLink } from '../../../../generic/links'

// Hook
const { t } = useTranslation()

// Simple text
{t('gfcr_modals.finance_solution.name')}

// Helper with link
helperText={
  <Trans
    i18nKey="gfcr_modals.finance_solution.name_helper"
    components={{
      a: <HelperTextLink href="https://..." target="_blank" />
    }}
  />
}

// Multiple link types
<Trans
  i18nKey="gfcr_modals.finance_solution.gender_smart_helper"
  components={{
    twoXLink: <HelperTextLink href="https://..." target="_blank" />,
    a: <HelperTextLink href="https://..." target="_blank" />
  }}
/>
```

**Form Pattern:**
```javascript
// Simple label
label={<><strong>F 1.1</strong> {t('gfcr_indicator_set.f1_1')}</>}

// Label with styled tag
label={
  <>
    <strong>F 2.1a</strong>{' '}
    <Trans i18nKey="gfcr_indicator_set.f2_1a" components={{ 0: <strong /> }} />
  </>
}

// Helper with multiple links
helperText={
  <Trans
    i18nKey="gfcr_indicator_set.f2_1a_helper"
    components={{
      acaLink: <HelperTextLink href="https://allencoralatlas.org/" target="_blank" />,
      a: <HelperTextLink href="https://..." target="_blank" />
    }}
  />
}
```

### **Documentation Created:**

Created **`GFCR_FORMS_MIGRATION_GUIDE.md`** - comprehensive guide for completing F3-F7 forms migration:
- Step-by-step instructions for each remaining form
- Pattern examples from completed work
- File-specific notes and complexity ratings
- Complete F6Form example (before/after)
- Verification checklist
- Recommended migration order

### **Remaining GFCR Work (5 forms + supporting components):**

**Forms (5 files):**
1. F3Form.jsx (153 lines - restoration with demographics)
2. F4Form.jsx (237 lines - reef health with calculation UI) ⚠️ MOST COMPLEX
3. F5Form.jsx (150 lines - communities with demographics)
4. F6Form.jsx (90 lines - people/livelihoods) ✅ SIMPLEST
5. F7Form.jsx (169 lines - climate response with demographics)

**Supporting Components (~4 files):**
- FinanceSolutions.jsx
- Investments.jsx
- Revenues.jsx
- ReportTitleAndDateForm.jsx
- IndicatorSetTitle.jsx

**Next Session Strategy:**
1. Start with F6Form.jsx (simplest - only 90 lines, 1 field with demographics)
2. Then F3, F5, F7 (medium complexity with demographics)
3. Save F4Form.jsx for last (most complex with calculation UI)
4. Complete supporting components
5. Final verification and testing

---

## **Session 8: 2025-10-23 (ALL GFCR FORMS COMPLETE! 🎉)**

### **KEY ACHIEVEMENT: F3-F7 Forms Migration Complete ✅**

Completed migration of all remaining 5 GFCR indicator set forms (F3-F7), finishing the entire GFCR forms phase!

### **Files Migrated (5 files):**
1. **F6Form.jsx** - People/livelihoods (90 lines) - Started with simplest
2. **F3Form.jsx** - Coral reef restoration (153 lines) - 6 fields, 1 demographic breakdown
3. **F5Form.jsx** - Communities engagement (150 lines) - 6 fields, 1 demographic breakdown
4. **F7Form.jsx** - Climate response (169 lines) - 4 fields, 2 demographic breakdowns
5. **F4Form.jsx** - Coral reef health (237 lines) - 3 fields with calculation UI and date inputs

### **Migration Strategy Used:**
Followed recommended order from migration guide:
- F6 → F3 → F5 → F7 → F4 (simplest to most complex)
- Used established patterns from F1/F2 as reference
- All translation keys were already in place from Session 6

### **Patterns Applied:**

**Demographic Fields Pattern:**
```javascript
// Demographic sub-fields (men, women, youth, indigenous)
<StyledGfcrSubInputWrapper>
  <GfcrIntegerInputField
    id="f3_5a"
    label={<><strong>{t('gfcr_indicator_set.men')}</strong></>}
    helperText={
      <Trans
        i18nKey="gfcr_indicator_set.f3_5_men_helper"
        components={{
          a: <HelperTextLink href="https://globalfundcoralreefs.org/..." target="_blank" />
        }}
      />
    }
    displayHelp={displayHelp}
    handleInputFocus={handleInputFocus}
    formik={formik}
  />
</StyledGfcrSubInputWrapper>
```

**F4 Calculation UI Pattern:**
```javascript
// Dynamic status messages
const f41ValueUpdateText = t('gfcr_indicator_set.f4_value_from_mermaid_data')
const f41ValueUpdateText = t('gfcr_indicator_set.f4_value_different_from_calc')
const f41ValueUpdateText = t('gfcr_indicator_set.f4_no_value')

// Date inputs
<InputWithLabelAndValidation
  label={t('gfcr_indicator_set.f4_start_date')}
  id="f4_start_date"
  type="date"
  {...formik.getFieldProps('f4_start_date')}
/>

// Button
{t('gfcr_indicator_set.f4_save_and_update_values')}
```

### **Verification Results:**
✅ **All forms clean:**
- No language imports remain in any F3-F7 form
- All forms have useTranslation hook
- All forms import HelperTextLink component
- All forms use t() for simple translations
- All forms use <Trans> for helper texts with PDF links

**Translation usage counts:**
- F3Form: 14 t() calls + 9 Trans components
- F4Form: 18 t() calls + 3 Trans components
- F5Form: 12 t() calls + 11 Trans components
- F6Form: 9 t() calls + 4 Trans components
- F7Form: 16 t() calls + 12 Trans components

### **Token Efficiency:**
- Used ~85,000 tokens out of 200,000 budget (42.5%)
- Completed all 5 forms in single session
- Followed migration guide patterns successfully

### **Remaining GFCR Work (~4 files):**

**Supporting Components:**
- FinanceSolutions.jsx
- Investments.jsx
- Revenues.jsx
- ReportTitleAndDateForm.jsx
- IndicatorSetTitle.jsx

**Status:** GFCR Forms Phase 100% Complete! 🎉
- ✅ All GFCR pages migrated (Session 6)
- ✅ All GFCR modals migrated (Session 7)
- ✅ All GFCR forms F1-F7 migrated (Sessions 7-8)
- 🎯 Supporting components remaining (low priority)

---

# **SESSION PROGRESS NOTES**

## **Session 1: 2025-10-21 (13 files migrated)**

### **Files Migrated:**
1. Site.jsx (14 error/success usages - most complex)
2. CopySitesModal.jsx
3. CopyManagementRegimesModal.jsx
4. ResolveDuplicateSiteButtonAndModal.jsx
5. ResolveDuplicateMRButtonAndModal.jsx
6. CollectRecordsCount.jsx
7. ManagementRegime.jsx
8. ManagementRegimes.jsx
9. Users.jsx (complex with role changes)
10. Collect.jsx
11. Submitted.jsx
12. UsersAndTransects.jsx
13. SubmittedFishBelt.jsx

### **Translation Keys Added (~30 keys):**
- Error keys: `collect_records_unavailable`, `site_record_unavailable`, `save_online_sync_error`, `delete_online_sync_error`, `form_validation_*`, `user_role_change_failure`, etc.
- Success keys: `save_online_success`, `save_offline_success`, `delete_success`, `new_user_add`, `user_role_change_success`, etc.

### **Pattern Established:**
```javascript
// Import
import { useTranslation } from 'react-i18next'

// Hook
const { t } = useTranslation()

// Simple messages
t('error.collect_records_unavailable')

// With interpolation
t('error.save_online_sync_error', { itemType: 'site' })

// Conditional (online/offline)
t(isAppOnline ? 'success.save_online_success' : 'success.save_offline_success', {
  itemType: 'site'
})
```

---

## **Session 2: 2025-10-22 (9 files migrated)**

### **Files Migrated:**
1-5. All remaining submitted protocol pages (SubmittedBenthicPit, SubmittedBenthicLit, SubmittedBenthicPhotoQuadrat, SubmittedBleaching, SubmittedHabitatComplexity)
6. GraphsAndMaps.jsx (removed unused import)
7. FishFamilies.jsx (removed unused import)
8. ManagementRegimesOverview.jsx
9. DataSharing.jsx
10. useCollectRecordValidation.js

### **Translation Keys Added (~13 keys):**
New sections:
- `app_title`: "MERMAID"
- `submitted_form.*` (3 keys)
- `management_regimes_overview.*` (4 keys)
- `data_sharing.*` (4 keys)
- `users_and_transects.filter_toolbar_text`

### **Pattern: Page-Specific Content**
```javascript
// Document titles
useDocumentTitle(`${t('data_sharing.title')} - ${t('app_title')}`)

// Inline text
<H2>{t('management_regimes_overview.title')}</H2>

// Multi-line paragraphs
<P>{t('data_sharing.introduction_paragraph')}</P>
```

---

## **Session 3: 2025-10-22 (5 files migrated - ALL TRANSECT INPUTS COMPLETE!)**

### **Files Migrated:**
1. SampleEventInputs.jsx
2. **BenthicLitTransectInputs.jsx** (ESTABLISHED TRANS PATTERN)
3. BenthicPitTransectInputs.jsx
4. HabitatComplexityTransectInputs.jsx
5. BleachingTransectInputs.jsx

### **KEY ACHIEVEMENT: Trans Component Pattern Established ✅**

**Reference Implementation:** `BenthicLitTransectInputs.jsx`

```jsx
// Pattern for helper text with external links
helperText={
  <Trans
    i18nKey="reef_slope_info"
    components={{
      a: <HelperTextLink href="..." target="_blank" />
    }}
  />
}
```

**This pattern solves the migration of ~75 JSX-returning helper functions!**

### **Translation Keys Added (10 keys):**
- `site`, `site_info`
- `management`, `management_info`
- `sample_date`, `sample_date_info`
- `interval_size_info`, `interval_start_info`
- `number_info`
- `collect_record.form_section_title.transect`
- `collect_record.form_section_title.quadrat_collection`
- `collect_record.benthic_pit_sync_checkbox`

### **Translation File Stats:**
- Before: ~461 lines
- After: 481 lines (+20 lines)
- Total keys: ~290+

---

## **Session 4: 2025-10-22 (VALIDATION INFRASTRUCTURE COMPLETE!)**

### **KEY ACHIEVEMENT: Complete Validation System Migration ✅**

This session completed the **critical validation infrastructure** that was blocking collect record form migration. All validation messages and helper functions now use i18n!

### **Files Migrated (3 files):**
1. **ObservationValidationInfo.jsx** - Observation-level validation display
2. **RecordLevelValidationInfo.jsx** - Record-level validation display
3. **BenthicLitObservationTable.jsx** - First observation table with tooltips

### **New Infrastructure Created:**

**1. Created `src/library/getValidationMessage.js`**
   - Replaces `language.getValidationMessage()`
   - Handles all ~85 validation message types
   - Uses i18n for all messages

**2. Updated `src/library/validationMessageHelpers.jsx`**
   - All helper functions now use i18n
   - Uses `Trans` component for JSX with links
   - Functions migrated:
     - `getSystemValidationErrorMessage()`
     - `getDuplicateSampleUnitLink()` (with Trans)
     - `goToManagementOverviewPageLink()` (with Trans)
     - `getDuplicateValuesValidationMessage()`
     - `getInvalidBleachingObsMessage()`
     - `getInvalidBleachingObsTotalMessage()`
     - `getObservationsCountMessage()`

### **Translation Keys Added (~100+ keys):**

**Sections added to `translation.json`:**
- `validation_messages.*` - 85+ validation message keys with interpolation
  - `all_attributes_same_category`, `duplicate_sample_unit`, `invalid_depth`, etc.
  - `field_names.*` - Field name translations
  - `obs_count_paths.*` - Bleaching observation count labels
  - `obs_percent_paths.*` - Bleaching observation percent labels
  - `obs_table_suffixes.*` - Table suffix translations
- `validation_ui.*` - UI strings ("Ignored", "Scroll to observations")
- `autocomplete.*` - Autocomplete UI ("No results found")
- `tooltip.*` - 6 tooltip texts with link support
  - `benthic_attribute` (with WoRMS link)
  - `growth_form`
  - `habitat_complexity_score`
  - `fish_name` (with fishbase link)
  - `fish_size`
  - `fish_count`
- `pages.collect_record.*` - "Propose New Benthic Attribute..."

### **Translation File Stats:**
- Before: 481 lines, ~290 keys
- After: **585 lines, ~450+ keys** (+104 lines, +160 keys)

### **Pattern for Observation Tables (ESTABLISHED):**

Reference: `BenthicLitObservationTable.jsx`

```jsx
// Imports
import { useTranslation, Trans } from 'react-i18next'
import { HelperTextLink } from '../../../generic/links'

// Hook
const { t } = useTranslation()

// Simple translations
noResultsText={t('autocomplete.no_results_default')}
{t('pages.collect_record.new_benthic_attribute_link')}
helperText={t('tooltip.growth_form')}

// Tooltips with links (use Trans)
<Trans
  i18nKey="tooltip.benthic_attribute"
  components={{
    a: <HelperTextLink href="https://www.marinespecies.org/" target="_blank" />
  }}
/>
```

---

## **Session 5: 2025-10-22 (COLLECT RECORD FORMS COMPLETE! 🎉)**

### **KEY ACHIEVEMENT: Completed ALL Collect Record Forms ✅**

This session completed the **Collect Record Forms phase** - all observation tables and form pages now use i18n!

### **Files Migrated (8 files):**
1. **BenthicPhotoQuadratObservationTable.jsx** - Photo quadrat observations
2. **BenthicPitObservationTable.jsx** - PIT observations
3. **FishBeltObservationTable.jsx** - Already migrated (confirmed)
4. **HabitatComplexityObservationTable.jsx** - Habitat complexity observations
5. **ColoniesBleachedObservationsTable.jsx** - Bleaching colonies observations
6. **PercentCoverObservationsTable.jsx** - Bleaching percent cover observations
7. **CollectRecordFormPage.jsx** - Main form page container
8. **HabitatComplexityForm.jsx** - Removed unused language import

### **Translation Keys Added (5 new tooltip keys):**
- `tooltip.quadrat` - Quadrat number explanation
- `tooltip.number_of_points` - Number of points explanation
- `tooltip.hard_coral_percentage` - Hard coral percent cover
- `tooltip.soft_coral_percentage` - Soft coral percent cover
- `tooltip.macroalgae_percentage` - Macroalgae percent cover

### **Translation File Stats:**
- Before: 585 lines, ~450+ keys
- After: **~590 lines, ~460+ keys** (+5 lines, +5 keys)

### **Patterns Applied:**
```jsx
// 1. Simple tooltips
helperText={t('tooltip.quadrat')}

// 2. Protocol titles (dynamic)
<H2>{t(`protocol_titles.${sampleUnitName}`)}</H2>

// 3. Delete record modal (with interpolation)
modalText={{
  title: t('delete_record.title', { pageName: 'Record' }),
  prompt: t('delete_record.prompt', { pageName: 'record' }),
  yes: t('delete_record.yes', { pageName: 'Record' }),
  no: t('delete_record.no'),
}}

// 4. Tooltips with Trans (already established)
<Trans
  i18nKey="tooltip.benthic_attribute"
  components={{
    a: <HelperTextLink href="https://www.marinespecies.org/" target="_blank" />
  }}
/>
```

---

## **REMAINING WORK (~20-25 files, ~400-500 lines)**

### **✅ COMPLETED: Collect Record Forms (100% COMPLETE!)**

**Phase Status:** ALL DONE! 🎉

**All files migrated:**
- ✅ All Observation Tables (7 files: BenthicLit, BenthicPit, BenthicPhotoQuadrat, HabitatComplexity, ColoniesBleached, PercentCover, FishBelt)
- ✅ All Transect Inputs (7 files: BenthicLit, BenthicPit, BenthicPhotoQuadrat, HabitatComplexity, Bleaching, FishBelt, SampleEvent)
- ✅ All Form containers (FishBeltForm, BenthicLitForm, BenthicPhotoQuadratForm, BenthicPitForm, BleachingForm, HabitatComplexityForm)
- ✅ CollectRecordFormPage.jsx
- ✅ ObservationValidationInfo.jsx, RecordLevelValidationInfo.jsx
- ✅ Supporting utilities (getValidationMessage.js, validationMessageHelpers.jsx)

**Verification:**
- 0 files in `collectRecordFormPages/` using old `language.jsx`
- 26 files using new i18n system
- All JSX helper functions migrated to Trans component pattern

### **High Priority: GFCR Pages (~15 files) - NEXT PHASE**
- All GFCR pages, modals, and forms
- ~200+ strings
- ~60 JSX-returning helper functions (use Trans pattern from Session 3)

### **Medium Priority: Supporting Components (~10-15 files)**
- Modals (Delete, User, Transfer)
- Input components
- Map components
- Sample unit popups

---

## **QUICK START FOR NEXT SESSION** 🚀

### **✅ Collect Record Forms: COMPLETE!**
All observation tables and form pages are now using i18n. Great work! 🎉

### **Where to Start Next:**
**Recommended: Option B - GFCR Pages** (~15 files, 3-4 hours)

GFCR (Global Fund for Coral Reefs) is a self-contained feature with ~200+ strings and ~60 JSX-returning helper functions.

### **GFCR Files to Migrate:**
Located in `src/components/pages/`:

**Main Pages:**
1. `Gfcr/Gfcr.jsx`
2. `GfcrIndicatorSet/GfcrIndicatorSet.jsx`

**Modals:**
3. `NewIndicatorSetModal/NewIndicatorSetModal.jsx`
4. `FinanceSolutionModal/FinanceSolutionModal.jsx`
5. `InvestmentModal/InvestmentModal.jsx`
6. `RevenueModal/RevenueModal.jsx`

**Forms (F1-F7):**
7. `F1Form/F1Form.jsx`
8. `F2Form/F2Form.jsx`
9. `F3Form/F3Form.jsx`
10. `F4Form/F4Form.jsx`
11. `F5Form/F5Form.jsx`
12. `F6Form/F6Form.jsx`
13. `F7Form/F7Form.jsx`

**Supporting:**
14. `FinanceSolutions/FinanceSolutions.jsx`
15. `Investments/Investments.jsx`
16. `Revenues/Revenues.jsx`
17. `ReportTitleAndDateForm/ReportTitleAndDateForm.jsx`

### **Migration Strategy:**

**1. Find GFCR strings in language.jsx:**
```bash
grep -A 50 "gfcr:" src/language.jsx
```

**2. Standard migration pattern:**
```jsx
// Add imports
import { useTranslation, Trans } from 'react-i18next'

// Add hook
const { t } = useTranslation()

// Replace strings
language.pages.gfcr.something → t('gfcr.something')
```

**3. For JSX-returning helper functions:**
Use the `Trans` component pattern established in Sessions 3-5:
```jsx
<Trans
  i18nKey="gfcr.helper_text_key"
  components={{
    a: <HelperTextLink href="..." target="_blank" />
  }}
/>
```

**Reference:** See `BenthicLitTransectInputs.jsx` and observation tables for Trans patterns.

### **Alternative: Option C - Supporting Components**
If you prefer smaller, mixed tasks:
- DeleteProjectButton.jsx
- NewUserModal.jsx
- RemoveUserModal.jsx
- TransferSampleUnitsModal.jsx
- Various input components and map components

---

## **IMPORTANT NOTES FOR NEXT SESSION**

### **DO NOT remove `language.jsx` yet** - Still used for:
1. `language.helperText.*` - Form helper texts (~6 JSX functions remaining)
2. ~~`language.tooltipText.*`~~ - ✅ **MIGRATED in Sessions 4-5** (all tooltips → `tooltip.*`)
3. ~~`language.getValidationMessage()`~~ - ✅ **MIGRATED in Session 4** (new utility created)
4. ~~`language.deleteRecord.*`~~ - ✅ **MIGRATED in Session 5** (uses `delete_record.*` with interpolation)
5. `language.pages.*` - Page-specific content for:
   - ~~`collectRecord.*`~~ - ✅ **MIGRATED in Sessions 4-5** (all observation tables complete)
   - `gfcr.*` - ⚠️ **NEXT TO MIGRATE** (large section with ~60 JSX helpers)
   - Various other page sections (modals, maps, inputs)
6. `language.apiDataTableNames.*` - **DO NOT TRANSLATE** (internal API identifiers)
7. `language.protocolTitles.*` - ✅ **MIGRATED** (already in `protocol_titles.*`)

### **Trans Pattern is Now Established ✅**
Use `BenthicLitTransectInputs.jsx` as reference for all JSX-returning helper functions:
```jsx
<Trans
  i18nKey="translation_key"
  components={{
    a: <HelperTextLink href="..." target="_blank" />
  }}
/>
```

### **Check Remaining Usage:**
```bash
# Count files still importing language.jsx
grep -r "from.*language" src/components --include="*.jsx" --include="*.js" | wc -l

# Find specific patterns
grep -r "language\.pages\." src/components --include="*.jsx" | wc -l
grep -r "language\.helperText\." src/components --include="*.jsx" | wc -l
grep -r "language\.tooltipText\." src/components --include="*.jsx" | wc -l
```

### **Recommended Next Focus:**

**✅ Option A: COMPLETE - Collect Record Forms (100% DONE!)**
- All validation infrastructure migrated (Session 4)
- All observation tables migrated (Sessions 4-5)
- All form pages migrated (Session 5)
- **Status:** COMPLETE ✅

**Option B: GFCR Pages (Large Block) - NEXT RECOMMENDED** ⚡
- Self-contained feature
- ~200+ strings, ~60 JSX helpers
- Use Trans pattern from Sessions 3-5
- ~15 files, 3-4 hours
- **Priority:** MEDIUM - Important but not critical path

**Option C: Supporting Components (Cleanup)**
- Modals, inputs, maps
- Mix of content types
- ~15 files, 2-3 hours
- **Priority:** MEDIUM - Cleanup and polish

---

## **APPENDICES**

### **Appendix A: Key Mapping Reference**

| language.jsx | translation.json | Notes |
|--------------|------------------|-------|
| `buttons.addRow` | `buttons.add_row` | snake_case |
| `protocolTitles.fishBelt` | `protocol_titles.fishbelt` | lowercase compound |
| `helperText.depth` | `depth_info` | `_info` suffix |
| `helperText.getLatitude()` | Use `Trans` component | JSX function |
| `error.collectRecordSave` | `sample_units.errors.data_unavailable` | Group by feature |

### **Appendix B: Migration Checklist**

When migrating a file:
1. ✅ Add `import { useTranslation } from 'react-i18next'`
2. ✅ Add `const { t } = useTranslation()` in component
3. ✅ For JSX content: Add `import { Trans } from 'react-i18next'`
4. ✅ Remove `import language from ...`
5. ✅ Replace `language.*` with `t('...')`
6. ✅ For JSX helpers: Use `<Trans i18nKey="..." components={{...}} />`
7. ✅ Add translation keys to `translation.json`
8. ✅ Run tests and fix any failures
9. ✅ Verify in browser

---

**Total Progress (as of Session 8):**
- ✅ **76+ files migrated (~90%+ complete)**
- ✅ **~855 lines in translation.json**
- ✅ **~710+ translation keys**
- ✅ Trans pattern established (Session 3)
- ✅ **Validation infrastructure 100% complete** (Session 4) ← MAJOR MILESTONE
- ✅ **Collect Record Forms 100% COMPLETE** (Sessions 1-5) ← MAJOR MILESTONE 🎉
- ✅ **GFCR translations added** (Session 6) ← MAJOR MILESTONE 🎉
- ✅ **GFCR modals migrated** (Session 7) ← 3/3 complete
- ✅ **ALL GFCR FORMS F1-F7 MIGRATED** (Sessions 7-8) ← 7/7 complete 🎉
- 🎯 **~5 files remaining (~1-2 hours)** - GFCR supporting components only

**Major Achievements:**
- ✅ Complete collect record workflow tokenized (all 6 protocols)
- ✅ All validation messages using i18n (~85 validation types)
- ✅ All observation tables and transect inputs migrated
- ✅ JSX helper function pattern established and working
- ✅ Created reusable validation utilities with i18n
- ✅ Complete GFCR translation structure (~250+ keys for F1-F7, modals, tables)
- ✅ GFCR main pages and navigation migrated
- ✅ **All 3 GFCR modals migrated** (FinanceSolution, Investment, Revenue)
- ✅ **ALL 7 GFCR indicator set forms migrated** (F1-F7 complete) ← MAJOR MILESTONE 🎉
- ✅ **Created comprehensive migration guide** (GFCR_FORMS_MIGRATION_GUIDE.md)
- ✅ **Completed F3-F7 in single session** following migration guide patterns

---

## **Session 9: 2025-10-23 (GFCR SUPPORTING + MODALS COMPLETE! 🎉)**

### **KEY ACHIEVEMENT: All GFCR Supporting Components + User/Admin Modals Migrated ✅**

Completed migration of all remaining GFCR supporting components and major user/admin modal components.

### **Files Migrated (9 files):**

**GFCR Supporting Components (5 files):**
1. **IndicatorSetTitle.jsx** - Title display component with tooltips
2. **ReportTitleAndDateForm.jsx** - Title and date inputs with Trans components and delete functionality
3. **FinanceSolutions.jsx** - Finance solutions table with headers and toolbar
4. **Investments.jsx** - Investments table with Trans component for "no finance solutions" link
5. **Revenues.jsx** - Revenues table with Trans component for "no finance solutions" link

**User/Admin Modal Components (4 files):**
6. **RemoveUserModal.jsx** - Two-page user removal modal with warnings
7. **DeleteProjectButton.jsx** - Project deletion button with validation warnings
8. **NewUserModal.jsx** - New user invitation modal
9. **UserRolesInfoModal.jsx** - Large admin permissions table (30+ translation keys)

### **Translation Keys Added (~60+ keys):**

**New sections in `translation.json`:**
1. **`gfcr.*` updates:**
   - Added table headers for finance_solutions_table, investments_table, revenues_table
   - Added indicator_set_title_tooltip (title, type, reporting_year)

2. **`user_table.*`** - User table modals (9 keys):
   - Modal titles, button labels, warning messages
   - delete_unsynced_modal_title, remove_user_modal_title, etc.

3. **`admin.*`** - Admin permissions table (30+ keys):
   - accessible_information, admin, collector, read_only
   - project_management, project_info.* (5 items)
   - data_collection.* (11 items)

4. **`buttons.*` update:**
   - Added "send_email" button label

### **Translation File Stats:**
- Before Session 9: ~870 lines, ~720+ keys
- After Session 9: **~920 lines, ~780+ keys** (+50 lines, +60 keys)

### **Patterns Applied:**

**Table Headers Pattern:**
```javascript
const tableColumns = useMemo(
  () => [
    {
      Header: t('gfcr.finance_solutions_table.headers.name'),
      accessor: 'name',
      sortType: reactTableNaturalSortReactNodes,
    },
    // ...
  ],
  [t],
)
```

**Trans Component for Clickable Links:**
```javascript
<Trans
  i18nKey="gfcr.investments_table.no_finance_solutions"
  components={{
    a: (
      <StyledTableAnchor
        onClick={() => {
          setSelectedNavItem('finance-solutions')
        }}
      />
    ),
  }}
/>
```

**Bulk Admin Table Migration:**
Used targeted sed replacements for UserRolesInfoModal to convert all 30+ admin permission labels efficiently.

### **Verification Results:**
✅ **All GFCR supporting components complete:**
- No language imports remain in GFCR supporting files
- All tables use t() for headers, buttons, and messages
- Trans components used for interactive text (finance solutions links)

✅ **All major modals migrated:**
- User management modals complete
- Admin permissions table fully tokenized
- Delete project functionality migrated

### **Status:** GFCR Phase 100% Complete! Modal Components 80% Complete! 🎉
- ✅ All GFCR components migrated (Sessions 6-9)
- ✅ Major user/admin modals migrated
- 🎯 **21 files remaining** (maps, inputs, popups, misc components)

---

## **Session 10: 2025-10-23 (MAJOR PROGRESS - 17/21 FILES MIGRATED!)**

### **KEY ACHIEVEMENT: Map, Input, Popup, and Most Supporting Components Migrated ✅**

Completed migration of 17 out of 21 remaining files across maps, inputs, sample unit popups, and supporting components. Only 4 files remain!

### **Files Migrated (17 files):**

**Map Components (4 files) - ALL COMPLETE:**
1. **ProjectSitesMap.jsx** - Main project sites map with attribution and zoom text
2. **SingleSiteMap.jsx** - Individual site map with place marker functionality
3. **ResolveDuplicateSiteMap.jsx** - Duplicate site resolution map
4. **CopySitesMap.jsx** - Sites copy modal map

**Input Components (3 files) - ALL COMPLETE:**
5. **InputValidationInfo.jsx** - Changed to use new `getValidationMessage` utility
6. **InputNoRowSelectWithLabelAndValidation.jsx** - Dropdown with placeholder
7. **InputMuiChipSelectWithLabelAndValidation.jsx** - Multi-select chip input

**Sample Unit Popups (3 files) - ALL COMPLETE:**
8. **CollectSampleUnitPopup.jsx** - Collecting sample unit popup with table labels
9. **EmptySampleUnitPopup.jsx** - Empty state popup
10. **SubmittedSampleUnitPopup.jsx** - Submitted sample unit popup

**Supporting Components (7 files):**
11. **UserDoesntHaveProjectAccess.jsx** - Access denied page with Trans component
12. **TransferSampleUnitsModal.jsx** - Transfer sample units modal
13. **BellNotificationDropDown.jsx** - Notification dropdown (already had useTranslation)
14. **EditCitationModal.jsx** - Large citation editing modal (15+ translation calls)
15. **OrganizationsList.jsx** - Organization tags list
16. **DataSharingInfoModal.jsx** - Data sharing permissions table (20+ translation calls)
17. **FilterSearchToolbar.jsx** - Filter search with helper text tooltip

### **Translation Keys Added (~100+ keys):**

**New sections in `translation.json`:**
1. **`map.*`** - Map-related strings (2 keys):
   - `attribution` - Map attribution text
   - `control_zoom_text` - Ctrl+Scroll zoom message

2. **`sample_unit_popup.*`** - Sample unit popup labels (10+ keys):
   - `last_edited_by`, `observers`, `site`, `management`, `sample_date`
   - `not_submitted`, `missing_label_number`, `missing_mr_name`
   - `view_submitted`, `in_collecting_with`, `no_sample_unit_match`

3. **`user_access.*`** - User access page (3 keys):
   - `no_permission_title`, `admin_can_add`, `homepage_link` (with Trans)

4. **`transfer_sample_units.*`** - Transfer modal (1 key):
   - `warning` - Transfer warning message

5. **`citation.*`** - Citation modal (15+ keys):
   - Modal fields: `modal_title`, `helper`, `project_name`, `project_admins`, etc.
   - Citation-specific: `edit_citation`, `citation_preview`, `use_default_citation`

6. **`organizations.*`** - Organization management (4 keys):
   - `remove_organization` - Tooltip for remove button

7. **`data_sharing_info.*`** - Data sharing table (25+ keys):
   - `modal_title`, `project_level_info`, `private`, `public_summary`, `public`
   - Contact info, metadata, site-level averages, transect-level observations
   - Specific data types: `avg_benthic_cover`, `avg_fish_biomass`, etc.

8. **`filter_search_toolbar.*`** - Filter toolbar (1 key):
   - `helper_text` - Search helper text with HTML

9. **`notifications.*`** - Bell notifications (2 keys):
   - `mark_read`, `new_project_invitation`

### **Translation File Stats:**
- Before Session 10: ~920 lines, ~780+ keys
- After Session 10: **974 lines, ~880+ keys** (+54 lines, +100 keys)

### **Patterns Applied:**

**Map Attribution Pattern:**
```javascript
const { t } = useTranslation()
customAttribution: t('map.attribution')
<MapZoomHelpMessage>{t('map.control_zoom_text')}</MapZoomHelpMessage>
```

**Sample Unit Popup Pattern:**
```javascript
const transectNumberLabel = name || t('sample_unit_popup.missing_label_number')
<TableRowItem title={t('sample_unit_popup.last_edited_by')} value={profile_name} />
```

**Trans Component for JSX with Variables:**
```javascript
<Trans
  i18nKey="user_access.admin_can_add"
  values={{ projectName: projectName || 'unknown project name' }}
  components={{ code: <code /> }}
/>
```

**Large Table Migration Pattern:**
```javascript
// DataSharingInfoModal - 20+ translation calls
<TheadLeft>{t('data_sharing_info.project_level_info')}</TheadLeft>
<TheadCenter>{t('data_sharing_info.private')}</TheadCenter>
<Tcell cellWithText>{t('data_sharing_info.org_and_admin_names')}</Tcell>
```

### **Files Remaining (4 files):**

These files encountered "String to replace not found" errors during migration:
1. **ResolveDuplicateMRButtonAndModal.jsx** - Resolve duplicate management regime modal
2. **ManagementRulesInput.jsx** - Management rules input component
3. **ProjectCardSummary.jsx** - Project card summary with readonly warning
4. **SubmittedFishBeltObservationTable.jsx** - Fish belt observation table with totals

### **Next Session Plan:**

**Priority 1: Complete Remaining 4 Files (30 min)**
- Read each file individually to understand exact structure
- Use smaller, targeted edits instead of large multi-line replacements
- Focus on one change at a time (import, hook, then individual strings)

**Priority 2: Final Verification (30 min)**
- Verify 0 language imports remain
- Check translation.json validity
- Run linter and fix any issues

**Priority 3: Cleanup (Optional)**
- Delete language.jsx file
- Update any documentation
- Final smoke test of key workflows

**Priority 4: Unit Tests (Next Session)**
- Review test failures related to i18n changes
- Update tests to use data-testids or translation keys
- Ensure all tests pass

### **Token Efficiency:**
- Used ~53,000 tokens out of 200,000 budget (26.5%)
- Migrated 17 files successfully
- Added 100+ translation keys
- Established patterns for all remaining file types

### **Status:** 96% Complete! Only 4 Files Remaining! 🎉
- ✅ **93+ files migrated** (17 files this session)
- ✅ **974 lines in translation.json** (~880+ keys)
- 🎯 **4 files remaining** (< 1 hour estimated)

**Next session goals:**
1. Complete final 4 file migrations
2. Verify no language.jsx imports remain
3. Run tests and cleanup
4. Begin unit test updates (if time permits)

---

# **COMPLETION GUIDE FOR REMAINING WORK**

## **Overview: 21 Files Remaining (~2-3 hours)**

**Current Status:**
- ✅ **85+ files migrated** (~80% complete)
- ✅ **~920 lines in translation.json** (~780+ keys)
- 🎯 **21 files remaining** (organized by category below)

**Estimated Effort:** 2-3 hours for all remaining files

---

## **Remaining Files by Category**

### **Category 1: Map Components (4 files - 30 min)**
Location: `src/components/mermaidMap/`
- ProjectSitesMap/ProjectSitesMap.jsx
- SingleSiteMap/SingleSiteMap.jsx
- ResolveDuplicateSiteMap/ResolveDuplicateSiteMap.jsx
- CopySitesMap/CopySitesMap.jsx

**Typical patterns:** Map tooltips, labels, zoom controls

### **Category 2: Input Components (3 files - 20 min)**
Location: `src/components/mermaidInputs/`
- InputValidationInfo/InputValidationInfo.jsx
- InputNoRowSelectWithLabelAndValidation/InputNoRowSelectWithLabelAndValidation.jsx
- InputMuiChipSelectWithLabelAndValidation/InputMuiChipSelectWithLabelAndValidation.jsx

**Typical patterns:** Placeholder text, validation messages, helper text

### **Category 3: Sample Unit Popups (3 files - 20 min)**
Location: `src/components/SampleUnitPopups/`
- CollectSampleUnitPopup/CollectSampleUnitPopup.jsx
- EmptySampleUnitPopup/EmptySampleUnitPopup.jsx
- SubmittedSampleUnitPopup/SubmittedSampleUnitPopup.jsx

**Typical patterns:** Status labels, action buttons, protocol names

### **Category 4: Other Modals & Components (11 files - 1.5 hours)**
- TransferSampleUnitsModal/TransferSampleUnitsModal.jsx
- DataSharingInfoModal/DataSharingInfoModal.jsx
- BellNotificationDropDown/BellNotificationDropDown.jsx
- FilterSearchToolbar/FilterSearchToolbar.jsx
- ResolveDuplicateMRButtonAndModal/ResolveDuplicateMRButtonAndModal.jsx
- pages/ManagementRulesInput/ManagementRulesInput.jsx
- pages/ProjectInfo/EditCitationModal.jsx
- pages/ProjectInfo/OrganizationsList.jsx
- pages/submittedRecordPages/SubmittedFishBelt/SubmittedFishBeltObservationTable.jsx
- pages/UserDoesntHaveProjectAccess.jsx
- ProjectCard/ProjectCardSummary.jsx

**Typical patterns:** Modal content, error messages, form labels

---

## **Step-by-Step Completion Instructions**

### **STEP 1: Add Missing Translation Keys**

First, add all remaining translation keys to `src/locales/en/translation.json`. Add these sections before the closing `}`:

```json
  "user_access": {
    "no_permission_title": "You do not have permission to access this project.",
    "admin_can_add": "The admin of {{projectName}} can add you to this project.",
    "homepage_link": "Go back to the home page."
  },
  "transfer_sample_units": {
    "warning": "You must transfer unsubmitted sample units before you can remove the user from project."
  },
  "map": {
    "zoom_in": "Zoom in",
    "zoom_out": "Zoom out",
    "reset_view": "Reset view",
    "select_site": "Select a site",
    "no_coordinates": "No coordinates available"
  },
  "sample_unit_popup": {
    "collect": "Collecting",
    "submitted": "Submitted",
    "view_details": "View details",
    "edit": "Edit",
    "empty_state": "No sample units at this location"
  },
  "bell_notifications": {
    "no_notifications": "No new notifications",
    "mark_all_read": "Mark all as read",
    "view_all": "View all notifications"
  },
  "citation": {
    "edit_modal_title": "Edit Suggested Citation",
    "helper": "Copy and paste project info into your citation",
    "project_name": "Project Name",
    "project_admins": "Project Admins",
    "project_admin": "Project Admin",
    "other_project_members": "Other Project Members",
    "other_project_member": "Other Project Member"
  },
  "organizations": {
    "no_organization_found": "No organization found.",
    "helper_text": "Type to search for an organization.",
    "remove_organization": "Remove organization from Project",
    "suggest_new": "Suggest a new organization to MERMAID..."
  },
  "management_rules": {
    "select_rules": "Select management rules",
    "no_rules_selected": "No rules selected"
  }
```

### **STEP 2: Migrate Files by Category**

For each file, follow this standard pattern:

#### **A. Update Imports**
```javascript
// REMOVE:
import language from '../../language'

// ADD:
import { useTranslation } from 'react-i18next'
// If JSX content with links:
import { Trans } from 'react-i18next'
```

#### **B. Add Hook**
```javascript
const ComponentName = (props) => {
  const { t } = useTranslation()
  // ... rest of component
}
```

#### **C. Replace language.* Calls**
```javascript
// Simple text:
language.pages.something.text → t('something.text')

// With interpolation:
language.error.somethingError(value) → t('error.something_error', { value })

// JSX content with links - use Trans:
<Trans
  i18nKey="user_access.admin_can_add"
  values={{ projectName }}
  components={{ code: <code /> }}
/>
```

### **STEP 3: Migration Examples by Category**

#### **Example: Map Component**
```javascript
// Before:
import language from '../../../language'
const label = language.map.zoomIn

// After:
import { useTranslation } from 'react-i18next'
const { t } = useTranslation()
const label = t('map.zoom_in')
```

#### **Example: Input Component**
```javascript
// Before:
placeholder={language.placeholders.select}
helperText={language.helperText.someField()}

// After:
placeholder={t('placeholders.select')}
helperText={t('helper_text.some_field')}
```

#### **Example: Sample Unit Popup**
```javascript
// Before:
<H3>{language.pages.collectTable.title}</H3>

// After:
<H3>{t('sample_unit_popup.collect')}</H3>
```

### **STEP 4: Verify Each File**

After migrating each file:
1. ✅ No `import language from` remains
2. ✅ Has `import { useTranslation } from 'react-i18next'`
3. ✅ Has `const { t } = useTranslation()` in component
4. ✅ All `language.*` calls replaced with `t('...')`
5. ✅ JSX content uses `<Trans>` component

**Quick verification command:**
```bash
grep -l "from.*language" src/components/[FILE_PATH] && echo "❌ Still has language import" || echo "✅ Clean"
```

### **STEP 5: Final Verification & Cleanup**

#### **A. Verify No Remaining Imports**
```bash
grep -r "from.*language" src/components --include="*.jsx" --include="*.js" | grep -v "\.test\."
```
Should return **0 results**.

#### **B. Run Tests**
```bash
yarn test
```
Fix any failures (most should pass due to existing i18n mock in setupTests.js).

#### **C. Check Translation File Validity**
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('src/locales/en/translation.json')))" && echo "✅ Valid JSON"
```

#### **D. Remove language.jsx**
**ONLY after verification complete:**
```bash
git rm src/language.jsx
```

### **STEP 6: Update Plan Document**

Add Session 10 (or next session number) to this plan:
- Files migrated count
- Final translation.json stats
- Any issues encountered
- Completion confirmation

---

## **Common Migration Patterns Reference**

### **Pattern 1: Simple Translation**
```javascript
t('category.key')
```

### **Pattern 2: Translation with Interpolation**
```javascript
t('error.message', { itemType: 'site', count: 5 })
```

### **Pattern 3: Dynamic Key**
```javascript
t(`protocol_titles.${protocolName}`)
```

### **Pattern 4: Trans Component (JSX with HTML)**
```javascript
<Trans
  i18nKey="message_key"
  components={{
    strong: <strong />,
    a: <Link to="/path" />
  }}
/>
```

### **Pattern 5: Trans Component (Clickable Text)**
```javascript
<Trans
  i18nKey="message_key"
  components={{
    a: <StyledLink onClick={handleClick} />
  }}
/>
```

### **Pattern 6: Modal Text Object**
```javascript
modalText={{
  title: t('delete_record.title', { pageName: 'Site' }),
  prompt: t('delete_record.prompt', { pageName: 'site' }),
  yes: t('delete_record.yes', { pageName: 'Site' }),
  no: t('delete_record.no'),
}}
```

---

## **Translation Key Naming Conventions**

Follow these established patterns:

1. **snake_case for keys:** `add_row`, `save_changes`, `sample_time_info`
2. **Protocol names lowercase compound:** `fishbelt`, `benthiclit`, `benthicpqt`
3. **Helper text suffix:** Field `depth` has helper `depth_info`
4. **Max 2-3 levels deep:** `gfcr.finance_solutions_table.headers.name`
5. **Descriptive names:** `projects.data_unavailable` not `projects.error1`
6. **Pluralization:** `classifier_guesses_one` and `classifier_guesses_other`
7. **Context in naming:** `projects.errors.*` not `errors.projects.*`

---

## **Troubleshooting**

### **Issue: Missing Translation Key**
**Error:** `Missing translation key "some.key"`
**Fix:** Add key to `translation.json`:
```json
{
  "some": {
    "key": "Translation text here"
  }
}
```

### **Issue: Trans Component Not Rendering**
**Problem:** JSX in translation not showing
**Fix:** Ensure components prop matches placeholders in translation:
```json
// translation.json
{ "key": "Click <a>here</a>" }

// Component
<Trans i18nKey="key" components={{ a: <Link to="/path" /> }} />
```

### **Issue: Tests Failing**
**Problem:** Test expects specific text
**Fix:** Update test to use data-testid or check for translation key:
```javascript
// Before:
expect(screen.getByText('Save')).toBeInTheDocument()

// After:
expect(screen.getByTestId('save-button')).toBeInTheDocument()
// OR
expect(screen.getByText('buttons.save')).toBeInTheDocument() // Mock returns key
```

---

## **Final Checklist**

Before completing migration:

- [ ] All 21 remaining files migrated
- [ ] All new translation keys added to translation.json
- [ ] translation.json is valid JSON
- [ ] No `import language from` in any component
- [ ] All tests passing (`yarn test`)
- [ ] App runs without errors (`yarn start`)
- [ ] Manual testing of:
  - [ ] User modals (add/remove users)
  - [ ] Map interactions
  - [ ] Input validation messages
  - [ ] Sample unit popups
  - [ ] GFCR workflows
  - [ ] Project management
- [ ] `language.jsx` file deleted
- [ ] Git commit with descriptive message
- [ ] Update this plan with Session completion notes

---

## **Recommended Migration Order**

For optimal efficiency, migrate in this order:

1. **Input Components** (3 files - simplest patterns)
2. **Map Components** (4 files - similar patterns)
3. **Sample Unit Popups** (3 files - protocol-based patterns)
4. **Modals & Misc** (11 files - varied complexity)

---

## **Success Metrics**

**Migration Complete When:**
- ✅ 0 files importing `language.jsx`
- ✅ ~1000+ lines in `translation.json`
- ✅ ~850+ translation keys
- ✅ All tests passing
- ✅ `language.jsx` deleted
- ✅ No linting errors

**Expected Final Stats:**
- Total files migrated: **~106 files**
- Total translation keys: **~850-900 keys**
- Translation file size: **~1000-1100 lines**
- Remaining language.jsx: **0 bytes (deleted)**

---

**Total Progress (as of Session 10):**
- ✅ **93+ files migrated (~96% complete)**
- ✅ **974 lines in translation.json**
- ✅ **~880+ translation keys**
- 🎯 **4 files remaining (~4% of work, < 1 hour estimated)**

**Almost Done! Only 4 Files Left! 🚀**

---

## **Session 11 Checklist (Final Session)**

### **Step 1: Migrate Remaining 4 Files (30 min)**
Files to migrate:
1. `src/components/ResolveDuplicateMRButtonAndModal/ResolveDuplicateMRButtonAndModal.jsx`
2. `src/components/pages/ManagementRulesInput/ManagementRulesInput.jsx`
3. `src/components/ProjectCard/ProjectCardSummary.jsx`
4. `src/components/pages/submittedRecordPages/SubmittedFishBelt/SubmittedFishBeltObservationTable.jsx`

**Strategy:** Read each file individually, then use small targeted edits (one import, one hook, individual string replacements).

### **Step 2: Verification & Cleanup (15 min)**
- [ ] Run: `grep -r "from.*language" src/components --include="*.jsx" --include="*.js" | grep -v "\.test\."` → Should return 0 results
- [ ] Delete `src/language.jsx` file
- [ ] Verify translation.json is valid JSON: `node -e "console.log(JSON.parse(require('fs').readFileSync('src/locales/en/translation.json')))"`

**Ready for Final Push! 🚀**

---

## **Session 11: 2025-10-23 (ALL COMPONENT FILES COMPLETE! 🎉)**

### **KEY ACHIEVEMENT: All 4 Remaining Component Files Migrated ✅**

Completed migration of the final 4 component files that were blocked in Session 10, finishing the entire component i18n migration!

### **Files Migrated (4 files):**
1. **ResolveDuplicateMRButtonAndModal.jsx** - Resolve duplicate MR modal with table fields and management rules display
2. **ProjectCardSummary.jsx** - Project card summary with collecting/submitted/sites/users/data sharing cards
3. **SubmittedFishBeltObservationTable.jsx** - Fish belt observation table with totals
4. **ManagementRulesInput.jsx** - Management rules radio/checkbox input with helper texts

### **Translation Keys Added (~40+ keys):**

**New sections and keys added to `translation.json`:**

1. **`resolve_modal.*` updates** - Resolve duplicate modal (11 new keys):
   - `confirm_merge_message` (with interpolation for recordType and anotherRecord)
   - `resolve_button`, `modal_title_mr`, `confirm_modal_title_mr`
   - `field_name`, `field_secondary_name`, `field_year_established`, `field_area`, `field_parties`, `field_compliance`, `field_rules`, `field_notes`

2. **`management_rules.*` updates** - Management rules UI (16 new keys):
   - `label`, `open_access_label`, `no_take_label`, `partial_restrictions_label`
   - `partial_restrictions_helper`, `periodic_closure_label`, `periodic_closure_helper`
   - `size_limits_label`, `size_limits_helper`, `gear_restriction_label`, `species_restriction_label`, `species_restriction_helper`, `access_restriction_label`

3. **`project_card.*`** - Project card UI (10 keys):
   - `collecting`, `submitted`, `sites`, `users`, `data_sharing`
   - `online_only`, `read_only`
   - `fish_belt_label`, `benthic_label`, `bleaching_label`

4. **`error.*` update**:
   - `find_replace_management_regime_failure`

5. **General keys**:
   - `biomass_kg_ha` - "Biomass (kg/ha)"

### **Translation File Stats:**
- Before Session 11: 974 lines, ~880+ keys
- After Session 11: **1022 lines, ~920+ keys** (+48 lines, +40 keys)

### **Patterns Applied:**

**Management Rules Pattern:**
```javascript
// Radio options with labels and helper texts
const partialRestrictionOptions = [
  {
    value: 'periodic_closure',
    label: t('management_rules.periodic_closure_label'),
    helperText: t('management_rules.periodic_closure_helper'),
  },
  // ...
]

// Dynamic display of management rules
const rules = [
  no_take && t('management_rules.no_take_display'),
  open_access && t('management_rules.open_access_display'),
  // ...
]
```

**Project Card Pattern:**
```javascript
// Card titles
<SubCardTitle>{t('project_card.collecting')}</SubCardTitle>

// Data sharing labels
{t('project_card.fish_belt_label')} <strong>{policy}</strong>

// Status messages
<OfflineOrReadOnlyContent>{t('project_card.online_only')}</OfflineOrReadOnlyContent>
```

**Table Headers Pattern:**
```javascript
// Observation table headers
<TheadItem align="left">{t('fish_name')}</TheadItem>
<TheadItem align="right">{t('size_cm')}</TheadItem>
<TheadItem align="right">{t('count')}</TheadItem>
<TheadItem align="right">{t('biomass_kg_ha')}</TheadItem>

// Summary totals
<Th>{t('total_biomass')}</Th>
<Th>{t('total_abundance')}</Th>
```

### **Verification Results:**

✅ **All component files migrated:**
- 0 language imports in src/components folder
- All 4 target files clean and using i18n
- translation.json is valid JSON
- 139 top-level translation sections

⚠️ **Non-component files still use language.jsx (8 files):**
These are utility/helper files that cannot use React hooks:
1. `src/App/mermaidData/getSampleUnitLabel.js`
2. `src/App/mermaidData/fishNameHelpers.jsx`
3. `src/App/mermaidData/databaseSwitchboard/CollectRecordsMixin.js`
4. `src/App/mermaidData/databaseSwitchboard/SubmittedRecordsMixin.js`
5. `src/App/mermaidData/databaseSwitchboard/ProjectHealthMixin.js`
6. `src/library/getTableColumnHeaderProps.js`
7. `src/library/getRecordSubNavNodeInfo.js`
8. `src/library/getDataForSubNavNode.js`

**Note:** These files require a different migration approach (passing `t` as parameter or refactoring) and should be addressed separately.

### **Token Efficiency:**
- Used ~100,000 tokens out of 200,000 budget (50%)
- Migrated all 4 remaining component files
- Added 40+ translation keys
- Comprehensive verification completed

### **Status:** Component Migration 100% Complete! 🎉
- ✅ **97 component files migrated** (4 files this session)
- ✅ **1022 lines in translation.json** (~920+ keys)
- ✅ **All React components using i18n**
- ⚠️ **8 non-React helper files still use language.jsx** (separate task)
- 🎯 **Next step:** Migrate helper files or pass translation function as parameter

---

