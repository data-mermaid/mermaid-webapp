import { createUuid } from '../../../../library/createUuid'

const benthicPitObservationReducer = (state, action) => {
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
        attribute: null,
        growth_form: null,
        interval: null,
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
    case 'updateAttribute':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId
        const { newAttribute } = action.payload

        return isObservationToUpdate ? { ...observation, attribute: newAttribute } : observation
      })
    case 'updateGrowthForm':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId
        const { newGrowthForm } = action.payload

        return isObservationToUpdate ? { ...observation, growth_form: newGrowthForm } : observation
      })

    default:
      throw new Error("This action isn't supported by the observationReducer")
  }
}

export default benthicPitObservationReducer
