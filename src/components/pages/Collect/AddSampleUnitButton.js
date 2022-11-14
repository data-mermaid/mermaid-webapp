import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'
import theme from '../../../theme'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import { Column } from '../../generic/positioning'
import { IconPlus } from '../../icons'

const CustomNavLink = styled(NavLink)`
  padding: ${theme.spacing.buttonPadding};
  text-decoration: none;
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
        <CustomNavLink to={`${currentProjectPath}/collecting/benthic-photo-quadrat`}>
          Benthic Photo Quadrat
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthicpit`}>
          Benthic PIT
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/habitatcomplexity`}>
          Habitat Complexity
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthiclit`}>
          Benthic LIT
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/bleaching`}>Bleaching</CustomNavLink>
      </Column>
    </StyledButtonSecondaryDropdown>
  )
}

export default AddSampleUnitButton
