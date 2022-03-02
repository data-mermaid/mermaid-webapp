import PropTypes from 'prop-types'

export default {
  validationMessagesPropType: PropTypes.arrayOf(
    PropTypes.shape({
      context: PropTypes.shape({
        len_surveyed_range: PropTypes.arrayOf(PropTypes.number),
        depth_range: PropTypes.arrayOf(PropTypes.number),
        time_range: PropTypes.arrayOf(PropTypes.string),
        observation_count_range: PropTypes.arrayOf(PropTypes.number),
        biomass_range: PropTypes.arrayOf(PropTypes.number),
        minimum_fish_count: PropTypes.number,
      }),
      code: PropTypes.node,
      name: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
}
