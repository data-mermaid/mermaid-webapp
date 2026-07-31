import { describe, expect, test } from 'vitest'
import getValidationTargets from './getValidationTargets'

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

    expect(targets.error).toEqual([
      { kind: 'record', validationId: 'r1' },
      { kind: 'record', validationId: 'r2' },
    ])
    expect(targets.warning).toEqual([{ kind: 'record', validationId: 'r3' }])
    expect(targets.ignored).toEqual([])
  })

  test('emits one field target per validationPath regardless of duplicate statuses', () => {
    const targets = getValidationTargets({
      data: {
        sample_event: {
          site: { v1: { status: 'error' }, v2: { status: 'error' } },
          management: { v3: { status: 'warning' } },
        },
      },
    })

    expect(targets.error).toEqual([{ kind: 'field', validationPath: 'data.sample_event.site' }])
    expect(targets.warning).toEqual([
      { kind: 'field', validationPath: 'data.sample_event.management' },
    ])
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

    expect(targets.error).toEqual([{ kind: 'observation', observationId: 'obs1' }])
    expect(targets.warning).toEqual([{ kind: 'observation', observationId: 'obs2' }])
    expect(targets.ignored).toEqual([{ kind: 'observation', observationId: 'obs3' }])
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

    expect(targets.error).toEqual([
      { kind: 'field', validationPath: 'data.sample_event.site' },
      { kind: 'observation', observationId: 'obs1' },
    ])
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

    expect(targets.error).toEqual([
      { kind: 'record', validationId: 'r1' },
      { kind: 'field', validationPath: 'data.sample_event.site' },
    ])
    expect(targets.warning).toEqual([{ kind: 'observation', observationId: 'obs1' }])
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

    expect(targets.error).toEqual([
      { kind: 'field', validationPath: 'data.fishbelt_transect.depth' },
    ])
    expect(targets.warning).toEqual([
      { kind: 'field', validationPath: 'data.fishbelt_transect.width' },
    ])
    expect(targets.ignored).toEqual([
      { kind: 'field', validationPath: 'data.fishbelt_transect.width' },
    ])
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
    expect(targets.error).toEqual([{ kind: 'field', validationPath: 'data.observers' }])
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
