import { useState, useCallback } from 'react'

/**
 * Custom hook for managing onBlur validation (simplified version)
 *
 * Features:
 * - Saves the record before validating
 * - Provides validation state (idle, validating)
 * - Non-blocking validation UX
 *
 * @param {Object} params
 * @param {Object} params.databaseSwitchboardInstance - Database API instance
 * @param {string} params.projectId - Project ID
 * @param {string} params.recordId - CollectRecord ID
 * @param {string} params.profileId - User profile ID
 * @param {string} params.protocol - Protocol name (e.g., 'fishbelt')
 * @param {Function} params.handleCollectRecordChange - Callback when record updates
 * @param {Function} params.setAreValidationsShowing - Show/hide validations
 * @param {Function} params.setIsFormDirty - Mark form as dirty/clean
 * @param {Function} params.sampleUnitFormatSaveFunction - Formats record for saving
 * @param {Object} params.collectRecordBeingEdited - Current collect record
 * @param {Object} params.formik - Formik instance
 * @param {Object} params.observationsTable1State - Observations reducer state
 * @param {Object} params.observationsTable2State - Observations reducer state (optional)
 * @returns {Object} - { isValidating, handleFieldBlur }
 */
const useOnBlurValidation = ({
  databaseSwitchboardInstance,
  projectId,
  recordId,
  profileId,
  protocol,
  handleCollectRecordChange,
  setAreValidationsShowing,
  setIsFormDirty,
  sampleUnitFormatSaveFunction,
  collectRecordBeingEdited,
  formik,
  observationsTable1State,
  observationsTable2State,
}) => {
  const [isValidating, setIsValidating] = useState(false)

  /**
   * Triggers validation: saves the record, then validates it
   * Runs validation regardless of field value (supports 'auto validate' mode)
   * Can be called from both onChange and onBlur events
   */
  const triggerValidation = useCallback(
    () => {
      // Set validation in progress flag
      setIsValidating(true)

      // Step 1: Format and save the record
      const recordToSubmit = sampleUnitFormatSaveFunction({
        collectRecordBeingEdited,
        formikValues: formik.values,
        observationsTable1State,
        observationsTable2State,
      })

      // Step 2: Save, then validate
      databaseSwitchboardInstance
        .saveSampleUnit({
          record: recordToSubmit,
          profileId,
          projectId,
          protocol
        })
        .then((savedRecordResponse) => {
          // Update the form with saved record
          handleCollectRecordChange(savedRecordResponse)
          setIsFormDirty(false)

          // Reset Formik's dirty state
          if (formik?.resetForm) {
            formik.resetForm({ values: formik.values })
          }

          // Step 3: Now validate the saved record
          return databaseSwitchboardInstance.validateSampleUnit({
            recordId: savedRecordResponse.id,
            projectId
          })
        })
        .then((validatedRecordResponse) => {
          // Show validations in the UI
          setAreValidationsShowing(true)
          handleCollectRecordChange(validatedRecordResponse)
        })
        .catch((error) => {
          // Silently fail for PoC - in production, you might want to log this
          console.error('OnBlur validation error:', error)
        })
        .finally(() => {
          // Always clear the validation flag when done
          setIsValidating(false)
        })
    },
    [
      formik,
      collectRecordBeingEdited,
      observationsTable1State,
      observationsTable2State,
      sampleUnitFormatSaveFunction,
      databaseSwitchboardInstance,
      profileId,
      projectId,
      protocol,
      recordId,
      handleCollectRecordChange,
      setAreValidationsShowing,
      setIsFormDirty,
    ]
  )

  /**
   * Wrapper for field blur events
   * Calls Formik's handleBlur, then triggers validation
   *
   * @param {Event} event - Blur event
   */
  const handleFieldBlur = useCallback(
    (event) => {
      // First, let Formik handle the blur event for touched state
      if (formik?.handleBlur) {
        formik.handleBlur(event)
      }

      // Trigger validation
      triggerValidation()
    },
    [formik, triggerValidation]
  )

  /**
   * Wrapper for field change events
   * Calls the original onChange handler, then triggers validation
   *
   * @param {Function} originalOnChange - The original onChange handler
   * @returns {Function} - Wrapped onChange handler
   */
  const createOnChangeWithValidation = useCallback(
    (originalOnChange) => {
      return (event) => {
        // First, call the original onChange
        if (originalOnChange) {
          originalOnChange(event)
        }

        // Then trigger validation
        triggerValidation()
      }
    },
    [triggerValidation]
  )

  return {
    isValidating,
    handleFieldBlur,
    createOnChangeWithValidation,
    triggerValidation,
  }
}

export default useOnBlurValidation
