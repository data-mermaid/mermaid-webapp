import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  ButtonZoom,
  TableWithNoMinWidth,
  TdZoom,
  TrImageClassification,
} from './ImageAnnotationModal.styles'
import { ButtonSecondary } from '../../../generic/buttons'
import { TableOverflowWrapper, Td, Th, thStyles, Tr } from '../../../generic/Table/table'
import { imageClassificationPointPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { IconZoomIn } from '../../../icons'
import { MuiTooltipDark } from '../../../generic/MuiTooltip'
import language from '../../../../language'
import {
  IMAGE_CLASSIFICATION_COLORS,
  unclassifiedGuid,
} from '../../../../library/constants/constants'

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
  const { groupedPoints, unclassifiedCount } = points.reduce(
    (acc, point) => {
      if (point.annotations[0].ba_gr === unclassifiedGuid) {
        acc.unclassifiedCount++
      }
      acc.groupedPoints.push(point)
      return acc
    },
    { groupedPoints: [], unclassifiedCount: 0 },
  )

  const tableData = Object.groupBy(groupedPoints, ({ annotations }) => annotations[0].ba_gr)

  const sortAlphabeticallyByAttributeLabel = (a, b) => {
    if (a === unclassifiedGuid) {
      return 1
    }
    if (b === unclassifiedGuid) {
      return -1
    }
    return tableData[a][0].annotations[0].ba_gr_label?.localeCompare(
      tableData[b][0].annotations[0].ba_gr_label,
    )
  }
  const getConfirmedCount = (groupedTableRowId) =>
    tableData[groupedTableRowId].reduce(
      (count, point) => (point.annotations[0].is_confirmed ? count + 1 : count),
      0,
    )

  const handleRowSelect = (groupedTableRowId) => {
    return groupedTableRowId === selectedAttributeId
      ? setSelectedAttributeId('')
      : setSelectedAttributeId(groupedTableRowId)
  }

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
    isTableShowing && (
      <TableOverflowWrapper id="annotation-modal-table">
        <TableWithNoMinWidth aria-labelledby="table-label">
          <thead>
            <Tr style={{ ...thStyles }}>
              <Th />
              <Th>{language.imageClassification.imageClassficationModal.attributeGrowthForm}</Th>
              <MuiTooltipDark
                title={language.imageClassification.imageClassficationModal.confirmedCount}
              >
                <Th>✓</Th>
              </MuiTooltipDark>
              <MuiTooltipDark
                title={language.imageClassification.imageClassficationModal.unconfirmedCount}
              >
                <Th>?</Th>
              </MuiTooltipDark>
              <Th>{language.imageClassification.imageClassficationModal.status}</Th>
            </Tr>
          </thead>
          <tbody>
            {Object.keys(tableData)
              .sort(sortAlphabeticallyByAttributeLabel)
              .map((groupedTableRowId) => {
                const confirmedCount = getConfirmedCount(groupedTableRowId)
                const unconfirmedCount = tableData[groupedTableRowId].length - confirmedCount

                return (
                  <TrImageClassification
                    key={groupedTableRowId}
                    onClick={() => handleRowSelect(groupedTableRowId)}
                    onMouseEnter={() => setHoveredAttributeId(groupedTableRowId)}
                    onMouseLeave={() => setHoveredAttributeId('')}
                    $isSelected={groupedTableRowId === selectedAttributeId}
                    $isAnyRowSelected={selectedAttributeId !== undefined}
                  >
                    <TdZoom>
                      <MuiTooltipDark
                        title={
                          language.imageClassification.imageClassficationModal.tooltip
                            .zoomToAttribute
                        }
                      >
                        <ButtonZoom
                          onClick={(event) =>
                            handleZoomClick({ event, attributeId: groupedTableRowId })
                          }
                          $isSelected={groupedTableRowId === selectedAttributeId}
                          type="button"
                        >
                          <IconZoomIn />
                        </ButtonZoom>
                      </MuiTooltipDark>
                    </TdZoom>
                    {/* All points in a row will have the same ba_gr label */}
                    {groupedTableRowId === unclassifiedGuid ? (
                      <Td colSpan={5} align="center" style={{ fontWeight: '700' }}>
                        <span>
                          {`${unclassifiedCount} ${
                            language.imageClassification.imageClassficationModal.unclassifiedPoint
                          }${unclassifiedCount > 1 ? 's' : ''}`}
                        </span>
                      </Td>
                    ) : (
                      <>
                        <Td>{tableData[groupedTableRowId][0].annotations[0].ba_gr_label}</Td>
                        <Td
                          style={{
                            textAlign: 'right',
                            backgroundColor:
                              confirmedCount > 0 ? IMAGE_CLASSIFICATION_COLORS.confirmed : 'null',
                          }}
                        >
                          {confirmedCount}
                        </Td>
                        <Td
                          style={{
                            textAlign: 'right',
                            backgroundColor:
                              unconfirmedCount > 0
                                ? IMAGE_CLASSIFICATION_COLORS.unconfirmed
                                : 'null',
                          }}
                        >
                          {unconfirmedCount}
                        </Td>
                        <Td style={{ textAlign: 'center', width: '104px' }}>
                          {!unconfirmedCount ? (
                            language.imageClassification.imageClassficationModal.confirmed
                          ) : (
                            <MuiTooltipDark
                              title={
                                language.imageClassification.imageClassficationModal.tooltip
                                  .confirmAllPoints
                              }
                            >
                              <ButtonSecondary
                                type="button"
                                onClick={(e) => handleRowConfirm(e, tableData[groupedTableRowId])}
                              >
                                {language.buttons.confirm}
                              </ButtonSecondary>
                            </MuiTooltipDark>
                          )}
                        </Td>
                      </>
                    )}
                  </TrImageClassification>
                )
              })}
          </tbody>
        </TableWithNoMinWidth>
      </TableOverflowWrapper>
    )
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
  isTableShowing: PropTypes.bool.isRequired,
}

export default ImageAnnotationModalTable
