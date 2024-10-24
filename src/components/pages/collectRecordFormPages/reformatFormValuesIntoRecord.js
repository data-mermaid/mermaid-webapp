export const reformatFormValuesIntoFishBeltRecord = ({
  formikValues,
  observationsTable1State,
  collectRecordBeingEdited,
}) => {
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
      obs_belt_fishes: observationsTable1State,
      observers,
    },
  }
}

export const reformatFormValuesIntoBenthicPQTRecord = ({
  collectRecordBeingEdited,
  formikValues,
  observationsTable1State,
  image_classification,
}) => {
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
        notes,
      },
      sample_event: {
        management,
        sample_date,
        site,
      },
      obs_benthic_photo_quadrats: observationsTable1State,
      observers,
      image_classification,
    },
  }
}

export const reformatFormValuesIntoBenthicPitRecord = ({
  formikValues,
  observationsTable1State,
  collectRecordBeingEdited,
}) => {
  const {
    current,
    depth,
    interval_size,
    interval_start,
    label,
    len_surveyed,
    management,
    notes,
    number,
    observers,
    reef_slope,
    relative_depth,
    sample_date,
    sample_time,
    site,
    tide,
    visibility,
  } = formikValues

  return {
    ...collectRecordBeingEdited,
    data: {
      benthic_transect: {
        current,
        depth,
        label,
        len_surveyed,
        notes,
        number,
        reef_slope,
        relative_depth,
        sample_time,
        tide,
        visibility,
      },
      sample_event: {
        management,
        sample_date,
        site,
      },
      interval_size,
      interval_start,
      obs_benthic_pits: observationsTable1State,
      observers,
    },
  }
}

export const reformatFormValuesIntoBenthicLitRecord = ({
  formikValues,
  observationsTable1State,
  collectRecordBeingEdited,
}) => {
  const {
    current,
    depth,
    label,
    len_surveyed,
    management,
    notes,
    number,
    observers,
    reef_slope,
    relative_depth,
    sample_date,
    sample_time,
    site,
    tide,
    visibility,
  } = formikValues

  return {
    ...collectRecordBeingEdited,
    data: {
      benthic_transect: {
        current,
        depth,
        label,
        len_surveyed,
        notes,
        number,
        reef_slope,
        relative_depth,
        sample_time,
        tide,
        visibility,
      },
      sample_event: {
        management,
        sample_date,
        site,
      },
      obs_benthic_lits: observationsTable1State,
      observers,
    },
  }
}

export const reformatFormValuesIntoBleachingRecord = ({
  formikValues,
  observationsTable1State,
  observationsTable2State,
  collectRecordBeingEdited,
}) => {
  const {
    current,
    depth,
    label,
    management,
    notes,
    number,
    observers,
    quadrat_size,
    relative_depth,
    sample_date,
    sample_time,
    site,
    tide,
    visibility,
  } = formikValues

  return {
    ...collectRecordBeingEdited,
    data: {
      quadrat_collection: {
        current,
        depth,
        label,
        notes,
        number,
        quadrat_size,
        relative_depth,
        sample_time,
        tide,
        visibility,
      },
      sample_event: {
        management,
        sample_date,
        site,
      },
      obs_colonies_bleached: observationsTable1State,
      obs_quadrat_benthic_percent: observationsTable2State,
      observers,
    },
  }
}

export const reformatFormValuesIntoHabitatComplexityRecord = ({
  formikValues,
  observationsTable1State,
  collectRecordBeingEdited,
}) => {
  const {
    current,
    depth,
    interval_size,
    label,
    len_surveyed,
    management,
    notes,
    number,
    observers,
    reef_slope,
    relative_depth,
    sample_date,
    sample_time,
    site,
    tide,
    visibility,
  } = formikValues

  return {
    ...collectRecordBeingEdited,
    data: {
      benthic_transect: {
        current,
        depth,
        label,
        len_surveyed,
        notes,
        number,
        reef_slope,
        relative_depth,
        sample_time,
        tide,
        visibility,
      },
      sample_event: {
        management,
        sample_date,
        site,
      },
      interval_size,
      obs_habitat_complexities: observationsTable1State,
      observers,
    },
  }
}
