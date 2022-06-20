import { createUuid } from '../../../../library/createUuid'

const fishbeltObservationReducer = (state, action) => {
  switch (action.type) {
    case 'loadObservationsFromApi': {
      const updateObservationsWithIds = [...action.payload].map((record) => ({
        id: record.id || createUuid(),
        ...record,
      }))

      return updateObservationsWithIds
    }

    case 'deleteObservation': {
      const observationIdToBeRemoved = action.payload

      const observationsWithTheRightOneRemoved = state.filter(
        (observation) => observation.id !== observationIdToBeRemoved,
      )

      return observationsWithTheRightOneRemoved
    }

    case 'addObservation':
      return [...state, { id: createUuid(), count: null, size: null }]
    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const { referenceObservationIndex } = action.payload
      const indexToInsertAt = referenceObservationIndex + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        fish_attribute: null,
        count: null,
        size: null,
      })

      return observationsWithInsertedRow
    }

    case 'duplicateLastObservation': {
      const observationWithNewId = {
        ...action.payload.referenceObservation,
        id: createUuid(),
      }

      return [...state, observationWithNewId]
    }
    case 'updateCount':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId

        const { newCount } = action.payload

        const newCountToUse =
          Number.isNaN(newCount) || newCount === '' ? null : parseFloat(newCount)

        return isObservationToUpdate ? { ...observation, count: newCountToUse } : observation
      })
    case 'updateSize':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId
        const { newSize } = action.payload

        const newSizeToUse = Number.isNaN(newSize) || newSize === '' ? null : parseFloat(newSize)

        return isObservationToUpdate ? { ...observation, size: newSizeToUse } : observation
      })
    case 'updateFishName':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId

        return isObservationToUpdate
          ? {
              ...observation,
              fish_attribute: action.payload.newFishName,
            }
          : observation
      })
    case 'resetFishSizes': {
      return state.map((observation) => ({ ...observation, size: '' }))
    }
    default:
      throw new Error("This action isn't supported by the observationReducer")
  }
}

export default fishbeltObservationReducer
