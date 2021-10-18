import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import theme from '../../../theme'
import HideShow, { DropdownContainer } from '../HideShow'
import { ButtonSecondary } from '../buttons'
import { IconDown } from '../../icons'

const StyledDropdownContainer = styled(DropdownContainer)`
  background-color: ${theme.color.white};
  border: solid 1px ${theme.color.border};
`

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
