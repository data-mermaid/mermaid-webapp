import styled, { css } from 'styled-components/macro'
import PropTypes from 'prop-types'
import React from 'react'
import theme from '../../theme'
import { useOnlineStatus } from '../../library/onlineStatusContext'

import { Column } from '../generic/positioning'
import ErrorBoundary from '../ErrorBoundary'

const LayoutContainer = styled(Column)`
  & main {
    flex-grow: 2;
  }
  height: 100vh;
`
const OfflineIndicatorStyles = styled.div`
  ${(props) =>
    !props.isAppOnline &&
    css`
      border: solid ${theme.spacing.borderXLarge} ${theme.color.cautionColor};
      pointer-events: none;
      width: ${theme.spacing.fullViewportWidth};
      height: 100vh;
      z-index: 1000;
      position: fixed;
    `}
`

const Layout = ({ children, footer, header }) => {
  const { isAppOnline } = useOnlineStatus()

  return (
    <LayoutContainer>
      <ErrorBoundary>
        <OfflineIndicatorStyles isAppOnline={isAppOnline} />
      </ErrorBoundary>
      <ErrorBoundary>{header}</ErrorBoundary>
      <ErrorBoundary>
        <main>{children}</main>
      </ErrorBoundary>
      <ErrorBoundary>{footer}</ErrorBoundary>
    </LayoutContainer>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
}

export default Layout
