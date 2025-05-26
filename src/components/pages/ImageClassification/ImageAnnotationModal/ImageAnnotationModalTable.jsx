import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

import {ButtonZoom, TableWithNoMinWidth, TdZoom, TrImageClassification,} from './ImageAnnotationModal.styles'
import {ButtonSecondary} from '../../../generic/buttons'
import {TableOverflowWrapper, Td, Th, thStyles, Tr} from '../../../generic/Table/table'
import {imageClassificationPointPropType} from '../../../../App/mermaidData/mermaidDataProptypes'
import {IconZoomIn} from '../../../icons'
import {MuiTooltipDark} from '../../../generic/MuiTooltip'
import {unclassifiedGuid,} from '../../../../library/constants/constants'
import {useTranslation} from 'react-i18next'

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
    const {t} = useTranslation()
    const {groupedPoints, unclassifiedCount} = points.reduce(
        (acc, point) => {
            if (point.annotations[0].ba_gr === unclassifiedGuid) {
                acc.unclassifiedCount++
            }
            acc.groupedPoints.push(point)
            return acc
        },
        {groupedPoints: [], unclassifiedCount: 0},
    )

    const tableData = Object.groupBy(groupedPoints, ({annotations}) => annotations[0].ba_gr)

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
        setDataToReview((prevState) => ({...prevState, points: updatedPoints}))
        setIsDataUpdatedSinceLastSave(true)
    }

    const handleZoomClick = ({event, attributeId}) => {
        event.stopPropagation()
        zoomToPointsByAttributeId(attributeId)
        setSelectedAttributeId(attributeId)
    }

    return (
        isTableShowing && (
            <TableOverflowWrapper id="annotation-modal-table">
                <TableWithNoMinWidth aria-labelledby="table-label">
                    <thead>
                    <Tr style={{...thStyles}}>
                        <Th/>
                        <Th style={{maxWidth: '200px' /**force text wrapping**/}}>
                            {t('image_classification.attribute_growth_form')}
                        </Th>
                        <MuiTooltipDark
                            title={t('image_classification.annotation.confirmed_total_count')}
                        >
                            <Th>{t('image_classification.annotation.confirmed')}</Th>
                        </MuiTooltipDark>
                        <Th style={{textAlign: 'center'}}>
                            {t('image_classification.annotation.status')}
                        </Th>
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
                                            title={t('image_classification.buttons.zoom_to_attribute')}
                                        >
                                            <ButtonZoom
                                                onClick={(event) =>
                                                    handleZoomClick({event, attributeId: groupedTableRowId})
                                                }
                                                $isSelected={groupedTableRowId === selectedAttributeId}
                                                type="button"
                                            >
                                                <IconZoomIn/>
                                            </ButtonZoom>
                                        </MuiTooltipDark>
                                    </TdZoom>
                                    {/* All points in a row will have the same ba_gr label */}

                                    {groupedTableRowId === unclassifiedGuid ? (
                                        <Td colSpan={5} align="center" style={{fontWeight: '700'}}>
                        <span>
                          {t('image_classification.annotation.unclassified_points', {count: unclassifiedCount})}
                        </span>
                                        </Td>
                                    ) : (
                                        <>
                                            <Td>{tableData[groupedTableRowId][0].annotations[0].ba_gr_label}</Td>
                                            <Td align="right">
                                                {confirmedCount} / {unconfirmedCount + confirmedCount}
                                            </Td>
                                            <Td style={{textAlign: 'center', width: '104px'}}>
                                                {!unconfirmedCount ? t('image_classification.annotation.confirmed') : (
                                                    <MuiTooltipDark
                                                        title={t('image_classification.buttons.confirm_all')}
                                                    >
                                                        <ButtonSecondary
                                                            type="button"
                                                            onClick={(e) => handleRowConfirm(e, tableData[groupedTableRowId])}
                                                        >
                                                            {t('image_classification.buttons.confirm_all')}
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
