import { describe, expect, test } from 'vitest'
import getValidationCounts from './getValidationCounts'

describe('getValidationCounts', () => {
  test('returns zeroes when results is undefined', () => {
    expect(getValidationCounts(undefined)).toEqual({
      errorCount: 0,
      warningCount: 0,
      ignoredCount: 0,
    })
  })

  test('returns zeroes when $record and data are absent', () => {
    expect(getValidationCounts({})).toEqual({
      errorCount: 0,
      warningCount: 0,
      ignoredCount: 0,
    })
  })

  test('counts record-level validations by status', () => {
    const counts = getValidationCounts({
      $record: [
        { status: 'error', validation_id: 'r1', code: 'a' },
        { status: 'warning', validation_id: 'r2', code: 'b' },
        { status: 'ignore', validation_id: 'r3', code: 'c' },
        { status: 'ok', validation_id: 'r4', code: 'd' },
        { status: 'reset', validation_id: 'r5', code: 'e' },
      ],
    })

    expect(counts).toEqual({ errorCount: 1, warningCount: 1, ignoredCount: 1 })
  })

  test('counts field-level validations nested under data', () => {
    const counts = getValidationCounts({
      data: {
        sample_event: {
          site: { v1: { status: 'error' }, v2: { status: 'warning' } },
          management: { v3: { status: 'ignore' } },
          sample_date: { v4: { status: 'ok' } },
        },
        fishbelt_transect: {
          len_surveyed: { v5: { status: 'error' } },
        },
      },
    })

    expect(counts).toEqual({ errorCount: 2, warningCount: 1, ignoredCount: 1 })
  })

  test('counts observation-level validations in nested arrays', () => {
    const counts = getValidationCounts({
      data: {
        obs_belt_fishes: [
          [
            { status: 'error', context: { observation_id: 'obs1' } },
            { status: 'warning', context: { observation_id: 'obs1' } },
          ],
          [{ status: 'ignore', context: { observation_id: 'obs2' } }],
          [{ status: 'ok', context: { observation_id: 'obs3' } }],
        ],
      },
    })

    expect(counts).toEqual({ errorCount: 1, warningCount: 1, ignoredCount: 1 })
  })

  test('sums record-level and data validations together', () => {
    const counts = getValidationCounts({
      $record: [
        { status: 'error', validation_id: 'r1' },
        { status: 'error', validation_id: 'r2' },
      ],
      data: {
        sample_event: { site: { v1: { status: 'warning' } } },
        obs_belt_fishes: [[{ status: 'ignore', context: { observation_id: 'x' } }]],
      },
    })

    expect(counts).toEqual({ errorCount: 2, warningCount: 1, ignoredCount: 1 })
  })

  test('does not double-count when a validation object has nested children', () => {
    // early return when a status is found stops the walker from descending further
    const counts = getValidationCounts({
      $record: [
        {
          status: 'error',
          nested: { status: 'warning' },
        },
      ],
    })

    expect(counts).toEqual({ errorCount: 1, warningCount: 0, ignoredCount: 0 })
  })
})
