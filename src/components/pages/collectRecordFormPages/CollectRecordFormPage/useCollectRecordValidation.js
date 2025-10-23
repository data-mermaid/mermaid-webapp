import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'

const useCollectRecordValidation = ({
  collectRecordBeingEdited,
  databaseSwitchboardInstance,
  formikInstance,
  handleCollectRecordChange,
  isParentDataLoading,
  observationTableRef,
  projectId,
  recordId,
  setAreValidationsShowing,
  setIsFormDirty,
  setValidateButtonState,
  setIsSubmitWarningVisible,
}) => {
  const { t } = useTranslation()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const getValidationButtonStatus = useCallback((collectRecord) => {
    return collectRecord?.validations?.status === 'ok'
      ? buttonGroupStates.validated
      : buttonGroupStates.validatable
  }, [])

  useEffect(
    function checkValidateButton() {
      if (!isParentDataLoading) {
        setValidateButtonState(getValidationButtonStatus(collectRecordBeingEdited))
      }
    },
    [
      isParentDataLoading,
      collectRecordBeingEdited,
      getValidationButtonStatus,
      setValidateButtonState,
    ],
  )

  const handleValidate = () => {
    setValidateButtonState(buttonGroupStates.validating)

    databaseSwitchboardInstance
      .validateSampleUnit({ recordId, projectId })
      .then((validatedRecordResponse) => {
        const isErrorOrWarning =
          validatedRecordResponse.validations.status === 'error' ||
          validatedRecordResponse.validations.status === 'warning'
        setAreValidationsShowing(true)
        handleCollectRecordChange(validatedRecordResponse)
        setValidateButtonState(getValidationButtonStatus(validatedRecordResponse))
        setIsSubmitWarningVisible(isErrorOrWarning)

        if (validatedRecordResponse.validations.status === 'ok') {
          toast.success(...getToastArguments(t('success.collect_record_validated')))
        }
      })
      .catch((error) => {
        setValidateButtonState(buttonGroupStates.validatable)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(t('error.collect_record_validation')))
          },
        })
      })
  }

  const validationPropertiesWithDirtyResetOnInputChange = (validationProperties, property) => {
    // for UX purpose only, validation is cleared when input is on change after page is validated
    const validationDirtyCheck =
      formikInstance.values[property] !== formikInstance.initialValues[property]
        ? null
        : validationProperties.validationType

    return {
      ...validationProperties,
      validationType: validationDirtyCheck,
    }
  }

  const handleScrollToObservation = () => {
    observationTableRef.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const ignoreObservationValidations = useCallback(
    ({ observationId }) => {
      databaseSwitchboardInstance
        .ignoreObservationValidations({
          recordId: collectRecordBeingEdited.id,
          observationId,
        })
        .then((recordWithIgnoredValidations) => {
          handleCollectRecordChange(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(t('error.collect_record_validation_ignore')))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleCollectRecordChange,
      handleHttpResponseError,
      setIsFormDirty,
    ],
  )

  const ignoreNonObservationFieldValidations = useCallback(
    ({ validationPath }) => {
      if (collectRecordBeingEdited && validationPath) {
        databaseSwitchboardInstance
          .ignoreNonObservationFieldValidations({
            record: collectRecordBeingEdited,
            validationPath,
          })
          .then((recordWithIgnoredValidations) => {
            handleCollectRecordChange(recordWithIgnoredValidations)
            setIsFormDirty(true)
          })
          .catch((error) => {
            handleHttpResponseError({
              error,
              callback: () => {
                toast.error(...getToastArguments(t('error.collect_record_validation_ignore')))
              },
            })
          })
      }
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleCollectRecordChange,
      handleHttpResponseError,
      setIsFormDirty,
    ],
  )

  const resetObservationValidations = useCallback(
    ({ observationId }) => {
      if (collectRecordBeingEdited && observationId) {
        databaseSwitchboardInstance
          .resetObservationValidations({ recordId: collectRecordBeingEdited.id, observationId })
          .then((recordWithResetValidations) => {
            handleCollectRecordChange(recordWithResetValidations)

            setIsFormDirty(true)
          })
          .catch((error) => {
            handleHttpResponseError({
              error,
              callback: () => {
                toast.error(...getToastArguments(t('error.collect_record_validation_reset')))
              },
            })
          })
      }
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleCollectRecordChange,
      handleHttpResponseError,
      setIsFormDirty,
    ],
  )

  const resetRecordLevelValidation = useCallback(
    ({ validationId }) => {
      databaseSwitchboardInstance
        .resetRecordLevelValidation({
          record: collectRecordBeingEdited,
          validationId,
        })
        .then((recordWithResetValidations) => {
          handleCollectRecordChange(recordWithResetValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(t('error.collect_record_validation_reset')))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleCollectRecordChange,
      handleHttpResponseError,
      setIsFormDirty,
    ],
  )

  const resetNonObservationFieldValidations = useCallback(
    ({ validationPath }) => {
      if (collectRecordBeingEdited && validationPath) {
        databaseSwitchboardInstance
          .resetNonObservationFieldValidations({
            record: collectRecordBeingEdited,
            validationPath,
          })
          .then((recordWithResetValidations) => {
            handleCollectRecordChange(recordWithResetValidations)
            setIsFormDirty(true)
          })
          .catch((error) => {
            handleHttpResponseError({
              error,
              callback: () => {
                toast.error(...getToastArguments(t('error.collect_record_validation_reset')))
              },
            })
          })
      }
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleCollectRecordChange,
      handleHttpResponseError,
      setIsFormDirty,
    ],
  )

  const ignoreRecordLevelValidation = useCallback(
    ({ validationId }) => {
      databaseSwitchboardInstance
        .ignoreRecordLevelValidation({
          record: collectRecordBeingEdited,
          validationId,
        })
        .then((recordWithIgnoredValidations) => {
          handleCollectRecordChange(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(t('error.collect_record_validation_ignore')))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleCollectRecordChange,
      handleHttpResponseError,
      setIsFormDirty,
    ],
  )

  return {
    handleScrollToObservation,
    handleValidate,
    ignoreNonObservationFieldValidations,
    ignoreObservationValidations,
    ignoreRecordLevelValidation,
    resetNonObservationFieldValidations,
    resetObservationValidations,
    resetRecordLevelValidation,
    validationPropertiesWithDirtyResetOnInputChange,
  }
}

export default useCollectRecordValidation
