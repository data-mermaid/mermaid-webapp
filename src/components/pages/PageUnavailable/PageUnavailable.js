import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Column } from '../../generic/positioning'
import theme from '../../../theme'

const PageUnavailableContainer = styled(Column)`
  padding-left: ${theme.spacing.large};
  text-align: ${(props) => props.align};
`

const PageUnavailable = ({ mainText, subText, align }) => {
  return (
    <PageUnavailableContainer align={align}>
      <h3>{mainText}</h3>
      <p>{subText}</p>
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
  align: 'start',
}

export default PageUnavailable
