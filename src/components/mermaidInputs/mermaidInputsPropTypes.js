import PropTypes from 'prop-types'

export default {
  validationMessagesPropType: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
}
