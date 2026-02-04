import styled, { css } from 'styled-components'
import theme from '../../../theme'
import { hoverState, mediaQueryTabletLandscapeOnly } from '../../../library/styling/mediaQueries'
import {
  ButtonCaution,
  ButtonThatLooksLikeLink,
  ButtonSecondary,
  Button,
} from '../../generic/buttons'
import { TableOverflowWrapper, Tr, Td, GenericStickyTable } from '../../generic/Table/table'
import { inputTextareaSelectStyles } from '../../generic/form'

export const NewOptionButton = styled(ButtonThatLooksLikeLink)`
  ${hoverState(css`
    background-color: ${theme.color.primaryColor};
    color: ${theme.color.white};
  `)}
`

export const ObservationTr = styled(Tr)`
  border-width: 0 0 0 ${theme.spacing.xsmall};
  border-style: solid;
  border-color: ${(props) => theme.color.getBorderColor(props.messageType)};
`

export const InputAutocompleteContainer = styled.div`
  ${inputTextareaSelectStyles}
  display: flex;
  justify-content: space-between;
  padding: 0;
  border: none;
  background: transparent;
`

export const ButtonRemoveRow = styled(ButtonCaution)`
  display: none;
  padding: 0;
`

export const ButtonPopover = styled(Button)`
  display: none;
  background-color: inherit;

  & > svg {
    height: ${theme.typography.mediumIconSize};
    width: ${theme.typography.mediumIconSize};
  }
`
export const Popover = styled('div')`
  border: solid thin grey;

  position: absolute;
  bottom: 1.4rem;
  right: calc(${theme.typography.xLargeIconSize} + 2px);
  z-index: 10;
  background-color: ${theme.color.white};
`

export const StyledOverflowWrapper = styled(TableOverflowWrapper)`
  border: solid 1px ${theme.color.secondaryColor};
  height: 100%;
  overflow-y: visible;
`

export const StickyObservationTable = styled(GenericStickyTable)`
  thead tr:nth-child(1) th {
    position: sticky;
    top: calc(
      ${theme.spacing.headerHeight} + ${theme.spacing.toolbarHeight} + ${theme.spacing.small}
    );
    z-index: 4; /* Ensure the first row is above the second */
    background-color: white;
  }

  thead tr:nth-child(2) th {
    position: sticky;
    top: calc(
      ${theme.spacing.headerHeight} + ${theme.spacing.toolbarHeight} + ${theme.spacing.small} + 4rem
    ); /* Adjust for the height of the first row */
    z-index: 3; /* Ensure the second row is below the first */
    background-color: white;
  }

  tr {
    &:focus-within button,
    &:hover button {
      display: inline;
      cursor: pointer;
    }

    td {
      padding: 0rem;
      & > div {
        background: transparent;
        border: none;
        span {
          line-height: 1.6;
          background: rgba(255, 255, 255, 0.5);
        }
      }
      input:not([type='checkbox']),
      select {
        background: transparent;
        border: none;
        padding: 1px 3px;
        height: 4rem;
        ${hoverState(css`
          outline: ${theme.color.outline};
        `)}
      }
    }
  }
`
export const StickyObservationTableWrapTh = styled(StickyObservationTable)`
  tr th {
    white-space: normal;
  }
`

export const UnderTableRow = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: ${theme.spacing.medium};
  ${mediaQueryTabletLandscapeOnly(css`
    flex-direction: column;
    gap: ${theme.spacing.small};
  `)}
`
export const UnderTableRowButtonArea = styled('div')`
  display: flex;
  flex-direction: column;
  button {
    align-self: flex-start;
  }
`

export const CellValidation = styled(Td)`
  border: none;
`

export const CellValidationButton = styled(ButtonSecondary)`
  font-size: smaller;
  padding: ${theme.spacing.xxsmall} ${theme.spacing.xsmall};
  margin: ${theme.spacing.xsmall};
  text-transform: capitalize;
`
export const TableValidationList = styled.ul`
  padding: ${theme.spacing.xsmall};
  margin: 0;
  list-style: none;
`

export const DeleteRecordButtonCautionWrapper = styled('div')`
  padding: ${theme.spacing.medium};
  margin: ${theme.spacing.large} 0;
`

export const DeleteProjectButtonCautionWrapper = styled(DeleteRecordButtonCautionWrapper)`
  display: flex;
`

export const ErrorText = styled.div`
  position: fixed;
  visibility: ${(props) => (props.isErrorShown ? 'shown' : 'hidden')};
  font-size: ${theme.typography.smallFontSize};
  pointer-events: auto;
  white-space: nowrap;
  border: solid 1px ${theme.color.border};
  text-transform: uppercase;
  background: ${theme.color.inlineErrorColor};
  color: ${theme.color.textColor};
  padding: 0.1rem 1rem;
  border-radius: 5px;
  right: 5px;
  &::after {
    position: absolute;
    content: '';
    background: ${theme.color.inlineErrorColor};
    width: 10px;
    height: 10px;
    left: calc(50% - 5px);
    border-style: solid;
    border-width: 1px 0 0 1px;
    border-color: ${theme.color.border};
  }
`
export const ErrorTextSubmit = styled(ErrorText)`
  text-transform: inherit;
  position: absolute;
  margin-top: 1em;
  margin-right: 3em;
  &::after {
    left: calc(90% - 5px);
  }
`

export const ErrorBox = styled.div`
  position: fixed;
  z-index: 4;
  pointer-events: none;
  top: calc(${theme.spacing.headerHeight} + ${theme.spacing.toolbarHeight} + 20px);
  bottom: ${theme.spacing.small};
  div:nth-child(1) {
    &::after {
      /* top */
      top: -6px;
      transform: rotate(45deg);
    }
  }
  div:nth-child(2) {
    bottom: 10px;
    &::after {
      /* bottom */
      bottom: -6px;
      transform: rotate(-135deg);
    }
  }
`
export const ErrorBoxSubmit = styled(ErrorBox)`
  position: absolute;
  top: 3.5em;
  right: 0;
`
export const ErrorTextButton = styled('button')`
  cursor: pointer;
  border-style: none;
  background-color: transparent;
  font-size: 12px;
  margin-left: 0.8em;
  padding: 0;
`

export const WarningText = styled('p')`
  margin-left: 0.8em;
`
