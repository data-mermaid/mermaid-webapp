import PropTypes from 'prop-types'

export const subNavNodePropTypes = PropTypes.shape({
  name: PropTypes.string,
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string,
})

