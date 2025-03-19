import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useMemo } from 'react'

import {
  StyledModalInputRow,
  StyledModalFooterWrapper,
  StyledModalLeftFooter,
} from '../subPages/subPages.styles'
import { ButtonCaution, ButtonSecondary } from '../../../../generic/buttons'
import { buttonGroupStates } from '../../../../../library/buttonGroupStates'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import { displayErrorMessagesGFCR } from '../../../../../library/displayErrorMessagesGFCR'
import { formikHandleNumericDecimalInputChange } from '../../../../../library/formikHandleInputTypes'
import { getOptions } from '../../../../../library/getOptions'
import { getRevenueInitialValues } from './revenueInitialValues'
import { getToastArguments } from '../../../../../library/getToastArguments'
import { Textarea } from '../../../../generic/form'
import { toast } from 'react-toastify'
import { useDatabaseSwitchboardInstance } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useFormik } from 'formik'
import { useHttpResponseErrorHandler } from '../../../../../App/HttpResponseErrorHandlerContext'
import { useParams } from 'react-router-dom'
import InputNoRowSelectWithLabelAndValidation from '../../../../mermaidInputs/InputNoRowSelectWithLabelAndValidation'
import InputNoRowWithLabelAndValidation from '../../../../mermaidInputs/InputNoRowWithLabelAndValidation'
import language from '../../../../../language'
import Modal, { RightFooter } from '../../../../generic/Modal/Modal'
import SaveButton from './SaveButton'

const modalLanguage = language.gfcrRevenueModal

const RevenueModal = ({
  indicatorSet,
  setIndicatorSet,
  isOpen,
  onDismiss,
  revenue = undefined,
  choices,
  financeSolutions,
  displayHelp,
}) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const [isFormDirty, setIsFormDirty] = useState(false)
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [isDeleting, setIsDeleting] = useState(false)

  const initialFormValues = useMemo(() => {
    return getRevenueInitialValues(revenue)
  }, [revenue])

  const handleFormSubmit = useCallback(
    async (formikValues, formikActions) => {
      setSaveButtonState(buttonGroupStates.saving)

      const formattedValues = {
        ...formikValues,
        id: revenue?.id,
        sustainable_revenue_stream: formikValues.sustainable_revenue_stream === 'true',
      }

      // Find the finance solution with the id which matches revenue.finance_solution
      const financeSolution = indicatorSet.finance_solutions.find(
        (fs) => fs.id === formattedValues.finance_solution,
      )

      let newRevenues
      let financeSolutions = indicatorSet.finance_solutions

      // Revenue already exists
      if (
        formattedValues.id &&
        formattedValues.finance_solution !== formattedValues.finance_solution
      ) {
        // Revenue finance solution has been updated
        // Remove any revenue with the same finance solution id within
        // any element of indicatorSetBeingEdited.finance_solutions
        financeSolutions = financeSolutions.map((fs) => ({
          ...fs,
          revenues: fs.revenues.filter((source) => source.id !== formattedValues.id),
        }))
      }

      // Add a new element to revenues
      newRevenues = [...financeSolution.revenues, formattedValues]

      const updatedIndicatorSet = {
        ...indicatorSet,
        finance_solutions: financeSolutions.map((fs) =>
          fs.id === financeSolution.id ? { ...fs, revenues: newRevenues } : fs,
        ),
      }

      try {
        const response = await databaseSwitchboardInstance.saveIndicatorSet(
          projectId,
          updatedIndicatorSet,
        )

        setIndicatorSet(response)

        toast.success(...getToastArguments(language.success.gfcrRevenueSave))
      } catch (error) {
        setSaveButtonState(buttonGroupStates.unsaved)

        if (error) {
          displayErrorMessagesGFCR(error)

          handleHttpResponseError({
            error,
          })
        }
      }

      setSaveButtonState(buttonGroupStates.saved)
      onDismiss(formikActions.resetForm)
    },
    [
      databaseSwitchboardInstance,
      handleHttpResponseError,
      indicatorSet,
      onDismiss,
      projectId,
      revenue,
      setIndicatorSet,
    ],
  )

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    validate: (values) => {
      const errors = {}

      if (!values.finance_solution) {
        errors.finance_solution = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (!values.revenue_type) {
        errors.revenue_type = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (values.sustainable_revenue_stream === '') {
        errors.sustainable_revenue_stream = [
          { code: language.error.formValidation.required, id: 'Required' },
        ]
      }

      if (values.revenue_amount === '') {
        errors.revenue_amount = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      return errors
    },
  })

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)

    // Update the finance solution by removing the revenue
    const updatedFinanceSolution = indicatorSet.finance_solutions
      .find((fs) => fs.id === revenue.finance_solution)
      .revenues.filter((source) => source.id !== revenue.id)

    const updatedIndicatorSet = {
      ...indicatorSet,
      finance_solutions: indicatorSet.finance_solutions.map(
        // Keep the original finance solution element unless it's the one we're updating, in which case replace it with the updated one
        (fs) =>
          fs.id === revenue.finance_solution ? { ...fs, revenues: updatedFinanceSolution } : fs,
      ),
    }

    try {
      const response = await databaseSwitchboardInstance.saveIndicatorSet(
        projectId,
        updatedIndicatorSet,
      )

      setIndicatorSet(response)

      toast.success(...getToastArguments(language.success.gfcrRevenueDelete))
    } catch (error) {
      if (error) {
        toast.error(...getToastArguments(language.error.gfcrRevenueDelete))

        handleHttpResponseError({
          error,
        })
      }
    }

    setIsDeleting(false)
    onDismiss(formik.resetForm)
  }, [
    databaseSwitchboardInstance,
    formik.resetForm,
    handleHttpResponseError,
    indicatorSet,
    onDismiss,
    projectId,
    revenue,
    setIndicatorSet,
  ])

  const _setSaveButtonUnsaved = useEffect(() => {
    if (isFormDirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [isFormDirty])

  const _setIsFormDirty = useEffect(() => setIsFormDirty(!!formik.dirty), [formik.dirty])

  const cancelButton = (
    <ButtonSecondary type="button" onClick={() => onDismiss(formik.resetForm)}>
      {modalLanguage.cancel}
    </ButtonSecondary>
  )

  const footer = (
    <StyledModalFooterWrapper>
      <StyledModalLeftFooter>
        {!!revenue && (
          <ButtonCaution onClick={handleDelete} disabled={isDeleting}>
            {modalLanguage.remove}
          </ButtonCaution>
        )}
      </StyledModalLeftFooter>
      <RightFooter>
        {cancelButton}
        <SaveButton
          formId="revenue-form"
          unsavedTitle={revenue ? modalLanguage.save : modalLanguage.add}
          saveButtonState={saveButtonState}
          formHasErrors={!!Object.keys(formik.errors).length}
          formDirty={isFormDirty}
        />
      </RightFooter>
    </StyledModalFooterWrapper>
  )

  const revenueForm = () => {
    return (
      <form id="revenue-form" onSubmit={formik.handleSubmit}>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={modalLanguage.financeSolution}
            id="finance-solution-select"
            {...formik.getFieldProps('finance_solution')}
            options={financeSolutions.map((fs) => ({ value: fs.id, label: fs.name }))}
            helperText={modalLanguage.getFinanceSolutionHelper()}
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={modalLanguage.revenueType}
            id="revenue-type-select"
            {...formik.getFieldProps('revenue_type')}
            options={getOptions(choices.revenuetypes.data)}
            helperText={modalLanguage.getRevenueTypeHelper()}
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={modalLanguage.sustainableRevenueStream}
            id="sustainable-revenue-stream-select"
            {...formik.getFieldProps('sustainable_revenue_stream')}
            options={[
              { value: 'true', label: modalLanguage.yes },
              { value: 'false', label: modalLanguage.no },
            ]}
            helperText={modalLanguage.getSustainableRevenueStreamHelper()}
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowWithLabelAndValidation
            label={modalLanguage.annualRevenue}
            id="revenue-amount-input"
            type="number"
            unit="USD $"
            alignUnitsLeft={true}
            {...formik.getFieldProps('revenue_amount')}
            helperText={modalLanguage.getAnnualRevenueHelper()}
            showHelperText={displayHelp}
            required={true}
            onChange={(event) =>
              formikHandleNumericDecimalInputChange({
                formik,
                event,
                fieldName: 'revenue_amount',
              })
            }
          />
        </StyledModalInputRow>
        <hr />
        <StyledModalInputRow>
          <label id="notes-label" htmlFor="notes-input">
            {modalLanguage.notes}
          </label>
          <Textarea
            aria-labelledby={'notes-label'}
            id="notes-input"
            rows="6"
            {...formik.getFieldProps('notes')}
          />
        </StyledModalInputRow>
      </form>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={() => onDismiss(formik.resetForm)}
      title={revenue ? modalLanguage.titleUpdate : modalLanguage.titleAdd}
      mainContent={revenueForm()}
      footerContent={footer}
      maxWidth="65rem"
    />
  )
}

RevenueModal.propTypes = {
  indicatorSet: PropTypes.object,
  setIndicatorSet: PropTypes.func.isRequired,
  choices: choicesPropType.isRequired,
  revenue: PropTypes.object,
  financeSolutions: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default RevenueModal
