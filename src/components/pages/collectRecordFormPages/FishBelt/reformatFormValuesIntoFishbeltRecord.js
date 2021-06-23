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

  return {
    ...collectRecordBeingEdited,
    data: {
      fishbelt_transect: {
        depth,
        label,
        len_surveyed,
        number,
        reef_slope,
        sample_time,
        size_bin,
        width,
      },
      sample_event: {
        management,
        notes,
        sample_date,
        site,
      },
      obs_belt_fishes: observationsValues,
    },
  }
}
