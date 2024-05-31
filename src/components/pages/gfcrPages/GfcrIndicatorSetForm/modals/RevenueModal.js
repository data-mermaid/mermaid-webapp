import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useMemo } from 'react'

import language from '../../../../../language'
import {
  CheckRadioLabel,
  CheckRadioWrapper,
  RequiredIndicator,
  Select,
  Textarea,
} from '../../../../generic/form'
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
import { getOptionList } from './modalHelpers'
import { getRevenueInitialValues } from './revenueInitialValues'
import InputNumberNoScrollWithUnit from '../../../../generic/InputNumberNoScrollWithUnit'

const modalLanguage = language.gfcrRevenueModal

const RevenueModal = ({
  isOpen,
  onDismiss,
  onSubmit,
  onDelete,
  revenue = undefined,
  choices,
  financeSolutions,
}) => {
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
      }

      await onSubmit(formattedValues, revenue && revenue.finance_solution)
      setSaveButtonState(buttonGroupStates.saved)
      onDismiss(formikActions.resetForm)
    },
    [revenue, onDismiss, onSubmit],
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

      if (values.annual_revenue === '') {
        errors.annual_revenue = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      return errors
    },
  })

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    await onDelete(revenue)
    setIsDeleting(false)
    onDismiss(formik.resetForm)
  }, [formik.resetForm, revenue, onDelete, onDismiss])

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
          <label id="finance-solution-label" htmlFor="finance-solution-select">
            {modalLanguage.financeSolution} <RequiredIndicator />
          </label>
          <Select
            id="finance-solution-select"
            aria-labelledby="finance-solution-label"
            {...formik.getFieldProps('finance_solution')}
          >
            <option value="">{language.placeholders.select}</option>
            {getOptionList(financeSolutions.map((fs) => ({ id: fs.id, name: fs.name })))}
          </Select>
        </StyledModalInputRow>
        <StyledModalInputRow>
          <label id="revenue-type-label" htmlFor="revenue-type-select">
            {modalLanguage.revenueType} <RequiredIndicator />
          </label>
          <Select
            id="revenue-type-select"
            aria-labelledby="revenue-type-label"
            {...formik.getFieldProps('revenue_type')}
          >
            <option value="">{language.placeholders.select}</option>
            {getOptionList(choices.revenuetypes.data)}
          </Select>
        </StyledModalInputRow>
        <StyledModalInputRow>
          <CheckRadioWrapper>
            <input
              id="sustainable-revenue-stream-input"
              aria-labelledby="sustainable-revenue-stream-label"
              type="checkbox"
              checked={formik.getFieldProps('sustainable_revenue_stream').value}
              onChange={({ target }) => {
                formik.setFieldValue('sustainable_revenue_stream', target.checked)
              }}
            />
            <CheckRadioLabel
              id="sustainable-revenue-stream-label"
              htmlFor="sustainable-revenue-stream-input"
            >
              {modalLanguage.sustainableRevenueStream}
            </CheckRadioLabel>
          </CheckRadioWrapper>
        </StyledModalInputRow>
        <StyledModalInputRow>
          <label id="annual-revenue-label" htmlFor="annual-revenue-input">
            {modalLanguage.annualRevenue} <RequiredIndicator />
          </label>
          <InputNumberNoScrollWithUnit
            aria-labelledby={'annual-revenue-label'}
            id="annual-revenue-input"
            unit="USD $"
            alignUnitsLeft={true}
            {...formik.getFieldProps('annual_revenue')}
          />
        </StyledModalInputRow>
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
      contentOverflowIsVisible={true}
      maxWidth="65rem"
    />
  )
}

RevenueModal.propTypes = {
  indicatorSet: PropTypes.object,
  choices: choicesPropType.isRequired,
  revenue: PropTypes.object,
  financeSolutions: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default RevenueModal
