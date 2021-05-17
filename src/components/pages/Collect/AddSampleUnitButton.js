import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import { Column } from '../../generic/positioning'
import { IconPlus } from '../../icons'

const CustomNavLink = styled(NavLink)`
  padding: ${(props) => props.theme.spacing.xsmall};

  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      color: grey;
    `}
`

const TemporarySpanStyling = styled.span`
  color: grey;
`

const AddSampleUnitButton = () => {
  const currentProjectPath = useCurrentProjectPath()
  const label = (
    <>
      <IconPlus /> Add Sample Unit
    </>
  )

  return (
    <ButtonSecondaryDropdown label={label}>
      <Column as="nav" data-testid="new-sample-unit-nav">
        <CustomNavLink to={`${currentProjectPath}/collecting/fishbelt`}>
          Fish Belt
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthiclit`}>
          <TemporarySpanStyling>Benthic LIT</TemporarySpanStyling>
        </CustomNavLink>
        <CustomNavLink
          to={`${currentProjectPath}/collecting/benthicpit`}
          disabled
        >
          Benthic PIT
        </CustomNavLink>
        <CustomNavLink
          to={`${currentProjectPath}/collecting/habitatcomplexity`}
          disabled
        >
          Habitat Complexity
        </CustomNavLink>
        <CustomNavLink
          to={`${currentProjectPath}/collecting/bleaching`}
          disabled
        >
          Bleaching
        </CustomNavLink>
      </Column>
    </ButtonSecondaryDropdown>
  )
}

export default AddSampleUnitButton
