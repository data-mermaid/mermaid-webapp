import PropTypes from 'prop-types'

const _sampleEventPropType = PropTypes.shape({
  site: PropTypes.string,
  management: PropTypes.string,
  sample_date: PropTypes.string,
})

const _observerPropType = PropTypes.shape({
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
})

export const projectsPropType = PropTypes.arrayOf(projectPropType)

export const sitePropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  reef_type: PropTypes.string,
  reef_zone: PropTypes.string,
  exposure: PropTypes.string,
})

export const fishBeltPropType = PropTypes.shape({
  id: PropTypes.string,
  data: PropTypes.shape({
    protocol: PropTypes.string,
    sample_event: _sampleEventPropType,
    fishbelt_transect: _fishBeltTransectPropType,
    observers: PropTypes.arrayOf(_observerPropType),
  }),
})

export const benthicPhotoQuadratPropType = PropTypes.shape({
  id: PropTypes.string,
  data: PropTypes.shape({
    protocol: PropTypes.string,
    sample_event: _sampleEventPropType,
    quadrat_transect: _benthicPhotoQuadratTransectPropType,
    observers: PropTypes.arrayOf(_observerPropType),
    obs_benthic_photo_quadrats: PropTypes.arrayOf(_benthicPhotoQuadratObservationPropType),
  }),
})

export const submittedFishBeltPropType = PropTypes.shape({
  id: PropTypes.string,
  sample_event: _sampleEventPropType,
  fishbelt_transect: _fishBeltTransectPropType,
  observers: PropTypes.arrayOf(_observerPropType),
  obs_belt_fishes: PropTypes.arrayOf(_submittedFishBeltObservationPropType),
})

export const submittedBenthicPhotoQuadratPropType = PropTypes.shape({
  id: PropTypes.string,
  collect_record_id: PropTypes.string,
  sample_event: _sampleEventPropType,
  quadrat_transect: _benthicPhotoQuadratTransectPropType,
  observers: PropTypes.arrayOf(_observerPropType),
  obs_benthic_photo_quadrats: PropTypes.arrayOf(_submittedBenthicPhotoQuadratObservationPropType),
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

export const observersPropType = PropTypes.arrayOf(_observerPropType)

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

export const observersValidationPropType = PropTypes.arrayOf(
  PropTypes.shape({
    code: PropTypes.string,
    context: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    status: PropTypes.string,
    validation_id: PropTypes.string,
  }),
)
