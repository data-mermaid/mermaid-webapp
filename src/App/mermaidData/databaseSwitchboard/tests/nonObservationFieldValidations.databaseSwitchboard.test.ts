import { expect, test } from 'vitest'
import { getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess } from './testHelpers.DatabaseSwitchboard'

const validationPath = 'data.sample_event.management'

// The API stores one result per validator on a field, so a field showing a single warning also
// carries the `ok` results of its other validators.
const recordWithManagementWarning = {
  id: 'record-with-management-warning',
  validations: {
    results: {
      data: {
        sample_event: {
          management: [
            { validation_id: 'required', status: 'ok' },
            { validation_id: 'unique', code: 'not_unique_management', status: 'warning' },
            { validation_id: 'rule', status: 'ok' },
          ],
        },
      },
    },
  },
}

const getStatuses = (record: typeof recordWithManagementWarning) =>
  record.validations.results.data.sample_event.management.map(({ status }) => status)

test('Un-ignoring a field restores its warning and leaves its other results alone, so it can be ignored again', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  const ignoredRecord = await dbSwitchboardInstance.ignoreNonObservationFieldValidations({
    record: recordWithManagementWarning,
    validationPath,
  })

  expect(getStatuses(ignoredRecord)).toEqual(['ok', 'ignore', 'ok'])

  const unignoredRecord = await dbSwitchboardInstance.unignoreNonObservationFieldValidations({
    record: ignoredRecord,
    validationPath,
  })

  expect(getStatuses(unignoredRecord)).toEqual(['ok', 'warning', 'ok'])

  const reignoredRecord = await dbSwitchboardInstance.ignoreNonObservationFieldValidations({
    record: unignoredRecord,
    validationPath,
  })

  expect(getStatuses(reignoredRecord)).toEqual(['ok', 'ignore', 'ok'])
})
