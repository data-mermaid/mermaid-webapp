import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { Column } from '../../generic/positioning'
import theme from '../../../theme'

const PageUnavailableContainer = styled(Column)`
  padding-left: ${theme.spacing.large};
  text-align: ${(props) => props.align};
`

const PageUnavailable = ({
  mainText = 'No Data',
  subText = '',
  align = 'start',
  children = undefined,
}) => {
  if (children) {
    return <PageUnavailableContainer>{children}</PageUnavailableContainer>
  }

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
  children: PropTypes.node,
}
export default PageUnavailable
