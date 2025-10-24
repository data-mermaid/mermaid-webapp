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
      <div>
        <h1>{t('error.page_not_found')}</h1>
        <p>{t('error.page_not_found_recovery')}</p>
        <Link to="/">{t('error.home_page_navigation')}</Link>
      </div>
    </PageNotFoundContainer>
  )
}

export default PageNotFound
