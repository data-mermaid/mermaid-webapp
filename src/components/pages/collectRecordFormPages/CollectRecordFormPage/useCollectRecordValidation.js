import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import getValidationSummary from './getValidationSummary'
import { VALIDATION_STATUS } from '../../Collect/collectConstants'

// Marks the item Next last landed on, valued by the chip's type, until Next selects another (see
// globalStyles). An attribute rather than a class, because React rewrites a styled row's class
// when its validations change.
const SELECTED_ATTRIBUTE = 'data-validation-selected'

const findTargetElement = (target) =>
  document.querySelector(`[${target.attribute}="${target.value}"]`)

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Focus stays on the chip, so this text is the only way a screen reader learns where the
// page went. The cap stops a wide observation row reciting every cell.
const describeTarget = (element) => element.textContent.replace(/\s+/g, ' ').trim().slice(0, 120)

const getIsErrorOrWarning = (collectRecord) =>
  collectRecord.validations?.status === VALIDATION_STATUS.error ||
  collectRecord.validations?.status === VALIDATION_STATUS.warning

const getIsValidationResultCurrent = (collectRecord) =>
  collectRecord.validations?.status === VALIDATION_STATUS.ok || getIsErrorOrWarning(collectRecord)

const useCollectRecordValidation = ({
  areValidationsShowing,
  collectRecordBeingEdited,
  databaseSwitchboardInstance,
  disclosureStore,
  handleCollectRecordChange,
  isParentDataLoading,
  observationIdsOnPage,
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

  const selectedElementRef = useRef(null)
  const { open: openDisclosure, close: closeDisclosure } = disclosureStore

  const clearSelection = useCallback(() => {
    selectedElementRef.current?.removeAttribute(SELECTED_ATTRIBUTE)
    selectedElementRef.current = null
  }, [])

  const select = (element, type) => {
    clearSelection()
    element.setAttribute(SELECTED_ATTRIBUTE, type)
    selectedElementRef.current = element
  }

  // Saving hides every finding, and another record (same route, same page) brings its own, so
  // neither leaves anything for Next's stop to point at.
  useEffect(
    function clearNextStop() {
      clearSelection()
      closeDisclosure()
    },
    [areValidationsShowing, recordId, clearSelection, closeDisclosure],
  )

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
    clearSelection()
    closeDisclosure()
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

  const validationSummary = getValidationSummary(
    collectRecordBeingEdited?.validations?.results,
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

    const { element, target } = resolved[cursor]

    // Committed before scrolling, so the scroll measures the field or row open. A record-level
    // message has nothing to open, so landing on one closes whatever was open.
    flushSync(() =>
      target.disclosureKey ? openDisclosure(target.disclosureKey) : closeDisclosure(),
    )
    element.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    })
    select(element, type)
    setNextAnnouncement(
      t('sample_units.validation_status.next_announcement', {
        position: cursor + 1,
        total: resolved.length,
        description: describeTarget(element),
      }),
    )
  }

  return {
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
    validationCounts,
    goToNextValidation,
    nextAnnouncement,
  }
}

export default useCollectRecordValidation
