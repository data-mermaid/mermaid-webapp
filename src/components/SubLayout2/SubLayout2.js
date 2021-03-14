import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import { Column, Row } from '../generic/positioning'
import NavMenu from '../NavMenu'
import ProjectName from '../ProjectName'

const SubLayout2Container = styled(Column)`
  height: 100%;
`

const LayoutMainSection = styled.div`
  width: 100%;
  padding: ${(props) => props.theme.spacing.medium};
`

const SubLayout2 = ({ lowerRight, upperRight }) => {
  // I don't see the point of passing pageTitle to every components using this layout, leave as constant for now.
  const pageTitle = 'Project Name Placeholder'

  return (
    <>
      <SubLayout2Container>
        <ProjectName pageTitle={pageTitle} />
        <Row>
          <Column>
            <NavMenu />
          </Column>

          <LayoutMainSection>
            <div>{upperRight}</div>
            <div>{lowerRight}</div>
          </LayoutMainSection>
        </Row>
      </SubLayout2Container>
    </>
  )
}

SubLayout2.propTypes = {
  lowerRight: PropTypes.node.isRequired,
  upperRight: PropTypes.node.isRequired,
}

export default SubLayout2
