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
import { formikHandleNumericDecimalInputChange } from '../../../../../library/formik/formikHandleInputTypes'
import { getInvestmentInitialValues } from './investmentInitialValues'
import { getOptions } from '../../../../../library/getOptions'
import { getToastArguments } from '../../../../../library/getToastArguments'
import { Textarea } from '../../../../generic/form'
import { toast } from 'react-toastify'
import { useDatabaseSwitchboardInstance } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useFormik } from 'formik'
import { useHttpResponseErrorHandler } from '../../../../../App/HttpResponseErrorHandlerContext'
import { useParams } from 'react-router-dom'
import InputNoRowSelectWithLabelAndValidation from '../../../../mermaidInputs/InputNoRowSelectWithLabelAndValidation'
import InputNoRowWithLabelAndValidation from '../../../../mermaidInputs/InputNoRowWithLabelAndValidation'
import { useTranslation } from 'react-i18next'
import GfcrHelperLinks from '../subPages/GfcrHelperLinks'
import Modal, { RightFooter } from '../../../../generic/Modal'
import SaveButton from './SaveButton'

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
  const { t } = useTranslation()

  const indicatorSetSaveSuccessText = t('gfcr.success.indicator_set_save')
  const indicatorSetSaveFailedText = t('gfcr.errors.indicator_set_save_failed')

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

        toast.success(...getToastArguments(indicatorSetSaveSuccessText))
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
      indicatorSetSaveSuccessText,
    ],
  )

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    validate: (values) => {
      const errors = {}

      if (!values.finance_solution) {
        errors.finance_solution = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (!values.investment_source) {
        errors.investment_source = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (!values.investment_type) {
        errors.investment_type = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (values.investment_amount === '') {
        errors.investment_amount = [{ code: t('forms.required_field'), id: 'Required' }]
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

      toast.success(...getToastArguments(indicatorSetSaveSuccessText))
    } catch (error) {
      if (error) {
        toast.error(...getToastArguments(indicatorSetSaveFailedText))

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
    indicatorSetSaveSuccessText,
    indicatorSetSaveFailedText,
  ])

  const _setSaveButtonUnsaved = useEffect(() => {
    if (isFormDirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [isFormDirty])

  const _setIsFormDirty = useEffect(() => setIsFormDirty(!!formik.dirty), [formik.dirty])

  const cancelButton = (
    <ButtonSecondary type="button" onClick={() => onDismiss(formik.resetForm)}>
      {t('buttons.cancel')}
    </ButtonSecondary>
  )

  const footer = (
    <StyledModalFooterWrapper>
      <StyledModalLeftFooter>
        {!!investment && (
          <ButtonCaution onClick={handleDelete} disabled={isDeleting}>
            {t('buttons.remove_row')}
          </ButtonCaution>
        )}
      </StyledModalLeftFooter>
      <RightFooter>
        {cancelButton}
        <SaveButton
          formId="investment-form"
          unsavedTitle={
            investment ? t('gfcr.forms.investments.save') : t('gfcr.forms.investments.add')
          }
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
            label={t('gfcr.forms.finance_solutions.business_finance_solution')}
            id="finance-solution-select"
            {...formik.getFieldProps('finance_solution')}
            options={financeSolutions.map((fs) => ({ value: fs.id, label: fs.name }))}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.investments.business_finance_solution_helper" />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr.forms.investments.investment_source')}
            id="investment-source-select"
            {...formik.getFieldProps('investment_source')}
            options={getOptions(choices.investmentsources.data)}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.investments.investment_source_helper" />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr.forms.investments.investment_type')}
            id="investment-type-select"
            {...formik.getFieldProps('investment_type')}
            options={getOptions(choices.investmenttypes.data)}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.investments.investment_type_helper" />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowWithLabelAndValidation
            label={t('gfcr.forms.investments.investment_amount')}
            id="investment-amount-input"
            type="number"
            unit="USD $"
            alignUnitsLeft={true}
            {...formik.getFieldProps('investment_amount')}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.investments.investment_amount_helper" />
            }
            showHelperText={displayHelp}
            required={true}
            onChange={(event) =>
              formikHandleNumericDecimalInputChange({
                formik,
                event,
                fieldName: 'investment_amount',
              })
            }
          />
        </StyledModalInputRow>
        <hr />
        <StyledModalInputRow>
          <label id="notes-label" htmlFor="notes-input">
            {t('notes')}
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
      title={investment ? t('gfcr.forms.investments.update') : t('gfcr.forms.investments.add')}
      mainContent={investmentForm()}
      footerContent={footer}
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
