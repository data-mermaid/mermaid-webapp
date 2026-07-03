import PropTypes from 'prop-types'
import React from 'react'
import HideShow from '../HideShow'
import { ButtonSecondary } from '../buttons'
import { IconDown } from '../../icons'
import { StyledDropdownContainer } from './ButtonSecondaryDropdown.styles'

const ButtonSecondaryDropdown = ({
  children,
  label,
  className = undefined,
  disabled = false,
  align = 'left',
  ...props
}) => {
  return (
    <HideShow
      button={
        <ButtonSecondary className={className} disabled={disabled} {...props}>
          {label} <IconDown />
        </ButtonSecondary>
      }
      contents={
        <StyledDropdownContainer $alignRight={align === 'right'}>
          {children}
        </StyledDropdownContainer>
      }
    />
  )
}

ButtonSecondaryDropdown.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right']),
}

export default ButtonSecondaryDropdown
