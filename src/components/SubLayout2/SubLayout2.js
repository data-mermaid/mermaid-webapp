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

const SubLayout2ContentStyle = styled(Column)`
  width: 80%;
  margin-left: 30px;
`

const SubLayout2 = ({ sidebar, lowerRight, upperRight }) => {
  return (
    <SubLayout2Container>
      <Column>{sidebar}</Column>

      <SubLayout2ContentStyle>
        <div>{upperRight}</div>
        <div>{lowerRight}</div>
      </SubLayout2ContentStyle>
    </SubLayout2Container>
  )
}

SubLayout2.propTypes = {
  sidebar: PropTypes.node.isRequired,
  lowerRight: PropTypes.node.isRequired,
  upperRight: PropTypes.node.isRequired,
}

export default SubLayout2
