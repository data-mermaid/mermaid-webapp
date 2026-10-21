import { expect, test } from 'vitest'
import { getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess } from './testHelpers.DatabaseSwitchboard'

// Bleaching has two observation tables. The record only has results for one of them, which
// covers a table with no validation results.
const recordWithObservationWarnings = {
  id: 'record-with-observation-warnings',
  data: { protocol: 'bleachingqc' },
  validations: {
    results: {
      data: {
        obs_colonies_bleached: [
          [
            { context: { observation_id: 'obs-1' }, validation_id: 'size', status: 'warning' },
            { context: { observation_id: 'obs-1' }, validation_id: 'count', status: 'ok' },
            { context: { observation_id: 'obs-1' }, validation_id: 'attribute', status: 'error' },
          ],
          [{ context: { observation_id: 'obs-2' }, validation_id: 'size', status: 'warning' }],
        ],
      },
    },
  },
}

type CollectRecord = typeof recordWithObservationWarnings

const getStatuses = (record: CollectRecord) =>
  record.validations.results.data.obs_colonies_bleached.map((observationValidations) =>
    observationValidations.map(({ status }) => status),
  )

test('Un-ignoring an observation restores its warnings and leaves its other results and other observations alone', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()
  const ids = { recordId: recordWithObservationWarnings.id, observationId: 'obs-1' }

  await dbSwitchboardInstance.dexiePerUserDataInstance.collect_records.put(
    recordWithObservationWarnings,
  )
  await dbSwitchboardInstance.ignoreObservationValidations(ids)
  await dbSwitchboardInstance.ignoreObservationValidations({ ...ids, observationId: 'obs-2' })

  const unignoredRecord = await dbSwitchboardInstance.unignoreObservationValidations(ids)

  expect(getStatuses(unignoredRecord)).toEqual([['warning', 'ok', 'error'], ['ignore']])
  expect(
    getStatuses(
      await dbSwitchboardInstance.dexiePerUserDataInstance.collect_records.get(ids.recordId),
    ),
  ).toEqual([['warning', 'ok', 'error'], ['ignore']])
})
