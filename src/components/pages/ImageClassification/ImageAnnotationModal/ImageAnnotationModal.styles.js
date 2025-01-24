import styled, { css } from 'styled-components'
import colorHelper from 'color'
import theme from '../../../../theme'
import { Table, Tr, Td, thStyles } from '../../../generic/Table/table'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import LoadingIndicator from '../../../LoadingIndicator/LoadingIndicator'
import { RowSpaceBetween } from '../../../generic/positioning'
import { ButtonPrimary, IconButton, buttonSecondaryCss } from '../../../generic/buttons'

const confirmed = colorHelper(COLORS.confirmed)
const unconfirmed = colorHelper(COLORS.unconfirmed)
const white = colorHelper(theme.color.white)

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
  width: 12px;
  height: 12px;
  margin-right: 2px;
  border: ${({ color }) => `2px solid ${color}`};
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

export const ImageAnnotationPopupContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

export const TdZoom = styled(Td)`
  padding: 0;
  height: 31px;
  width: 48px;
  background-color: ${theme.color.white}; // stop the row hover colour from showing
  &:hover {
    background-color: ${theme.color.tableRowHover};
  }
`

export const TrImageClassification = styled(Tr)`
  border: 1px solid transparent;
  border-top: ${({ $isSelected }) => $isSelected && `2px solid ${COLORS.selected}`};
  border-bottom: ${({ $isSelected }) => $isSelected && `2px solid ${COLORS.selected}`};
  cursor: pointer;
  &:hover {
    border-top: ${({ $isSelected }) => !$isSelected && `2px solid ${COLORS.hover}`};
    border-bottom: ${({ $isSelected }) => !$isSelected && `2px solid ${COLORS.hover}`};
    svg {
      opacity: 1; // this make the zoom icon visible on hover
    }
  }
  &:nth-child(odd),
  &:nth-child(even) {
    background-color: ${theme.color.white}; // undo default table row striping
  }
  &:has(${TdZoom}:hover) {
    background-color: ${theme.color.white};
  }
`

export const TdConfirmed = styled(Td)`
  background-color: ${({ $hasConfirmedPoint }) =>
    $hasConfirmedPoint ? confirmed.mix(white, 0.7) : undefined};
`

export const TdUnconfirmed = styled(Td)`
  background-color: ${({ $hasUnconfirmedPoint }) =>
    $hasUnconfirmedPoint ? unconfirmed.mix(white, 0.7) : undefined};
`

export const EditPointPopupTable = styled(Table)`
  border: ${`2px solid ${COLORS.current}`};
`

export const PopupTd = styled(Td)`
  background-color: ${theme.color.tableRowEven};
  border: none;
`

export const PopupTdForRadio = styled(PopupTd)`
  width: 15px;
`

export const NewAttributeModalContentContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.large};
`

export const NewAttributeModalFooterContainer = styled.div`
  justify-self: right;
`

export const NewAttributeModalLabel = styled.label`
  font-weight: bold;
`
export const MapControlButton = styled.button`
  z-index: 1;
  padding: 2px 7px; // don't like specific values but need to match maplibre zoom buttons
  cursor: hover;
  border: ${(props) => (props.$isSelected ? `solid thin ${theme.color.white}` : 'none')};
  border-radius: ${theme.spacing.borderMedium};
  background-color: ${(props) =>
    props.$isSelected ? theme.color.primaryColor : theme.color.white};
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); // copy maplibre button shadow
  color: ${(props) => (props.$isSelected ? theme.color.white : 'inherit')};
`
export const MapResetButton = styled(MapControlButton)`
  position: absolute;
  top: 75px;
  left: 10px;
`
export const ToggleTableButton = styled(MapControlButton)`
  position: absolute;
  top: 110px;
  left: 10px;
`
export const ToggleLabelsButton = styled(MapControlButton)`
  position: absolute;
  top: 145px;
  left: 10px;
`

export const ButtonZoom = styled.button`
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
export const LabelThatLooksLikeATh = styled.div(
  (props) => css`
    ${thStyles(props)}
  `,
)
export const RowThatLooksLikeAnEvenTr = styled.div`
  display: flex;
  padding: 10px;
  gap: 20px;
  background-color: ${theme.color.tableRowEven};
`

export const LabelPopup = styled.div`
  padding: 3px;
  display: flex;
  align-items: center;
  gap: 0.1rem;
`
