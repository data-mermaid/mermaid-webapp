import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components/macro'
import theme from '../../theme'
import { Column } from '../generic/positioning'
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'
import NavMenu from '../NavMenu'
import ProjectName from '../ProjectName'

const SubLayout2Container = styled('div')`
  display: grid;
  grid-template-rows: auto 1fr;
  height: calc(100% - ${theme.spacing.headerHeight});
  margin-top: ${theme.spacing.headerHeight};
  background: ${theme.color.white};
`

const SubLayout2ContentWrapper = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100%;
`

const ContentWrapper = styled('div')`
  background: ${theme.color.backgroundColor};
`
const contentStyles = css`
  margin: ${theme.spacing.small};
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  background: ${theme.color.white};
`
const ContentToolbar = styled('div')`
  ${contentStyles};
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

const SubLayout2 = ({ content, toolbar, isLoading }) => {
  // I don't see the point of passing pageTitle to every components using this layout, leave as constant for now.
  const pageTitle = 'Project Name Placeholder'

  return (
    <>
      <SubLayout2Container>
        <ProjectName pageTitle={pageTitle} />

        <SubLayout2ContentWrapper>
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
        </SubLayout2ContentWrapper>
      </SubLayout2Container>
    </>
  )
}

SubLayout2.propTypes = {
  content: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  toolbar: PropTypes.node.isRequired,
}

SubLayout2.defaultProps = {
  isLoading: false,
}

export default SubLayout2
