import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'
import theme from '../../theme'

export const SampleUnitNumber = styled('span')`
  white-space: nowrap;
  border-style: dotted;
  border-width: 0 0 ${theme.spacing.borderMedium} 0;
  position: relative;
  display: inline-grid;
  place-items: center;
  margin-left: 4px;
  cursor: pointer;
  &:hover span,
  &:focus span {
    transition: ${theme.timing.hoverTransition};
    display: block;
  }
`

export const SampleUnitPopupInfo = styled('span')`
  display: none;
  width: 100%;
  min-width: 35ch;
  max-width: 60ch;
  background-color: ${theme.color.calloutColor};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  bottom: 3rem;
  white-space: normal;
  z-index: 100;
  border: 2px solid ${theme.color.primaryColor};
`

export const EmptyCellPopup = styled(`div`)`
  display: none;
  width: 100%;
  min-width: 21ch;
  background-color: ${theme.color.calloutColor};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  bottom: 3.5rem;
  z-index: 100;
  border: 2px solid ${theme.color.primaryColor};
  text-align: left;
  left: -0.1rem;
  padding: 3px;
  & > h4 {
    margin: 0px;
  }
`

export const PopupText = styled('div')`
  display: flex;
  text-align: left;
  padding: 4px;
  font-size: ${theme.typography.smallFontSize};
  &.highlighted {
    text-align: center;
    background-color: hsl(50 80% 80% / 1);
  }
`
export const PopupLink = styled(Link)`
  display: flex;
  justify-content: center;
  padding: 4px;
  font-size: ${theme.typography.smallFontSize};
`
