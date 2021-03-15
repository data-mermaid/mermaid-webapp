import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import { Column } from '../generic/positioning'
import NavMenu from '../NavMenu'
import ProjectName from '../ProjectName'

const SubLayout2Container = styled('div')`
  display: grid;
  grid-template-rows: auto 1fr;
  height: calc(100% - ${(props) => props.theme.spacing.headerHeight});
  margin-top: ${(props) => props.theme.spacing.headerHeight};
`

const SubLayout2ContentWrapper = styled('div')`
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100%;
`

const ContentWrapper = styled('div')`
  background: ${(props) => props.theme.color.white};
`
const Content = styled('div')`
  padding: ${(props) => props.theme.spacing.medium};
`

const ContentToolbar = styled('div')`
  border-bottom: solid 1px ${(props) => props.theme.color.border};
  padding: ${(props) => props.theme.spacing.medium};
`
const SubLayout2 = ({ content, toolbar }) => {
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
            <ContentToolbar>{toolbar}</ContentToolbar>
            <Content>{content}</Content>
          </ContentWrapper>
        </SubLayout2ContentWrapper>
      </SubLayout2Container>
    </>
  )
}

SubLayout2.propTypes = {
  content: PropTypes.node.isRequired,
  toolbar: PropTypes.node.isRequired,
}

export default SubLayout2
