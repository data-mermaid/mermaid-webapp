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

const PageNoData = ({ noDataText, noDataExtraText }) => {
  return (
    <PageNoDataContainer>
      <h3>{noDataText}</h3>
      <p>{noDataExtraText}</p>
    </PageNoDataContainer>
  )
}

PageNoData.propTypes = {
  noDataText: PropTypes.string,
  noDataExtraText: PropTypes.string,
}

PageNoData.defaultProps = {
  noDataText: 'No Data',
  noDataExtraText: '',
}

export default PageNoData
