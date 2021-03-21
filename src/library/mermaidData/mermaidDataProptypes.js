import PropTypes from 'prop-types'

export const projectsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string,
    countries: PropTypes.arrayOf(PropTypes.string),
    num_sites: PropTypes.number,
    updated_on: PropTypes.string,
  }),
)
export const sitePropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  reef_type: PropTypes.string,
  reef_zone: PropTypes.string,
  exposure: PropTypes.string,
})
export const collectRecordPropType = PropTypes.shape({
  method: PropTypes.string,
  site: PropTypes.string,
  management_regime: PropTypes.string,
  data: PropTypes.shape({
    protocol: PropTypes.string,
  }),
  depth: PropTypes.number,
})

export const managementRegimePropType = PropTypes.shape({
  name: PropTypes.string,
})

export const currentUserPropType = PropTypes.shape({
  id: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  full_name: PropTypes.string,
  email: PropTypes.string,
})
