import { useState } from 'react'
import { getBenthicOptions } from '../../../library/getOptions'
import { toast } from 'react-toastify'

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

  const handleDisplayNewRowSelection = () => {
    const promises = [
      databaseSwitchboardInstance.getBenthicAttributes(),
      databaseSwitchboardInstance.getChoices(),
    ]

    Promise.all(promises)
      .then(([benthicAttributes, choices]) => {
        setBenthicAttributeSelectOptions(getBenthicOptions(benthicAttributes))
        setGrowthFormSelectOptions(choices.growthforms.data)
        setShouldDisplayModal(true)
      })
      .catch(() => {
        toast.error('Failed to retrieve benthic attributes and growth forms')
      })
  }

  const handleCloseModal = () => {
    setSelectedBenthicAttr('')
    setSelectedGrowthForm('')
    setShouldDisplayModal(false)
  }

  const selectClassifierGuessAsConfirmedAnnotation = () => {
    const updatedAnnotations = selectedPoint.annotations.reduce((acc, currentAnnotation) => {
      const { ba_gr, is_machine_created } = currentAnnotation

      // only want classifier guesses
      if (!is_machine_created) {
        return acc
      }

      // Move the matching classifier guess to front of array and confirm. Unconfirm the rest.
      if (`${selectedBenthicAttr}_${selectedGrowthForm || null}` === ba_gr) {
        acc.unshift({ ...currentAnnotation, is_confirmed: true })
      } else {
        acc.push({ ...currentAnnotation, is_confirmed: false })
      }

      return acc
    }, [])

    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id ? { ...point, annotations: updatedAnnotations } : point,
    )

    setDataToReview({ ...dataToReview, points: updatedPoints })
    setIsDataUpdatedSinceLastSave(true)
    handleCloseModal()
  }

  const addNewAnnotation = () => {
    // Only want classifier guesses, and want them unconfirmed.
    const resetAnnotationsForPoint = selectedPoint.annotations.reduce((acc, currentAnnotation) => {
      if (currentAnnotation.is_machine_created) {
        acc.push({ ...currentAnnotation, is_confirmed: false })
      }

      return acc
    }, [])

    const benthicAttributeLabel = benthicAttributeSelectOptions.find(
      ({ value }) => value === selectedBenthicAttr,
    )?.label
    const growthFormLabel = growthFormSelectOptions
      .find(({ id }) => id === selectedGrowthForm)
      ?.name.toLowerCase()

    const annotationToAdd = {
      ba_gr: `${selectedBenthicAttr}_${selectedGrowthForm || null}`,
      ba_gr_label: growthFormLabel
        ? `${benthicAttributeLabel} ${growthFormLabel}`
        : benthicAttributeLabel,
      benthic_attribute: selectedBenthicAttr,
      growth_form: selectedGrowthForm || null,
      is_confirmed: true,
      is_machine_created: false,
    }

    const updatedAnnotations = [annotationToAdd, ...resetAnnotationsForPoint]

    const updatedPoints = dataToReview.points.map((point) =>
      point.id === selectedPoint.id ? { ...point, annotations: updatedAnnotations } : point,
    )

    setDataToReview({ ...dataToReview, points: updatedPoints })
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
      selectClassifierGuessAsConfirmedAnnotation()
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
