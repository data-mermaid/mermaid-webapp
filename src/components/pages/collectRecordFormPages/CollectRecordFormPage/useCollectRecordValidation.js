import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import getValidationSummary from './getValidationSummary'
import { VALIDATION_STATUS } from '../../Collect/collectConstants'
import theme from '../../../../theme'

const HIGHLIGHT_CLASS = 'validation-target-highlight'
const HIGHLIGHT_COLOR_VAR = '--validation-target-highlight-color'

// A pale wash of the validation type's colour. Ignored uses the row's own stripe colour, not
// the ignored chip fill, which is a solid grey and too heavy across a full-width row.
const highlightColorByType = {
  error: theme.color.chipErrorBackground,
  warning: theme.color.chipWarningBackground,
  ignore: theme.color.ignore,
}

const findTargetElement = (target) =>
  document.querySelector(`[${target.attribute}="${target.value}"]`)

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const STILL_FRAMES_REQUIRED = 3
const MAX_SETTLE_FRAMES = 60

/**
 * Calls back once `element` has stopped moving. Smooth scrolling is asynchronous and `scrollend`
 * is too new to rely on, so this watches the element's position instead. The frame cap stops a
 * user who is scrolling by hand from holding the callback off indefinitely.
 */
const whenScrollSettles = (element, onSettled) => {
  let previousTop = null
  let stillFrames = 0
  let framesWaited = 0
  let frameId

  const check = () => {
    const { top } = element.getBoundingClientRect()

    stillFrames = top === previousTop ? stillFrames + 1 : 0
    previousTop = top
    framesWaited += 1

    if (stillFrames >= STILL_FRAMES_REQUIRED || framesWaited >= MAX_SETTLE_FRAMES) {
      onSettled()

      return
    }

    frameId = requestAnimationFrame(check)
  }

  frameId = requestAnimationFrame(check)

  return () => cancelAnimationFrame(frameId)
}

// Focus stays on the chip, so this text is the only way a screen reader learns where the
// page went. The cap stops a wide observation row reciting every cell.
const describeTarget = (element) => element.textContent.replace(/\s+/g, ' ').trim().slice(0, 120)

const getIsErrorOrWarning = (collectRecord) =>
  collectRecord.validations?.status === VALIDATION_STATUS.error ||
  collectRecord.validations?.status === VALIDATION_STATUS.warning

const getIsValidationResultCurrent = (collectRecord) =>
  collectRecord.validations?.status === VALIDATION_STATUS.ok || getIsErrorOrWarning(collectRecord)

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
  const validationUnignoreText = t('sample_units.errors.validation_unignore')

  // Per-chip cursors — refs so advancing doesn't trigger a render.
  // Reset to 0 whenever validations get refreshed (see handleValidate below).
  const nextCursorsRef = useRef({ error: 0, warning: 0, ignore: 0 })
  const resetNextCursors = () => {
    nextCursorsRef.current = { error: 0, warning: 0, ignore: 0 }
  }

  const [nextAnnouncement, setNextAnnouncement] = useState('')

  // The highlight in flight. Tracked so a second Next restarts the fade instead of letting
  // the previous timer strip the class part way through, and so nothing fires after unmount.
  const highlightRef = useRef({ element: null, timeoutId: null, cancelScrollWatch: null })

  const clearHighlight = useCallback(() => {
    const { element, timeoutId, cancelScrollWatch } = highlightRef.current

    cancelScrollWatch?.()
    clearTimeout(timeoutId)

    if (element) {
      element.classList.remove(HIGHLIGHT_CLASS)
      element.style.removeProperty(HIGHLIGHT_COLOR_VAR)
    }

    highlightRef.current = { element: null, timeoutId: null, cancelScrollWatch: null }
  }, [])

  useEffect(() => clearHighlight, [clearHighlight])

  const scrollToAndHighlight = (element, type) => {
    clearHighlight()

    element.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    })

    element.style.setProperty(HIGHLIGHT_COLOR_VAR, highlightColorByType[type])

    // The fade starts once the page has arrived, so a jump the length of the record cannot
    // finish before the row it is marking comes into view.
    const startFade = () => {
      void element.offsetWidth // restart the CSS animation
      element.classList.add(HIGHLIGHT_CLASS)
      highlightRef.current.timeoutId = setTimeout(
        clearHighlight,
        theme.timing.validationTargetHighlightMs,
      )
    }

    highlightRef.current = {
      element,
      timeoutId: null,
      cancelScrollWatch: whenScrollSettles(element, startFade),
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

  // Any save marks a record's validations stale, so a stored ok, warning, or error result is
  // current, whether Collect or another client (such as mermaidr) ran the validation.
  const recordIdShownOnLoadRef = useRef(null)

  useEffect(
    function showStoredValidationsOnLoad() {
      if (
        isParentDataLoading ||
        !collectRecordBeingEdited ||
        collectRecordBeingEdited.id !== recordId ||
        recordIdShownOnLoadRef.current === recordId
      ) {
        return
      }

      recordIdShownOnLoadRef.current = recordId

      if (getIsValidationResultCurrent(collectRecordBeingEdited)) {
        setAreValidationsShowing(true)
        setIsSubmitWarningVisible(getIsErrorOrWarning(collectRecordBeingEdited))
      }
    },
    [
      isParentDataLoading,
      collectRecordBeingEdited,
      recordId,
      setAreValidationsShowing,
      setIsSubmitWarningVisible,
    ],
  )

  // Shows a record the API has just validated, whether from Validate or from a Submit the API
  // refused after re-validating.
  const showValidationResult = (validatedRecord) => {
    setAreValidationsShowing(true)
    resetNextCursors()
    handleCollectRecordChange(validatedRecord)
    setValidateButtonState(getValidationButtonStatus(validatedRecord))
    setIsSubmitWarningVisible(getIsErrorOrWarning(validatedRecord))
  }

  const handleValidate = () => {
    setValidateButtonState(buttonGroupStates.validating)

    databaseSwitchboardInstance
      .validateSampleUnit({ recordId, projectId })
      .then((validatedRecordResponse) => {
        showValidationResult(validatedRecordResponse)

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

  // Bleaching is the only protocol with two observation tables, so the validation's `fields`
  // decide which one to scroll to.
  const handleScrollToObservation = (fields = []) => {
    const namedTable = fields
      .map((field) =>
        document.querySelector(`[data-observation-table="${field.replace('data.', '')}"]`),
      )
      .find(Boolean)

    const target = namedTable ?? observationTableRef.current

    target?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // Every ignore, un-ignore and mark-stale change is written to IndexedDB by the switchboard;
  // the updated record is shown and a save pushes it. A new record has no stored validations
  // to change yet.
  const applyValidationChange = useCallback(
    (getChange, failureText) => {
      if (!collectRecordBeingEdited) {
        return
      }

      getChange(collectRecordBeingEdited)
        .then((updatedRecord) => {
          handleCollectRecordChange(updatedRecord)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(failureText))
            },
          })
        })
    },
    [collectRecordBeingEdited, handleCollectRecordChange, handleHttpResponseError, setIsFormDirty],
  )

  const ignoreRecordLevelValidation = useCallback(
    ({ validationId }) =>
      applyValidationChange(
        (record) =>
          databaseSwitchboardInstance.ignoreRecordLevelValidation({ record, validationId }),
        validationIgnoreText,
      ),
    [applyValidationChange, databaseSwitchboardInstance, validationIgnoreText],
  )

  const unignoreRecordLevelValidation = useCallback(
    ({ validationId }) =>
      applyValidationChange(
        (record) =>
          databaseSwitchboardInstance.unignoreRecordLevelValidation({ record, validationId }),
        validationUnignoreText,
      ),
    [applyValidationChange, databaseSwitchboardInstance, validationUnignoreText],
  )

  const ignoreNonObservationFieldValidations = useCallback(
    ({ validationPath, validationId }) =>
      applyValidationChange(
        (record) =>
          databaseSwitchboardInstance.ignoreNonObservationFieldValidations({
            record,
            validationPath,
            validationId,
          }),
        validationIgnoreText,
      ),
    [applyValidationChange, databaseSwitchboardInstance, validationIgnoreText],
  )

  const unignoreNonObservationFieldValidations = useCallback(
    ({ validationPath, validationId }) =>
      applyValidationChange(
        (record) =>
          databaseSwitchboardInstance.unignoreNonObservationFieldValidations({
            record,
            validationPath,
            validationId,
          }),
        validationUnignoreText,
      ),
    [applyValidationChange, databaseSwitchboardInstance, validationUnignoreText],
  )

  const markFieldValidationsStale = useCallback(
    ({ validationPath }) =>
      applyValidationChange(
        (record) =>
          databaseSwitchboardInstance.markFieldValidationsStale({ record, validationPath }),
        validationResetText,
      ),
    [applyValidationChange, databaseSwitchboardInstance, validationResetText],
  )

  const ignoreObservationValidations = useCallback(
    ({ observationId, validationId }) =>
      applyValidationChange(
        (record) =>
          databaseSwitchboardInstance.ignoreObservationValidations({
            recordId: record.id,
            observationId,
            validationId,
          }),
        validationIgnoreText,
      ),
    [applyValidationChange, databaseSwitchboardInstance, validationIgnoreText],
  )

  const unignoreObservationValidations = useCallback(
    ({ observationId, validationId }) =>
      applyValidationChange(
        (record) =>
          databaseSwitchboardInstance.unignoreObservationValidations({
            recordId: record.id,
            observationId,
            validationId,
          }),
        validationUnignoreText,
      ),
    [applyValidationChange, databaseSwitchboardInstance, validationUnignoreText],
  )

  const markObservationValidationsStale = useCallback(
    ({ observationId }) =>
      applyValidationChange(
        (record) =>
          databaseSwitchboardInstance.markObservationValidationsStale({
            recordId: record.id,
            observationId,
          }),
        validationResetText,
      ),
    [applyValidationChange, databaseSwitchboardInstance, validationResetText],
  )

  // Rebuilt every render on purpose: isFieldValueDirty reads formik values, so an edited
  // field has to drop out of the counts on the next keystroke.
  const validationSummary = getValidationSummary(
    collectRecordBeingEdited?.validations?.results,
    isFieldValueDirty,
    observationIdsOnPage,
  )
  const validationCounts = {
    errorCount: validationSummary.counts.error,
    warningCount: validationSummary.counts.warning,
    ignoredCount: validationSummary.counts.ignore,
  }

  const goToNextValidation = (type) => {
    const targets = validationSummary.targets[type]
    if (!targets || targets.length === 0) {
      return
    }

    // Resolve targets to DOM elements and sort by vertical page position so the
    // cursor advances top-to-bottom regardless of API key order.
    const resolved = targets
      .map((target) => ({ target, element: findTargetElement(target) }))
      .filter((entry) => entry.element !== null)

    if (resolved.length === 0) {
      if (import.meta.env.DEV) {
        console.warn(`No element found for any ${type} validation target`, targets)
      }

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
    markFieldValidationsStale,
    markObservationValidationsStale,
    showValidationResult,
    unignoreNonObservationFieldValidations,
    unignoreObservationValidations,
    unignoreRecordLevelValidation,
    validationPropertiesWithDirtyResetOnInputChange,
    validationCounts,
    goToNextValidation,
    nextAnnouncement,
  }
}

export default useCollectRecordValidation
