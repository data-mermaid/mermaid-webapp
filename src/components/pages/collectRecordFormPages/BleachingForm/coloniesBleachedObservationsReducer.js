import { createUuid } from '../../../../library/createUuid'
import { updateObservationReducerValue } from '../updateObservationReducerValue'

const coloniesBleachedObservationsReducer = (state, action) => {
  switch (action.type) {
    case 'loadObservationsFromApi': {
      const updateObservationsWithIds = [...action.payload].map((record) => ({
        id: record.id || createUuid(),
        ...record,
      }))

      return updateObservationsWithIds
    }

    case 'deleteObservation': {
      const { observationId: observationIdToBeRemoved } = action.payload

      const observationsWithTheRightOneRemoved = state.filter(
        (observation) => observation.id !== observationIdToBeRemoved,
      )

      return observationsWithTheRightOneRemoved
    }

    case 'addObservation': {
      return [
        ...state,
        {
          id: createUuid(),
          attribute: '',
          count_100: '',
          count_20: '',
          count_50: '',
          count_80: '',
          count_dead: '',
          count_normal: '',
          count_pale: '',
          growth_form: '',
        },
      ]
    }

    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const { referenceObservationIndex } = action.payload
      const indexToInsertAt = referenceObservationIndex + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        attribute: '',
        count_100: '',
        count_20: '',
        count_50: '',
        count_80: '',
        count_dead: '',
        count_normal: '',
        count_pale: '',
        growth_form: '',
      })

      return observationsWithInsertedRow
    }

    case 'duplicateLastObservation': {
      const { referenceObservation } = action.payload
      const observationWithNewId = {
        ...referenceObservation,
        id: createUuid(),
      }

      return [...state, observationWithNewId]
    }
    case 'updateBenthicAttribute':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'attribute' })
    case 'updateGrowthForm':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'growth_form' })
    case 'updateNormal':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'count_normal' })
    case 'updatePale':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'count_pale' })
    case 'update20Bleached':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'count_20' })
    case 'update50Bleached':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'count_50' })
    case 'update80Bleached':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'count_80' })
    case 'update100Bleached':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'count_100' })
    case 'updateRecentlyDead':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'count_dead' })

    default:
      throw new Error(`This action (${action.type}) isn't supported by the observationReducer`)
  }
}

export default coloniesBleachedObservationsReducer
