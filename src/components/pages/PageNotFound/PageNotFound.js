import React from 'react'
import styled from 'styled-components/macro'
import { H1 } from '../../generic/text'
import { Column } from '../../generic/positioning'
import { NavLinkThatLooksLikeButton } from '../../generic/links'

const PageNotFoundContainer = styled(Column)`
  align-items: center;
`

const NavLinkThatLooksLikeButtonStyle = styled(NavLinkThatLooksLikeButton)`
  display: flex;
  justify-content: center;
  width: 200px;
`

const PageNotFound = () => {
  return (
    <PageNotFoundContainer>
      <H1>Sorry, Page Not Found!</H1>
      <NavLinkThatLooksLikeButtonStyle to="/">
        Back to home
      </NavLinkThatLooksLikeButtonStyle>
    </PageNotFoundContainer>
  )
}

export default PageNotFound
