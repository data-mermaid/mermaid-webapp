import { createUuid } from '../../../../library/createUuid'

const beltInvertObservationReducer = (state, action) => {
  switch (action.type) {
    case 'loadObservationsFromApi': {
      const updateObservationsWithIds = [...action.payload].map((record) => ({
        id: record.id || createUuid(),
        ...record,
        notes: record.notes ?? '',
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
      return [...state, { id: createUuid(), count: null, size: null, notes: ''}]
    case 'addNewObservationBelow': {
      const observationsWithInsertedRow = [...state]
      const { referenceObservationIndex } = action.payload
      const indexToInsertAt = referenceObservationIndex + 1

      observationsWithInsertedRow.splice(indexToInsertAt, 0, {
        id: createUuid(),
        invert_attribute: null,
        count: null,
        size: null,
        notes: '',
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

        const parsedCount = parseFloat(newCount)
        const newCountToUse = Number.isNaN(parsedCount) || newCount === '' ? null : parsedCount

        return isObservationToUpdate ? { ...observation, count: newCountToUse } : observation
      })
    case 'updateSize':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId
        const { newSize } = action.payload

        const parsedSize = parseFloat(newSize)
        const newSizeToUse = Number.isNaN(parsedSize) || newSize === '' ? null : parsedSize

        return isObservationToUpdate ? { ...observation, size: newSizeToUse } : observation
      })
    case 'updateInvertName':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId

        return isObservationToUpdate
          ? {
              ...observation,
              invert_attribute: action.payload.newInvertAttribute,
            }
          : observation
      })
    case 'resetObservationSizes': {
      return state.map((observation) => ({ ...observation, size: '' }))
    }
    case 'updateNotes':
      return state.map((observation) => {
        const isObservationToUpdate = observation.id === action.payload.observationId

        return isObservationToUpdate
          ? { ...observation, notes: action.payload.newNotes }
          : observation
      })
    default:
      throw new Error("This action isn't supported by the observationReducer")
  }
}

export default beltInvertObservationReducer
