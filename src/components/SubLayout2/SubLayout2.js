import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'

import { NavLinkButtonish, NavLinkButtonishIcon } from '../generic/links'
import { Column, Row } from '../generic/positioning'
import { IconCollect, IconData, IconAdmin } from '../icons'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'

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
  const projectUrl = useCurrentProjectPath()

  return (
    <SubLayout2Container>
      <SideBar>
        <NavContainer>
          <NavLinkButtonish to={projectUrl}>Project Overview</NavLinkButtonish>
          <Row>
            <NavLinkButtonishIcon
              to={`${projectUrl}/collecting`}
              aria-label="Collect"
            >
              <IconCollect />
            </NavLinkButtonishIcon>
            <NavLinkButtonishIcon to={`${projectUrl}/data`} aria-label="Data">
              <IconData />
            </NavLinkButtonishIcon>
            <NavLinkButtonishIcon to={`${projectUrl}/admin`} aria-label="Admin">
              <IconAdmin />
            </NavLinkButtonishIcon>
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
