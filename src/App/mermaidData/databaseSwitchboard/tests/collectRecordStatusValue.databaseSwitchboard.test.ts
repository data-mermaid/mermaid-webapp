import { expect, test } from 'vitest'
import { getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess } from './testHelpers.DatabaseSwitchboard'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { VALIDATION_STATUS } from '../../../../components/pages/Collect/collectConstants'

// Regression coverage for the bug where Collect status border colours disappeared
// in non-English languages: RECORD_STATUS_COLORS used to be keyed on the translated
// status label. The colour is now keyed on uiLabels.statusValue, a stable value
// that must not track the (translatable) uiLabels.status label.
const STABLE_STATUSES = [VALIDATION_STATUS.error, VALIDATION_STATUS.warning, VALIDATION_STATUS.ok]

test('getCollectRecordsForUIDisplay exposes a stable statusValue that is independent of the translated status label', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dbSwitchboardInstance.dexiePerUserDataInstance)

  const records = await dbSwitchboardInstance.getCollectRecordsForUIDisplay('5')

  expect(records.length).toBeGreaterThan(0)

  records.forEach((record) => {
    const rawStatus = record.validations?.status
    const expectedStatusValue = STABLE_STATUSES.includes(rawStatus)
      ? rawStatus
      : VALIDATION_STATUS.stale

    // the styling key is the stable status value...
    expect(record.uiLabels.statusValue).toEqual(expectedStatusValue)
    // ...and never the translated display text the colours used to be keyed on.
    expect(record.uiLabels.statusValue).not.toEqual(record.uiLabels.status)
  })

  // guard the scenario the bug was about: at least one record with a real status
  // whose translated label differs from its stable value.
  expect(records.some((record) => record.uiLabels.statusValue === VALIDATION_STATUS.error)).toBe(
    true,
  )
})

test('getCollectRecordsForUIDisplay treats records with no validation status (e.g. created offline) as stale', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dbSwitchboardInstance.dexiePerUserDataInstance)

  // clone an existing, fully-formed record and strip its validations to mimic a
  // record created offline that has no validation status yet.
  const allRecords = await dbSwitchboardInstance.dexiePerUserDataInstance.collect_records.toArray()
  const templateRecord = allRecords.find((record) => record.project === '5')

  const offlineRecord = {
    ...structuredClone(templateRecord),
    id: 'offline-record-without-validations',
    validations: undefined,
  }

  await dbSwitchboardInstance.dexiePerUserDataInstance.collect_records.put(offlineRecord)

  const records = await dbSwitchboardInstance.getCollectRecordsForUIDisplay('5')
  const offlineRecordForDisplay = records.find((record) => record.id === offlineRecord.id)

  expect(offlineRecordForDisplay.uiLabels.statusValue).toEqual(VALIDATION_STATUS.stale)
})
