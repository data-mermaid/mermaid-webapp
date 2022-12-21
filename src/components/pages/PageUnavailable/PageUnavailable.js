import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Column } from '../../generic/positioning'
import theme from '../../../theme'

const PageUnavailableContainer = styled(Column)`
  padding-left ${theme.spacing.large};
  text-align: ${(props) => props.align};
  div.bodyText {
    font-size: ${theme.typography.smallFontSize};
  }
`

const PageUnavailable = ({ mainText, subText, align }) => {
  return (
    <PageUnavailableContainer align={align}>
      <h3>{mainText}</h3>
      <div className="bodyText">{subText}</div>
    </PageUnavailableContainer>
  )
}

PageUnavailable.propTypes = {
  mainText: PropTypes.string,
  subText: PropTypes.oneOfType([PropTypes.number, PropTypes.node]),
  align: PropTypes.string,
}

PageUnavailable.defaultProps = {
  mainText: 'No Data',
  subText: '',
  align: 'left',
}

export default PageUnavailable
