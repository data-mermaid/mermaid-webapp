import PropTypes from 'prop-types'

const _sampleEventPropType = PropTypes.shape({
  site: PropTypes.string,
  management: PropTypes.string,
  sample_date: PropTypes.string,
})

export const observerPropType = PropTypes.shape({
  id: PropTypes.string,
  updated_by: PropTypes.string,
  profile_name: PropTypes.string,
  created_on: PropTypes.string,
  updated_on: PropTypes.string,
  role: PropTypes.number,
  created_by: PropTypes.string,
  project: PropTypes.string,
  profile: PropTypes.string,
})

const _fishBeltTransectPropType = PropTypes.shape({
  depth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
  len_surveyed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  reef_slope: PropTypes.string,
  sample_time: PropTypes.string,
  size_bin: PropTypes.string,
  width: PropTypes.string,
  visibility: PropTypes.string,
  current: PropTypes.string,
  relative_depth: PropTypes.string,
  tide: PropTypes.string,
  notes: PropTypes.string,
})

const _benthicTransectPropType = PropTypes.shape({
  reef_slope: PropTypes.string,
  visibility: PropTypes.string,
  current: PropTypes.string,
  relative_depth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tide: PropTypes.string,
  notes: PropTypes.string,
})

const _benthicPhotoQuadratTransectPropType = PropTypes.shape({
  tide: PropTypes.string,
  depth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  current: PropTypes.string,
  reef_slope: PropTypes.string,
  visibility: PropTypes.string,
  sample_time: PropTypes.string,
  len_surveyed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  num_quadrats: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  quadrat_size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  quadrat_number_start: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  relative_depth: PropTypes.string,
  num_points_per_quadrat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  notes: PropTypes.string,
})

const _bleachingQuadratPropType = PropTypes.shape({
  id: PropTypes.string,
  depth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
  visibility: PropTypes.string,
  current: PropTypes.string,
  quadrat_size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  relative_depth: PropTypes.string,
  tide: PropTypes.string,
  notes: PropTypes.string,
})

const _benthicPhotoQuadratObservationPropType = PropTypes.shape({
  id: PropTypes.string,
  attribute: PropTypes.string,
  num_points: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  growth_form: PropTypes.string,
  quadrat_number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
})

export const _submittedFishBeltObservationPropType = PropTypes.shape({
  id: PropTypes.string,
  updated_by: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  created_on: PropTypes.string,
  updated_on: PropTypes.string,
  count: PropTypes.number,
  include: PropTypes.bool,
  notes: PropTypes.string,
  created_by: PropTypes.string,
  beltfish: PropTypes.string,
  fish_attribute: PropTypes.string,
})

export const _submittedBenthicPhotoQuadratObservationPropType = PropTypes.shape({
  attribute: PropTypes.string,
  benthic_photo_quadrat_transect: PropTypes.string,
  count: PropTypes.number,
  created_by: PropTypes.string,
  created_on: PropTypes.string,
  growth_form: PropTypes.string,
  id: PropTypes.string,
  notes: PropTypes.string,
  num_points: PropTypes.number,
  quadrat_number: PropTypes.number,
  updated_by: PropTypes.string,
  updated_on: PropTypes.string,
})

export const projectPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  countries: PropTypes.arrayOf(PropTypes.string),
  num_sites: PropTypes.number,
  updated_on: PropTypes.string,
  data_policy_beltfish: PropTypes.number,
  data_policy_benthiclit: PropTypes.number,
  data_policy_bleachingqc: PropTypes.number,
  includes_gfcr: PropTypes.bool,
})

export const projectsPropType = PropTypes.arrayOf(projectPropType)

export const sitePropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  reef_type: PropTypes.string,
  reef_zone: PropTypes.string,
  exposure: PropTypes.string,
})

export const copySitePropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  project: PropTypes.string,
  projectName: PropTypes.string,
  countryName: PropTypes.string,
  reefType: PropTypes.string,
  reefZone: PropTypes.string,
  exposure: PropTypes.string,
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
})

export const fishNameConstantsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string,
    biomass_constant_a: PropTypes.number,
    biomass_constant_b: PropTypes.number,
    biomass_constant_c: PropTypes.number,
  }),
)

export const fishBeltPropType = PropTypes.shape({
  id: PropTypes.string,
  data: PropTypes.shape({
    protocol: PropTypes.string,
    sample_event: _sampleEventPropType,
    fishbelt_transect: _fishBeltTransectPropType,
    observers: PropTypes.arrayOf(observerPropType),
  }),
})

export const benthicPhotoQuadratPropType = PropTypes.shape({
  id: PropTypes.string,
  data: PropTypes.shape({
    protocol: PropTypes.string,
    sample_event: _sampleEventPropType,
    quadrat_transect: _benthicPhotoQuadratTransectPropType,
    observers: PropTypes.arrayOf(observerPropType),
    obs_benthic_photo_quadrats: PropTypes.arrayOf(_benthicPhotoQuadratObservationPropType),
  }),
})

export const submittedFishBeltPropType = PropTypes.shape({
  id: PropTypes.string,
  sample_event: _sampleEventPropType,
  fishbelt_transect: _fishBeltTransectPropType,
  observers: PropTypes.arrayOf(observerPropType),
  obs_belt_fishes: PropTypes.arrayOf(_submittedFishBeltObservationPropType),
})

export const submittedBenthicPhotoQuadratPropType = PropTypes.shape({
  id: PropTypes.string,
  collect_record_id: PropTypes.string,
  sample_event: _sampleEventPropType,
  quadrat_transect: _benthicPhotoQuadratTransectPropType,
  observers: PropTypes.arrayOf(observerPropType),
  obs_benthic_photo_quadrats: PropTypes.arrayOf(_submittedBenthicPhotoQuadratObservationPropType),
})

export const benthicPitRecordPropType = PropTypes.shape({
  id: PropTypes.string,
  data: PropTypes.shape({
    interval_size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    inetrval_start: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    benthic_transect: _benthicTransectPropType,
    obs_benthic_pits: PropTypes.arrayOf(
      PropTypes.shape({
        attribute: PropTypes.string,
        growth_form: PropTypes.string,
        id: PropTypes.string,
        interval: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
  }),
})

export const habitatComplexityPropType = PropTypes.shape({
  id: PropTypes.string,
  data: PropTypes.shape({
    interval_size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    benthic_transect: _benthicTransectPropType,
    obs_habitat_complexities: PropTypes.arrayOf(
      PropTypes.shape({
        score: PropTypes.string,
        id: PropTypes.string,
        interval: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
  }),
})

export const benthicLitPropType = PropTypes.shape({
  id: PropTypes.string,
  interval_size: PropTypes.number,
  inetrval_start: PropTypes.number,
  benthic_transect: _benthicTransectPropType,
})
export const observationsColoniesBleachedPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string,
    attribute: PropTypes.string,
    count_100: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count_20: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count_50: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count_80: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count_dead: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count_normal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    count_pale: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    growth_form: PropTypes.string,
  }),
)

export const observationsQuadratBenthicPercentPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string,
    percent_algae: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    percent_hard: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    percent_soft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quadrat_number: PropTypes.number,
  }),
)

export const observationsPercentCoverProptype = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string,
    percent_algae: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    percent_hard: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    percent_soft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quadrat_number: PropTypes.number,
  }),
)

export const bleachingRecordPropType = PropTypes.shape({
  id: PropTypes.string,
  data: PropTypes.shape({
    quadrat_collection: _bleachingQuadratPropType,
    obs_quadrat_benthic_percent: observationsPercentCoverProptype,
    obs_colonies_bleached: observationsColoniesBleachedPropType,
  }),
})

export const submittedHabitatComplexityPropType = PropTypes.shape({
  id: PropTypes.string,
  interval_size: PropTypes.number,
  benthic_transect: _benthicTransectPropType,
})

export const managementRegimePropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  name_secondary: PropTypes.string,
  est_year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  parties: PropTypes.arrayOf(PropTypes.string),
  compliance: PropTypes.string,
  open_access: PropTypes.bool,
  no_take: PropTypes.bool,
  access_restriction: PropTypes.bool,
  periodic_closure: PropTypes.bool,
  size_limits: PropTypes.bool,
  gear_restriction: PropTypes.bool,
  species_restriction: PropTypes.bool,
  notes: PropTypes.string,
})

export const currentUserPropType = PropTypes.shape({
  id: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  full_name: PropTypes.string,
  email: PropTypes.string,
})

const _fishSizeBinPropType = PropTypes.shape({
  name: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      updated_on: PropTypes.string,
      val: PropTypes.string,
    }),
  ),
})
const _beltTransectWidthPropType = PropTypes.shape({
  name: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      updated_on: PropTypes.string,
      conditions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
          updated_on: PropTypes.string,
          size: PropTypes.number,
          operator: PropTypes.string,
          val: PropTypes.number,
        }),
      ),
    }),
  ),
})

const _reefSlopePropType = PropTypes.shape({
  name: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      updated_on: PropTypes.string,
      val: PropTypes.number,
    }),
  ),
})

export const choicesPropType = PropTypes.shape({
  fishsizebins: _fishSizeBinPropType,
  belttransectwidths: _beltTransectWidthPropType,
  reefslopes: _reefSlopePropType,
})

export const observersPropType = PropTypes.arrayOf(observerPropType)

export const observationsReducerPropType = (props, propName, componentName) => {
  if (!Array.isArray(props[propName])) {
    return new Error(
      `Failed prop type: Invalid prop ${propName} supplied to ${componentName}, expected an Array.`,
    )
  }
  if (!Array.isArray(props[propName][0])) {
    return new Error(
      `Failed prop type: Invalid property element ${propName}[0] supplied to ${componentName}, expected an Array.`,
    )
  }
  if (typeof props[propName][1] !== 'function') {
    return new Error(
      `Failed prop type: Invalid property element ${propName}[1] supplied to ${componentName}, expected an Function.`,
    )
  }

  return null
}

export const notificationsPropType = PropTypes.shape({
  count: PropTypes.number,
  next: PropTypes.string,
  previous: PropTypes.string,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      created_by: PropTypes.string,
      created_on: PropTypes.string,
      description: PropTypes.string,
      id: PropTypes.string,
      owner: PropTypes.string,
      status: PropTypes.string,
      title: PropTypes.string,
      updated_by: PropTypes.string,
      updated_on: PropTypes.string,
    }),
  ),
})

// Start of PropTypes for validation object
const validationObject = {
  code: PropTypes.string,
  context: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  fields: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  status: PropTypes.string,
  validation_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

const _depthValidationContextPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    depth_range: PropTypes.arrayOf(PropTypes.number),
  }),
])
const _lenSurveyedValidationContextPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    len_surveyed_range: PropTypes.arrayOf(PropTypes.number),
  }),
])
const _sampleTimeValidationContextPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    time_range: PropTypes.arrayOf(PropTypes.string),
  }),
])

const _validationsPropType = PropTypes.arrayOf(PropTypes.shape(validationObject))

const _depthValidationPropType = PropTypes.arrayOf(
  PropTypes.shape({ ...validationObject, context: _depthValidationContextPropType }),
)

const _lenSurveyedValidationPropType = PropTypes.arrayOf(
  PropTypes.shape({ ...validationObject, context: _lenSurveyedValidationContextPropType }),
)

const _sampleTimeValidationPropType = PropTypes.arrayOf(
  PropTypes.shape({ ...validationObject, context: _sampleTimeValidationContextPropType }),
)

export const observersValidationPropType = _validationsPropType

export const fishbeltValidationPropType = PropTypes.shape({
  depth: _depthValidationPropType,
  len_surveyed: _lenSurveyedValidationPropType,
  number: _validationsPropType,
  sample_time: _sampleTimeValidationPropType,
  size_bin: _validationsPropType,
  width: _validationsPropType,
})

export const benthicpqtValidationPropType = PropTypes.shape({
  depth: _depthValidationPropType,
  len_surveyed: _lenSurveyedValidationPropType,
  num_points_per_quadrat: _validationsPropType,
  num_quadrats: _validationsPropType,
  quadrat_size: _validationsPropType,
  number: _validationsPropType,
  sample_time: _sampleTimeValidationPropType,
})

export const benthicPitValidationPropType = PropTypes.shape({
  benthic_transect: PropTypes.shape({
    depth: _depthValidationPropType,
    len_surveyed: _lenSurveyedValidationPropType,
    number: _validationsPropType,
    sample_time: _sampleTimeValidationPropType,
  }),
  interval_start: _validationsPropType,
  interval_size: _validationsPropType,
  obs_benthic_pits: PropTypes.arrayOf(_validationsPropType),
})

export const habitatComplexityValidationPropType = PropTypes.shape({
  benthic_transect: PropTypes.shape({
    depth: _depthValidationPropType,
    len_surveyed: _lenSurveyedValidationPropType,
    number: _validationsPropType,
    sample_time: _sampleTimeValidationPropType,
  }),
  interval_size: _validationsPropType,
  obs_habitat_complexities: PropTypes.arrayOf(_validationsPropType),
})

// End of PropTypes for validation object

export const subNavNodePropTypes = PropTypes.shape({
  name: PropTypes.string,
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
})

export const mermaidRecordPropType = PropTypes.oneOfType([
  benthicLitPropType,
  benthicPhotoQuadratPropType,
  benthicPitRecordPropType,
  bleachingRecordPropType,
  fishBeltPropType,
  habitatComplexityPropType,
])

export const fishFamiliyPropType = PropTypes.shape({
  id: PropTypes.string,
  biomass_constant_a: PropTypes.number,
  biomass_constant_b: PropTypes.number,
  biomass_constant_c: PropTypes.number,
  name: PropTypes.string,
})

export const fishGeneraSingluarPropType = PropTypes.shape({
  id: PropTypes.string,
  biomass_constant_a: PropTypes.number,
  biomass_constant_b: PropTypes.number,
  biomass_constant_c: PropTypes.number,
  name: PropTypes.string,
  family: PropTypes.string,
})

export const fishSpeciesSingluarPropType = PropTypes.shape({
  id: PropTypes.string,
  biomass_constant_a: PropTypes.number,
  biomass_constant_b: PropTypes.number,
  biomass_constant_c: PropTypes.number,
  name: PropTypes.string,
  display_name: PropTypes.string,
  functional_group: PropTypes.string,
  trophic_group: PropTypes.string,
  max_length: PropTypes.number,
  max_length_type: PropTypes.string,
  group_size: PropTypes.string,
})

export const fishFamiliesPropType = PropTypes.arrayOf(fishFamiliyPropType)
export const fishGroupingsPropType = PropTypes.arrayOf(fishFamiliyPropType)
export const fishSpeciesPropType = PropTypes.arrayOf(fishSpeciesSingluarPropType)
export const fishGeneraPropType = PropTypes.arrayOf(fishGeneraSingluarPropType)

export const imageClassificationPointPropType = PropTypes.shape({
  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired,
})

export const imageClassificationResponsePropType = PropTypes.shape({
  image: PropTypes.string.isRequired,
  original_image_width: PropTypes.number.isRequired,
  original_image_height: PropTypes.number.isRequired,
  patch_size: PropTypes.number.isRequired,
  points: PropTypes.arrayOf(imageClassificationPointPropType).isRequired,
})
