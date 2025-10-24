# Testing Tokenization (i18n Migration) - Guide

## Summary

This document explains how to run tests for the i18n tokenization work and what test failures to expect.

## Current Status

### ✅ Completed Migration
- **63+ files migrated** to use i18next (75% complete)
- **~590 lines** in `translation.json` with **~460+ keys**
- **ALL Collect Record Forms complete** (Sessions 1-5)
- Validation infrastructure fully migrated

### Test Infrastructure Already in Place

The test setup in `src/setupTests.js` (lines 59-86) already mocks i18next:

```javascript
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,  // Returns the key unchanged
    i18n: { ... },
  }),
  Trans: ({ children }) => children,
  I18nextProvider: ({ children }) => children,
}))
```

**Important:** This mock returns **translation keys unchanged**, not the English values.

---

## Prerequisites for Running Tests

### 1. Install Node Version (Recommended: 20.10.0)

```bash
nvm use  # If you have .nvmrc file
# OR
nvm install 20.10.0
nvm use 20.10.0
```

**Note:** You currently have node v24.10.0. Tests may work, but recommended version is 20.10.0.

### 2. Install Yarn 4.1.1

```bash
npm install -g corepack
corepack enable
corepack prepare yarn@4.1.1 --activate
```

### 3. Install Dependencies

```bash
yarn install
```

**Important:** Set this environment variable to avoid package manager issues:
```bash
export COREPACK_ENABLE_AUTO_PIN=0
```

### 4. Set Up Environment Variables

Copy test environment file:
```bash
cp .env.test.sample .env.test
```

---

## Running Tests

### Run All Tests
```bash
yarn test
```

### Run Specific Test File
```bash
yarn test <filename>
```

### Run Tests for Collect Record Forms
```bash
# Unit tests
yarn test src/components/pages/collectRecordFormPages/FishBeltForm/tests/

# Integration tests
yarn test src/App/integrationTests/collectRecords/fishBelt/
yarn test src/App/integrationTests/collectRecords/benthicLit/
yarn test src/App/integrationTests/collectRecords/benthicPit/
# etc.
```

---

## Expected Test Failures and How to Fix Them

### Issue 1: Label Text Mismatches

**Problem:** Tests use English text to find elements, but i18n mock returns lowercase keys.

**Example:**
```javascript
// Translation in translation.json
{
  "site": "Site",
  "management": "Management"
}

// In component (after migration)
<InputLabel>{t('site')}</InputLabel>  // In production: "Site", In tests: "site"

// In test
await user.selectOptions(screen.getByLabelText('Site'), '1')  // ❌ FAILS - looks for "Site"
```

**Fix:** Update test to use the lowercase key:
```javascript
// BEFORE
await user.selectOptions(screen.getByLabelText('Site'), '1')

// AFTER
await user.selectOptions(screen.getByLabelText('site'), '1')
```

### Issue 2: Button Text Mismatches

**Problem:** Button text now comes from i18n keys.

**Example:**
```javascript
// Translation
{
  "buttons": {
    "save": "Save"
  }
}

// In component
<Button>{t('buttons.save')}</Button>  // In tests: returns "buttons.save"

// In test
await user.click(screen.getByText('Save'))  // ❌ FAILS
```

**Fix:** Update test to use the key:
```javascript
// BEFORE
await user.click(screen.getByText('Save'))

// AFTER
await user.click(screen.getByText('buttons.save'))
```

### Issue 3: Validation Messages

**Problem:** Validation messages now use i18n keys.

**Example:**
```javascript
// In component
toast.error(t('error.collect_records_unavailable'))

// In test
expect(await screen.findByText('Record saved.'))  // May need to use key instead
```

**Fix:** Check `translation.json` for the exact key and use that:
```javascript
expect(await screen.findByText('success.save_online_success'))
```

---

## Translation Keys for Common Test Scenarios

### Form Fields
```javascript
// Common field labels (keys are lowercase)
'site'                  // "Site"
'management'            // "Management"
'depth'                 // "Depth"
'sample_date'           // "Sample Date"
'sample_time'           // "Sample Time"
'transect_number'       // "Transect Number"
'label'                 // "Label"
```

### Buttons
```javascript
'buttons.save'          // "Save"
'buttons.cancel'        // "Cancel"
'buttons.delete'        // "Delete"
'buttons.submit'        // "Submit"
'buttons.add_row'       // "Add row"
```

### Success Messages
```javascript
'success.save_online_success'    // "Record saved."
'success.save_offline_success'   // "Record saved (offline)."
'success.delete_success'         // "Successfully deleted {{itemType}}"
```

### Error Messages
```javascript
'error.collect_records_unavailable'
'sample_units.errors.data_unavailable'
'sample_units.errors.supporting_data_unavailable'
```

### Protocol Titles
```javascript
'protocol_titles.fishbelt'
'protocol_titles.benthiclit'
'protocol_titles.benthicpit'
'protocol_titles.benthicpqt'
'protocol_titles.bleachingqc'
'protocol_titles.habitatcomplexity'
```

---

## Test Update Strategy

### Option 1: Use `data-testid` (Preferred)

Most stable approach - not affected by i18n changes:

```javascript
// Component
<input data-testid="site-select" />

// Test
const siteSelect = screen.getByTestId('site-select')
```

**Many existing tests already use this approach!**

### Option 2: Update Text Selectors to Use Keys

Update existing tests to use i18n keys instead of English text:

```javascript
// BEFORE
screen.getByLabelText('Site')
screen.getByText('Save')

// AFTER
screen.getByLabelText('site')
screen.getByText('buttons.save')
```

### Option 3: Use Alternative Selectors

Use role-based or other semantic selectors:

```javascript
// Instead of getByText('Save')
screen.getByRole('button', { name: 'buttons.save' })

// Instead of getByLabelText('Site')
screen.getByRole('combobox', { name: 'site' })
```

---

## Files Likely to Need Test Updates

### High Priority (Collect Record Forms - Already Migrated)

1. **Fish Belt:**
   - `src/App/integrationTests/collectRecords/fishBelt/*.test.jsx` (18 files)
   - `src/components/pages/collectRecordFormPages/FishBeltForm/tests/*.test.jsx`

2. **Benthic LIT:**
   - `src/App/integrationTests/collectRecords/benthicLit/*.test.jsx` (13 files)

3. **Benthic PIT:**
   - `src/App/integrationTests/collectRecords/benthicPit/*.test.jsx` (13 files)

4. **Benthic Photo Quadrat:**
   - `src/App/integrationTests/collectRecords/benthicPhotoQuadrat/*.test.jsx` (4 files)

5. **Bleaching:**
   - `src/App/integrationTests/collectRecords/bleaching/*.test.jsx` (13 files)

6. **Habitat Complexity:**
   - `src/App/integrationTests/collectRecords/habitatComplexity/*.test.jsx` (10 files)

### Medium Priority (Session 1-2 Migrations)

- Site management tests
- Management regime tests
- User management tests
- Submitted records tests

### Low Priority (Not Yet Migrated)

- GFCR tests (GFCR pages not yet migrated)
- Supporting component tests

---

## Test Update Process

### Step 1: Run Tests and Identify Failures

```bash
yarn test 2>&1 | tee test-results.txt
```

### Step 2: Categorize Failures

Look for patterns like:
- `Unable to find an element with the text: Site`
- `Unable to find an element with the text: Save`
- `TestingLibraryElementError: Unable to find an accessible element with the role "combobox" and name "Site"`

### Step 3: Fix One Test File at a Time

1. Open the test file
2. Search for text selectors (`getByText`, `getByLabelText`)
3. Check `translation.json` for the corresponding key
4. Replace English text with i18n key
5. Re-run the test
6. Repeat

### Step 4: Verify Component Test IDs

If a component doesn't have a `data-testid`, consider adding one for more stable tests.

---

## Example Test Update

### Before (Original Test)
```javascript
test('New fishbelt save shows toast', async () => {
  await user.selectOptions(screen.getByLabelText('Site'), '1')
  await user.selectOptions(screen.getByLabelText('Management'), '2')
  await user.type(screen.getByTestId('depth-input'), '10')
  await user.click(screen.getByText('Save', { selector: 'button' }))

  expect(await screen.findByText('Record saved.'))
})
```

### After (Updated for i18n)
```javascript
test('New fishbelt save shows toast', async () => {
  // These already use testId - no change needed ✅
  await user.selectOptions(screen.getByLabelText('site'), '1')  // Updated
  await user.selectOptions(screen.getByLabelText('management'), '2')  // Updated
  await user.type(screen.getByTestId('depth-input'), '10')
  await user.click(screen.getByText('buttons.save', { selector: 'button' }))  // Updated

  expect(await screen.findByText('success.save_online_success'))  // Updated
})
```

---

## Helpful Commands

### Find All Text Selectors in a Test File
```bash
grep -n "getByText\|getByLabelText" src/App/integrationTests/collectRecords/fishBelt/App.fishBeltCreateOnline.test.jsx
```

### Search for a Translation Key
```bash
grep -r "\"site\"" src/locales/en/translation.json
```

### Count Test Files to Update
```bash
find src/App/integrationTests/collectRecords -name "*.test.jsx" | wc -l
```

---

## Notes

- **Test mocking is already set up correctly** - no changes needed to `setupTests.js`
- **Most tests use `data-testid`** which won't be affected by i18n changes
- **Focus on tests with `getByText` and `getByLabelText`** selectors
- **Tests will fail loudly** making it easy to identify what needs updating
- According to the plan test strategy: "Use data-testids for stable, language-agnostic tests"

---

## Reference

- **Translation file:** `src/locales/en/translation.json`
- **Test setup:** `src/setupTests.js`
- **Test utilities:** `src/testUtilities/`
- **Jest config:** `jest.config.js`
- **Migration plan:** `collecting_translation_plan.md`
