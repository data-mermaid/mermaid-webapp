import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import theme from '../../../theme'
import HideShow from '../HideShow'
import { ButtonSecondary } from '../buttons'
import { IconDown } from '../../icons'

const CustomButtonSecondary = styled(ButtonSecondary)`
  padding: ${theme.spacing.xsmall};
`
const DropdownContainer = styled.div`
  padding: ${theme.spacing.small};
  background-color: ${theme.color.backgroundColor};
  border: solid thin ${theme.color.primaryBorder};
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
