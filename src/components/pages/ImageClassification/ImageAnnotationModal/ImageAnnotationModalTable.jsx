import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  ButtonZoom,
  TableWithNoMinWidth,
  TdStatus,
  TdZoom,
  TrImageClassification,
} from './ImageAnnotationModal.styles'
import { ButtonSecondary } from '../../../generic/buttons'
import { TableOverflowWrapper, Td, Th, thStyles, Tr } from '../../../generic/Table/table'
import { imageClassificationPointPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { IconZoomIn } from '../../../icons'
import { MuiTooltipDark } from '../../../generic/MuiTooltip'
import language from '../../../../language'

const ImageAnnotationModalTable = ({
  points,
  setDataToReview,
  selectedAttributeId,
  setSelectedAttributeId,
  setHoveredAttributeId,
  setIsDataUpdatedSinceLastSave,
  zoomToPointsByAttributeId,
  isTableShowing,
}) => {
  useEffect(
    function deselectAttributeIfTableHidden() {
      if (!isTableShowing) {
        setSelectedAttributeId('')
      }
    },
    [isTableShowing, setSelectedAttributeId],
  )
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

  return isTableShowing ? (
    <TableOverflowWrapper id="annotation-modal-table">
      <TableWithNoMinWidth aria-labelledby="table-label">
        <thead>
          <Tr style={{ ...thStyles }}>
            <Th />
            <Th style={{ maxWidth: '200px' }}>
              {language.imageClassification.imageClassficationModal.attributeGrowthForm}
            </Th>
            <MuiTooltipDark
              title={language.imageClassification.imageClassficationModal.confirmedTotal}
            >
              <Th>{language.imageClassification.imageClassficationModal.confirmed}</Th>
            </MuiTooltipDark>
            <Th>{language.imageClassification.imageClassficationModal.status}</Th>
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
                    <MuiTooltipDark title="Zoom to attribute">
                      <ButtonZoom
                        onClick={(event) => handleZoomClick({ event, attributeId: rowKey })}
                        $isSelected={rowKey === selectedAttributeId}
                        type="button"
                      >
                        <IconZoomIn />
                      </ButtonZoom>
                    </MuiTooltipDark>
                  </TdZoom>
                  {/* All points in a row will have the same ba_gr label */}
                  <Td>{tableData[rowKey][0].annotations[0].ba_gr_label}</Td>
                  <Td align="right">
                    {confirmedCount} / {unconfirmedCount + confirmedCount}
                  </Td>
                  <TdStatus align="center">
                    {!unconfirmedCount ? (
                      language.imageClassification.imageClassficationModal.confirmed
                    ) : (
                      <MuiTooltipDark title="Confirm all points">
                        <ButtonSecondary
                          type="button"
                          onClick={(e) => handleRowConfirm(e, tableData[rowKey])}
                        >
                          {language.buttons.confirmAll}
                        </ButtonSecondary>
                      </MuiTooltipDark>
                    )}
                  </TdStatus>
                </TrImageClassification>
              )
            })}
        </tbody>
      </TableWithNoMinWidth>
    </TableOverflowWrapper>
  ) : null
}

ImageAnnotationModalTable.propTypes = {
  selectedAttributeId: PropTypes.string.isRequired,
  setSelectedAttributeId: PropTypes.func.isRequired,
  setHoveredAttributeId: PropTypes.func.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  points: PropTypes.arrayOf(imageClassificationPointPropType).isRequired,
  setIsDataUpdatedSinceLastSave: PropTypes.func.isRequired,
  zoomToPointsByAttributeId: PropTypes.func.isRequired,
  isTableShowing: PropTypes.bool.isRequired,
}

export default ImageAnnotationModalTable
