import React from 'react'
import styled from 'styled-components/macro'
import SubLayout1 from '../../SubLayout1'
import { RowSpaceBetween, RowRight, RowLeft } from '../../generic/positioning'
import { NavLinkButtonishIcon } from '../../generic/links'
import { ButtonSecondary } from '../../generic/buttons'
import { IconCollect, IconData, IconAdmin, IconCopy } from '../../icons'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
// import PropTypes from 'prop-types'

/**
 * Describe your component
 */

const GlobalWrapper = styled(RowSpaceBetween)`
  margin-bottom: 20px;
  border-bottom: 1px solid;
  padding: 10px 100px;
  align-items: center;
`

const ProjectInfoLeft = styled(RowLeft)`
  flex-direction: column;

  div:first-child {
    font-size: 3em;
  }
`

const ProjectInfoRight = styled(RowRight)`
  flex-direction: column;
  align-items: flex-end;
`

const ProjectInfo = () => {
  const projectUrl = useCurrentProjectPath()

  return (
    <GlobalWrapper>
      <ProjectInfoLeft>
        <div>project name</div>
        <RowLeft>
          <NavLinkButtonishIcon
            to={`${projectUrl}/collecting`}
            aria-label="Collect"
          >
            <IconCollect />
          </NavLinkButtonishIcon>
          <NavLinkButtonishIcon to={`${projectUrl}/data`} aria-label="Data">
            <IconData />
          </NavLinkButtonishIcon>
          <NavLinkButtonishIcon to={`${projectUrl}/admin`} aria-label="Admin">
            <IconAdmin />
          </NavLinkButtonishIcon>
          <ButtonSecondary>
            <IconCopy />
          </ButtonSecondary>
        </RowLeft>
      </ProjectInfoLeft>
      <ProjectInfoRight>
        <div>offline ready</div>
        <div>last updated</div>
        <div>date</div>
        <div>country - number of sites</div>
      </ProjectInfoRight>
    </GlobalWrapper>
  )
}

const Details = () => {
  return (
    <SubLayout1
      topRow={<ProjectInfo />}
      bottomRow={<>Single Project Details Placeholder</>}
    />
  )
}

Details.propTypes = {}

export default Details
