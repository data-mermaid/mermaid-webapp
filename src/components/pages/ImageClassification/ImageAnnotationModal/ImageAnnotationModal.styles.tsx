import styled, { css } from 'styled-components'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import theme from '../../../../theme'
import LoadingIndicator from '../../../LoadingIndicator/LoadingIndicator'
import { Table, Td, Tr, thStyles } from '../../../generic/Table/table'
import { ButtonPrimary, IconButton, buttonSecondaryCss } from '../../../generic/buttons'
import { RowSpaceBetween } from '../../../generic/positioning'

interface IsSelectedProps {
  $isSelected?: boolean
}

export const RowThatLooksLikeAnEvenTr = styled.div`
  display: flex;
  padding: 10px;
  gap: 20px;
  background-color: ${theme.color.tableRowEven};
`
export const ClickableRowThatLooksLikeAnEvenTr = styled(RowThatLooksLikeAnEvenTr)`
  &:hover {
    cursor: pointer;
    background-color: ${theme.color.tableRowHover};
  }
`

export const LabelThatLooksLikeATh = styled.div(
  (props) => css`
    ${thStyles(props)}
  `,
)

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Legend = styled.div`
  display: flex;
  gap: 8px;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
`

export const LegendSquare = styled.div`
  width: 15px;
  height: 15px;
  margin-right: 3px;
  border: ${({ color }) => `3px solid ${color}`};
`

export const LoadingContainer = styled.div`
  background-color: ${theme.color.background};
  height: 500px;
  width: 100%;
`

export const ImageAnnotationModalContainer = styled.div`
  display: flex;
  max-height: inherit;
  overflow: hidden;
  margin: -${theme.spacing.medium};
  background-color: ${theme.color.background};
`

export const ImageAnnotationMapWrapper = styled.div`
  position: relative;
`

export const TableWithNoMinWidth = styled(Table)`
  min-width: unset;
  border-top: none;
`

export const TdZoom = styled(Td)`
  padding: 0;
  height: 57px; // prevents shifts to layout when the attribute is confirmed
  width: 48px;
  background-color: ${theme.color.white}; // stop the row hover colour from showing

  &:hover {
    background-color: ${theme.color.tableRowHover};
  }
`

export const TrImageClassification = styled(Tr)<IsSelectedProps>`
  position: relative;
  cursor: pointer;

  &:hover {
    svg {
      opacity: 1; // this make the zoom icon visible on hover
    }

    &::after {
      // this is a non-layout impacting hack to receive the hover border
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-top: 2px solid ${COLORS.hover};
      border-bottom: 2px solid ${COLORS.hover};
      pointer-events: none;
    }
  }

  &:nth-child(odd),
  &:nth-child(even) {
    background-color: ${theme.color.white}; // undo default table row striping
  }

  &:has(${TdZoom}:hover) {
    background-color: ${theme.color.white};
  }

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: ${COLORS.selected} !important; //hack to override the table row striping
      &::after {
        // this is a non-layout impacting hack to receive the selected row border
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-top: 2px solid ${COLORS.selected};
        border-bottom: 2px solid ${COLORS.selected};
        pointer-events: none;
      }
    `}
`

export const TdStatus = styled(Td)`
  width: 125px; // prevents shifts to layout when the status is confirmed
`
export const PointPopupSectionHeader = styled.div`
  ${thStyles}
  display: flex;
  justify-content: space-between;
`

export const PopupWrapperForRadio = styled.div`
  width: 15px;
`

export const NewAttributeModalContentContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.large};
`

export const NewAttributeModalFooterContainer = styled.div`
  justify-self: right;
`

export const ButtonZoom = styled.button<IsSelectedProps>`
  all: unset;
  height: 100%;
  width: 100%;
  text-align: center;

  & svg {
    opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
  }
`

export const LoadingIndicatorImageClassificationImage = styled(LoadingIndicator)`
  width: 100%;
  height: 100%;
`
export const PopupBottomRow = styled(RowSpaceBetween)`
  align-items: stretch;
  padding: 1rem;
`

export const PopupConfirmButton = styled(ButtonPrimary)`
  width: 100%;
`
export const PopupIconButton = styled(IconButton)`
  ${buttonSecondaryCss}
  border: solid thin ${theme.color.border};
  margin: 0;
  padding: ${theme.spacing.buttonPadding};

  &:nth-child(2) {
    border-left: none;
  }
`
export const PopupZoomButtonContainer = styled.div`
  display: flex;
`

export const LabelPopup = styled.div`
  padding: 3px;
  display: flex;
  align-items: center;
  gap: 0.1rem;
`
