import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components/macro'
import theme from '../../../../theme'
import { Column } from '../../../generic/positioning'
import {
  mediaQueryTabletLandscapeOnly,
  mediaQueryPhoneOnly,
} from '../../../../library/styling/mediaQueries'
import LoadingIndicator from '../../../LoadingIndicator/LoadingIndicator'
import NavMenu from '../../../NavMenu'
import ProjectName from '../../../ProjectName'

const contentPadding = theme.spacing.xsmall
const MainContentPageLayout = styled('div')`
  display: grid;
  grid-template-rows: auto 1fr;
  height: calc(100% - ${theme.spacing.headerHeight});
  margin-top: ${theme.spacing.headerHeight};
  background: ${theme.color.white};
`
const ContentWrapper = styled('div')`
  background: ${theme.color.backgroundColor};
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
  margin-bottom: 0px;
`
const Content = styled('div')`
  ${contentStyles};
  margin-top: 0px;
`

const ContentPageLayout = ({ content, toolbar, isLoading }) => {
  // I don't see the point of passing pageTitle to every components using this layout, leave as constant for now.
  const pageTitle = 'Project Name Placeholder'

  return (
    <>
      <MainContentPageLayout>
        <ProjectName pageTitle={pageTitle} />

        <NavAndContentLayout>
          <Column>
            <NavMenu />
          </Column>
          <ContentWrapper>
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <>
                <ContentToolbar>{toolbar}</ContentToolbar>
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
  isLoading: PropTypes.bool,
  toolbar: PropTypes.node.isRequired,
}

ContentPageLayout.defaultProps = {
  isLoading: false,
}

export default ContentPageLayout
