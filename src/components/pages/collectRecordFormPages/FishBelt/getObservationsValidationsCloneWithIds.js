const getObservationValidationsCloneWithIds = ({ observationsFromApiWithIds, collectRecord }) => {
  const observationsValidationsWithoutIds =
    collectRecord?.validations?.results?.data?.obs_belt_fishes ?? []

  const observationsValidationsWithIds = observationsValidationsWithoutIds.map(
    (observationValidations, index) => {
      return {
        validations: observationValidations,
        observationUiId: observationsFromApiWithIds[index]?.uiId,
      }
    },
  )

  return observationsValidationsWithIds
}

export default getObservationValidationsCloneWithIds
