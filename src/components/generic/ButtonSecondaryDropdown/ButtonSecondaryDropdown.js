import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import HideShow from '../HideShow'
import { ButtonSecondary } from '../buttons'
import { IconDown } from '../../icons'

const CustomButtonSecondary = styled(ButtonSecondary)`
  padding: ${(props) => props.theme.spacing.xsmall};
`
const DropdownContainer = styled.div`
  padding: ${(props) => props.theme.spacing.small};
  background-color: ${(props) => props.theme.color.backgroundColor};
  border: solid thin ${(props) => props.theme.color.primaryBorder};
`

const ButtonSecondaryDropdown = ({ children, label }) => {
  return (
    <HideShow
      button={
        <CustomButtonSecondary>
          {label} <IconDown />
        </CustomButtonSecondary>
      }
      contents={<DropdownContainer>{children}</DropdownContainer>}
    />
  )
}

ButtonSecondaryDropdown.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

export default ButtonSecondaryDropdown
