import { createUuid } from '../../../../library/createUuid'

const coloniesBleachedObservationReducer = (state, action) => {
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
      return [...state, { id: createUuid(), attribute: '' }]
    }

    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const { referenceObservationIndex } = action.payload
      const indexToInsertAt = referenceObservationIndex + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        attribute: '',
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
      return state.map((observation) => {
        const isObservationToUpdate = observation?.id === action.payload.observationId
        const { newBenthicAttribute } = action.payload

        return isObservationToUpdate
          ? { ...observation, attribute: newBenthicAttribute }
          : observation
      })

    default:
      throw new Error("This action isn't supported by the observationReducer")
  }
}

export default coloniesBleachedObservationReducer
