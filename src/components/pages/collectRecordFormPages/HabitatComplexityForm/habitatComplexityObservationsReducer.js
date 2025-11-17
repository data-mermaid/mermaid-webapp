import { createUuid } from '../../../../library/createUuid'
import { updateObservationReducerValue } from '../updateObservationReducerValue'

const habitatComplexityObservationReducer = (state, action) => {
  const getObservationsWithRecalculatedIntervals = ({ observations, intervalSize }) => {
    const recalculatedObservations = []
    const intervalStartToUse = intervalSize ?? 1

    if (!intervalSize) {
      return observations.map((observation) => ({ ...observation, interval: '-' }))
    }

    observations.forEach((observation, index) => {
      const previousObservation = recalculatedObservations[index - 1]
      const interval = !previousObservation
        ? intervalStartToUse
        : previousObservation.interval + intervalSize

      recalculatedObservations.push({ ...observation, interval })
    })

    return recalculatedObservations
  }

  switch (action.type) {
    case 'loadObservationsFromApi': {
      const updateObservationsWithIds = [...action.payload].map((record) => ({
        id: record.id || createUuid(),
        ...record,
      }))

      return updateObservationsWithIds
    }

    case 'recalculateObservationIntervals': {
      const { intervalSize } = action.payload

      return getObservationsWithRecalculatedIntervals({
        observations: state,
        intervalSize,
      })
    }

    case 'deleteObservation': {
      const { observationId: observationIdToBeRemoved, intervalSize } = action.payload

      const observationsWithTheRightOneRemoved = state.filter(
        (observation) => observation.id !== observationIdToBeRemoved,
      )

      return getObservationsWithRecalculatedIntervals({
        observations: observationsWithTheRightOneRemoved,
        intervalSize,
      })
    }

    case 'addObservation': {
      const { intervalSize } = action.payload

      return getObservationsWithRecalculatedIntervals({
        observations: [...state, { id: createUuid(), score: '' }],
        intervalSize,
      })
    }
    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const { referenceObservationIndex, intervalSize } = action.payload
      const indexToInsertAt = referenceObservationIndex + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        score: '',
      })

      return getObservationsWithRecalculatedIntervals({
        observations: observationsWithInsertedRow,
        intervalSize,
      })
    }

    case 'duplicateLastObservation': {
      const { intervalSize, referenceObservation } = action.payload
      const observationWithNewId = {
        ...referenceObservation,
        id: createUuid(),
      }

      return getObservationsWithRecalculatedIntervals({
        observations: [...state, observationWithNewId],
        intervalSize,
      })
    }
    case 'updateHabitatComplexityScore':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'score' })

    default:
      throw new Error(`This action (${action.type}) isn't supported by the observationReducer`)
  }
}

export default habitatComplexityObservationReducer
