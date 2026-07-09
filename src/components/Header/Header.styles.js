import { styled, css, keyframes } from 'styled-components'
import { IconBell, IconOpenInNew, IconExcel, IconMenu } from '../icons'
import theme from '../../theme'
import { ButtonThatLooksLikeLink } from '../generic/buttons'
import { hoverState, mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'

export const StyledHeader = styled('header')`
  background-color: ${theme.color.headerColor};
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  color: ${theme.color.white};
  position: fixed;
  width: 100%;
  top: 0;
  z-index: ${theme.zIndex.header};
  height: ${theme.spacing.headerHeight};
`
export const UserButton = styled('button')`
  cursor: pointer;
  height: ${theme.spacing.headerHeight};
  width: ${theme.spacing.headerHeight};
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: none;
  border: none;
`
export const HeaderIconWrapper = styled('div')`
  margin-right: 0.3em;
`
export const LogoImg = styled('img')`
  height: calc(${theme.spacing.headerHeight} - 10px);
  margin: ${theme.spacing.small};
  ${mediaQueryTabletLandscapeOnly(css`
    height: calc(${theme.spacing.headerHeight} - 15px);
    margin-top: 7px;
  `)}
`
const linkStyles = css`
  color: ${theme.color.white};
  cursor: pointer;
  white-space: nowrap;
  height: ${theme.spacing.headerHeight};
  border-bottom: solid ${theme.spacing.borderLarge} transparent;
  text-decoration: none;
  position: relative;
  margin: 0 ${theme.spacing.small};
  display: inline-block;
  padding: 0;
  line-height: ${theme.spacing.headerHeight};
  ${hoverState(
    css`
      border-bottom: solid 3px ${theme.color.callout};
    `,
  )}
`

export const HeaderButtonThatLooksLikeLink = styled(ButtonThatLooksLikeLink)`
  ${linkStyles}
`

export const StyledNavLink = styled('a')`
  ${linkStyles}
  ${(props) =>
    props.$disabledLink &&
    css`
      color: ${theme.color.disabledText};
      pointer-events: none;
    `}
  display: flex;
`

export const UserMenu = styled('div')`
  position: absolute;
  top: ${theme.spacing.headerHeight};
  right: 0;
  background-color: ${theme.color.headerDropdownMenuBackground};
  color: ${theme.color.white};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: ${theme.spacing.medium};
`

export const LoggedInAs = styled('p')`
  color: inherit;
  white-space: nowrap;
  opacity: 0.7;
`
export const GlobalNav = styled('nav')`
  .desktop {
    display: flex;
  }
  .mobile {
    display: none;
  }
  ${mediaQueryTabletLandscapeOnly(css`
    .desktop {
      display: none;
    }
    .mobile {
      display: flex;
    }
  `)}
`

export const UserMenuButton = styled.button`
  ${linkStyles}
  border-width: 0 0 3px 0;
  background: none;
  display: inline-block;
`
const biggerIcons = css`
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
  top: 0.7rem;
  position: relative;
`
const mediumIcons = css`
  width: ${theme.typography.mediumIconSize};
  height: ${theme.typography.mediumIconSize};
  top: 0.5rem;
  position: relative;
`

export const MediumIconOpenInNew = styled(IconOpenInNew)`
  ${mediumIcons};
`
export const MediumIconExcel = styled(IconExcel)`
  ${mediumIcons};
`
const bellRing = keyframes`
  0%   { transform: rotate(20deg); }
  5%   { transform: rotate(-20deg); }
  10%  { transform: rotate(35deg); }
  15%  { transform: rotate(-35deg); }
  20%  { transform: rotate(20deg); }
  25%  { transform: rotate(-20deg); }
  30%  { transform: rotate(30deg); }
  35%  { transform: rotate(-30deg); }
  40%  { transform: rotate(20deg); }
  45%  { transform: rotate(-10deg); }
  50%  { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
`

export const BiggerIconBell = styled(IconBell)`
  ${biggerIcons}
`

export const BellWrapper = styled.span`
  position: relative;
  display: inline-flex;
  ${({ $animated }) =>
    $animated &&
    css`
      transform-origin: top center;
      animation: ${bellRing} 2.7s linear;
      animation-iteration-count: 1;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}
`
export const BiggerIconMenu = styled(IconMenu)`
  ${biggerIcons}
`
export const NotificationIndicator = styled.span`
  color: red;
  font-size: 4rem;
  position: absolute;
  top: 90%;
  left: -3px;
  line-height: 1rem;
  height: 1rem;
`
export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`
