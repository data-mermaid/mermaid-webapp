import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { Column } from '../../generic/positioning'
import { hoverState } from '../../../library/styling/mediaQueries'
import { IconPlus } from '../../icons'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import theme from '../../../theme'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'

const CustomNavLink = styled(NavLink)`
  padding: ${theme.spacing.buttonPadding};
  text-decoration: none;
  ${hoverState(css`
    background: ${theme.color.secondaryHover};
  `)}
`
const StyledButtonSecondaryDropdown = styled(ButtonSecondaryDropdown)`
  white-space: nowrap;
`
const AddSampleUnitButton = () => {
  const currentProjectPath = useCurrentProjectPath()
  const label = (
    <>
      <IconPlus /> Add Sample Unit
    </>
  )

  return (
    <StyledButtonSecondaryDropdown label={label}>
      <Column as="nav" data-testid="new-sample-unit-nav">
        <CustomNavLink to={`${currentProjectPath}/collecting/fishbelt`}>Fish Belt</CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthicpit`}>
          Benthic PIT
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthiclit`}>
          Benthic LIT
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthicpqt`}>
          Benthic Photo Quadrat
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/bleachingqc`}>Bleaching</CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/habitatcomplexity`}>
          Habitat Complexity
        </CustomNavLink>
      </Column>
    </StyledButtonSecondaryDropdown>
  )
}

export default AddSampleUnitButton
