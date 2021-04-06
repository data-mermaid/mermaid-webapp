import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'

import { Column } from '../../../generic/positioning'
import LoadingIndicator from '../../../LoadingIndicator/LoadingIndicator'
import NavMenu from '../../../NavMenu'
import ProjectName from '../../../ProjectName'
import theme from '../../../../theme'

const MainContentPageLayout = styled('div')`
  display: grid;
  grid-template-rows: auto 1fr;
  height: calc(100% - ${theme.spacing.headerHeight});
  margin-top: ${theme.spacing.headerHeight};
  background: ${theme.color.white};
`
const NavAndContentLayout = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100%;
`
const ContentWrapper = styled('div')`
  background: ${theme.color.backgroundColor};
`
const ContentToolbar = styled('div')`
  margin: ${theme.spacing.small};
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  background: ${theme.color.white};
  position: sticky;
  top: ${theme.spacing.headerHeight};
  border-bottom: solid ${theme.spacing.borderMedium}
    ${theme.color.backgroundColor};
  margin-bottom: 0px;
`
const Content = styled('div')`
  margin: ${theme.spacing.small};
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  background: ${theme.color.white};
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
