import React from 'react'

import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation, Trans } from 'react-i18next'

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
  const { t } = useTranslation()
  const { projectName } = useParams()

  return (
    <CenterCenter>
      <div>
        <H2>{t('user_access.no_permission_title')}</H2>
        <P>
          <Trans
            i18nKey="user_access.admin_can_add"
            values={{ projectName: projectName || 'unknown project name' }}
            components={{ code: <code /> }}
          />
        </P>
        <Link to="/projects"> {t('user_access.homepage_link')}</Link>
      </div>
    </CenterCenter>
  )
}

export default UserDoesntHaveProjectAccess
