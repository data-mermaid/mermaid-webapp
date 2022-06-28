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
