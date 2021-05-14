import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../theme'

const CollectRecordsCountWrapper = styled.span`
  background: ${theme.color.cautionColor};
  border-radius: 50%;
  padding: 3px;
  color: ${theme.color.white};
  float: right;
  font-size: 1.4rem;
`

const CollectRecordsCount = () => {
  return <CollectRecordsCountWrapper>15</CollectRecordsCountWrapper>
}

CollectRecordsCount.propTypes = {}

export default CollectRecordsCount
