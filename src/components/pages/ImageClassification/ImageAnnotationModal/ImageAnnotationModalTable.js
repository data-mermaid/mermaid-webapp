import React from 'react'
import PropTypes from 'prop-types'

import {
  ButtonZoom,
  TableWithNoMinWidth,
  TdConfirmed,
  TdUnconfirmed,
  TdZoom,
  TrImageClassification,
} from './ImageAnnotationModal.styles'
import { ButtonSecondary } from '../../../generic/buttons'
import { Tr, Th, Td, TableOverflowWrapper } from '../../../generic/Table/table'
import { imageClassificationPointPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { IconZoomIn } from '../../../icons'

const ImageAnnotationModalTable = ({
  points,
  setDataToReview,
  selectedAttributeId,
  setSelectedAttributeId,
  setHoveredAttributeId,
  setIsDataUpdatedSinceLastSave,
  zoomToPointsByAttributeId,
}) => {
  const classifiedPoints = points.filter(({ annotations }) => annotations.length > 0)
  const tableData = Object.groupBy(classifiedPoints, ({ annotations }) => annotations[0].ba_gr)

  const sortAlphabeticallyByAttributeLabel = (a, b) =>
    tableData[a][0].annotations[0].ba_gr_label?.localeCompare(
      tableData[b][0].annotations[0].ba_gr_label,
    )

  const getConfirmedCount = (rowKey) =>
    tableData[rowKey].reduce(
      (count, point) => (point.annotations[0].is_confirmed ? count + 1 : count),
      0,
    )

  const handleRowSelect = (rowKey) =>
    rowKey === selectedAttributeId ? setSelectedAttributeId('') : setSelectedAttributeId(rowKey)

  const handleRowConfirm = (e, rowData) => {
    e.stopPropagation()

    const updatedPoints = points.map((point) => {
      const isPointInRow = rowData.some((pointInRow) => pointInRow.id === point.id)
      if (isPointInRow) {
        point.annotations[0].is_confirmed = true
      }

      return point
    })

    setDataToReview((prevState) => ({ ...prevState, points: updatedPoints }))
    setIsDataUpdatedSinceLastSave(true)
  }

  const handleZoomClick = ({ event, attributeId }) => {
    event.stopPropagation()
    zoomToPointsByAttributeId(attributeId)
    setSelectedAttributeId(attributeId)
  }

  return (
    <TableOverflowWrapper id="annotation-modal-table">
      <TableWithNoMinWidth aria-labelledby="table-label">
        <thead>
          <Tr>
            <Th />
            <Th>Attribute growth form</Th>
            <Th title="Confirmed count">✓</Th>
            <Th title="Unconfirmed count">?</Th>
            <Th>Status</Th>
          </Tr>
        </thead>
        <tbody>
          {Object.keys(tableData)
            .sort(sortAlphabeticallyByAttributeLabel)
            .map((rowKey) => {
              const confirmedCount = getConfirmedCount(rowKey)
              const unconfirmedCount = tableData[rowKey].length - confirmedCount

              return (
                <TrImageClassification
                  key={rowKey}
                  onClick={() => handleRowSelect(rowKey)}
                  onMouseEnter={() => setHoveredAttributeId(rowKey)}
                  onMouseLeave={() => setHoveredAttributeId('')}
                  $isSelected={rowKey === selectedAttributeId}
                  $isAnyRowSelected={selectedAttributeId !== undefined}
                >
                  <TdZoom>
                    <ButtonZoom
                      onClick={(event) => handleZoomClick({ event, attributeId: rowKey })}
                      $isSelected={rowKey === selectedAttributeId}
                      type="button"
                    >
                      <IconZoomIn />
                    </ButtonZoom>
                  </TdZoom>
                  {/* All points in a row will have the same ba_gr label */}
                  <Td>{tableData[rowKey][0].annotations[0].ba_gr_label}</Td>
                  <TdConfirmed align="right" $hasConfirmedPoint={!!confirmedCount}>
                    {confirmedCount}
                  </TdConfirmed>
                  <TdUnconfirmed align="right" $hasUnconfirmedPoint={!!unconfirmedCount}>
                    {unconfirmedCount}
                  </TdUnconfirmed>
                  <Td align="center">
                    {!unconfirmedCount ? (
                      'Confirmed'
                    ) : (
                      <ButtonSecondary
                        type="button"
                        onClick={(e) => handleRowConfirm(e, tableData[rowKey])}
                      >
                        Confirm
                      </ButtonSecondary>
                    )}
                  </Td>
                </TrImageClassification>
              )
            })}
        </tbody>
      </TableWithNoMinWidth>
    </TableOverflowWrapper>
  )
}

ImageAnnotationModalTable.propTypes = {
  selectedAttributeId: PropTypes.string.isRequired,
  setSelectedAttributeId: PropTypes.func.isRequired,
  setHoveredAttributeId: PropTypes.func.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  points: PropTypes.arrayOf(imageClassificationPointPropType).isRequired,
  setIsDataUpdatedSinceLastSave: PropTypes.func.isRequired,
  zoomToPointsByAttributeId: PropTypes.func.isRequired,
}

export default ImageAnnotationModalTable
