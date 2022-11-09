import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import language from '../../../../language'
import { getBenthicOptions } from '../../../../library/getOptions'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'

const useCollectRecordObservations = ({ observationsReducer }) => {
  const [observationsState, observationsDispatch] = observationsReducer // eslint-disable-line no-unused-vars
  const [newBenthicAttributeToAdd, setNewBenthicAttributeToAdd] = useState()
  const [isNewBenthicAttributeModalOpen, setIsNewBenthicAttributeModalOpen] = useState(false)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [, setBenthicAttributeOptions] = useState([])
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { currentUser } = useCurrentUser()

  const persistUnsavedObservationsUtilities = useUnsavedDirtyFormDataUtilities(
    `${currentUser.id}-unsavedObservations`,
  )

  const {
    clearPersistedUnsavedFormData: clearPersistedUnsavedObservationsData,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsData,
  } = persistUnsavedObservationsUtilities
  const closeNewBenthicAttributeModal = () => {
    setIsNewBenthicAttributeModalOpen(false)
  }

  const handleNewObservationAdd = useCallback(
    (observationAttributeId) => setNewBenthicAttributeToAdd(observationAttributeId),
    [],
  )
  const openNewObservationModal = useCallback(
    (observationId) => {
      handleNewObservationAdd(observationId)
      setIsNewBenthicAttributeModalOpen(true)
    },
    [handleNewObservationAdd],
  )
  const updateBenthicAttributeOptionsStateWithOfflineStorageData = useCallback(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getBenthicAttributes().then((benthicAttributes) => {
        const updatedBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

        setBenthicAttributeOptions(updatedBenthicAttributeOptions)
      })
    }
  }, [databaseSwitchboardInstance])

  const onSubmitNewBenthicAttribute = ({
    benthicAttributeParentId,
    benthicAttributeParentName,
    newBenthicAttributeName,
  }) => {
    return databaseSwitchboardInstance
      .addBenthicAttribute({
        benthicAttributeParentId,
        benthicAttributeParentName,
        newBenthicAttributeName,
      })
      .then((newBenthicAttribute) => {
        observationsDispatch({
          type: 'updateBenthicAttribute',
          payload: {
            observationId: newBenthicAttributeToAdd,
            newBenthicAttribute: newBenthicAttribute.id,
          },
        })
        updateBenthicAttributeOptionsStateWithOfflineStorageData() // why doesnt the above dispatch update the ui?
        toast.success(...getToastArguments(language.success.attributeSave('benthic attribute')))
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            if (error.message === 'Benthic attribute already exists') {
              toast.error(
                ...getToastArguments(language.error.attributeAlreadyExists('benthic attribute')),
              )

              observationsDispatch({
                type: 'updateBenthicAttribute',
                payload: {
                  observationId: newBenthicAttributeToAdd,
                  newBenthicAttribute: error.existingBenthicAttribute.id,
                },
              })
            } else {
              toast.error(...getToastArguments(language.error.attributeSave('benthic attribute')))
            }
          },
        })
      })
  }

  return {
    closeNewBenthicAttributeModal,
    isNewBenthicAttributeModalOpen,
    onSubmitNewBenthicAttribute,
    openNewObservationModal,
    clearPersistedUnsavedObservationsData,
    getPersistedUnsavedObservationsData,
  }
}

export default useCollectRecordObservations
