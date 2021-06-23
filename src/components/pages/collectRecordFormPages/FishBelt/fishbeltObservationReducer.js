import { createUuid } from '../../../../library/createUuid'

const fishbeltObservationReducer = (state, action) => {
  switch (action.type) {
    case 'loadObservationsFromApi':
      return [...action.payload]

    case 'deleteObservation': {
      const idOfRemovee = action.payload

      const observationsWithTheRightOneRemoved = state.filter(
        (observation) => observation.id !== idOfRemovee,
      )

      return observationsWithTheRightOneRemoved
    }

    case 'addObservation':
      return [...state, { id: createUuid(), count: 0, size: 0 }]
    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const indexToInsertAt = action.payload + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        count: 0,
        size: 0,
      })

      return observationsWithInsertedRow
    }

    case 'duplicateLastObservation': {
      const observationWithNewId = {
        ...action.payload.observation,
        id: createUuid(),
      }

      return [...state, observationWithNewId]
    }
    case 'updateCount':
      return state.map((observation) => {
        const isObservationToUpdate =
          observation.id === action.payload.observationId

        return isObservationToUpdate
          ? { ...observation, count: action.payload.newCount }
          : observation
      })
    case 'updateSize':
      return state.map((observation) => {
        const isObservationToUpdate =
          observation.id === action.payload.observationId

        return isObservationToUpdate
          ? { ...observation, size: action.payload.newSize }
          : observation
      })
    default:
      throw new Error("This action isn't supported by the observationReducer")
  }
}

export default fishbeltObservationReducer
