import styled, { css } from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import theme from '../../theme'
import {
  mediaQueryPhoneOnly,
  hoverState,
  mediaQueryTabletLandscapeOnly,
} from '../../library/styling/mediaQueries'

export const ButtonGroups = styled('div')`
  padding: ${theme.spacing.medium};
  display: grid;
  grid-template-columns: auto auto auto auto 1fr;
  align-items: center;
  gap: ${theme.spacing.small};
  @media (hover: none) {
    a {
      display: none;
    }
  }
  ${mediaQueryTabletLandscapeOnly(css`
    a {
      display: none;
    }
  `)}
`

export const CardWrapper = styled('div')`
  margin: ${theme.spacing.xlarge} auto 0 auto;
  width: ${theme.spacing.width};
  max-width: ${theme.spacing.maxWidth};
  background: ${theme.color.white};
  cursor: pointer;
  ${hoverState(css`
    background: ${theme.color.tableRowHover};
  `)}
  }
  ${mediaQueryTabletLandscapeOnly(css`
    width: 98%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  `)}
`

export const ProjectCardHeader = styled('div')`
  display: grid;
  grid-template-columns: 2fr 1fr;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  ${theme.typography.noWordBreak};
  padding: ${theme.spacing.xlarge};
  ${mediaQueryPhoneOnly(css`
    font-size: ${theme.typography.defaultFontSize};
    padding: ${theme.spacing.small};
  `)}
  h2 {
    margin: 0;
  }
  label {
    margin-left: 10px;
  }
`

export const ProjectCardHeaderRightSection = styled(`div`)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
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

export const SummaryCardGroup = styled('div')`
  padding: ${theme.spacing.medium};
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
`

const linkStyles = css`
  text-decoration: none;
  margin: 10px;
  height: fit-content;
  background-color: #f3f2f7;
`

export const SummaryCard = styled(NavLink)`
  ${linkStyles}
  ${hoverState(css`
    background-color: ${theme.color.secondaryHover};
  `)}
  &:active {
    background-color: ${theme.color.secondaryActive};
  }
`

export const OfflineSummaryCard = styled('div')`
  ${linkStyles}
  cursor: not-allowed;
  color: ${theme.color.disabledText};
`

export const SummaryTitle = styled('div')`
  text-align: center;
  padding: ${theme.spacing.buttonPadding};
  background-color: ${theme.color.secondaryColor};
  color: ${(props) =>
    props.isDisabled ? theme.color.secondaryDisabledColor : theme.color.secondaryText};
`

export const SubCardContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 10.6rem;
  div {
    display: flex;
    font-size: 3.2rem;
    font-weight: bold;
    margin: ${theme.spacing.large};
    align-items: center;
    svg {
      width: ${theme.typography.xLargeIconSize};
      height: ${theme.typography.xLargeIconSize};
      margin-right: 10px;
    }
  }
`

export const OfflineSubCardContent = styled('div')`
  display: grid;
  min-height: 10.6rem;
  justify-items: center;
`

export const OfflineMessage = styled('p')`
  font-size: larger;
  font-style: italic;
  color: ${theme.color.secondaryColor};
`

export const SubCardTitle = styled('span')`
  ${theme.typography.upperCase};
  margin: ${theme.spacing.small};
  font-size: ${theme.typography.smallFontSize};
`

export const SubCardGroupContent = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
`

export const OfflineSubCardGroupContent = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  justify-items: center;
  min-height: 10.6rem;
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
    font-size: 1.5rem;
  }
`

export const ActiveCollectRecordsCount = styled.strong`
  background: ${theme.color.callout};
  border-radius: 100%;
  border: solid 1px ${theme.color.white};
  width: ${theme.typography.xLargeIconSize};
  height: ${theme.typography.xLargeIconSize};
  color: ${theme.color.white};
  display: grid;
  margin: 0.25rem 0.5rem;
  place-items: center;
  font-size: 2.4rem;
`
