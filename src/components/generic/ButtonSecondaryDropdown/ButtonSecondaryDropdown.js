import PropTypes from 'prop-types'
import React from 'react'
import HideShow from '../HideShow'
import { ButtonSecondary } from '../buttons'
import { IconDown } from '../../icons'
import { StyledDropdownContainer } from './ButtonSecondaryDropdown.styles'

const ButtonSecondaryDropdown = ({ children, label, className }) => {
  return (
    <HideShow
      button={
        <ButtonSecondary className={className}>
          {label} <IconDown />
        </ButtonSecondary>
      }
      contents={<StyledDropdownContainer>{children}</StyledDropdownContainer>}
    />
  )
}

ButtonSecondaryDropdown.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
}
ButtonSecondaryDropdown.defaultProps = {
  className: undefined,
}

export default ButtonSecondaryDropdown
