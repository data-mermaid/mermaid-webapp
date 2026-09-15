import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import getValidationTargets from './getValidationTargets'
import theme from '../../../../theme'

const HIGHLIGHT_CLASS = 'validation-target-highlight'
const HIGHLIGHT_COLOR_VAR = '--validation-target-highlight-color'

// A pale wash of the validation type's colour. Ignored uses the row's own stripe colour, not
// the ignored chip fill, which is a solid grey and too heavy across a full-width row.
const highlightColorByType = {
  error: theme.color.chipErrorBackground,
  warning: theme.color.chipWarningBackground,
  ignored: theme.color.ignore,
}

const findTargetElement = (target) =>
  document.querySelector(`[${target.attribute}="${target.value}"]`)

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Focus stays on the chip so it can be pressed again, which means this text is the only way
// a screen reader learns where the page went. The row already reads as its label, severity
// and message, so repeating it is enough; the cap keeps a wide observation row from reciting
// every cell.
const describeTarget = (element) => element.textContent.replace(/\s+/g, ' ').trim().slice(0, 120)

const useCollectRecordValidation = ({
  collectRecordBeingEdited,
  databaseSwitchboardInstance,
  formikInstance,
  handleCollectRecordChange,
  isParentDataLoading,
  observationIdsOnPage,
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

  const [nextAnnouncement, setNextAnnouncement] = useState('')

  // The highlight in flight. Tracked so a second Next restarts the fade instead of letting
  // the previous timer strip the class part way through, and so nothing fires after unmount.
  const highlightRef = useRef({ element: null, timeoutId: null })

  const clearHighlight = useCallback(() => {
    const { element, timeoutId } = highlightRef.current

    clearTimeout(timeoutId)

    if (element) {
      element.classList.remove(HIGHLIGHT_CLASS)
      element.style.removeProperty(HIGHLIGHT_COLOR_VAR)
    }

    highlightRef.current = { element: null, timeoutId: null }
  }, [])

  useEffect(() => clearHighlight, [clearHighlight])

  const scrollToAndHighlight = (element, type) => {
    clearHighlight()

    element.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    })

    element.style.setProperty(HIGHLIGHT_COLOR_VAR, highlightColorByType[type])
    void element.offsetWidth // restart the CSS animation
    element.classList.add(HIGHLIGHT_CLASS)

    highlightRef.current = {
      element,
      timeoutId: setTimeout(clearHighlight, theme.timing.validationTargetHighlightMs),
    }
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

  // Has the user edited this input since the record was last validated? Formik reinitialises
  // from the record on save and on validate, so initialValues is always the last validated
  // state. Both the inline badge below and the status indicator chips read this one function,
  // so a field that stops showing a badge also stops being counted and navigated to.
  const isFieldValueDirty = (property) =>
    formikInstance.values[property] !== formikInstance.initialValues[property]

  const validationPropertiesWithDirtyResetOnInputChange = (validationProperties, property) => {
    // for UX purpose only, validation is cleared when input is on change after page is validated
    const validationDirtyCheck = isFieldValueDirty(property)
      ? null
      : validationProperties.validationType

    return {
      ...validationProperties,
      validationType: validationDirtyCheck,
    }
  }

  // A record-level validation names the observation table it is about in `fields`, as
  // `data.obs_*`. Bleaching is the only protocol with two tables, so without matching on the
  // name its percent cover warnings scroll to the colonies bleached table above.
  const handleScrollToObservation = (fields = []) => {
    const namedTable = fields
      .map((field) =>
        document.querySelector(`[data-observation-table="${field.replace('data.', '')}"]`),
      )
      .find(Boolean)

    const target = namedTable ?? observationTableRef.current

    target?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
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
  const validationTargets = getValidationTargets(
    collectRecordBeingEdited?.validations?.results,
    isFieldValueDirty,
    observationIdsOnPage,
  )
  const validationCounts = {
    errorCount: validationTargets.error.length,
    warningCount: validationTargets.warning.length,
    ignoredCount: validationTargets.ignored.length,
  }

  // Not memoised: validationTargets is rebuilt every render (see above), so any memo would
  // be invalidated every render anyway. FormStatusIndicators is not memoised either, so a
  // fresh function identity costs nothing.
  const goToNextValidation = (type) => {
    const targets = validationTargets[type]
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

    const { element } = resolved[cursor]

    scrollToAndHighlight(element, type)
    setNextAnnouncement(
      t('sample_units.validation_status.next_announcement', {
        position: cursor + 1,
        total: resolved.length,
        description: describeTarget(element),
      }),
    )
  }

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
    nextAnnouncement,
  }
}

export default useCollectRecordValidation
