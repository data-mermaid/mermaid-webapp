import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useMemo } from 'react'

import language from '../../../../../language'
import { Textarea } from '../../../../generic/form'
import Modal, { RightFooter } from '../../../../generic/Modal/Modal'
import {
  StyledModalInputRow,
  StyledModalFooterWrapper,
  StyledModalLeftFooter,
} from '../subPages/subPages.styles'
import { useFormik } from 'formik'
import { buttonGroupStates } from '../../../../../library/buttonGroupStates'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonCaution, ButtonSecondary } from '../../../../generic/buttons'
import SaveButton from './SaveButton'
import { getInvestmentInitialValues } from './investmentInitialValues'
import { useDatabaseSwitchboardInstance } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useParams } from 'react-router-dom'
import { useHttpResponseErrorHandler } from '../../../../../App/HttpResponseErrorHandlerContext'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../../../library/getToastArguments'
import InputNoRowSelectWithLabelAndValidation from '../../../../mermaidInputs/InputNoRowSelectWithLabelAndValidation'
import { getOptions } from '../../../../../library/getOptions'
import InputNoRowWithLabelAndValidation from '../../../../mermaidInputs/InputNoRowWithLabelAndValidation'
import { displayErrorMessagesGFCR } from '../../../../../library/displayErrorMessagesGFCR'

const modalLanguage = language.gfcrInvestmentModal

const InvestmentModal = ({
  isOpen,
  onDismiss,
  indicatorSet,
  setIndicatorSet,
  investment = undefined,
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
    return getInvestmentInitialValues(investment)
  }, [investment])

  const handleFormSubmit = useCallback(
    async (formikValues, formikActions) => {
      setSaveButtonState(buttonGroupStates.saving)

      const formattedValues = {
        ...formikValues,
        id: investment?.id,
      }

      // Find the finance solution with the id which matches investment.finance_solution
      const financeSolution = indicatorSet.finance_solutions.find(
        (fs) => fs.id === formattedValues.finance_solution,
      )

      let newInvestments
      let financeSolutions = indicatorSet.finance_solutions

      // Investment already exists
      if (formattedValues.id && formattedValues.finance_solution !== investment.finance_solution) {
        // Investment finance solution has been updated
        // Remove any investment with the same finance solution id within
        // any element of indicatorSetBeingEdited.finance_solutions
        financeSolutions = financeSolutions.map((fs) => ({
          ...fs,
          investment_sources: fs.investment_sources.filter(
            (source) => source.id !== formattedValues.id,
          ),
        }))
      }

      // Add a new element to investments
      newInvestments = [...financeSolution.investment_sources, formattedValues]

      const updatedIndicatorSet = {
        ...indicatorSet,
        finance_solutions: financeSolutions.map((fs) =>
          fs.id === financeSolution.id ? { ...fs, investment_sources: newInvestments } : fs,
        ),
      }

      try {
        const response = await databaseSwitchboardInstance.saveIndicatorSet(
          projectId,
          updatedIndicatorSet,
        )
        setIndicatorSet(response)

        toast.success(...getToastArguments(language.success.gfcrInvestmentSave))
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
      investment,
      onDismiss,
      projectId,
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

      if (!values.investment_source) {
        errors.investment_source = [
          { code: language.error.formValidation.required, id: 'Required' },
        ]
      }

      if (!values.investment_type) {
        errors.investment_type = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (values.investment_amount === '') {
        errors.investment_amount = [
          { code: language.error.formValidation.required, id: 'Required' },
        ]
      }

      return errors
    },
  })

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)

    // Update the finance solution by removing the investment
    const updatedFinanceSolution = indicatorSet.finance_solutions
      .find((fs) => fs.id === investment.finance_solution)
      .investment_sources.filter((source) => source.id !== investment.id)

    const updatedIndicatorSet = {
      ...indicatorSet,
      finance_solutions: indicatorSet.finance_solutions.map(
        // Keep the original finance solution element unless it's the one we're updating, in which case replace it with the updated one
        (fs) =>
          fs.id === investment.finance_solution
            ? { ...fs, investment_sources: updatedFinanceSolution }
            : fs,
      ),
    }

    try {
      const response = await databaseSwitchboardInstance.saveIndicatorSet(
        projectId,
        updatedIndicatorSet,
      )

      setIndicatorSet(response)

      toast.success(...getToastArguments(language.success.gfcrInvestmentDelete))
    } catch (error) {
      if (error) {
        toast.error(...getToastArguments(language.error.gfcrInvestmentDelete))

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
    investment,
    onDismiss,
    projectId,
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
        {!!investment && (
          <ButtonCaution onClick={handleDelete} disabled={isDeleting}>
            {modalLanguage.remove}
          </ButtonCaution>
        )}
      </StyledModalLeftFooter>
      <RightFooter>
        {cancelButton}
        <SaveButton
          formId="investment-form"
          unsavedTitle={investment ? modalLanguage.save : modalLanguage.add}
          saveButtonState={saveButtonState}
          formHasErrors={!!Object.keys(formik.errors).length}
          formDirty={isFormDirty}
        />
      </RightFooter>
    </StyledModalFooterWrapper>
  )

  const investmentForm = () => {
    return (
      <form id="investment-form" onSubmit={formik.handleSubmit}>
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
            label={modalLanguage.investmentSource}
            id="investment-source-select"
            {...formik.getFieldProps('investment_source')}
            options={getOptions(choices.investmentsources.data)}
            helperText={modalLanguage.getInvestmentSourceHelper()}
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={modalLanguage.investmentType}
            id="investment-type-select"
            {...formik.getFieldProps('investment_type')}
            options={getOptions(choices.investmenttypes.data)}
            helperText={modalLanguage.getInvestmentTypeHelper()}
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowWithLabelAndValidation
            label={modalLanguage.investmentAmount}
            id="investment-amount-input"
            type="number"
            unit="USD $"
            alignUnitsLeft={true}
            {...formik.getFieldProps('investment_amount')}
            helperText={modalLanguage.getInvestmentAmountHelper()}
            showHelperText={displayHelp}
            required={true}
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
      title={investment ? modalLanguage.titleUpdate : modalLanguage.titleAdd}
      mainContent={investmentForm()}
      footerContent={footer}
      contentOverflowIsVisible={false}
      maxWidth="65rem"
    />
  )
}

InvestmentModal.propTypes = {
  indicatorSet: PropTypes.object.isRequired,
  setIndicatorSet: PropTypes.func.isRequired,
  choices: choicesPropType.isRequired,
  investment: PropTypes.object,
  financeSolutions: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default InvestmentModal
