import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import theme from '../../../theme'

const PageNotFoundContainer = styled('div')`
  display: grid;
  place-items: center;
  padding: ${theme.spacing.medium};
  height: 100vh;
`

const PageNotFound = () => {
  const { t } = useTranslation()

  return (
    <PageNotFoundContainer>
      <div data-testid="page-not-found">
        <h1>{t('errors.not_found')}</h1>
        <p>{t('errors.confirm_correct_url')}</p>
        <Link to="/">{t('links.go_back_to_homepage')}</Link>
      </div>
    </PageNotFoundContainer>
  )
}

export default PageNotFound
