import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { OutlinedInput } from '@mui/material'

import language from '../../../../../language'
import theme from '../../../../../theme'
import {
  CheckRadioLabel,
  CheckRadioWrapper,
  Input,
  RequiredIndicator,
  Select,
} from '../../../../generic/form'
import {
  CustomMenuItem,
  CustomMuiSelect,
} from '../../../../mermaidInputs/InputMuiChipSelectWithLabelAndValidation/InputMuiChipSelectWithLabelAndValidation.styles'
import Modal, { RightFooter } from '../../../../generic/Modal/Modal'
import {
  StyledModalInputRow,
  StyledModalFooterWrapper,
  StyledModalLeftFooter,
} from '../subPages/subPages.styles'
import { getFinanceSolutionInitialValues } from './financeSolutionInitialValues'
import { useFormik } from 'formik'
import { buttonGroupStates } from '../../../../../library/buttonGroupStates'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonCaution, ButtonSecondary } from '../../../../generic/buttons'
import SaveButton from './SaveButton'
import { getChips, getOptionList } from './modalHelpers'

const modalLanguage = language.gfcrFinanceSolutionModal

const FinanceSolutionModal = ({
  isOpen,
  onDismiss,
  onSubmit,
  onDelete,
  financeSolution = undefined,
  choices,
}) => {
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [isDeleting, setIsDeleting] = useState(false)

  const initialFormValues = useMemo(() => {
    return getFinanceSolutionInitialValues(financeSolution)
  }, [financeSolution])

  const handleFormSubmit = useCallback(
    async (formikValues, formikActions) => {
      setSaveButtonState(buttonGroupStates.saving)

      const formattedValues = {
        ...formikValues,
        id: financeSolution?.id,
        used_an_incubator:
          formikValues.used_an_incubator === 'none' ? null : formikValues.used_an_incubator,
      }

      await onSubmit(formattedValues)
      setSaveButtonState(buttonGroupStates.saved)
      onDismiss(formikActions.resetForm)
    },
    [financeSolution, onDismiss, onSubmit],
  )

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    validate: (values) => {
      const errors = {}

      if (!values.name) {
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (!values.sector) {
        errors.sector = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (!values.used_an_incubator) {
        errors.used_an_incubator = [
          { code: language.error.formValidation.required, id: 'Required' },
        ]
      }

      return errors
    },
  })

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    await onDelete(financeSolution.id)
    setIsDeleting(false)
    onDismiss(formik.resetForm)
  }, [financeSolution?.id, formik.resetForm, onDelete, onDismiss])

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
        {!!financeSolution && (
          <ButtonCaution onClick={handleDelete} disabled={isDeleting}>
            {modalLanguage.remove}
          </ButtonCaution>
        )}
      </StyledModalLeftFooter>
      <RightFooter>
        {cancelButton}
        <SaveButton
          formId="finance-solution-form"
          unsavedTitle={financeSolution ? modalLanguage.save : modalLanguage.add}
          saveButtonState={saveButtonState}
          formHasErrors={!!Object.keys(formik.errors).length}
          formDirty={isFormDirty}
        />
      </RightFooter>
    </StyledModalFooterWrapper>
  )

  const financeSolutionForm = () => {
    return (
      <form id="finance-solution-form" onSubmit={formik.handleSubmit}>
        <StyledModalInputRow>
          <label id="finance-solution-label" htmlFor="finance-solution-input">
            {modalLanguage.name} <RequiredIndicator />
          </label>
          <Input
            id="finance-solution-input"
            aria-labelledby="finance-solution-label"
            {...formik.getFieldProps('name')}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <label id="sector-label" htmlFor="sector-select">
            {modalLanguage.sector} <RequiredIndicator />
          </label>
          <Select
            id="sector-select"
            aria-labelledby="sector-label"
            {...formik.getFieldProps('sector')}
          >
            <option value="">{language.placeholders.select}</option>
            {getOptionList(choices.sectors.data)}
          </Select>
        </StyledModalInputRow>
        <StyledModalInputRow>
          <label id="used-an-incubator-label" htmlFor="used-an-incubator-select">
            {modalLanguage.usedAnIncubator} <RequiredIndicator />
          </label>
          <Select
            id="used-an-incubator-select"
            aria-labelledby="used-an-incubator-label"
            {...formik.getFieldProps('used_an_incubator')}
          >
            <option value="">{language.placeholders.select}</option>
            <option value="none">{modalLanguage.none}</option>
            {getOptionList(choices.incubatortypes.data)}
          </Select>
        </StyledModalInputRow>
        <StyledModalInputRow>
          <CheckRadioWrapper>
            <input
              id="local-enterprise-input"
              aria-labelledby="local-enterprise-label"
              type="checkbox"
              checked={formik.getFieldProps('local_enterprise').value}
              onChange={({ target }) => {
                formik.setFieldValue('local_enterprise', target.checked)
              }}
            />
            <CheckRadioLabel id="local-enterprise-label" htmlFor="local-enterprise-input">
              {modalLanguage.localEnterprise}
            </CheckRadioLabel>
          </CheckRadioWrapper>
        </StyledModalInputRow>
        <StyledModalInputRow>
          <CheckRadioWrapper>
            <input
              id="gender-smart-input"
              aria-labelledby="gender-smart-label"
              type="checkbox"
              checked={formik.getFieldProps('gender_smart').value}
              onChange={({ target }) => {
                formik.setFieldValue('gender_smart', target.checked)
              }}
            />

            <CheckRadioLabel id="gender-smart-label" htmlFor="gender-smart-input">
              {modalLanguage.genderSmart}
            </CheckRadioLabel>
          </CheckRadioWrapper>
        </StyledModalInputRow>
        <StyledModalInputRow>
          <label
            id="sustainable-finance-mechanisms-label"
            htmlFor="sustainable-finance-mechanisms-select"
          >
            {modalLanguage.sustainableFinanceMechanisms}
          </label>
          <CustomMuiSelect
            id="sustainable-finance-mechanisms-select"
            labelId="sustainable-finance-mechanisms-label"
            multiple
            {...formik.getFieldProps('sustainable_finance_mechanisms')}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) =>
              selected?.length
                ? getChips(selected, choices.sustainablefinancemechanisms.data)
                : language.placeholders.select
            }
            displayEmpty={true}
          >
            {choices.sustainablefinancemechanisms.data.map((option) => (
              <CustomMenuItem
                key={option.id}
                value={option.id}
                sx={{ fontSize: theme.typography.defaultFontSize }}
              >
                {option.name}
              </CustomMenuItem>
            ))}
          </CustomMuiSelect>
        </StyledModalInputRow>
      </form>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={() => onDismiss(formik.resetForm)}
      title={financeSolution ? modalLanguage.titleUpdate : modalLanguage.titleAdd}
      mainContent={financeSolutionForm()}
      footerContent={footer}
      contentOverflowIsVisible={true}
      maxWidth="65rem"
    />
  )
}

FinanceSolutionModal.propTypes = {
  indicatorSet: PropTypes.object.isRequired,
  choices: choicesPropType.isRequired,
  financeSolution: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default FinanceSolutionModal
