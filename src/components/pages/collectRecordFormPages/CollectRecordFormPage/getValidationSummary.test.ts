import { describe, expect, test } from 'vitest'
import getValidationSummary from './getValidationSummary'

const recordTarget = (value: string) => ({ attribute: 'data-record-validation-id', value })
const fieldTarget = (value: string) => ({ attribute: 'data-validation-field', value })
const observationTarget = (value: string) => ({ attribute: 'data-observation-id', value })

const noCounts = { error: 0, warning: 0, ignore: 0 }
const noTargets = { error: [], warning: [], ignore: [] }

describe('getValidationSummary targets', () => {
  test('returns an empty summary when results is undefined', () => {
    expect(getValidationSummary(undefined)).toEqual({ counts: noCounts, targets: noTargets })
  })

  test('emits one record target per validation_id so each item can be highlighted individually', () => {
    const { targets } = getValidationSummary({
      $record: [
        { status: 'error', validation_id: 'r1' },
        { status: 'error', validation_id: 'r2' },
        { status: 'warning', validation_id: 'r3' },
      ],
    })

    expect(targets.error).toEqual([recordTarget('r1'), recordTarget('r2')])
    expect(targets.warning).toEqual([recordTarget('r3')])
    expect(targets.ignore).toEqual([])
  })

  test('emits one field target per input regardless of duplicate statuses', () => {
    const { targets } = getValidationSummary({
      data: {
        sample_event: {
          site: { v1: { status: 'error' }, v2: { status: 'error' } },
          management: { v3: { status: 'warning' } },
        },
      },
    })

    expect(targets.error).toEqual([fieldTarget('site')])
    expect(targets.warning).toEqual([fieldTarget('management')])
  })

  test('emits one observation target per observation_id per status', () => {
    const { targets } = getValidationSummary({
      data: {
        obs_belt_fishes: [
          [
            { status: 'error', context: { observation_id: 'obs1' } },
            { status: 'error', context: { observation_id: 'obs1' } },
          ],
          [{ status: 'warning', context: { observation_id: 'obs2' } }],
          [{ status: 'ignore', context: { observation_id: 'obs3' } }],
        ],
      },
    })

    expect(targets.error).toEqual([observationTarget('obs1')])
    expect(targets.warning).toEqual([observationTarget('obs2')])
    expect(targets.ignore).toEqual([observationTarget('obs3')])
  })

  test('per-row error preempts warning/ignore (matches getValidationsToDisplay)', () => {
    const { counts, targets } = getValidationSummary({
      data: {
        // Field row with both an error and a warning: only the error should count.
        sample_event: {
          site: { v1: { status: 'error' }, v2: { status: 'warning' } },
        },
        // Observation row with both an error and a warning: only the error should count.
        obs_belt_fishes: [
          [
            { status: 'error', context: { observation_id: 'obs1' } },
            { status: 'warning', context: { observation_id: 'obs1' } },
          ],
        ],
      },
    })

    expect(targets.error).toEqual([fieldTarget('site'), observationTarget('obs1')])
    expect(targets.warning).toEqual([])
    expect(targets.ignore).toEqual([])
    expect(counts).toEqual({ error: 2, warning: 0, ignore: 0 })
  })

  test('combines record, field, and observation targets across buckets', () => {
    const { targets } = getValidationSummary({
      $record: [{ status: 'error', validation_id: 'r1' }],
      data: {
        sample_event: {
          site: { v1: { status: 'error' } },
        },
        obs_belt_fishes: [[{ status: 'warning', context: { observation_id: 'obs1' } }]],
      },
    })

    expect(targets.error).toEqual([recordTarget('r1'), fieldTarget('site')])
    expect(targets.warning).toEqual([observationTarget('obs1')])
  })

  test('handles array shape for field validations (post-reset shape from CollectRecordsMixin)', () => {
    const { targets } = getValidationSummary({
      data: {
        fishbelt_transect: {
          // After user edits a field, the reset flow converts the keyed object
          // { key: { status } } into an array [{ status }].
          number: [{ status: 'reset' }],
          depth: [{ status: 'error' }],
          width: [{ status: 'warning' }, { status: 'ignore' }],
        },
      },
    })

    expect(targets.error).toEqual([fieldTarget('depth')])
    expect(targets.warning).toEqual([fieldTarget('width')])
    expect(targets.ignore).toEqual([fieldTarget('width')])
  })

  test('handles shallow field shape where data.<section> contains validations directly (e.g. observers)', () => {
    const { targets } = getValidationSummary({
      data: {
        observers: {
          v1: { status: 'error' },
          v2: { status: 'warning' },
        },
      },
    })

    // Error preempts warning on the same row.
    expect(targets.error).toEqual([fieldTarget('observers')])
    expect(targets.warning).toEqual([])
  })

  test('accepts context.id as well as context.observation_id, as the row lookup does', () => {
    const { targets } = getValidationSummary({
      data: {
        obs_belt_fishes: [
          [{ status: 'error', context: { id: 'obs1' } }],
          [{ status: 'warning', context: { observation_id: 'obs2' } }],
        ],
      },
    })

    expect(targets.error).toEqual([observationTarget('obs1')])
    expect(targets.warning).toEqual([observationTarget('obs2')])
  })

  test('skips observation validations that lack a status or observation_id', () => {
    const summary = getValidationSummary({
      data: {
        obs_belt_fishes: [
          [{ status: 'error' }], // missing context.observation_id → skip
          [{ context: { observation_id: 'obs1' } }], // missing status → skip
        ],
      },
    })

    expect(summary).toEqual({ counts: noCounts, targets: noTargets })
  })
})

describe('getValidationSummary counts', () => {
  test('counts every warning a row shows, while the row stays one place to scroll to', () => {
    // A row showing three warning messages is three things to deal with, not one.
    const { counts, targets } = getValidationSummary({
      data: {
        obs_belt_fishes: [
          [
            { status: 'warning', context: { observation_id: 'obs1' } },
            { status: 'warning', context: { observation_id: 'obs1' } },
            { status: 'warning', context: { observation_id: 'obs1' } },
          ],
        ],
      },
    })

    expect(counts.warning).toBe(3)
    expect(targets.warning).toEqual([observationTarget('obs1')])
  })

  test('counts warnings on separate rows separately', () => {
    const { counts, targets } = getValidationSummary({
      data: {
        obs_belt_fishes: [
          [{ status: 'warning', context: { observation_id: 'obs1' } }],
          [{ status: 'warning', context: { observation_id: 'obs2' } }],
        ],
      },
    })

    expect(counts.warning).toBe(2)
    expect(targets.warning).toEqual([observationTarget('obs1'), observationTarget('obs2')])
  })

  test('counts one error for a row with several, matching the single message it shows', () => {
    // getValidationsToDisplay renders the first error and hides the rest of the row.
    const { counts } = getValidationSummary({
      data: {
        sample_event: {
          site: { v1: { status: 'error' }, v2: { status: 'error' } },
        },
      },
    })

    expect(counts.error).toBe(1)
  })
})

describe('getValidationSummary with edited fields', () => {
  // An input the user has edited hides its validation badge, so it must also drop out of
  // the counts. The formik property name is the last segment of the validation path.
  const results = {
    $record: [{ status: 'error', validation_id: 'r1' }],
    data: {
      fishbelt_transect: {
        depth: { v1: { status: 'error' } },
        len_surveyed: { v2: { status: 'warning' } },
      },
      observers: { v3: { status: 'warning' } },
      obs_belt_fishes: [[{ status: 'error', context: { observation_id: 'obs1' } }]],
    },
  }

  test('drops a field target once its input is edited', () => {
    const { counts, targets } = getValidationSummary(results, (property) => property === 'depth')

    // The depth field target is gone; the record and observation errors are untouched.
    expect(targets.error).toEqual([recordTarget('r1'), observationTarget('obs1')])
    expect(targets.warning).toEqual([fieldTarget('len_surveyed'), fieldTarget('observers')])
    expect(counts).toEqual({ error: 2, warning: 2, ignore: 0 })
  })

  test('derives the formik property from the last path segment, at any depth', () => {
    const editedProperties: string[] = []

    getValidationSummary(results, (property) => {
      editedProperties.push(property)

      return false
    })

    expect(editedProperties).toEqual(['depth', 'len_surveyed', 'observers'])
  })

  test('keeps record and observation targets, which have no input to edit', () => {
    const { counts, targets } = getValidationSummary(results, () => true)

    expect(targets.error).toEqual([recordTarget('r1'), observationTarget('obs1')])
    expect(targets.warning).toEqual([])
    expect(counts).toEqual({ error: 2, warning: 0, ignore: 0 })
  })

  test('counts every field target when no inputs have been edited', () => {
    expect(getValidationSummary(results, () => false)).toEqual(getValidationSummary(results))
  })
})

describe('getValidationSummary with deleted observation rows', () => {
  // Third argument is the rows still on the page. Deleting one leaves its validations behind.
  const results = {
    data: {
      obs_belt_fishes: [
        [{ status: 'error', context: { observation_id: 'obs1' } }],
        [{ status: 'warning', context: { observation_id: 'obs2' } }],
      ],
    },
  }

  test('drops validations for rows that are no longer on the page', () => {
    const { counts, targets } = getValidationSummary(results, () => false, new Set(['obs2']))

    expect(targets.error).toEqual([])
    expect(targets.warning).toEqual([observationTarget('obs2')])
    expect(counts).toEqual({ error: 0, warning: 1, ignore: 0 })
  })

  test('keeps validations for rows that are still on the page', () => {
    const { targets } = getValidationSummary(results, () => false, new Set(['obs1', 'obs2']))

    expect(targets.error).toEqual([observationTarget('obs1')])
    expect(targets.warning).toEqual([observationTarget('obs2')])
  })

  test('drops the last row on the page when it is deleted', () => {
    const summary = getValidationSummary(results, () => false, new Set())

    expect(summary).toEqual({ counts: noCounts, targets: noTargets })
  })

  test('counts everything while the observation tables are still loading', () => {
    const { targets } = getValidationSummary(results, () => false, null)

    expect(targets.error).toEqual([observationTarget('obs1')])
    expect(targets.warning).toEqual([observationTarget('obs2')])
  })
})

describe('getValidationSummary with duplicate_values', () => {
  // duplicate_values is a $record validation that getObservationValidationInfo also paints
  // onto every row named in context.duplicates, so those rows are targets too.
  const duplicateValues = (status: string) => ({
    code: 'duplicate_values',
    status,
    validation_id: 'dupes',
    fields: ['data.obs_benthic_photo_quadrats'],
    context: {
      duplicates: [
        [
          { id: 'obs1', index: 0 },
          { id: 'obs2', index: 1 },
        ],
      ],
    },
  })

  test('emits a target for the record message and for every row it names', () => {
    const { targets } = getValidationSummary({ $record: [duplicateValues('warning')] })

    expect(targets.warning).toEqual([
      recordTarget('dupes'),
      observationTarget('obs1'),
      observationTarget('obs2'),
    ])
  })

  test('counts one warning, however many rows it marks', () => {
    // One validation, one message on screen. The marked rows are places to go, not more work.
    const { counts } = getValidationSummary({ $record: [duplicateValues('warning')] })

    expect(counts).toEqual({ error: 0, warning: 1, ignore: 0 })
  })

  test('still counts a marked row for validations of its own', () => {
    const { counts, targets } = getValidationSummary({
      $record: [duplicateValues('warning')],
      data: {
        obs_benthic_photo_quadrats: [[{ status: 'warning', context: { observation_id: 'obs1' } }]],
      },
    })

    // The record message, plus obs1's own warning. obs2 carries only the duplicate.
    expect(counts).toEqual({ error: 0, warning: 2, ignore: 0 })
    expect(targets.warning).toEqual([
      recordTarget('dupes'),
      observationTarget('obs1'),
      observationTarget('obs2'),
    ])
  })

  test('a named row showing its own error is not also counted as a duplicate warning', () => {
    const { counts, targets } = getValidationSummary({
      $record: [duplicateValues('warning')],
      data: {
        obs_benthic_photo_quadrats: [[{ status: 'error', context: { observation_id: 'obs1' } }]],
      },
    })

    expect(targets.error).toEqual([observationTarget('obs1')])
    expect(targets.warning).toEqual([recordTarget('dupes'), observationTarget('obs2')])
    expect(counts).toEqual({ error: 1, warning: 1, ignore: 0 })
  })

  test('respects rows that are no longer on the page', () => {
    const { counts, targets } = getValidationSummary(
      { $record: [duplicateValues('warning')] },
      () => false,
      new Set(['obs2']),
    )

    expect(targets.warning).toEqual([recordTarget('dupes'), observationTarget('obs2')])
    expect(counts).toEqual({ error: 0, warning: 1, ignore: 0 })
  })

  test('follows the validation status, so an ignored duplicate counts as ignored', () => {
    const { counts, targets } = getValidationSummary({ $record: [duplicateValues('ignore')] })

    expect(targets.warning).toEqual([])
    expect(targets.ignore).toEqual([
      recordTarget('dupes'),
      observationTarget('obs1'),
      observationTarget('obs2'),
    ])
    expect(counts).toEqual({ error: 0, warning: 0, ignore: 1 })
  })

  test('ignores duplicate_images, which keys context.duplicates by image id instead', () => {
    const { counts, targets } = getValidationSummary({
      $record: [
        {
          code: 'duplicate_images',
          status: 'warning',
          validation_id: 'images',
          context: { duplicates: { 'image-1': [{ id: 'obs1' }] } },
        },
      ],
    })

    expect(targets.warning).toEqual([recordTarget('images')])
    expect(counts).toEqual({ error: 0, warning: 1, ignore: 0 })
  })
})

describe('getValidationSummary record level statuses', () => {
  test('counts a record level reset as a warning, since the panel still renders it as one', () => {
    const { counts, targets } = getValidationSummary({
      $record: [{ status: 'reset', validation_id: 'r1' }],
    })

    expect(targets.warning).toEqual([recordTarget('r1')])
    expect(targets.ignore).toEqual([])
    expect(counts).toEqual({ error: 0, warning: 1, ignore: 0 })
  })

  test('leaves a field reset uncounted, since the input renders nothing for it', () => {
    const summary = getValidationSummary({
      data: { fishbelt_transect: { depth: [{ status: 'reset' }] } },
    })

    expect(summary).toEqual({ counts: noCounts, targets: noTargets })
  })

  test('leaves an observation reset uncounted', () => {
    const summary = getValidationSummary({
      data: {
        obs_belt_fishes: [[{ status: 'reset', context: { observation_id: 'obs1' } }]],
      },
    })

    expect(summary).toEqual({ counts: noCounts, targets: noTargets })
  })

  test('skips the dry submit summary while other record level errors are unresolved', () => {
    const { counts, targets } = getValidationSummary({
      $record: [
        { status: 'error', code: 'unsuccessful_dry_submit', validation_id: 'summary' },
        { status: 'error', code: 'duplicate_transect', validation_id: 'r1' },
      ],
    })

    expect(targets.error).toEqual([recordTarget('r1')])
    expect(counts.error).toBe(1)
  })

  test('counts the dry submit summary once it is the only record level error', () => {
    const { counts, targets } = getValidationSummary({
      $record: [
        { status: 'error', code: 'unsuccessful_dry_submit', validation_id: 'summary' },
        { status: 'warning', code: 'all_equal', validation_id: 'r1' },
      ],
    })

    expect(targets.error).toEqual([recordTarget('summary')])
    expect(targets.warning).toEqual([recordTarget('r1')])
    expect(counts).toEqual({ error: 1, warning: 1, ignore: 0 })
  })
})
