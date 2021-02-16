import React from 'react'
import styled from 'styled-components/macro'
import SubLayout1 from '../../SubLayout1'
import { RowSpaceBetween, RowLeft, Column } from '../../generic/positioning'
import { ButtonSecondary } from '../../generic/buttons'
import { H1 } from '../../generic/text'
import { IconCopy } from '../../icons'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import NavLinkButtonRow from '../../generic/NavLinkButtonRow'

/**
 * Describe your component
 */

const ProjectInfoWrapper = styled(RowSpaceBetween)`
  margin-bottom: 20px;
  border-bottom: 1px solid;
  padding: 10px 100px;
  align-items: center;
`

const ProjectInfoLeft = styled(Column)`
  div:first-child {
    font-size: 3em;
  }
`

const ProjectInfoRight = styled(Column)`
  align-items: flex-end;
`

const ProjectInfo = () => {
  const projectUrl = useCurrentProjectPath()

  return (
    <ProjectInfoWrapper>
      <ProjectInfoLeft>
        <H1>project name</H1>
        <RowLeft>
          <NavLinkButtonRow projectUrl={projectUrl} />
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
    </ProjectInfoWrapper>
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

export default Details
