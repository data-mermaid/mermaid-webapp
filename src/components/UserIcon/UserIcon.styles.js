import { styled, css } from 'styled-components'

import { hoverState, mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'
import { IconUser } from '../icons'
import theme from '../../theme'

export const UserProfilePicture = styled.img`
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
  border-radius: 50%;
  ${hoverState(
    css`
      outline: solid 3px ${theme.color.callout};
    `,
  )};
  ${mediaQueryTabletLandscapeOnly(css`
    height: calc(${theme.spacing.headerHeight} - 15px);
    margin-top: 7px;
  `)}
`
export const UserCircle = styled.div`
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
  border-radius: 50%;
  text-align: center;
  line-height: ${theme.typography.largeIconSize};
  font-weight: bold;
  color: ${(props) => (props.$dark ? theme.color.white : theme.color.primaryColor)};
  letter-spacing: 0.1rem;
  background-color: ${(props) => (props.$dark ? theme.color.primaryColor : theme.color.white)};
  font-size: ${theme.typography.smallFontSize};
`
export const FallbackUserIcon = styled(IconUser)`
  color: ${(props) => (props.$dark ? theme.color.primaryColor : theme.color.white)};
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
`
