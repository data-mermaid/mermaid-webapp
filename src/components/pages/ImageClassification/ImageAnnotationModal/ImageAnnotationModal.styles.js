import styled from 'styled-components'
import theme from '../../../../theme'
import { Table, Tr, Th, Td } from '../../../generic/Table/table'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import { IconCheck } from '../../../icons'

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
  margin: -${theme.spacing.medium};
  background-color: ${theme.color.background};
`

export const ImageAnnotationMapWrapper = styled.div`
  position: relative;
`

export const ImageAnnotationMapContainer = styled.div`
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
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

export const TrWithBorderStyling = styled(Tr)`
  border: 1px solid transparent;
  border-top: ${({ $isSelected }) => $isSelected && `2px solid ${COLORS.current}`};
  border-bottom: ${({ $isSelected }) => $isSelected && `2px solid ${COLORS.current}`};

  &:hover {
    border-top: ${({ $isSelected }) => !$isSelected && `2px solid ${COLORS.highlighted}`};
    border-bottom: ${({ $isSelected }) => !$isSelected && `2px solid ${COLORS.highlighted}`};
  }

  td {
    border: none;
  }
`

export const ConfirmedIcon = styled(IconCheck)`
  color: ${COLORS.confirmed};
  height: 2rem;
  width: 2rem;
`

export const PopupTable = styled(Table)`
  width: 500px;
`

export const PopupSubTh = styled(Th)`
  border: solid 1px ${theme.color.tableBorderColor};
  font-weight: bold;
  background-color: ${theme.color.tableRowEven};
`
export const PopupTd = styled(Td)`
  background-color: ${theme.color.tableRowOdd};
`

export const PopupTdForRadio = styled(PopupTd)`
  width: 15px;
`

export const NewRowContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.large};
`

export const NewRowFooterContainer = styled.div`
  justify-self: right;
`

export const NewRowLabel = styled.label`
  font-weight: bold;
`

export const MapResetButton = styled.button`
  position: absolute;
  top: 75px;
  left: 10px;
  z-index: 1;
  padding: 2px 7px; // don't like specific values but need to match maplibre zoom buttons
  cursor: pointer;
  border: none;
  border-radius: ${theme.spacing.borderMedium};
  background-color: ${theme.color.white};
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); // copy maplibre button shadow
`
