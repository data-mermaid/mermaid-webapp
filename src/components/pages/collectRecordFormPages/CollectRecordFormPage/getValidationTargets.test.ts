import { describe, expect, test } from 'vitest'
import getValidationTargets from './getValidationTargets'

const recordTarget = (value: string) => ({ attribute: 'data-record-validation-id', value })
const fieldTarget = (value: string) => ({ attribute: 'data-validation-field', value })
const observationTarget = (value: string) => ({ attribute: 'data-observation-id', value })

describe('getValidationTargets', () => {
  test('returns empty buckets when results is undefined', () => {
    expect(getValidationTargets(undefined)).toEqual({ error: [], warning: [], ignored: [] })
  })

  test('emits one record target per validation_id so each item can be highlighted individually', () => {
    const targets = getValidationTargets({
      $record: [
        { status: 'error', validation_id: 'r1' },
        { status: 'error', validation_id: 'r2' },
        { status: 'warning', validation_id: 'r3' },
      ],
    })

    expect(targets.error).toEqual([recordTarget('r1'), recordTarget('r2')])
    expect(targets.warning).toEqual([recordTarget('r3')])
    expect(targets.ignored).toEqual([])
  })

  test('emits one field target per input regardless of duplicate statuses', () => {
    const targets = getValidationTargets({
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
    const targets = getValidationTargets({
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
    expect(targets.ignored).toEqual([observationTarget('obs3')])
  })

  test('per-row error preempts warning/ignore (matches getValidationsToDisplay)', () => {
    const targets = getValidationTargets({
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
    expect(targets.ignored).toEqual([])
  })

  test('combines record, field, and observation targets across buckets', () => {
    const targets = getValidationTargets({
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
    const targets = getValidationTargets({
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
    expect(targets.ignored).toEqual([fieldTarget('width')])
  })

  test('handles shallow field shape where data.<section> contains validations directly (e.g. observers)', () => {
    const targets = getValidationTargets({
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

  test('skips observation validations that lack a status or observation_id', () => {
    const targets = getValidationTargets({
      data: {
        obs_belt_fishes: [
          [{ status: 'error' }], // missing context.observation_id → skip
          [{ context: { observation_id: 'obs1' } }], // missing status → skip
        ],
      },
    })

    expect(targets.error).toEqual([])
  })
})

describe('getValidationTargets with edited fields', () => {
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
    const targets = getValidationTargets(results, (property) => property === 'depth')

    // The depth field target is gone; the record and observation errors are untouched.
    expect(targets.error).toEqual([recordTarget('r1'), observationTarget('obs1')])
    expect(targets.warning).toEqual([fieldTarget('len_surveyed'), fieldTarget('observers')])
  })

  test('derives the formik property from the last path segment, at any depth', () => {
    const editedProperties: string[] = []

    getValidationTargets(results, (property) => {
      editedProperties.push(property)

      return false
    })

    expect(editedProperties).toEqual(['depth', 'len_surveyed', 'observers'])
  })

  test('keeps record and observation targets, which have no input to edit', () => {
    const targets = getValidationTargets(results, () => true)

    expect(targets.error).toEqual([recordTarget('r1'), observationTarget('obs1')])
    expect(targets.warning).toEqual([])
  })

  test('counts every field target when no inputs have been edited', () => {
    expect(getValidationTargets(results, () => false)).toEqual(getValidationTargets(results))
  })
})

describe('getValidationTargets with deleted observation rows', () => {
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
    const targets = getValidationTargets(results, () => false, new Set(['obs2']))

    expect(targets.error).toEqual([])
    expect(targets.warning).toEqual([observationTarget('obs2')])
  })

  test('keeps validations for rows that are still on the page', () => {
    const targets = getValidationTargets(results, () => false, new Set(['obs1', 'obs2']))

    expect(targets.error).toEqual([observationTarget('obs1')])
    expect(targets.warning).toEqual([observationTarget('obs2')])
  })

  test('drops the last row on the page when it is deleted', () => {
    const targets = getValidationTargets(results, () => false, new Set())

    expect(targets.error).toEqual([])
    expect(targets.warning).toEqual([])
  })

  test('counts everything while the observation tables are still loading', () => {
    const targets = getValidationTargets(results, () => false, null)

    expect(targets.error).toEqual([observationTarget('obs1')])
    expect(targets.warning).toEqual([observationTarget('obs2')])
  })
})

describe('getValidationTargets with duplicate_values', () => {
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
    const targets = getValidationTargets({ $record: [duplicateValues('warning')] })

    expect(targets.warning).toEqual([
      recordTarget('dupes'),
      observationTarget('obs1'),
      observationTarget('obs2'),
    ])
  })

  test('a named row showing its own error is not also counted as a duplicate warning', () => {
    const targets = getValidationTargets({
      $record: [duplicateValues('warning')],
      data: {
        obs_benthic_photo_quadrats: [[{ status: 'error', context: { observation_id: 'obs1' } }]],
      },
    })

    expect(targets.error).toEqual([observationTarget('obs1')])
    expect(targets.warning).toEqual([recordTarget('dupes'), observationTarget('obs2')])
  })

  test('respects rows that are no longer on the page', () => {
    const targets = getValidationTargets(
      { $record: [duplicateValues('warning')] },
      () => false,
      new Set(['obs2']),
    )

    expect(targets.warning).toEqual([recordTarget('dupes'), observationTarget('obs2')])
  })

  test('follows the validation status, so an ignored duplicate counts as ignored', () => {
    const targets = getValidationTargets({ $record: [duplicateValues('ignore')] })

    expect(targets.warning).toEqual([])
    expect(targets.ignored).toEqual([
      recordTarget('dupes'),
      observationTarget('obs1'),
      observationTarget('obs2'),
    ])
  })

  test('ignores duplicate_images, which keys context.duplicates by image id instead', () => {
    const targets = getValidationTargets({
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
  })
})

describe('getValidationTargets record level statuses', () => {
  test('counts a record level reset as a warning, since the panel still renders it as one', () => {
    const targets = getValidationTargets({
      $record: [{ status: 'reset', validation_id: 'r1' }],
    })

    expect(targets.warning).toEqual([recordTarget('r1')])
    expect(targets.ignored).toEqual([])
  })

  test('leaves a field reset uncounted, since the input renders nothing for it', () => {
    const targets = getValidationTargets({
      data: { fishbelt_transect: { depth: [{ status: 'reset' }] } },
    })

    expect(targets).toEqual({ error: [], warning: [], ignored: [] })
  })

  test('leaves an observation reset uncounted', () => {
    const targets = getValidationTargets({
      data: {
        obs_belt_fishes: [[{ status: 'reset', context: { observation_id: 'obs1' } }]],
      },
    })

    expect(targets).toEqual({ error: [], warning: [], ignored: [] })
  })

  test('skips the dry submit summary while other record level errors are unresolved', () => {
    const targets = getValidationTargets({
      $record: [
        { status: 'error', code: 'unsuccessful_dry_submit', validation_id: 'summary' },
        { status: 'error', code: 'duplicate_transect', validation_id: 'r1' },
      ],
    })

    expect(targets.error).toEqual([recordTarget('r1')])
  })

  test('counts the dry submit summary once it is the only record level error', () => {
    const targets = getValidationTargets({
      $record: [
        { status: 'error', code: 'unsuccessful_dry_submit', validation_id: 'summary' },
        { status: 'warning', code: 'all_equal', validation_id: 'r1' },
      ],
    })

    expect(targets.error).toEqual([recordTarget('summary')])
    expect(targets.warning).toEqual([recordTarget('r1')])
  })
})
