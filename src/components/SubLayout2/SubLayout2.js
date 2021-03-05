// import { useRouteMatch } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import { Column, Row } from '../generic/positioning'
import ProjectName from '../ProjectName'

/**
 * Describe your component
 */

const SubLayout2Container = styled(Column)`
  height: 100%;
`

const SubLayout2ContentWrapper = styled(Row)`
  height: 100%;
`

const SubLayout2 = ({ sidebar, lowerRight, upperRight }) => {
  return (
    <>
      <SubLayout2Container>
        <ProjectName />
        <SubLayout2ContentWrapper>
          <Column>{sidebar}</Column>
          <Column>
            <div>{upperRight}</div>
            <div>{lowerRight}</div>
          </Column>
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
