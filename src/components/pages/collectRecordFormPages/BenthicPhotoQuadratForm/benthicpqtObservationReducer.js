import { createUuid } from '../../../../library/createUuid'
import { hasNonEmptyValue } from '../../../../library/hasNonEmptyValue'
import { parseApiNumber } from '../../../../library/numbers/parseApiNumber'

const benthicpqtObservationReducer = (state, action) => {
  switch (action.type) {
    case 'loadObservationsFromApi': {
      const updateObservationsWithIds = [...action.payload].map((record) => ({
        id: record.id || createUuid(),
        ...record,
        quadrat_number: parseApiNumber(record.quadrat_number),
        num_points: parseApiNumber(record.num_points),
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
      return [
        ...state,
        { id: createUuid(), quadrat_number: null, growth_form: null, num_points: null },
      ]

    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const { referenceObservationIndex } = action.payload
      const indexToInsertAt = referenceObservationIndex + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        quadrat_number: null,
        attribute: null,
        growth_form: null,
        num_points: null,
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

    case 'updateQuadratNumber':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId

        const { newQuadratNumber } = action.payload

        const newQuadratNumberToUse = hasNonEmptyValue(newQuadratNumber)
          ? parseFloat(newQuadratNumber)
          : null

        return isObservationToUpdate
          ? { ...observation, quadrat_number: newQuadratNumberToUse }
          : observation
      })

    case 'updateBenthicAttribute': {
      const newState = state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId

        return isObservationToUpdate
          ? {
              ...observation,
              attribute: action.payload.newBenthicAttribute,
            }
          : observation
      })

      return newState
    }

    case 'updateGrowthForm':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId

        return isObservationToUpdate
          ? {
              ...observation,
              growth_form: action.payload.newGrowthForm,
            }
          : observation
      })

    case 'updateNumberOfPoints':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId

        const { newNumberOfPoints } = action.payload

        const newNumberOfPointsToUse = hasNonEmptyValue(newNumberOfPoints)
          ? parseFloat(newNumberOfPoints)
          : null

        return isObservationToUpdate
          ? { ...observation, num_points: newNumberOfPointsToUse }
          : observation
      })

    default:
      throw new Error("This action isn't supported by the observationReducer")
  }
}

export default benthicpqtObservationReducer
