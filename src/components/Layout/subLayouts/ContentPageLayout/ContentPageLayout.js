import PropTypes from 'prop-types'
import React from 'react'
import { useParams } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { subNavNodePropTypes } from '../../../SubNavMenuRecordName/subNavNodePropTypes'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import {
  mediaQueryPhoneOnly,
  mediaQueryTabletLandscapeOnly,
} from '../../../../library/styling/mediaQueries'
import theme from '../../../../theme'
import { Column } from '../../../generic/positioning'
import LoadingIndicator from '../../../LoadingIndicator/LoadingIndicator'
import NavMenu from '../../../NavMenu'
import ProjectName from '../../../ProjectName'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import PageUnavailableReadOnly from '../../../pages/PageUnavailableReadOnly'

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
`

const ContentToolbar = styled('div')`
  ${contentStyles};
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border-bottom: solid ${theme.spacing.borderMedium} ${theme.color.backgroundColor};
  margin-bottom: 0;
  z-index: 100;
  ${(props) =>
    props.isToolbarSticky &&
    css`
      position: sticky;
      top: ${theme.spacing.headerHeight};
    `}
`

const Content = styled('div')`
  ${contentStyles};
  margin-top: 0px;
`

const ContentPageToolbarWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  ${mediaQueryPhoneOnly(css`
    flex-direction: column;
    align-items: start;
  `)}
  ${mediaQueryTabletLandscapeOnly(css`
    &,
    button {
      padding: ${theme.spacing.small};
    }
  `)}
`

const ContentPageLayout = ({
  content,
  toolbar,
  isPageContentLoading,
  isToolbarSticky,
  subNavNode,
}) => {
  const { isSyncInProgress } = useSyncStatus()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const { getProjectRole } = useCurrentUser()

  const isReadOnlyUser = getProjectRole(projectId) === 10
  const isReadOnlyAndOffline = !isAppOnline && isReadOnlyUser

  const mainContent = isReadOnlyAndOffline ? (
    <PageUnavailableReadOnly />
  ) : (
    <NavAndContentLayout>
      <Column>
        <NavMenu subNavNode={subNavNode} />
      </Column>
      <ContentWrapper>
        {isPageContentLoading || isSyncInProgress ? (
          <LoadingIndicator aria-label="project pages loading indicator" />
        ) : (
          <ContentWrapper>
            {toolbar && (
              <ContentToolbar isToolbarSticky={isToolbarSticky}>{toolbar}</ContentToolbar>
            )}
            <Content>{content}</Content>
          </ContentWrapper>
        )}
      </ContentWrapper>
    </NavAndContentLayout>
  )

  return (
    <>
      <MainContentPageLayout>
        <ProjectName />
        {mainContent}
      </MainContentPageLayout>
    </>
  )
}

ContentPageLayout.propTypes = {
  content: PropTypes.node.isRequired,
  isPageContentLoading: PropTypes.bool,
  toolbar: PropTypes.node,
  isToolbarSticky: PropTypes.bool,
  subNavNode: subNavNodePropTypes,
}

ContentPageLayout.defaultProps = {
  isPageContentLoading: false,
  isToolbarSticky: false,
  toolbar: undefined,
  subNavNode: null,
}

export default ContentPageLayout
export { ContentPageToolbarWrapper }
