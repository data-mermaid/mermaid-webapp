const updateObservationReducerValue = ({ state, propertyToUpdate, action }) => {
  return state.map((observation) => {
    const isObservationToUpdate = observation.id === action.payload.observationId
    const { newValue } = action.payload

    return isObservationToUpdate ? { ...observation, [propertyToUpdate]: newValue } : observation
  })
}

export { updateObservationReducerValue }
