import styled, { css } from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import theme from '../../theme'
import {
  mediaQueryPhoneOnly,
  hoverState,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'

export const CardWrapper = styled('div')`
  margin: ${theme.spacing.xlarge} auto 0 auto;
  width: ${theme.spacing.width};
  max-width: ${theme.spacing.maxWidth};
  background: ${theme.color.white};
  cursor: pointer;
  ${hoverState(css`
    outline: solid 2px ${theme.color.primaryBorder};
  `)}
  }
  ${mediaQueryTabletLandscapeOnly(css`
    width: 98%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  `)}
`
export const DateAndCountryLabel = styled('span')`
  opacity: 0.8;
  font-size: ${theme.typography.smallFontSize};
`
export const ProjectCardHeader = styled('div')`
  display: flex;
  padding: ${theme.spacing.medium};
  justify-content: space-between;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  ${theme.typography.noWordBreak};
  ${mediaQueryPhoneOnly(css`
    font-size: ${theme.typography.defaultFontSize};
    padding: ${theme.spacing.small};
    flex-direction: column;
  `)}
  h2 {
    margin: 0 0 ${theme.spacing.medium} 0;
    line-height: 1;
  }
  label {
    margin-left: ${theme.spacing.medium};
  }
`

export const ProjectCardHeaderButtonsAndDate = styled(`div`)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  ${mediaQueryPhoneOnly(css`
    align-items: flex-start;
  `)}
`

export const CheckBoxLabel = styled.label`
  display: inline-block;
  background: ${theme.color.secondaryColor};
  padding: ${theme.spacing.buttonPadding};
  justify-self: end;
  background: ${(props) =>
    props.disabled ? theme.color.secondaryDisabledColor : theme.color.secondaryColor};
  color: ${(props) => (props.disabled ? theme.color.primaryDisabledColor : theme.color.textColor)};
  ${hoverState(css`
    background: ${theme.color.secondaryHover};
  `)}
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
  }
`

const linkStyles = css`
  text-decoration: none;
  background-color: ${theme.color.grey2};
`

export const SummaryCardGroup = styled('div')`
  padding: ${theme.spacing.small};
  background: ${theme.color.grey3};
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.small};
`

export const SummaryCard = styled(NavLink)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
  ${linkStyles}
  ${hoverState(css`
    background-color: ${theme.color.white};
  `)}
  &:active {
    background-color: ${theme.color.secondaryActive};
  }
  ${mediaQueryTabletLandscapeOnly(css`
    &:last-child {
      display: none;
    }
  `)}
`

export const OfflineSummaryCard = styled('div')`
  ${linkStyles}
  cursor: not-allowed;
`

export const SummaryTitle = styled('h3')`
  text-align: center;
  display: none;
  margin: 0;
  font-weight: 400;
  padding: ${theme.spacing.buttonPadding};
  background-color: ${theme.color.grey1};
  color: ${(props) =>
    props.isDisabled ? theme.color.secondaryDisabledColor : theme.color.secondaryText};
`

export const SubCardContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  div {
    display: flex;
    margin: ${theme.spacing.large};
    align-items: center;
    svg {
      width: ${theme.typography.xLargeIconSize};
      height: ${theme.typography.xLargeIconSize};
    }
  }
`

export const OfflineSubCardContent = styled('div')`
  display: grid;
  justify-items: center;
`

export const OfflineMessage = styled('p')`
  font-size: larger;
  color: ${theme.color.secondaryColor};
`

export const SubCardTitle = styled('span')`
  ${theme.typography.upperCase};
  margin: ${theme.spacing.small};
  display: block;
  text-align: center;
  padding: ${theme.spacing.small};
  width: 100%;
`

export const SubCardGroupContent = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
`

export const OfflineSubCardGroupContent = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  justify-items: center;
  p {
    grid-column: 1 / 4;
    grid-row: 2;
  }
`

export const DataSharingPolicySubCardContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  div {
    display: flex;
    flex-direction: column;
  }
`

export const ActiveCollectRecordsCount = styled.strong`
  background: ${theme.color.callout};
  border-radius: 50%;
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
  color: ${theme.color.white};
  display: grid;
  place-items: center;
`
