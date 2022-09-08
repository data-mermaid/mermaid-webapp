import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Column } from '../../generic/positioning'
import theme from '../../../theme'

const PageUnavailableContainer = styled(Column)`
  padding-left ${theme.spacing.large};
  text-align: center;
  p {
    font-size: ${theme.typography.smallFontSize};
    margin-top: 0
  }
`

const PageUnavailable = ({ mainText, subText }) => {
  return (
    <PageUnavailableContainer>
      <h3>{mainText}</h3>
      <p>{subText}</p>
    </PageUnavailableContainer>
  )
}

PageUnavailable.propTypes = {
  mainText: PropTypes.string,
  subText: PropTypes.string,
}

PageUnavailable.defaultProps = {
  mainText: 'No Data',
  subText: '',
}

export default PageUnavailable
