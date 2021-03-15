import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import { Column, Row } from '../generic/positioning'
import ProjectName from '../ProjectName'

const SubLayout2Container = styled(Column)`
  height: 100%;
`

const SubLayout2ContentWrapper = styled(Row)`
  height: 100%;
`

const RightSideContentWrapper = styled(Column)`
  width: 80%;
  margin: 20px 0 40px 60px;
`

const SubLayout2 = ({ sidebar, lowerRight, upperRight }) => {
  // I don't see the point of passing pageTitle to every components using this layout, leave as constant for now.
  const pageTitle = 'Project Name Placeholder'

  return (
    <>
      <SubLayout2Container>
        <ProjectName pageTitle={pageTitle} />
        <SubLayout2ContentWrapper>
          <Column>{sidebar}</Column>
          <RightSideContentWrapper>
            <div>{upperRight}</div>
            <div>{lowerRight}</div>
          </RightSideContentWrapper>
        </SubLayout2ContentWrapper>
      </SubLayout2Container>
    </>
  )
}

SubLayout2.propTypes = {
  sidebar: PropTypes.node.isRequired,
  lowerRight: PropTypes.node.isRequired,
  upperRight: PropTypes.node.isRequired,
}

export default SubLayout2
