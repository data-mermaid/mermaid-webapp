import { describe, expect, test } from 'vitest'

import getObservationValidationInfo, { getCellMarkProps } from './getObservationValidationInfo'

const getCellMarks = (rowValidations) =>
  getObservationValidationInfo({
    observationId: 'obs-1',
    observationsPropertyName: 'obs_colonies_bleached',
    areValidationsShowing: true,
    collectRecord: {
      validations: {
        results: {
          data: {
            obs_colonies_bleached: [
              rowValidations.map((validation, index) => ({
                validation_id: `v${index}`,
                ...validation,
                context: { observation_id: 'obs-1', ...validation.context },
              })),
            ],
          },
        },
      },
    },
  }).cellMarks

describe('cell marks', () => {
  test('marks the column each message is about', () => {
    const cellMarks = getCellMarks([
      { status: 'warning', code: 'no_region_match' },
      { status: 'error', code: 'invalid_count', context: { invalid_paths: ['count_pale'] } },
    ])

    expect(cellMarks).toEqual({
      attribute: { status: 'warning', isStale: false },
      count_pale: { status: 'error', isStale: false },
    })
  })

  test('gives a cell with two messages the more severe status', () => {
    const cellMarks = getCellMarks([
      { status: 'warning', code: 'invert_count_high' },
      { status: 'error', code: 'invalid_invert_count' },
    ])

    expect(cellMarks.count).toEqual({ status: 'error', isStale: false })
  })

  test('marks nothing when validations are not showing', () => {
    const { cellMarks } = getObservationValidationInfo({
      observationId: 'obs-1',
      observationsPropertyName: 'obs_colonies_bleached',
      areValidationsShowing: false,
      collectRecord: {},
    })

    expect(cellMarks).toEqual({})
  })
})

describe('getCellMarkProps', () => {
  const cellMarks = {
    count_pale: { status: 'warning', isStale: false },
    total: { status: 'error', isStale: false },
    attribute: { status: 'error', isStale: true },
  }

  test('marks a cell with its status', () => {
    expect(getCellMarkProps(cellMarks, 'count_pale')).toEqual({ 'data-validation-mark': 'warning' })
  })

  test('marks a greyed cell as info', () => {
    expect(getCellMarkProps(cellMarks, 'attribute')).toEqual({ 'data-validation-mark': 'info' })
  })

  test('takes the strongest mark of the columns a cell answers to', () => {
    expect(getCellMarkProps(cellMarks, 'count_pale', 'total')).toEqual({
      'data-validation-mark': 'error',
    })
    expect(getCellMarkProps(cellMarks, 'count_normal', 'total')).toEqual({
      'data-validation-mark': 'error',
    })
  })

  test('leaves an unmarked cell alone', () => {
    expect(getCellMarkProps(cellMarks, 'count_dead')).toEqual({})
  })
})

describe('duplicate observations', () => {
  const duplicateValues = (validationId, observationIds) => ({
    code: 'duplicate_values',
    status: 'error',
    validation_id: validationId,
    context: { duplicates: [observationIds.map((id, index) => ({ id, index }))] },
  })

  // Bleaching runs one duplicate check per table.
  const collectRecord = {
    validations: {
      results: {
        $record: [
          duplicateValues('colonies', ['colony-1', 'colony-2']),
          duplicateValues('quadrats', ['quadrat-1', 'quadrat-2']),
        ],
      },
    },
  }

  test('a row shows only the duplicate check that names it', () => {
    const { observationValidationMessages } = getObservationValidationInfo({
      observationId: 'colony-1',
      observationsPropertyName: 'obs_colonies_bleached',
      areValidationsShowing: true,
      collectRecord,
    })

    expect(observationValidationMessages.map(({ id }) => id)).toEqual(['colonies'])
  })

  test('a row no duplicate check names shows none', () => {
    const { observationValidationMessages } = getObservationValidationInfo({
      observationId: 'colony-3',
      observationsPropertyName: 'obs_colonies_bleached',
      areValidationsShowing: true,
      collectRecord,
    })

    expect(observationValidationMessages).toEqual([])
  })
})
