import React from 'react'

import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Trans, useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  const subtitleContent = projectName ? (
    t('projects.known_project_access', { projectName })
  ) : (
    <Trans i18nKey="projects.unknown_project_access" components={{ code: <code /> }} />
  )

  return (
    <CenterCenter>
      <div>
        <H2>{t('projects.no_access_permission')}</H2>
        <P>{subtitleContent}</P>
        <Link to="/projects">{t('go_back_to_homepage')}</Link>
      </div>
    </CenterCenter>
  )
}

export default UserDoesntHaveProjectAccess
