import React from 'react'

import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

import language from '../../language'
import theme from '../../theme'
import { H2, P } from '../generic/text'

const CenterCenter = styled('div')`
  display: flex;
  height: calc(100% - ${theme.spacing.headerHeight});
  margin-top: ${theme.spacing.headerHeight};
  justify-content: center;
  align-items: center;
`

const UserDoesntHaveProjectAccess = () => {
  const { projectName } = useParams()

  return (
    <CenterCenter>
      <div>
        <H2>{language.pages.userDoesntHaveProjectAccess.title}</H2>
        <P>{language.pages.userDoesntHaveProjectAccess.getSubtitle(projectName)}</P>
        <Link to="/projects"> {language.pages.userDoesntHaveProjectAccess.homepageLink}</Link>
      </div>
    </CenterCenter>
  )
}

export default UserDoesntHaveProjectAccess
