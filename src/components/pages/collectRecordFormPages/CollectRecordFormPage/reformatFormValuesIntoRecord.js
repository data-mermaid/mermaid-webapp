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
        notes,
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
        sample_date,
        site,
      },
      obs_belt_fishes: observationsValues,
      observers,
    },
  }
}

export const reformatFormValuesIntoBenthicPQTRecord = (
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
    sample_date,
    sample_time,
    site,
    quadrat_number_start,
    quadrat_size,
    num_quadrats,
    num_points_per_quadrat,
    relative_depth,
    visibility,
    current,
    tide,
  } = formikValues

  return {
    ...collectRecordBeingEdited,
    data: {
      quadrat_transect: {
        depth,
        label,
        len_surveyed,
        number,
        sample_time,
        quadrat_number_start,
        quadrat_size,
        num_quadrats,
        num_points_per_quadrat,
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
      obs_benthic_photo_quadrats: observationsValues,
      observers,
    },
  }
}
