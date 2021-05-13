import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components/macro'
import theme from '../../../theme'
import { hoverState } from '../../../library/styling/mediaQueries'
import HideShow, { DropdownContainer } from '../HideShow'
import { ButtonSecondary } from '../buttons'
import { IconDown } from '../../icons'

const StyledDropdownContainer = styled(DropdownContainer)`
  background-color: ${theme.color.white};
  border: solid 1px ${theme.color.border};
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  div,
  p {
    display: block;
    padding: ${theme.spacing.small} ${theme.spacing.xsmall};
    margin: 0;
    font-weight: 700;
    white-space: nowrap;
  }
  button {
    width: 100%;
    margin: 0;
    white-space: nowrap;
  }
  a {
    display: block;
    font-weight: normal;
    text-decoration: none;
    padding: ${theme.spacing.xsmall} ${theme.spacing.small};
    ${hoverState(css`
      background: ${theme.color.secondaryHover};
    `)}
    &:active {
      background: ${theme.color.secondaryActive};
    }
  }
`

const ButtonSecondaryDropdown = ({ children, label }) => {
  return (
    <HideShow
      button={
        <ButtonSecondary>
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
}

export default ButtonSecondaryDropdown
