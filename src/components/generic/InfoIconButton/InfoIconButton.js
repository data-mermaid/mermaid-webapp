import PropTypes from 'prop-types'
import React from 'react'

import { IconButton } from '../buttons'
import { IconInfo } from '../../icons'

const ButtonSecondaryDropdown = ({ className }) => {
  return (
    <IconButton className={className}>
      <IconInfo aria-label="info" />
    </IconButton>
  )
}

ButtonSecondaryDropdown.propTypes = {
  className: PropTypes.string,
}
ButtonSecondaryDropdown.defaultProps = {
  className: undefined,
}

export default ButtonSecondaryDropdown
