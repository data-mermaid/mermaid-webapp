import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Column } from '../../generic/positioning'
import theme from '../../../theme'

const PageUnavailableContainer = styled(Column)`
  padding-left: ${theme.spacing.large};
  text-align: ${(props) => props.align};
  /* testId is passed through but not used in styles */
`

const PageUnavailable = ({
  mainText = 'No Data',
  subText = '',
  align = 'start',
  children = undefined,
  testId = 'page-unavailable-main-text',
}) => {
  if (children) {
    return <PageUnavailableContainer data-testid={testId}>{children}</PageUnavailableContainer>
  }

  return (
    <PageUnavailableContainer align={align} data-testid={testId}>
      <h3>{mainText}</h3>
      <p>{subText}</p>
    </PageUnavailableContainer>
  )
}

PageUnavailable.propTypes = {
  mainText: PropTypes.string,
  subText: PropTypes.oneOfType([PropTypes.number, PropTypes.node]),
  align: PropTypes.string,
  children: PropTypes.node,
  testId: PropTypes.string,
}
export default PageUnavailable
