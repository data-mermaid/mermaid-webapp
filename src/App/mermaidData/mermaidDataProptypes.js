import PropTypes from 'prop-types'

export const projectPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  countries: PropTypes.arrayOf(PropTypes.string),
  num_sites: PropTypes.number,
  updated_on: PropTypes.string,
})

export const projectsPropType = PropTypes.arrayOf(projectPropType)
export const sitePropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  reef_type: PropTypes.string,
  reef_zone: PropTypes.string,
  exposure: PropTypes.string,
})

const _sampleEventPropType = PropTypes.shape({
  site: PropTypes.string,
  management: PropTypes.string,
  sample_date: PropTypes.string,
  notes: PropTypes.string,
})

export const fishBeltPropType = PropTypes.shape({
  id: PropTypes.string,
  data: PropTypes.shape({
    protocol: PropTypes.string,
    sample_event: _sampleEventPropType,
    fishbelt_transect: PropTypes.shape({
      depth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      len_surveyed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      reef_slope: PropTypes.string,
      sample_time: PropTypes.string,
      size_bin: PropTypes.string,
      width: PropTypes.string,
    }),
  }),
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

export const observersPropType = PropTypes.shape({
  id: PropTypes.string,
  updated_by: PropTypes.string,
  profile_name: PropTypes.string,
  is_collector: PropTypes.bool,
  is_admin: PropTypes.bool,
  created_on: PropTypes.string,
  updated_on: PropTypes.string,
  role: PropTypes.number,
  created_by: PropTypes.string,
  project: PropTypes.string,
  profile: PropTypes.string,
})
