import styled, { css } from 'styled-components/macro'
import theme from '../../../theme'
import { hoverState, mediaQueryTabletLandscapeOnly } from '../../../library/styling/mediaQueries'
import { ButtonCaution, ButtonThatLooksLikeLink, ButtonSecondary } from '../../generic/buttons'
import { Table, TableOverflowWrapper, Tr, Td, GenericStickyTable } from '../../generic/Table/table'
import InputAutocomplete from '../../generic/InputAutocomplete'
import { inputTextareaSelectStyles } from '../../generic/form'
import { LinkThatLooksLikeButton } from '../../generic/links'

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

export const ObservationAutocomplete = styled(InputAutocomplete)`
  & input {
    border: none;
  }
  width: 100%;
  text-align: inherit;
  padding: 0;
`

export const InputAutocompleteContainer = styled.div`
  ${inputTextareaSelectStyles}
  display: flex;
  justify-content: space-between;
  padding: 0;
  border: none;
  background: transparent;
`

export const ObservationsSummaryStats = styled(Table)`
  width: 25%;
  table-layout: auto;
  min-width: auto;
  max-width: 40rem;
  border: solid 1px ${theme.color.secondaryColor};
  tr:nth-child(even),
  tr:nth-child(odd) {
    background-color: ${theme.color.white};
  }
  ${mediaQueryTabletLandscapeOnly(css`
    font-size: smaller;
  `)}
`

export const ButtonRemoveRow = styled(ButtonCaution)`
  display: none;
  padding: 0;
`

export const StyledLinkThatLooksLikeButtonToReference = styled(LinkThatLooksLikeButton)`
  padding: 0.5rem 1rem 0 1rem;
  background: transparent;
`

export const StyledOverflowWrapper = styled(TableOverflowWrapper)`
  border: solid 1px ${theme.color.secondaryColor};
  height: 100%;
  overflow-y: visible;
`

export const StickyObservationTable = styled(GenericStickyTable)`
  tr {
    &:focus-within button,
    &:hover button {
      display: inline;
      cursor: pointer;
    }
    th {
      top: calc(
        ${theme.spacing.headerHeight} + ${theme.spacing.toolbarHeight} + ${theme.spacing.small}
      );
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
      input,
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

export const CellValidation = styled(Td)``

export const CellValidationButton = styled(ButtonSecondary)`
  font-size: smaller;
  padding: ${theme.spacing.xxsmall} ${theme.spacing.xsmall};
  margin: ${theme.spacing.xsmall};
  text-transform: capitalize;
`
export const TableValidationList = styled.ul`
  padding: ${theme.spacing.xsmall};
  margin: 0;
  list-style: none; ;
`

export const DeleteRecordButtonCautionWrapper = styled('div')`
  padding: 0 ${theme.spacing.medium};
  text-align: right;
  ${mediaQueryTabletLandscapeOnly(css`
    text-align: left;
  `)}
`

export const ErrorText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: ${(props) => (props.isErrorShown ? 'shown' : 'hidden')};
  font-size: 1.5rem;
  color: ${theme.color.calloutColor};
  background: ${theme.color.cautionColor};
  width: 100%;
`

export const ErrorBox = styled.div`
  z-index: 1000;
  position: fixed;
  display: block;
  top: 130px;
  left: 170px;
  width: 200px;
  bottom: 10px;
  div:nth-child(1) {
    padding: 20px 10px 10px 10px;
    clip-path: polygon(
      0 10px,
      calc(50% - 10px) 10px,
      50% 0,
      calc(50% + 10px) 10px,
      100% 10px,
      100% 100%,
      0 100%
    );
  }
  div:nth-child(2) {
    position: absolute;
    bottom: 0;
    padding: 10px 10px 20px 10px;
    clip-path: polygon(
      0 0,
      100% 0,
      100% calc(100% - 10px),
      calc(50% - 10px) calc(100% - 10px),
      50% 100%,
      calc(50% + 10px) calc(100% - 10px),
      0 calc(100% - 10px)
    );
  }
`
