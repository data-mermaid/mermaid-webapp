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
import { useTranslation } from 'react-i18next'
import GfcrHelperLinks from '../subPages/GfcrHelperLinks'
import Modal, { RightFooter } from '../../../../generic/Modal'
import SaveButton from './SaveButton'

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
      onDismiss,
      projectId,
      revenue,
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

      if (!values.revenue_type) {
        errors.revenue_type = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (values.sustainable_revenue_stream === '') {
        errors.sustainable_revenue_stream = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (values.revenue_amount === '') {
        errors.revenue_amount = [{ code: t('forms.required_field'), id: 'Required' }]
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
    onDismiss,
    projectId,
    revenue,
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
        {!!revenue && (
          <ButtonCaution onClick={handleDelete} disabled={isDeleting}>
            {t('buttons.remove_row')}
          </ButtonCaution>
        )}
      </StyledModalLeftFooter>
      <RightFooter>
        {cancelButton}
        <SaveButton
          formId="revenue-form"
          unsavedTitle={revenue ? t('gfcr.forms.revenues.save') : t('gfcr.forms.revenues.add')}
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
            label={t('gfcr.forms.finance_solutions.business_finance_solution')}
            id="finance-solution-select"
            {...formik.getFieldProps('finance_solution')}
            options={financeSolutions.map((fs) => ({ value: fs.id, label: fs.name }))}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.revenues.business_finance_solution_helper" />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr.forms.revenues.revenue_type')}
            id="revenue-type-select"
            {...formik.getFieldProps('revenue_type')}
            options={getOptions(choices.revenuetypes.data)}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.revenues.revenue_type_helper" />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr.forms.revenues.sustainable_revenue_stream')}
            id="sustainable-revenue-stream-select"
            {...formik.getFieldProps('sustainable_revenue_stream')}
            options={[
              { value: 'true', label: t('yes') },
              { value: 'false', label: t('no') },
            ]}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.revenues.sustainable_revenue_stream_helper" />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowWithLabelAndValidation
            label={t('gfcr.forms.revenues.revenue_amount')}
            id="revenue-amount-input"
            type="number"
            unit="USD $"
            alignUnitsLeft={true}
            {...formik.getFieldProps('revenue_amount')}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.revenues.revenue_amount_helper" />
            }
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
      title={revenue ? t('gfcr.forms.revenues.update') : t('gfcr.forms.revenues.add')}
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
