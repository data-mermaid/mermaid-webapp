export const reformatFormValuesIntoFishBeltRecord = (
  formikValues,
  observationsValues,
  collectRecordBeingEdited,
) => {
  const {
    depth,
    label,
    len_surveyed,
    management,
    notes,
    number,
    observers,
    reef_slope,
    sample_date,
    sample_time,
    site,
    size_bin,
    width,
    relative_depth,
    visibility,
    current,
    tide,
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
        relative_depth,
        visibility,
        current,
        tide,
      },
      sample_event: {
        management,
        notes,
        sample_date,
        site,
      },
      obs_belt_fishes: observationsValues,
      observers,
    },
  }
}
