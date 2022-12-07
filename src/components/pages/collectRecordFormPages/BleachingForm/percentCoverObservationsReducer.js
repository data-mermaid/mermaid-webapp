import { createUuid } from '../../../../library/createUuid'

const updateObservationValue = ({ state, propertyToUpdate, action }) => {
  return state.map((observation) => {
    const isObservationToUpdate = observation.id === action.payload.observationId
    const { newValue } = action.payload

    return isObservationToUpdate ? { ...observation, [propertyToUpdate]: newValue } : observation
  })
}

const getObservationsWithRecalculatedQuadratNumbers = (observations) => {
  return observations.map((observation, index) => {
    return { ...observation, quadrat_number: index + 1 }
  })
}

const percentCoverObservationsReducer = (state, action) => {
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

      return getObservationsWithRecalculatedQuadratNumbers(observationsWithTheRightOneRemoved)
    }

    case 'addObservation': {
      const quadrat_number = state.length + 1

      return [
        ...state,
        {
          id: createUuid(),
          percent_hard: '',
          percent_soft: '',
          percent_algae: '',
          quadrat_number,
        },
      ]
    }

    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const { referenceObservationIndex } = action.payload
      const indexToInsertAt = referenceObservationIndex + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        percent_hard: '',
        percent_soft: '',
        percent_algae: '',
      })

      return getObservationsWithRecalculatedQuadratNumbers(observationsWithInsertedRow)
    }

    case 'duplicateLastObservation': {
      const { referenceObservation } = action.payload
      const quadrat_number = state.length + 1

      const observationWithNewId = {
        ...referenceObservation,
        id: createUuid(),
        quadrat_number,
      }

      return [...state, observationWithNewId]
    }
    case 'updateSoftCoralPercent':
      return updateObservationValue({ state, action, propertyToUpdate: 'percent_soft' })
    case 'updateHardCoralPercent':
      return updateObservationValue({ state, action, propertyToUpdate: 'percent_hard' })
    case 'updateAlgaePercent':
      return updateObservationValue({ state, action, propertyToUpdate: 'percent_algae' })

    default:
      throw new Error(`This action (${action.type}) isn't supported by the observationReducer`)
  }
}

export default percentCoverObservationsReducer
