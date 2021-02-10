import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const ButtonPrimary = styled.button`
  background-color: blue;
`

export const ButtonSecondary = styled.button`
  background-color: lightgray;
`
export const ButtonCallout = styled.button`
  background-color: green;
`
export const ButtonCaution = styled.button`
  background-color: red;
`
export const ButtonyNavLink = styled(NavLink)`
  background-color: lightgray;
  border: solid thin grey;
`
export const ButtonyNavLinkIcon = styled(ButtonyNavLink)``
