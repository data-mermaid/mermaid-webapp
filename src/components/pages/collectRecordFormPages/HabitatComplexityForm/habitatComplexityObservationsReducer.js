import { createUuid } from '../../../../library/createUuid'
import { updateObservationReducerValue } from '../updateObservationReducerValue'

const habitatComplexityObservationReducer = (state, action) => {
  const getObservationsWithRecalculatedIntervals = ({
    observations,
    intervalStart,
    intervalSize,
  }) => {
    const recalculatedObservations = []
    const isIntervalStart = intervalStart !== ''
    const intervalStartToUse = isIntervalStart ? Number(intervalStart) : 0
    const intervalSizeToUse = Number(intervalSize)
    const formatInterval = (interval) => {
      return interval % 1 === 0 ? interval.toFixed(1) : interval.toFixed(2)
    }

    if (!intervalSize) {
      return observations.map((observation) => ({ ...observation, interval: '-' }))
    }

    observations.forEach((observation, index) => {
      const interval = formatInterval(intervalStartToUse + intervalSizeToUse * index)
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
      const { intervalStart, intervalSize } = action.payload

      return getObservationsWithRecalculatedIntervals({
        observations: state,
        intervalSize,
        intervalStart,
      })
    }

    case 'deleteObservation': {
      const {
        observationId: observationIdToBeRemoved,
        intervalSize,
        intervalStart,
      } = action.payload

      const observationsWithTheRightOneRemoved = state.filter(
        (observation) => observation.id !== observationIdToBeRemoved,
      )

      return getObservationsWithRecalculatedIntervals({
        observations: observationsWithTheRightOneRemoved,
        intervalSize,
        intervalStart,
      })
    }

    case 'addObservation': {
      const { intervalStart, intervalSize } = action.payload

      return getObservationsWithRecalculatedIntervals({
        observations: [...state, { id: createUuid(), score: '' }],
        intervalSize,
        intervalStart,
      })
    }
    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const { referenceObservationIndex, intervalSize, intervalStart } = action.payload
      const indexToInsertAt = referenceObservationIndex + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        score: '',
      })

      return getObservationsWithRecalculatedIntervals({
        observations: observationsWithInsertedRow,
        intervalSize,
        intervalStart,
      })
    }

    case 'duplicateLastObservation': {
      const { intervalSize, referenceObservation, intervalStart } = action.payload
      const observationWithNewId = {
        ...referenceObservation,
        id: createUuid(),
      }

      return getObservationsWithRecalculatedIntervals({
        observations: [...state, observationWithNewId],
        intervalSize,
        intervalStart,
      })
    }
    case 'updateHabitatComplexityScore':
      return updateObservationReducerValue({ state, action, propertyToUpdate: 'score' })

    default:
      throw new Error(`This action (${action.type}) isn't supported by the observationReducer`)
  }
}

export default habitatComplexityObservationReducer
