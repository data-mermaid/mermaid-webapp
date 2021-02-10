import { useRouteMatch } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'

import { ButtonyNavLink, ButtonyNavLinkIcon } from '../generic/buttons'
import { Column, Row } from '../generic/positioning'
import { IconCollect, IconData, IconAdmin } from '../icons'

/**
 * Describe your component
 */

const SubLayout2Container = styled(Row)`
  height: 100%;
`

const SideBar = styled(Column)`
  width: 200px;
`
const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  border-bottom: thin solid lightgray;
  padding: ${(props) => props.theme.spacing.small};
  & > ${Row} {
    justify-content: space-between;
    padding-top: ${(props) => props.theme.spacing.small};
  }
`

const SubLayout2 = ({ lowerLeft, lowerRight, upperRight }) => {
  const { params } = useRouteMatch()
  const projectUrl = `/projects/${params.projectId}`

  return (
    <SubLayout2Container>
      <SideBar>
        <NavContainer>
          <ButtonyNavLink to={projectUrl}>Project Overview</ButtonyNavLink>
          <Row>
            <ButtonyNavLinkIcon
              to={`${projectUrl}/collecting`}
              aria-label="Collect"
            >
              <IconCollect />
            </ButtonyNavLinkIcon>
            <ButtonyNavLinkIcon to={`${projectUrl}/data`} aria-label="Data">
              <IconData />
            </ButtonyNavLinkIcon>
            <ButtonyNavLinkIcon to={`${projectUrl}/admin`} aria-label="Admin">
              <IconAdmin />
            </ButtonyNavLinkIcon>
          </Row>
        </NavContainer>
        <div>{lowerLeft}</div>
      </SideBar>

      <Column>
        <div>{upperRight}</div>
        <div>{lowerRight}</div>
      </Column>
    </SubLayout2Container>
  )
}

SubLayout2.propTypes = {
  lowerLeft: PropTypes.node.isRequired,
  lowerRight: PropTypes.node.isRequired,
  upperRight: PropTypes.node.isRequired,
}

export default SubLayout2
