import styled from 'styled-components'
import theme from '../../../../theme'
import { Table, Tr, Th, Td } from '../../../generic/Table/table'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import { inputTextareaSelectStyles } from '../../../generic/form'

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

export const ImageAnnotationMapWrapper = styled.div`
  position: relative;
`

export const ImageAnnotationMapContainer = styled.div`
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
  margin-top: '2rem';
`

export const TableWithNoMinWidth = styled(Table)`
  min-width: unset;
`

export const ImageAnnotationPopupContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

export const TrWithBorderStyling = styled(Tr)`
  border: ${({ $isSelected }) => $isSelected && `2px solid ${COLORS.current}`};
  background-color: ${({ $isConfirmed }) => $isConfirmed && `${COLORS.confirmed} !important`};

  &:hover {
    border: ${({ $isSelected }) => !$isSelected && `2px solid ${COLORS.highlighted}`};
  }
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

export const PopupInputAutocompleteContainer = styled.div`
  ${inputTextareaSelectStyles}
  padding: 0;
`
