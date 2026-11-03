import { describe, expect, test } from 'vitest'
import getValidationSummary from './getValidationSummary'
import {
  fieldDisclosureKey,
  rowDisclosureKey,
} from '../../../generic/ValidationMessage/ValidationDisclosure'
import mockImageClassificationValidations from '../../../../testUtilities/mockBenthicPhotoQuadratImageClassificationValidationsObject'

const recordTarget = (value: string) => ({ attribute: 'data-record-validation-id', value })
const fieldTarget = (validationPath: string) => ({
  attribute: 'data-validation-field',
  value: validationPath.slice(validationPath.lastIndexOf('.') + 1),
  disclosureKey: fieldDisclosureKey(validationPath),
})
const observationTarget = (value: string) => ({
  attribute: 'data-observation-id',
  value,
  disclosureKey: rowDisclosureKey(value),
})

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

    expect(targets.error).toEqual([fieldTarget('data.sample_event.site')])
    expect(targets.warning).toEqual([fieldTarget('data.sample_event.management')])
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

  test('a row with an error and a warning counts both and is a target for both chips', () => {
    const { counts, targets } = getValidationSummary({
      data: {
        sample_event: {
          site: { v1: { status: 'error' }, v2: { status: 'warning' } },
        },
        obs_belt_fishes: [
          [
            { status: 'error', context: { observation_id: 'obs1' } },
            { status: 'warning', context: { observation_id: 'obs1' } },
          ],
        ],
      },
    })

    expect(targets.error).toEqual([
      fieldTarget('data.sample_event.site'),
      observationTarget('obs1'),
    ])
    expect(targets.warning).toEqual([
      fieldTarget('data.sample_event.site'),
      observationTarget('obs1'),
    ])
    expect(targets.ignore).toEqual([])
    expect(counts).toEqual({ error: 2, warning: 2, ignore: 0 })
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

    expect(targets.error).toEqual([fieldTarget('data.sample_event.site'), recordTarget('r1')])
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

    expect(targets.error).toEqual([fieldTarget('data.fishbelt_transect.depth')])
    expect(targets.warning).toEqual([fieldTarget('data.fishbelt_transect.width')])
    expect(targets.ignore).toEqual([fieldTarget('data.fishbelt_transect.width')])
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

    // An error never hides a warning, so the row is a target for both chips.
    expect(targets.error).toEqual([fieldTarget('data.observers')])
    expect(targets.warning).toEqual([fieldTarget('data.observers')])
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

  test('counts every error a row shows', () => {
    const { counts } = getValidationSummary({
      data: {
        sample_event: {
          site: { v1: { status: 'error' }, v2: { status: 'error' } },
        },
      },
    })

    expect(counts.error).toBe(2)
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
    const { counts, targets } = getValidationSummary(results, new Set(['obs2']))

    expect(targets.error).toEqual([])
    expect(targets.warning).toEqual([observationTarget('obs2')])
    expect(counts).toEqual({ error: 0, warning: 1, ignore: 0 })
  })

  test('keeps validations for rows that are still on the page', () => {
    const { targets } = getValidationSummary(results, new Set(['obs1', 'obs2']))

    expect(targets.error).toEqual([observationTarget('obs1')])
    expect(targets.warning).toEqual([observationTarget('obs2')])
  })

  test('drops the last row on the page when it is deleted', () => {
    const summary = getValidationSummary(results, new Set())

    expect(summary).toEqual({ counts: noCounts, targets: noTargets })
  })

  test('counts everything while the observation tables are still loading', () => {
    const { targets } = getValidationSummary(results, null)

    expect(targets.error).toEqual([observationTarget('obs1')])
    expect(targets.warning).toEqual([observationTarget('obs2')])
  })
})

describe('getValidationSummary with duplicate_values', () => {
  // duplicate_values is a $record validation that getObservationValidationInfo also shows on
  // every row named in context.duplicates. While any of those rows is on the page, the rows are
  // what is counted and reached, not the message.
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

  test('counts once per row it marks, and targets the rows only', () => {
    const { counts, targets } = getValidationSummary({ $record: [duplicateValues('error')] })

    expect(counts).toEqual({ error: 2, warning: 0, ignore: 0 })
    expect(targets.error).toEqual([observationTarget('obs1'), observationTarget('obs2')])
  })

  test('still counts a marked row for validations of its own', () => {
    const { counts, targets } = getValidationSummary({
      $record: [duplicateValues('error')],
      data: {
        obs_benthic_photo_quadrats: [[{ status: 'warning', context: { observation_id: 'obs1' } }]],
      },
    })

    expect(counts).toEqual({ error: 2, warning: 1, ignore: 0 })
    expect(targets.error).toEqual([observationTarget('obs1'), observationTarget('obs2')])
    expect(targets.warning).toEqual([observationTarget('obs1')])
  })

  test('counts only the marked rows still on the page', () => {
    const { counts, targets } = getValidationSummary(
      { $record: [duplicateValues('error')] },
      new Set(['obs2']),
    )

    expect(counts).toEqual({ error: 1, warning: 0, ignore: 0 })
    expect(targets.error).toEqual([observationTarget('obs2')])
  })

  test('counts and targets the message when none of its rows is on the page', () => {
    const { counts, targets } = getValidationSummary(
      { $record: [duplicateValues('error')] },
      new Set(['obs3']),
    )

    expect(counts).toEqual({ error: 1, warning: 0, ignore: 0 })
    expect(targets.error).toEqual([recordTarget('dupes')])
  })

  test('follows the validation status, so an ignored duplicate counts as ignored', () => {
    const { counts, targets } = getValidationSummary({ $record: [duplicateValues('ignore')] })

    expect(counts).toEqual({ error: 0, warning: 0, ignore: 2 })
    expect(targets.ignore).toEqual([observationTarget('obs1'), observationTarget('obs2')])
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

// A greyed message (edited since the last Validate) stays on screen, so a diver can see what the
// last Validate said, but it is out of their hands until the next one: not counted, not a stop.
describe('getValidationSummary with greyed messages', () => {
  test('leaves a greyed field message uncounted and untargeted', () => {
    const summary = getValidationSummary({
      data: { fishbelt_transect: { depth: [{ status: 'error', isStale: true }] } },
    })

    expect(summary).toEqual({ counts: noCounts, targets: noTargets })
  })

  test('counts only the live messages on an edited row', () => {
    const { counts, targets } = getValidationSummary({
      data: {
        obs_belt_fishes: [
          [
            { status: 'error', isStale: true, context: { observation_id: 'obs1' } },
            { status: 'warning', isStale: true, context: { observation_id: 'obs1' } },
            { status: 'ignore', isStale: true, context: { observation_id: 'obs1' } },
          ],
        ],
      },
    })

    expect(counts).toEqual({ error: 0, warning: 0, ignore: 1 })
    expect(targets).toEqual({ error: [], warning: [], ignore: [observationTarget('obs1')] })
  })
})

describe('getValidationSummary record level statuses', () => {
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

// "One or more invalid fields": the API's duplicate transect check could not read one of the
// fields in its `fields`.
describe('getValidationSummary with the invalid transect fields message', () => {
  const invalidTransect = {
    status: 'error',
    code: 'invalid_fishbelt_transect',
    validation_id: 'transect',
    fields: ['data.sample_event.site', 'data.fishbelt_transect.depth'],
  }

  test('is not counted or targeted while one of its fields shows a message', () => {
    const { counts, targets } = getValidationSummary({
      $record: [invalidTransect],
      data: { sample_event: { site: [{ status: 'error' }] } },
    })

    expect(counts.error).toBe(1)
    expect(targets.error).toEqual([fieldTarget('data.sample_event.site')])
  })

  test('is counted again once its only mark is greyed by an edit', () => {
    const { counts, targets } = getValidationSummary({
      $record: [invalidTransect],
      data: { fishbelt_transect: { depth: [{ status: 'error', isStale: true }] } },
    })

    expect(counts.error).toBe(1)
    expect(targets.error).toEqual([recordTarget('transect')])
  })

  test('is not explained by a warning on one of its fields', () => {
    const { counts, targets } = getValidationSummary({
      $record: [invalidTransect],
      data: { sample_event: { site: [{ status: 'warning' }] } },
    })

    expect(counts).toEqual({ error: 1, warning: 1, ignore: 0 })
    expect(targets.error).toEqual([recordTarget('transect')])
  })

  test('is counted and targeted when none of its fields shows a message', () => {
    const { counts, targets } = getValidationSummary({
      $record: [invalidTransect],
      data: { fishbelt_transect: { width: [{ status: 'error' }] } },
    })

    expect(counts.error).toBe(2)
    expect(targets.error).toEqual([
      fieldTarget('data.fishbelt_transect.width'),
      recordTarget('transect'),
    ])
  })
})

// The dry submit summary ("System validation error") names, in context.dry_submit_results, the
// fields and observation columns the API could not save.
describe('getValidationSummary with the dry submit summary', () => {
  const drySubmit = (...names: string[]) => ({
    status: 'error',
    code: 'unsuccessful_dry_submit',
    validation_id: 'summary',
    context: {
      dry_submit_results: Object.fromEntries(
        names.map((name) => [name, 'This field is required.']),
      ),
    },
  })

  test('is not counted or targeted while every field it names shows a message', () => {
    const { counts, targets } = getValidationSummary({
      $record: [drySubmit('site', 'depth')],
      data: {
        sample_event: { site: [{ status: 'error' }] },
        fishbelt_transect: { depth: [{ status: 'error' }] },
      },
    })

    expect(counts.error).toBe(2)
    expect(targets.error).toEqual([
      fieldTarget('data.sample_event.site'),
      fieldTarget('data.fishbelt_transect.depth'),
    ])
  })

  test('is counted again when a field it names shows only a greyed or ignored message', () => {
    const { counts, targets } = getValidationSummary({
      $record: [drySubmit('site', 'depth')],
      data: {
        sample_event: { site: [{ status: 'ignore' }] },
        fishbelt_transect: { depth: [{ status: 'error', isStale: true }] },
      },
    })

    expect(counts).toEqual({ error: 1, warning: 0, ignore: 1 })
    expect(targets.error).toEqual([recordTarget('summary')])
  })

  test('matches an observation column a row marks, by the column key the table uses', () => {
    const { counts, targets } = getValidationSummary({
      $record: [drySubmit('fish_attribute', 'size')],
      data: {
        obs_belt_fishes: [
          [
            {
              status: 'error',
              code: 'required',
              name: 'fish_attribute_list_required_validator',
              context: { observation_id: 'obs1' },
            },
            {
              status: 'error',
              code: 'required',
              name: 'size_list_required_validator',
              context: { observation_id: 'obs1' },
            },
          ],
        ],
      },
    })

    expect(counts.error).toBe(2)
    expect(targets.error).toEqual([observationTarget('obs1')])
  })

  test('is counted and targeted when a name it gives has no mark of its own', () => {
    const { counts, targets } = getValidationSummary({
      $record: [drySubmit('depth', 'non_field_errors')],
      data: { fishbelt_transect: { depth: [{ status: 'error' }] } },
    })

    expect(counts.error).toBe(2)
    expect(targets.error).toEqual([
      fieldTarget('data.fishbelt_transect.depth'),
      recordTarget('summary'),
    ])
  })
})

describe('getValidationSummary with image classification rows', () => {
  const imageId = 'd67bb9d3-6a16-4180-a7f1-afd7bc7660f8'
  const annotationRowIds = [
    '2b55697f-f26e-433e-9070-f1fe9748bf7b::888609b5-b58a-4d57-addc-a6935bba284b',
    '350e9eb4-5e6b-48f5-aeb8-0bfdf023bf1c::888609b5-b58a-4d57-addc-a6935bba284b',
    '350e9eb4-5e6b-48f5-aeb8-0bfdf023bf1c::cf2deca6-53b8-4096-916f-32c2c71d14bf',
    'f4df7abd-3d51-42fb-8cab-5102b95fad8e::',
    '350e9eb4-5e6b-48f5-aeb8-0bfdf023bf1c::e149db12-9398-4a10-8642-5db70d1a8505',
    '350e9eb4-5e6b-48f5-aeb8-0bfdf023bf1c::',
    '5f1f7956-bc21-4bfd-a409-9740e614b2ac::',
    '09226989-50e7-4c40-bd36-5bcef32ee7a1::',
  ].map((attributeAndGrowthForm) => `${imageId}::${attributeAndGrowthForm}`)
  const { results } = mockImageClassificationValidations

  test('counts and targets each annotation row the table reports', () => {
    const { counts, targets } = getValidationSummary(results, new Set(annotationRowIds))

    expect(targets.error).toEqual(annotationRowIds.map(observationTarget))
    expect(counts).toEqual({ error: 8, warning: 0, ignore: 0 })
  })
})
