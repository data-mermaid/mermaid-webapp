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
const DisabledCustomNavLink = styled(CustomNavLink)`
  color: ${theme.color.disabledColor};
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
        <CustomNavLink to={`${currentProjectPath}/collecting/benthicpqt`}>
          Benthic Photo Quadrat
        </CustomNavLink>
        <DisabledCustomNavLink as="span">Benthic LIT</DisabledCustomNavLink>
        <DisabledCustomNavLink as="span">Benthic PIT</DisabledCustomNavLink>
        <DisabledCustomNavLink as="span">Habitat Complexity</DisabledCustomNavLink>
        <DisabledCustomNavLink as="span">Bleaching</DisabledCustomNavLink>
      </Column>
    </StyledButtonSecondaryDropdown>
  )
}

export default AddSampleUnitButton
