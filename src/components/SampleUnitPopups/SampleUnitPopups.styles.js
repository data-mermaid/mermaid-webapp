import styled from 'styled-components'
import { Link } from 'react-router-dom'
import theme from '../../theme'

export const TooltipText = styled('p')`
  margin: ${theme.spacing.small} 0;
  text-align: center;
  font-weight: 700;
`
export const TooltipSampleUnitStatus = styled('p')`
  text-align: center;
  padding: ${theme.spacing.xsmall};
  font-size: ${theme.typography.smallFontSize};
`
export const SampleUnitNumber = styled('span')`
  white-space: nowrap;
  border-style: dotted;
  border-width: 0 0 ${theme.spacing.borderMedium} 0;
  position: relative;
  display: inline-grid;
  margin-left: 4px;
  cursor: pointer;
  transition: ${theme.timing.TooltipTransition};
  padding: 0 ${theme.spacing.xsmall};
  &:hover,
  &:focus {
    background: ${theme.color.primaryColor};
    color: white;
    span {
      cursor: auto;
      color: ${theme.color.textColor};
      transition: ${theme.timing.TooltipTransition};
      visibility: visible;
    }
  }
`

export const SampleUnitPopup = styled('span')`
  visibility: hidden;
  min-width: 35ch;
  max-width: 60ch;
  background-color: ${theme.color.calloutColor};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  bottom: 2.2rem;
  white-space: nowrap;
  z-index: 100;
  border: 2px solid ${theme.color.primaryColor};
  right: 0rem;
  transition: ${theme.timing.TooltipTransition};
  & > div {
    text-align: center;
    padding: 4px;
  }
`

export const EmptyCellPopup = styled(`div`)`
  display: none;
  min-width: 21ch;
  background-color: ${theme.color.calloutColor};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  bottom: 3.5rem;
  z-index: 100;
  border: 2px solid ${theme.color.primaryColor};
  white-space: nowrap;
  text-align: left;
  right: 0;
  padding: 3px;
  transition: ${theme.timing.TooltipTransition};
  & > h4 {
    margin: 0px;
  }
`

export const PopupLink = styled(Link)`
  text-align: center;
  display: block;
  margin: 1.2rem 0;
  padding: ${theme.spacing.xsmall};
  font-size: ${theme.typography.smallFontSize};
`
