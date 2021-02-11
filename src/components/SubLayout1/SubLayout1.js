import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import { Column } from '../generic/positioning'

/**
 * Describe your component
 */
const SubLayout1Container = styled(Column)`
  height: 100%;
`
const TopRow = styled.div``
const BottomRow = styled.div`
  flex-grow: 2;
`

const SubLayout1 = ({ topRow, bottomRow }) => {
  return (
    <SubLayout1Container>
      <TopRow>{topRow}</TopRow>
      <BottomRow>{bottomRow}</BottomRow>
    </SubLayout1Container>
  )
}

SubLayout1.propTypes = {
  topRow: PropTypes.node.isRequired,
  bottomRow: PropTypes.node.isRequired,
}

export default SubLayout1
