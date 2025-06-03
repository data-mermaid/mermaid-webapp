import {useState} from 'react'
import {getBenthicOptions} from '../../../library/getOptions'
import {toast} from 'react-toastify'
import {useHttpResponseErrorHandler} from '../../../App/HttpResponseErrorHandlerContext'

const isAClassifierGuessOfSelectedPoint = (annotations, ba_gr) =>
    annotations.some((annotation) => annotation.is_machine_created && annotation.ba_gr === ba_gr)

export const useSelectNewAttribute = ({
                                          selectedPoint,
                                          dataToReview,
                                          setDataToReview,
                                          databaseSwitchboardInstance,
                                          setIsDataUpdatedSinceLastSave,
                                      }) => {
    const [shouldDisplayModal, setShouldDisplayModal] = useState(false)
    const [benthicAttributeSelectOptions, setBenthicAttributeSelectOptions] = useState([])
    const [growthFormSelectOptions, setGrowthFormSelectOptions] = useState([])
    const [selectedBenthicAttr, setSelectedBenthicAttr] = useState('')
    const [selectedGrowthForm, setSelectedGrowthForm] = useState('')
    const handleHttpResponseError = useHttpResponseErrorHandler()

    const handleDisplayNewRowSelection = () => {
        const promises = [
            databaseSwitchboardInstance.getBenthicAttributes(),
            databaseSwitchboardInstance.getChoices(),
        ]

        Promise.all(promises)
            .then(([benthicAttributes, choices]) => {
                const benthicOptions = getBenthicOptions(benthicAttributes)
                const growthFormOptions = choices.growthforms.data
                setBenthicAttributeSelectOptions(benthicOptions)
                setGrowthFormSelectOptions(growthFormOptions)
                if (benthicOptions.length && growthFormOptions.length) {
                    setShouldDisplayModal(true)
                }
            })
            .catch((error) => {
                handleHttpResponseError({
                    error,
                    callback: () => {
                        toast.error('Failed to retrieve benthic attributes and growth forms.', error.message)
                    },
                    shouldShowServerNonResponseMessage: false,
                })
            })
    }

    const handleCloseModal = () => {
        setSelectedBenthicAttr('')
        setSelectedGrowthForm('')
        setShouldDisplayModal(false)
    }

    const selectClassifierGuess = () => {
        const updatedAnnotations = selectedPoint.annotations.reduce(
            (accumulator, currentAnnotation) => {
                const {ba_gr, is_machine_created: isClassifierGuess} = currentAnnotation

                if (!isClassifierGuess) {
                    return accumulator
                }

                const moveMatchingClassifierGuessToAccumulatorStartIndex = () => {
                    if (`${selectedBenthicAttr}_${selectedGrowthForm || null}` === ba_gr) {
                        accumulator.unshift(currentAnnotation)
                    } else {
                        accumulator.push(currentAnnotation)
                    }
                }

                moveMatchingClassifierGuessToAccumulatorStartIndex()

                return accumulator
            },
            [],
        )

        const updatedPoints = dataToReview.points.map((point) =>
            point.id === selectedPoint.id ? {...point, annotations: updatedAnnotations} : point,
        )

        setDataToReview({...dataToReview, points: updatedPoints})
        setIsDataUpdatedSinceLastSave(true)
        handleCloseModal()
    }

    const addNewAnnotation = () => {
        const classifierGuessesWithConfirmationReset = selectedPoint.annotations
            .filter((annotation) => annotation.is_machine_created)
            .map((annotation) => ({...annotation, is_confirmed: false}))

        const benthicAttributeLabel = benthicAttributeSelectOptions.find(
            ({value}) => value === selectedBenthicAttr,
        )?.label
        const growthFormLabel = growthFormSelectOptions
            .find(({id}) => id === selectedGrowthForm)
            ?.name.toLowerCase()

        const annotationToAdd = {
            ba_gr: `${selectedBenthicAttr}_${selectedGrowthForm || null}`,
            ba_gr_label: growthFormLabel
                ? `${benthicAttributeLabel} ${growthFormLabel}`
                : benthicAttributeLabel,
            benthic_attribute: selectedBenthicAttr,
            growth_form: selectedGrowthForm || null,
            is_confirmed: false,
            is_machine_created: false,
        }

        const updatedAnnotations = [annotationToAdd, ...classifierGuessesWithConfirmationReset]

        const updatedPoints = dataToReview.points.map((point) =>
            point.id === selectedPoint.id ? {...point, annotations: updatedAnnotations} : point,
        )

        setDataToReview({...dataToReview, points: updatedPoints})
        setIsDataUpdatedSinceLastSave(true)
        handleCloseModal()
    }

    const handleAddNewRowClick = () => {
        if (
            isAClassifierGuessOfSelectedPoint(
                selectedPoint.annotations,
                `${selectedBenthicAttr}_${selectedGrowthForm || null}`,
            )
        ) {
            selectClassifierGuess()
        } else {
            addNewAnnotation()
        }
    }

    return {
        handleDisplayNewRowSelection,
        benthicAttributeSelectOptions,
        growthFormSelectOptions,
        shouldDisplayModal,
        handleCloseModal,
        selectedBenthicAttr,
        setSelectedBenthicAttr,
        handleAddNewRowClick,
        setSelectedGrowthForm,
    }
}
