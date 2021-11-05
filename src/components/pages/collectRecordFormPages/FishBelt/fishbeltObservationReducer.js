import { createUuid } from '../../../../library/createUuid'

const fishbeltObservationReducer = (state, action) => {
  switch (action.type) {
    case 'loadObservationsFromApi':
      return [...action.payload]

    case 'deleteObservation': {
      const idOfRemovee = action.payload

      const observationsWithTheRightOneRemoved = state.filter(
        observation => observation.uiId !== idOfRemovee,
      )

      return observationsWithTheRightOneRemoved
    }

    case 'addObservation':
      return [...state, { uiId: createUuid(), count: null, size: null }]
    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const { referenceObservationIndex, referenceObservation } = action.payload
      const indexToInsertAt = referenceObservationIndex + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        uiId: createUuid(),
        fish_attribute: referenceObservation.fish_attribute,
        count: null,
        size: null,
      })

      return observationsWithInsertedRow
    }

    case 'duplicateLastObservation': {
      const observationWithNewId = {
        ...action.payload.referenceObservation,
        uiId: createUuid(),
      }

      return [...state, observationWithNewId]
    }
    case 'updateCount':
      return state.map(observation => {
        const isObservationToUpdate = observation.uiId === action.payload.observationId

        const { newCount } = action.payload

        const newCountToUse =
          Number.isNaN(newCount) || newCount === '' ? null : parseFloat(newCount)

        return isObservationToUpdate ? { ...observation, count: newCountToUse } : observation
      })
    case 'updateSize':
      return state.map(observation => {
        const isObservationToUpdate = observation.uiId === action.payload.observationId
        const { newSize } = action.payload

        const newSizeToUse = Number.isNaN(newSize) || newSize === '' ? null : parseFloat(newSize)

        return isObservationToUpdate ? { ...observation, size: newSizeToUse } : observation
      })
    case 'updateFishName':
      return state.map(observation => {
        const isObservationToUpdate = observation.uiId === action.payload.observationId

        return isObservationToUpdate
          ? {
              ...observation,
              fish_attribute: action.payload.newFishName,
            }
          : observation
      })
    case 'resetFishSizes': {
      return state.map(observation => ({ ...observation, size: '' }))
    }
    default:
      throw new Error("This action isn't supported by the observationReducer")
  }
}

export default fishbeltObservationReducer
