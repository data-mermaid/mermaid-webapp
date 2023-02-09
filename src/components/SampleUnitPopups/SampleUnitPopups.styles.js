import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'
import theme from '../../theme'

export const SampleUnitNumber = styled('span')`
  white-space: nowrap;
  border-style: dotted;
  border-width: 0 0 ${theme.spacing.borderMedium} 0;
  position: relative;
  display: inline-grid;
  margin-left: 4px;
  cursor: pointer;
  &:hover span,
  &:focus span {
    transition: ${theme.timing.hoverTransition};
    display: block;
  }
`

export const SampleUnitPopup = styled('span')`
  display: none;
  min-width: 35ch;
  max-width: 60ch;
  background-color: ${theme.color.calloutColor};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  bottom: 3rem;
  white-space: normal;
  z-index: 100;
  border: 2px solid ${theme.color.primaryColor};
  right: -1rem;
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
  text-align: left;
  left: -0.1rem;
  padding: 3px;
  & > h4 {
    margin: 0px;
  }
`

export const PopupLink = styled(Link)`
  display: flex;
  padding: 4px;
  font-size: ${theme.typography.smallFontSize};
  justify-content: center;
`
