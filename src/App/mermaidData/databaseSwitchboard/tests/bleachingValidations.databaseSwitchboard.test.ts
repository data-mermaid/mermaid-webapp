import { expect, test } from 'vitest'
import { getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess } from './testHelpers.DatabaseSwitchboard'

const recordWithBleachingResults = {
  id: 'record-with-bleaching-results',
  data: { protocol: 'benthicpit' },
  validations: {
    results: {
      $record: [
        { name: 'bleaching_status_missing_validator', status: 'warning' },
        { name: 'all_equal_validator', status: 'warning' },
      ],
      data: {
        include_bleaching: [{ name: 'include_bleaching_validator', status: 'ok' }],
        interval_size: [{ name: 'interval_size_validator', status: 'error' }],
        obs_benthic_pits: [
          [
            {
              name: 'bleaching_status_validator',
              status: 'error',
              context: { observation_id: '1' },
            },
            { name: 'region_validator', status: 'warning', context: { observation_id: '1' } },
          ],
          [{ name: 'bleaching_status_validator', status: 'ok', context: { observation_id: '2' } }],
        ],
      },
    },
  },
}

interface Result {
  name: string
  isStale?: boolean
}

const getStaleNames = (results: Result[]) =>
  results.filter(({ isStale }) => isStale).map(({ name }) => name)

test('Marking bleaching validations stale marks the field and the bleaching result on every row, and nothing else', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()

  await dbSwitchboardInstance.dexiePerUserDataInstance.collect_records.put(
    recordWithBleachingResults,
  )

  const updatedRecord = await dbSwitchboardInstance.markBleachingValidationsStale({
    recordId: recordWithBleachingResults.id,
  })
  const storedRecord = await dbSwitchboardInstance.dexiePerUserDataInstance.collect_records.get(
    recordWithBleachingResults.id,
  )

  expect(storedRecord).toEqual(updatedRecord)

  const { $record, data } = updatedRecord.validations.results

  expect(getStaleNames($record)).toEqual([])
  expect(getStaleNames(data.include_bleaching)).toEqual(['include_bleaching_validator'])
  expect(getStaleNames(data.interval_size)).toEqual([])
  expect(data.obs_benthic_pits.map(getStaleNames)).toEqual([
    ['bleaching_status_validator'],
    ['bleaching_status_validator'],
  ])
})

test('Marking bleaching validations stale leaves a record that was never validated alone', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()
  const neverValidatedRecord = { id: 'never-validated', data: { protocol: 'benthiclit' } }

  await dbSwitchboardInstance.dexiePerUserDataInstance.collect_records.put(neverValidatedRecord)

  expect(
    await dbSwitchboardInstance.markBleachingValidationsStale({
      recordId: neverValidatedRecord.id,
    }),
  ).toEqual(neverValidatedRecord)
})
