import PropTypes from 'prop-types'

export const inputOptionPropType = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
})

export const inputOptionsPropTypes = PropTypes.arrayOf(inputOptionPropType)
