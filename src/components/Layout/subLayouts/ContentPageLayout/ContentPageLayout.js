import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components/macro'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import theme from '../../../../theme'
import { Column } from '../../../generic/positioning'
import LoadingIndicator from '../../../LoadingIndicator/LoadingIndicator'
import NavMenu from '../../../NavMenu'
import ProjectName from '../../../ProjectName'

const contentPadding = theme.spacing.xsmall
const MainContentPageLayout = styled('div')`
  display: grid;
  grid-template-rows: auto 1fr;
  height: calc(100% - ${theme.spacing.headerHeight});
  margin-top: ${theme.spacing.headerHeight};
`
const ContentWrapper = styled('div')`
  padding: ${contentPadding} 0 0 ${contentPadding};
`
const NavAndContentLayout = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100%;
`
const contentStyles = css`
  background: ${theme.color.white};
  width: ${theme.spacing.fullViewportWidth};
`
const ContentToolbar = styled('div')`
  ${contentStyles};
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  position: sticky;
  top: ${theme.spacing.headerHeight};
  border-bottom: solid ${theme.spacing.borderMedium}
    ${theme.color.backgroundColor};
  margin-bottom: 0;
  z-index: 100;
`
const Content = styled('div')`
  ${contentStyles};
  margin-top: 0px;
`

const ContentPageLayout = ({ content, toolbar, isPageContentLoading }) => {
  const { isSyncInProgress } = useSyncStatus()

  return (
    <>
      <MainContentPageLayout>
        <ProjectName />

        <NavAndContentLayout>
          <Column>
            <NavMenu />
          </Column>
          <ContentWrapper>
            {isPageContentLoading || isSyncInProgress ? (
              <LoadingIndicator aria-label="project pages loading indicator" />
            ) : (
              <>
                {toolbar && <ContentToolbar>{toolbar}</ContentToolbar>}
                <Content>{content}</Content>
              </>
            )}
          </ContentWrapper>
        </NavAndContentLayout>
      </MainContentPageLayout>
    </>
  )
}

ContentPageLayout.propTypes = {
  content: PropTypes.node.isRequired,
  isPageContentLoading: PropTypes.bool,
  toolbar: PropTypes.node,
}

ContentPageLayout.defaultProps = {
  isPageContentLoading: false,
  toolbar: undefined,
}

export default ContentPageLayout
