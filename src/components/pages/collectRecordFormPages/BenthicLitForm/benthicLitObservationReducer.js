import { createUuid } from '../../../../library/createUuid'
import { clearBleachingStatuses, fillBleachingStatuses } from '../../../../library/bleachingStatus'
import { updateObservationReducerValue } from '../updateObservationReducerValue'

const benthicLitObservationReducer = (state, action) => {
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
      return [...state, { id: createUuid(), attribute: '', growth_form: '', length: '' }]
    }
    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const { referenceObservationIndex } = action.payload
      const indexToInsertAt = referenceObservationIndex + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        attribute: '',
        growth_form: '',
        length: '',
      })

      return observationsWithInsertedRow
    }

    case 'duplicateLastObservation': {
      const { referenceObservation } = action.payload
      // A new row starts not assessed for bleaching; fillBleachingStatuses makes it Normal if coral.
      const observationWithNewId = {
        ...referenceObservation,
        id: createUuid(),
        bleaching_status: null,
      }

      return [...state, observationWithNewId]
    }
    case 'updateBenthicAttribute':
      return state.map((observation) => {
        const isObservationToUpdate = observation?.id === action.payload.observationId
        const { newValue } = action.payload

        return isObservationToUpdate ? { ...observation, attribute: newValue } : observation
      })
    case 'updateGrowthForm':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'growth_form' })

    case 'updateLength':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'length' })

    case 'updateBleachingStatus':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'bleaching_status' })

    case 'fillBleachingStatuses':
      return fillBleachingStatuses(state, action.payload.coralAttributeIds)
    case 'clearBleachingStatuses':
      return clearBleachingStatuses(state)

    default:
      throw new Error(`This action (${action.type}) isn't supported by the observationReducer`)
  }
}

export { benthicLitObservationReducer }
