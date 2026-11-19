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

test('Editing a row marks every result, so an ignored warning keeps its status but comes back greyed when unticked', async () => {
  const dbSwitchboardInstance = getDatabaseSwitchboardInstanceAuthenticatedOnlineDexieSuccess()
  const ids = { recordId: recordWithTwoWarningsOnARow.id, observationId: 'obs-1' }

  await dbSwitchboardInstance.dexiePerUserDataInstance.collect_records.put(
    recordWithTwoWarningsOnARow,
  )
  await dbSwitchboardInstance.ignoreObservationValidations({ ...ids, validationId: 'size' })

  const editedRecord = await dbSwitchboardInstance.markObservationValidationsStale(ids)

  expect(getRows(editedRecord)).toEqual([['ignore*', 'warning*', 'error*', 'ok*'], ['warning']])

  const unignoredRecord = await dbSwitchboardInstance.unignoreObservationValidations({
    ...ids,
    validationId: 'size',
  })

  expect(getRows(unignoredRecord)).toEqual([['warning*', 'warning*', 'error*', 'ok*'], ['warning']])

  // Re-ignoring keeps the mark, so a later untick still brings the warning back greyed.
  const reignoredRecord = await dbSwitchboardInstance.ignoreObservationValidations({
    ...ids,
    validationId: 'size',
  })

  expect(getRows(reignoredRecord)).toEqual([['ignore*', 'warning*', 'error*', 'ok*'], ['warning']])
})

// Switching "Include bleaching observations" on a Benthic PIT or LIT record
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
