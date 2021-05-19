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
  name: PropTypes.string,
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

export const tableColumnPropType = PropTypes.shape({
  Header: PropTypes.string,
  accessor: PropTypes.string,
  sortType: PropTypes.func,
  align: PropTypes.string,
})

export const collectTableCellPropType = PropTypes.shape({
  method: PropTypes.string,
  site: PropTypes.string,
  management: PropTypes.string,
  sampleUnitNumber: PropTypes.string,
  size: PropTypes.string,
  depth: PropTypes.string,
  sampleDate: PropTypes.string,
  observers: PropTypes.string,
  status: PropTypes.string,
  synced: PropTypes.string,
})

export const siteTableCellPropType = PropTypes.shape({
  site: PropTypes.string,
  reefType: PropTypes.string,
  reefZone: PropTypes.string,
  exposure: PropTypes.string,
})
