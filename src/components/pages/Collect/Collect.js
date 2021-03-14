import { Link, NavLink } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'

import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import SubLayout2 from '../../SubLayout2'
import { mermaidDataPropType } from '../../../library/mermaidData/useMermaidData'
import { H3 } from '../../generic/text'
import { Column, RowSpaceBetween } from '../../generic/positioning'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import { IconPlus } from '../../icons'

/**
 * Project Collect Page
 */
const CustomNavLink = styled(NavLink)`
  padding: ${(props) => props.theme.spacing.xsmall};
`
const AddSampleUnitDropdown = () => {
  const currentProjectPath = useCurrentProjectPath()

  const label = (
    <>
      <IconPlus /> Add Sample Unit
    </>
  )

  return (
    <ButtonSecondaryDropdown label={label}>
      <Column as="nav">
        <CustomNavLink to={`${currentProjectPath}/collecting/fishbelt`}>
          Fish Belt
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthiclit`}>
          Benthic LIT
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/benthicpit`}>
          Benthic PIT
        </CustomNavLink>
        <CustomNavLink
          to={`${currentProjectPath}/collecting/habitatcomplexity`}
        >
          Habitat Complexity
        </CustomNavLink>
        <CustomNavLink to={`${currentProjectPath}/collecting/bleaching`}>
          Bleaching
        </CustomNavLink>
      </Column>
    </ButtonSecondaryDropdown>
  )
}
const TopBar = () => (
  <>
    <H3>Collect Records</H3>
    <RowSpaceBetween>
      <div>Future filter</div> <AddSampleUnitDropdown />
    </RowSpaceBetween>
  </>
)

const CollectRecordList = ({ mermaidData }) => {
  const currentProjectPath = useCurrentProjectPath()
  const { collectRecords } = mermaidData

  return (
    <>
      {collectRecords.map(({ id, method, data }) => (
        <div key={id}>
          <Link to={`${currentProjectPath}/collecting/${data.protocol}/${id}`}>
            {method}
          </Link>
        </div>
      ))}
    </>
  )
}

CollectRecordList.propTypes = {
  mermaidData: mermaidDataPropType.isRequired,
}

const Collect = ({ mermaidData }) => {
  return (
    <SubLayout2
      lowerRight={<CollectRecordList mermaidData={mermaidData} />}
      upperRight={<TopBar />}
    />
  )
}

Collect.propTypes = {
  mermaidData: mermaidDataPropType.isRequired,
}

export default Collect
