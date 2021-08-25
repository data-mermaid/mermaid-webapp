const reformatObservationsForFishBeltRecord = (observations) =>
  observations.map((observation) => {
    // eslint-disable-next-line no-unused-vars
    const { uiId, ...observationWithUiPropertiesRemoved } = observation

    return {
      ...observationWithUiPropertiesRemoved,
      size: observation.size === '' ? null : observation.size,
    }
  })

const removeEmptyProperty = (formValues) => {
  const result = []

  for (const [key, value] of Object.entries(formValues)) {
    if (value !== '') {
      result.push(key)
    }
  }

  return result.reduce((obj, item) => {
    return { ...obj, [item]: formValues[item] }
  }, {})
}

export const reformatFormValuesIntoFishBeltRecord = (
  formikValues,
  observationsValues,
  collectRecordBeingEdited,
) => {
  const {
    management,
    notes,
    sample_date,
    site,
    depth,
    label,
    len_surveyed,
    number,
    reef_slope,
    sample_time,
    size_bin,
    width,
  } = formikValues

  const fishBeltTransectData = removeEmptyProperty({
    depth,
    label,
    len_surveyed,
    number,
    reef_slope,
    sample_time,
    size_bin,
    width,
  })

  const sampleEventData = removeEmptyProperty({
    management,
    notes,
    sample_date,
    site,
  })

  return {
    ...collectRecordBeingEdited,
    data: {
      fishbelt_transect: fishBeltTransectData,
      sample_event: sampleEventData,
      obs_belt_fishes: reformatObservationsForFishBeltRecord(
        observationsValues,
      ),
    },
  }
}
