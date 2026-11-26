import { describe, expect, test } from 'vitest'
import benthicpqtObservationReducer from './benthicpqtObservationReducer'

const state = [{ id: '1', quadrat_number: 2, num_points: 3 }]

describe('benthicpqtObservationReducer', () => {
  test('stores a cleared quadrat number as null', () => {
    const newState = benthicpqtObservationReducer(state, {
      type: 'updateQuadratNumber',
      payload: { newQuadratNumber: null, observationId: '1' },
    })

    expect(newState[0].quadrat_number).toBeNull()
  })

  test('stores a cleared number of points as null', () => {
    const newState = benthicpqtObservationReducer(state, {
      type: 'updateNumberOfPoints',
      payload: { newNumberOfPoints: null, observationId: '1' },
    })

    expect(newState[0].num_points).toBeNull()
  })
})
