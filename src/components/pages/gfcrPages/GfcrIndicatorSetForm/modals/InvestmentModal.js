import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useMemo } from 'react'

import language from '../../../../../language'
import { RequiredIndicator, Select, Textarea } from '../../../../generic/form'
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
import { getInvestmentInitialValues } from './investmentInitialValues'
import InputNumberNoScrollWithUnit from '../../../../generic/InputNumberNoScrollWithUnit'

const modalLanguage = language.gfcrInvestmentModal

const InvestmentModal = ({
  isOpen,
  onDismiss,
  onSubmit,
  onDelete,
  investment = undefined,
  choices,
  financeSolutions,
}) => {
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

      await onSubmit(formattedValues, investment && investment.finance_solution)
      setSaveButtonState(buttonGroupStates.saved)
      onDismiss(formikActions.resetForm)
    },
    [investment, onDismiss, onSubmit],
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
    await onDelete(investment)
    setIsDeleting(false)
    onDismiss(formik.resetForm)
  }, [formik.resetForm, investment, onDelete, onDismiss])

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
          <label id="investment-source-label" htmlFor="investment-source-select">
            {modalLanguage.investmentSource} <RequiredIndicator />
          </label>
          <Select
            id="investment-source-select"
            aria-labelledby="investment-source-label"
            {...formik.getFieldProps('investment_source')}
          >
            <option value="">{language.placeholders.select}</option>
            {getOptionList(choices.investmentsources.data)}
          </Select>
        </StyledModalInputRow>
        <StyledModalInputRow>
          <label id="investment-type-label" htmlFor="investment-type-select">
            {modalLanguage.investmentType} <RequiredIndicator />
          </label>
          <Select
            id="investment-type-select"
            aria-labelledby="investments-type-label"
            {...formik.getFieldProps('investment_type')}
          >
            <option value="">{language.placeholders.select}</option>
            {getOptionList(choices.investmenttypes.data)}
          </Select>
        </StyledModalInputRow>
        <StyledModalInputRow>
          <label id="investment-amount-label" htmlFor="investment-amount-input">
            {modalLanguage.investmentAmount} <RequiredIndicator />
          </label>
          <InputNumberNoScrollWithUnit
            aria-labelledby={'investment-amount-label'}
            id="investment-amount-input"
            unit="USD $"
            alignUnitsLeft={true}
            {...formik.getFieldProps('investment_amount')}
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
      title={investment ? modalLanguage.titleUpdate : modalLanguage.titleAdd}
      mainContent={investmentForm()}
      footerContent={footer}
      contentOverflowIsVisible={true}
      maxWidth="65rem"
    />
  )
}

InvestmentModal.propTypes = {
  indicatorSet: PropTypes.object,
  choices: choicesPropType.isRequired,
  investment: PropTypes.object,
  financeSolutions: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default InvestmentModal
