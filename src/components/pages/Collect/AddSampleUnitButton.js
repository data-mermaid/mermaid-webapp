import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import { Column } from '../../generic/positioning'
import { IconPlus } from '../../icons'

const CustomNavLink = styled(NavLink)`
  padding: ${(props) => props.theme.spacing.xsmall};
`

const TemporarySpanStyling = styled.span`
  color: grey;
  padding: 0.5rem 1rem;
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
        <TemporarySpanStyling>Benthic LIT</TemporarySpanStyling>
        <TemporarySpanStyling>Benthic PIT</TemporarySpanStyling>
        <TemporarySpanStyling>Habitat Complexity</TemporarySpanStyling>
        <TemporarySpanStyling>Bleaching</TemporarySpanStyling>
      </Column>
    </ButtonSecondaryDropdown>
  )
}

export default AddSampleUnitButton
