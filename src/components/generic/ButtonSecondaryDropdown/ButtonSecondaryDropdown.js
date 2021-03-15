import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import HideShow from '../HideShow'
import { ButtonSecondary } from '../buttons'
import { IconDown } from '../../icons'

const CustomButtonSecondary = styled(ButtonSecondary)`
  padding: ${(props) => props.theme.spacing.xsmall};
`

const ButtonSecondaryDropdown = ({ children, label }) => {
  return (
    <HideShow
      button={
        <CustomButtonSecondary>
          {label} <IconDown />
        </CustomButtonSecondary>
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
