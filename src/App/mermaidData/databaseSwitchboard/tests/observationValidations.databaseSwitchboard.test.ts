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

// The API gives the same validation_id to the same validator on every row, so a change by id
// has to be scoped to the row as well.
const recordWithTwoWarningsOnARow = {
  id: 'record-with-two-warnings-on-a-row',
  data: { protocol: 'fishbelt' },
  validations: {
    results: {
      data: {
        obs_belt_fishes: [
          [
            { context: { observation_id: 'obs-1' }, validation_id: 'size', status: 'warning' },
            { context: { observation_id: 'obs-1' }, validation_id: 'region', status: 'warning' },
            { context: { observation_id: 'obs-1' }, validation_id: 'count', status: 'error' },
            { context: { observation_id: 'obs-1' }, validation_id: 'name', status: 'ok' },
          ],
          [{ context: { observation_id: 'obs-2' }, validation_id: 'size', status: 'warning' }],
        ],
      },
    },
  },
}

const getRows = (record: typeof recordWithTwoWarningsOnARow) =>
  record.validations.results.data.obs_belt_fishes.map((row) =>
    row.map(({ status, isStale }: { status: string; isStale?: boolean }) =>
      isStale ? `${status}*` : status,
    ),
  )

test("Ignoring one warning by id leaves the row's other warning, and the same id on another row, alone", async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()
  const ids = { recordId: recordWithTwoWarningsOnARow.id, observationId: 'obs-1' }

  await dbSwitchboardInstance.dexiePerUserDataInstance.collect_records.put(
    recordWithTwoWarningsOnARow,
  )

  const ignoredRecord = await dbSwitchboardInstance.ignoreObservationValidations({
    ...ids,
    validationId: 'size',
  })

  expect(getRows(ignoredRecord)).toEqual([['ignore', 'warning', 'error', 'ok'], ['warning']])

  const unignoredRecord = await dbSwitchboardInstance.unignoreObservationValidations({
    ...ids,
    validationId: 'size',
  })

  expect(getRows(unignoredRecord)).toEqual([['warning', 'warning', 'error', 'ok'], ['warning']])
})

test('Editing a row greys its errors and warnings, keeps its ignored warning, and restores an un-ignored warning as greyed', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()
  const ids = { recordId: recordWithTwoWarningsOnARow.id, observationId: 'obs-1' }

  await dbSwitchboardInstance.dexiePerUserDataInstance.collect_records.put(
    recordWithTwoWarningsOnARow,
  )
  await dbSwitchboardInstance.ignoreObservationValidations({ ...ids, validationId: 'size' })

  const editedRecord = await dbSwitchboardInstance.markObservationValidationsStale(ids)

  expect(getRows(editedRecord)).toEqual([['ignore', 'warning*', 'error*', 'ok'], ['warning']])

  const unignoredRecord = await dbSwitchboardInstance.unignoreObservationValidations({
    ...ids,
    validationId: 'size',
  })

  expect(getRows(unignoredRecord)).toEqual([['warning*', 'warning*', 'error*', 'ok'], ['warning']])

  // Ignoring a greyed warning makes it live again: an ignore is never stale.
  const reignoredRecord = await dbSwitchboardInstance.ignoreObservationValidations({
    ...ids,
    validationId: 'size',
  })

  expect(getRows(reignoredRecord)).toEqual([['ignore', 'warning*', 'error*', 'ok'], ['warning']])
})
