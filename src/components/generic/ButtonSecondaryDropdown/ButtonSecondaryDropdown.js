import React from 'react'
import PropTypes from 'prop-types'
import HideShow from '../HideShow'
import { ButtonSecondary } from '../buttons'
import { IconDown } from '../../icons'

const ButtonSecondaryDropdown = ({ children, label }) => {
  return (
    <HideShow
      button={
        <ButtonSecondary>
          {label} <IconDown />
        </ButtonSecondary>
      }
      contents={children}
    />
  )
}

ButtonSecondaryDropdown.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.oneOf([PropTypes.string, PropTypes.node]).isRequired,
}

export default ButtonSecondaryDropdown
