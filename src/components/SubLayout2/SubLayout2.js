// import { useRouteMatch } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import { Column, Row } from '../generic/positioning'

/**
 * Describe your component
 */

const SubLayout2Container = styled(Row)`
  height: 100%;
`

const SideBar = styled(Column)`
  width: 260px;
`

const SubLayout2 = ({ lowerLeft, lowerRight, upperRight }) => {
  return (
    <SubLayout2Container>
      <SideBar>
        <div>{lowerLeft}</div>
      </SideBar>

      <Column>
        <div>{upperRight}</div>
        <div>{lowerRight}</div>
      </Column>
    </SubLayout2Container>
  )
}

SubLayout2.propTypes = {
  lowerLeft: PropTypes.node.isRequired,
  lowerRight: PropTypes.node.isRequired,
  upperRight: PropTypes.node.isRequired,
}

export default SubLayout2
