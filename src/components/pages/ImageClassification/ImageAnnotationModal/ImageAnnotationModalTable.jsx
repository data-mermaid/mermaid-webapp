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
  const allPoints = points.map(({ annotations }) => {
    return annotations.length > 0
      ? annotations
      : annotations.push({
          ba_gr: unclassifiedGuid,
          ba_gr_label: language.imageClassification.imageClassficationModal.unclassified,
        })
  })
  const classifiedPoints = points.filter(({ annotations }) => annotations.length > 0)
  const unclassifiedPoints = points.filter(({ annotations }) => !annotations.length)
  const tableData = Object.groupBy(points, ({ annotations }) => annotations[0].ba_gr)

  const sortAlphabeticallyByAttributeLabel = (a, b) =>
    tableData[a][0].annotations[0].ba_gr_label?.localeCompare(
      tableData[b][0].annotations[0].ba_gr_label,
    )
  const getConfirmedCount = (observationRowKey) =>
    tableData[observationRowKey].reduce(
      (count, point) => (point.annotations[0].is_confirmed ? count + 1 : count),
      0,
    )

  const handleRowSelect = (observationRowKey) => {
    return observationRowKey === selectedAttributeId
      ? setSelectedAttributeId('')
      : setSelectedAttributeId(observationRowKey)
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
              .map((observationRowKey) => {
                const confirmedCount = getConfirmedCount(observationRowKey)
                const unconfirmedCount = tableData[observationRowKey].length - confirmedCount

                return (
                  <TrImageClassification
                    key={observationRowKey}
                    onClick={() => handleRowSelect(observationRowKey)}
                    onMouseEnter={() => setHoveredAttributeId(observationRowKey)}
                    onMouseLeave={() => setHoveredAttributeId('')}
                    $isSelected={observationRowKey === selectedAttributeId}
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
                            handleZoomClick({ event, attributeId: observationRowKey })
                          }
                          $isSelected={observationRowKey === selectedAttributeId}
                          type="button"
                        >
                          <IconZoomIn />
                        </ButtonZoom>
                      </MuiTooltipDark>
                    </TdZoom>
                    {/* All points in a row will have the same ba_gr label */}
                    <Td>{tableData[observationRowKey][0].annotations[0].ba_gr_label}</Td>
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
                          unconfirmedCount > 0 ? IMAGE_CLASSIFICATION_COLORS.unconfirmed : 'null',
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
                            onClick={(e) => handleRowConfirm(e, tableData[observationRowKey])}
                          >
                            {language.buttons.confirm}
                          </ButtonSecondary>
                        </MuiTooltipDark>
                      )}
                    </Td>
                  </TrImageClassification>
                )
              })}
            {unclassifiedPoints.length > 0 && (
              <Tr key={unclassifiedGuid}>
                <Td />
                <Td>{language.imageClassification.imageClassficationModal.unclassified}</Td>
                <Td
                  style={{
                    backgroundColor: IMAGE_CLASSIFICATION_COLORS.unclassified,
                    textAlign: 'center',
                  }}
                  colSpan={2}
                >
                  {unclassifiedPoints.length}
                </Td>
                <Td colSpan={2} />
              </Tr>
            )}
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
