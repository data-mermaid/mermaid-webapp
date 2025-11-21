import React from 'react'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components'
import language from '../../../language'
import theme from '../../../theme'

const PageNotFoundContainer = styled('div')`
  display: grid;
  place-items: center;
  padding: ${theme.spacing.medium};
  height: 100vh;
`

const PageNotFound = () => {
  return (
    <PageNotFoundContainer>
      <div>
        <h1>{language.error.pageNotFound}</h1>
        <p>{language.error.pageNotFoundRecovery}</p>
        <Link to="/">{language.error.homePageNavigation}</Link>
      </div>
    </PageNotFoundContainer>
  )
}

export default PageNotFound
