import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Column } from '../../generic/positioning'
import theme from '../../../theme'

const PageNoDataContainer = styled(Column)`
  padding-left ${theme.spacing.large};
  text-align: center;
  p {
    font-size: ${theme.typography.smallFontSize};
    margin-top: 0
  }
`

const PageNoData = ({ mainText, subText }) => {
  return (
    <PageNoDataContainer>
      <h3>{mainText}</h3>
      <p>{subText}</p>
    </PageNoDataContainer>
  )
}

PageNoData.propTypes = {
  mainText: PropTypes.string,
  subText: PropTypes.string,
}

PageNoData.defaultProps = {
  mainText: 'No Data',
  subText: '',
}

export default PageNoData
