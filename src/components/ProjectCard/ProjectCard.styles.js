import styled, { css } from 'styled-components'
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
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  ${hoverState(css`
    outline: ${(props) => props.disabled && `solid 2px ${theme.color.primaryBorder}`};
  `)}
  ${mediaQueryTabletLandscapeOnly(css`
    width: 98%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  `)}
`

export const ProjectCardHeader = styled('div')`
  display: flex;
  padding: ${theme.spacing.medium};
  justify-content: space-between;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  gap: ${theme.spacing.large};
  ${theme.typography.noWordBreak};
  ${mediaQueryPhoneOnly(css`
    font-size: ${theme.typography.defaultFontSize};
    padding: ${theme.spacing.small};
    flex-direction: column;
  `)}
  h2 {
    margin: 0 0 ${theme.spacing.medium} 0;
    line-height: 1.2;
  }
  label {
    margin-left: ${theme.spacing.medium};
  }
`

export const ProjectCardHeaderButtonsAndDate = styled('div')`
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
  background-color: ${theme.color.grey5};
`

export const SummaryCardGroup = styled('div')`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: ${theme.color.grey2};
  gap: ${theme.spacing.small};
  padding: ${theme.spacing.small};
  ${mediaQueryTabletLandscapeOnly(css`
    grid-template-columns: repeat(2, 1fr);
  `)}
`

const summaryCardStyles = css`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  width: 100%;
  ${mediaQueryTabletLandscapeOnly(css`
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5) {
      display: none;
    }
  `)}
`

export const SummaryCard = styled(NavLink)`
  ${summaryCardStyles}
  ${linkStyles}
  ${hoverState(css`
    background-color: ${theme.color.white};
  `)}
  &:active {
    background-color: ${theme.color.secondaryActive};
  }
`
export const DataSharingSummaryCard = styled(SummaryCard)`
  display: grid;
  &:before,
  &:after {
    content: '';
  }
  grid-template-columns: 1fr auto 1fr;
  padding-bottom: ${theme.spacing.medium};
  span {
    text-align: start;
    padding-inline: 0;
  }
`

export const DataSharingList = styled('ul')`
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: ${theme.typography.smallFontSize};
`
export const SubCardContent = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const SubCardIconAndCount = styled('div')`
  text-align: center;
  font-size: ${theme.typography.largeFontSize};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.small};
  padding: ${theme.spacing.medium};
  svg {
    width: ${theme.typography.largeIconSize};
    height: ${theme.typography.largeIconSize};
  }
`

export const SubCardTitle = styled('span')`
  ${theme.typography.upperCase};
  margin: ${theme.spacing.small} 0;
  display: block;
  text-align: center;
  padding: ${theme.spacing.small};
`

export const ActiveCollectRecordsCount = styled.strong`
  background: ${theme.color.callout};
  border-radius: 50%;
  display: inline-block;
  font-size: ${theme.typography.defaultFontSize};
  line-height: ${theme.typography.largeIconSize};
  width: ${theme.typography.largeIconSize};
  height: ${theme.typography.largeIconSize};
  color: ${theme.color.white};
`

export const OfflineSummaryCard = styled('div')`
  ${summaryCardStyles}
  cursor: not-allowed;
  background: ${theme.color.grey4};
  * {
    opacity: 0.4;
  }
`

export const OfflineOrReadOnlyContent = styled('span')`
  font-size: ${(props) =>
    props.smallFont ? theme.typography.smallFontSize : theme.typography.mediumFontSize};
  text-align: center;
  padding: 1rem;
`

export const ProjectTitleContainer = styled('div')`
  display: flex;
`

export const AdminPill = styled('div')`
  margin-left: 1em;
  margin-top: 0.2em;
  display: flex;
  align-items: center;
  border: solid 1px #ffffff8c;
  text-transform: uppercase;
  background: ${(props) => theme.color.getMessageColorBackground(props.type)};
  color: #ffffffde;
  padding: ${theme.spacing.xxsmall} ${theme.spacing.medium};
  border-radius: 5px;
  white-space: nowrap;
  font-size: smaller;
  height: 2em;
`
