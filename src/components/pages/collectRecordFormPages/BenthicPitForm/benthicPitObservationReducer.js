import { createUuid } from '../../../../library/createUuid'
import { clearBleachingStatuses, fillBleachingStatuses } from '../../../../library/bleachingStatus'
import { updateObservationReducerValue } from '../updateObservationReducerValue'

const benthicPitObservationReducer = (state, action) => {
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

    if (!intervalSizeToUse) {
      return observations.map((observation) => ({
        ...observation,
        interval: '-',
        interval_size: '',
      }))
    }

    observations.forEach((observation, index) => {
      const interval = formatInterval(intervalStartToUse + intervalSizeToUse * index)
      recalculatedObservations.push({ ...observation, interval, interval_size: intervalSize })
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
        intervalStart,
        intervalSize,
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
        observations: [...state, { id: createUuid(), attribute: '', growth_form: '' }],
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
        attribute: '',
        growth_form: '',
      })

      return getObservationsWithRecalculatedIntervals({
        observations: observationsWithInsertedRow,
        intervalSize,
        intervalStart,
      })
    }

    case 'duplicateLastObservation': {
      const { intervalSize, intervalStart, referenceObservation } = action.payload
      // A new row starts not assessed for bleaching; fillBleachingStatuses makes it Normal if coral.
      const observationWithNewId = {
        ...referenceObservation,
        id: createUuid(),
        bleaching_status: null,
      }

      return getObservationsWithRecalculatedIntervals({
        observations: [...state, observationWithNewId],
        intervalSize,
        intervalStart,
      })
    }
    case 'updateBenthicAttribute':
      return state.map((observation) => {
        const isObservationToUpdate = observation?.id === action.payload.observationId
        const { newBenthicAttribute } = action.payload

        return isObservationToUpdate
          ? { ...observation, attribute: newBenthicAttribute }
          : observation
      })
    case 'updateGrowthForm':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId
        const { newGrowthForm } = action.payload

        return isObservationToUpdate ? { ...observation, growth_form: newGrowthForm } : observation
      })
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

export default benthicPitObservationReducer
