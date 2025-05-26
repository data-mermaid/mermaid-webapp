import React from 'react'
import PropTypes from 'prop-types'

import {
    imageClassificationPointPropType,
    imageClassificationResponsePropType,
} from '../../../../../App/mermaidData/mermaidDataProptypes'
import {createPortal} from 'react-dom'
import {databaseSwitchboardPropTypes} from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboard'
import {LabelThatLooksLikeATh, RowThatLooksLikeAnEvenTr} from '../ImageAnnotationModal.styles'
import {Select} from '../../../../generic/form'
import {useSelectNewAttribute} from '../../useSelectNewAttribute'
import NewAttributeModal from './NewAttributeModal'
import {unclassifiedGuid} from '../../../../../library/constants/constants'
import {useTranslation} from "react-i18next";

const isClassified = ({annotations}) => annotations.length > 0

const isAClassifierGuessOfSelectedPoint = (annotations, ba_gr) =>
    annotations.some((annotation) => annotation.is_machine_created && annotation.ba_gr === ba_gr)

const isOptionAlreadyAdded = (acc, value) => acc.some((option) => option.value === value)

const SelectAttributeFromClassifierGuesses = ({
                                                  selectedPoint,
                                                  dataToReview,
                                                  setDataToReview,
                                                  setIsDataUpdatedSinceLastSave,
                                                  databaseSwitchboardInstance,
                                              }) => {
    const {t} = useTranslation()
    const rowKeyForPoint = selectedPoint.annotations[0]?.ba_gr
    const isSelectedPointUnclassified = rowKeyForPoint === unclassifiedGuid

    const existingRowDropdownOptions = dataToReview.points
        .reduce((acc, currentPoint) => {
            const annotations = currentPoint.annotations[0]
            if (!annotations) {
                return acc
            }
            const {ba_gr, ba_gr_label} = annotations

            if (
                isClassified(currentPoint) &&
                !isOptionAlreadyAdded(acc, ba_gr) &&
                !isAClassifierGuessOfSelectedPoint(selectedPoint.annotations, ba_gr) &&
                ba_gr !== unclassifiedGuid
            ) {
                acc.push({label: ba_gr_label, value: ba_gr})
            }

            return acc
        }, [])
        .sort((a, b) => a.label.localeCompare(b.label))

    const isPointInARow = existingRowDropdownOptions?.some((row) => rowKeyForPoint === row.value)
    const selectedExistingRow = isPointInARow ? rowKeyForPoint : ''

    const {
        handleDisplayNewRowSelection,
        benthicAttributeSelectOptions,
        growthFormSelectOptions,
        shouldDisplayModal,
        handleCloseModal,
        selectedBenthicAttr,
        setSelectedBenthicAttr,
        handleAddNewRowClick,
        setSelectedGrowthForm,
    } = useSelectNewAttribute({
        selectedPoint,
        dataToReview,
        setDataToReview,
        databaseSwitchboardInstance,
        setIsDataUpdatedSinceLastSave,
    })

    const handleSelectOnChange = (event) => {
        const existingAnnotation = event.target.value
        if (!existingAnnotation) {
            return
        }
        if (existingAnnotation === 'selectNewAttribute') {
            handleDisplayNewRowSelection()
            return
        }
        addExistingAnnotation(existingAnnotation)
    }

    const addExistingAnnotation = (existingAnnotation) => {
        const [benthic_attribute, growth_form] = existingAnnotation.split('_')

        // Only want classifier guesses, and want them unconfirmed.
        const resetAnnotationsForPoint = selectedPoint.annotations.reduce((acc, currentAnnotation) => {
            if (currentAnnotation.is_machine_created) {
                acc.push({...currentAnnotation, is_confirmed: false})
            }

            return acc
        }, [])

        const labelForExistingAnnotation = existingRowDropdownOptions.find(
            ({value}) => value === existingAnnotation,
        )?.label

        const annotationToAdd = {
            ba_gr: existingAnnotation,
            ba_gr_label: labelForExistingAnnotation,
            benthic_attribute,
            growth_form: growth_form === 'null' ? null : growth_form,
            is_confirmed: false,
            is_machine_created: false,
        }

        const updatedAnnotations = [annotationToAdd, ...resetAnnotationsForPoint]

        const updatedPoints = dataToReview.points.map((point) =>
            point.id === selectedPoint.id ? {...point, annotations: updatedAnnotations} : point,
        )
        setDataToReview({...dataToReview, points: updatedPoints})
        setIsDataUpdatedSinceLastSave(true)
    }

    return (
        <>
            {isSelectedPointUnclassified && (
                <LabelThatLooksLikeATh>
                    {t('image_classification.attribute_growth_form')}
                </LabelThatLooksLikeATh>
            )}
            <RowThatLooksLikeAnEvenTr>
                <input
                    type="radio"
                    id="existing-row-point-selection"
                    name="existing-row-point-selection"
                    value="existing-row"
                    disabled={!selectedExistingRow}
                    checked={selectedPoint.annotations[0]?.ba_gr === selectedExistingRow}
                    onChange={() => addExistingAnnotation(selectedExistingRow)}
                />

                <Select
                    label={t('image_classification.select_attribute')}
                    value={selectedExistingRow}
                    onChange={handleSelectOnChange}
                >
                    <option value="" disabled>
                        {t('image_classification.select_attribute')}
                    </option>
                    {existingRowDropdownOptions?.map((row) => (
                        <option key={row.value} value={row.value}>
                            {row.label}
                        </option>
                    ))}
                    <option disabled>──────────</option>
                    <option value="selectNewAttribute">{t('image_classification.select_new_attribute')}...</option>
                </Select>
            </RowThatLooksLikeAnEvenTr>
            {createPortal(
                //modal will otherwise populate within the map container
                <NewAttributeModal
                    benthicAttributeSelectOptions={benthicAttributeSelectOptions}
                    growthFormSelectOptions={growthFormSelectOptions}
                    shouldDisplayModal={shouldDisplayModal}
                    handleCloseModal={handleCloseModal}
                    selectedBenthicAttr={selectedBenthicAttr}
                    setSelectedBenthicAttr={setSelectedBenthicAttr}
                    handleAddNewRowClick={handleAddNewRowClick}
                    setSelectedGrowthForm={setSelectedGrowthForm}
                />,
                document.body,
            )}
        </>
    )
}

SelectAttributeFromClassifierGuesses.propTypes = {
    selectedPoint: imageClassificationPointPropType.isRequired,
    dataToReview: imageClassificationResponsePropType.isRequired,
    setDataToReview: PropTypes.func.isRequired,
    setIsDataUpdatedSinceLastSave: PropTypes.func.isRequired,
    databaseSwitchboardInstance: databaseSwitchboardPropTypes,
}

export default SelectAttributeFromClassifierGuesses
