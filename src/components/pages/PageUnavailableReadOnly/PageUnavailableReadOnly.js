import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import language from '../../../language'

const PageUnavailableReadOnlyContainer = styled('div')`
  display: grid;
  place-items: center;
`

const PageUnavailableReadOnly = () => {
  return (
    <PageUnavailableReadOnlyContainer>
      <div>
        <h2>{language.error.pageReadOnlyOffline}</h2>
        <Link to="/">{language.error.homePageNavigation}</Link>
      </div>
    </PageUnavailableReadOnlyContainer>
  )
}

PageUnavailableReadOnly.propTypes = {}

export default PageUnavailableReadOnly
