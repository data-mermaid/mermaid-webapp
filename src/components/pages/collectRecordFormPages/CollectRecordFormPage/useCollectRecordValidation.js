import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import getValidationTargets from './getValidationTargets'
import theme from '../../../../theme'

const HIGHLIGHT_CLASS = 'validation-target-highlight'
const HIGHLIGHT_COLOR_VAR = '--validation-target-highlight-color'

const highlightColorByType = {
  error: theme.color.chipErrorBackground,
  warning: theme.color.chipWarningBackground,
  ignored: theme.color.chipIgnoreBackground,
}

const findTargetElement = (target) => {
  if (target.kind === 'record') {
    return document.querySelector(`[data-record-validation-id="${target.validationId}"]`)
  }
  if (target.kind === 'field') {
    return document.querySelector(`[data-validation-path="${target.validationPath}"]`)
  }
  return document.querySelector(`[data-observation-id="${target.observationId}"]`)
}

const scrollToAndHighlight = (element, type) => {
  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  element.style.setProperty(HIGHLIGHT_COLOR_VAR, highlightColorByType[type])
  element.classList.remove(HIGHLIGHT_CLASS)

  void element.offsetWidth // restart CSS animation
  element.classList.add(HIGHLIGHT_CLASS)
  setTimeout(() => {
    element.classList.remove(HIGHLIGHT_CLASS)
    element.style.removeProperty(HIGHLIGHT_COLOR_VAR)
  }, theme.timing.validationTargetHighlightMs)
}

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
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { t } = useTranslation()
  const validationIgnoreText = t('sample_units.errors.validation_ignore')
  const validationResetText = t('sample_units.errors.validation_reset')

  // Per-chip cursors — refs so advancing doesn't trigger a render.
  // Reset to 0 whenever validations get refreshed (see handleValidate below).
  const nextCursorsRef = useRef({ error: 0, warning: 0, ignored: 0 })
  const resetNextCursors = () => {
    nextCursorsRef.current = { error: 0, warning: 0, ignored: 0 }
  }
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
        resetNextCursors()
        handleCollectRecordChange(validatedRecordResponse)
        setValidateButtonState(getValidationButtonStatus(validatedRecordResponse))
        setIsSubmitWarningVisible(isErrorOrWarning)

        if (validatedRecordResponse.validations.status === 'ok') {
          toast.success(...getToastArguments(t('sample_units.success.record_validated')))
        }
      })
      .catch((error) => {
        setValidateButtonState(buttonGroupStates.validatable)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(t('sample_units.errors.validation_unavailable')))
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
              toast.error(...getToastArguments(validationIgnoreText))
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
      validationIgnoreText,
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
                toast.error(...getToastArguments(validationIgnoreText))
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
      validationIgnoreText,
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
                toast.error(...getToastArguments(validationResetText))
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
      validationResetText,
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
              toast.error(...getToastArguments(validationResetText))
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
      validationResetText,
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
                toast.error(...getToastArguments(validationResetText))
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
      validationResetText,
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
              toast.error(...getToastArguments(validationIgnoreText))
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
      validationIgnoreText,
    ],
  )

  // Recompute each render — the reset flow mutates the results subtree in place
  // (see setObjectPropertyOnClone), so reference-based memoization would miss updates.
  // Chip counts derive from the (deduped) navigation targets so the number matches
  // what the user can navigate to and what's visible inline.
  const validationTargets = getValidationTargets(collectRecordBeingEdited?.validations?.results)
  const validationCounts = {
    errorCount: validationTargets.error.length,
    warningCount: validationTargets.warning.length,
    ignoredCount: validationTargets.ignored.length,
  }

  const goToNextValidation = useCallback(
    (type) => {
      const targets = getValidationTargets(collectRecordBeingEdited?.validations?.results)[type]
      if (!targets || targets.length === 0) {
        return
      }

      // Resolve targets to DOM elements and sort by vertical page position so the
      // cursor advances top-to-bottom regardless of API key order.
      const resolved = targets
        .map((target) => ({ target, element: findTargetElement(target) }))
        .filter((entry) => entry.element !== null)

      if (resolved.length === 0) {
        return
      }

      resolved.sort(
        (a, b) => a.element.getBoundingClientRect().top - b.element.getBoundingClientRect().top,
      )

      const cursor = nextCursorsRef.current[type] % resolved.length
      nextCursorsRef.current[type] = cursor + 1

      scrollToAndHighlight(resolved[cursor].element, type)
    },
    [collectRecordBeingEdited],
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
    validationCounts,
    goToNextValidation,
  }
}

export default useCollectRecordValidation
