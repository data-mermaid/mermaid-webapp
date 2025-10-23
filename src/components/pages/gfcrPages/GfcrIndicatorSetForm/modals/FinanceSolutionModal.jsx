import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Checkbox, OutlinedInput } from '@mui/material'
import { useTranslation, Trans } from 'react-i18next'

import theme from '../../../../../theme'
import { HelperText, Textarea } from '../../../../generic/form'
import { HelperTextLink } from '../../../../generic/links'
import {
  CustomMenuItem,
  CustomMuiSelect,
} from '../../../../mermaidInputs/InputMuiChipSelectWithLabelAndValidation/InputMuiChipSelectWithLabelAndValidation.styles'
import Modal, { RightFooter } from '../../../../generic/Modal'
import {
  StyledModalInputRow,
  StyledModalFooterWrapper,
  StyledModalLeftFooter,
} from '../subPages/subPages.styles'
import { getFinanceSolutionInitialValues } from './financeSolutionInitialValues'
import { useFormik } from 'formik'
import { buttonGroupStates } from '../../../../../library/buttonGroupStates'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'
import { ButtonCaution, ButtonSecondary, IconButton } from '../../../../generic/buttons'
import SaveButton from './SaveButton'
import { getChips } from './modalHelpers'
import { useDatabaseSwitchboardInstance } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../../App/HttpResponseErrorHandlerContext'
import InputNoRowWithLabelAndValidation from '../../../../mermaidInputs/InputNoRowWithLabelAndValidation'
import InputNoRowSelectWithLabelAndValidation from '../../../../mermaidInputs/InputNoRowSelectWithLabelAndValidation'
import { getOptions } from '../../../../../library/getOptions'
import { IconInfo } from '../../../../icons'
import { displayErrorMessagesGFCR } from '../../../../../library/displayErrorMessagesGFCR'

const FinanceSolutionModal = ({
  isOpen,
  onDismiss,
  financeSolution = undefined,
  indicatorSet,
  setIndicatorSet,
  choices,
  displayHelp,
}) => {
  const { t } = useTranslation()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { projectId } = useParams()
  const handleHttpResponseError = useHttpResponseErrorHandler()

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

      const existingFinanceSolutions = indicatorSet.finance_solutions

      let newFinanceSolutions

      if (formattedValues.id) {
        // Replace existing element
        newFinanceSolutions = existingFinanceSolutions.map((fs) =>
          fs.id === formattedValues.id ? formattedValues : fs,
        )
      } else {
        // Add a new element
        newFinanceSolutions = [...existingFinanceSolutions, formattedValues]
      }

      const updatedIndicatorSet = {
        ...indicatorSet,
        finance_solutions: newFinanceSolutions,
      }

      try {
        const response = await databaseSwitchboardInstance.saveIndicatorSet(
          projectId,
          updatedIndicatorSet,
        )

        setIndicatorSet(response)

        toast.success(...getToastArguments(t('success.gfcr_finance_solution_save')))
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
      financeSolution,
      handleHttpResponseError,
      indicatorSet,
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

      if (!values.name) {
        errors.name = [{ code: t('error.form_validation_required'), id: 'Required' }]
      }

      if (!values.sector) {
        errors.sector = [{ code: t('error.form_validation_required'), id: 'Required' }]
      }

      if (values.used_an_incubator === '') {
        errors.used_an_incubator = [
          { code: t('error.form_validation_required'), id: 'Required' },
        ]
      }

      if (values.local_enterprise === '') {
        errors.local_enterprise = [{ code: t('error.form_validation_required'), id: 'Required' }]
      }

      if (values.gender_smart === '') {
        errors.gender_smart = [{ code: t('error.form_validation_required'), id: 'Required' }]
      }

      return errors
    },
  })

  const handleDelete = useCallback(async () => {
    setIsDeleting(true)
    const updatedIndicatorSet = {
      ...indicatorSet,
      finance_solutions: indicatorSet.finance_solutions.filter(
        (fs) => fs.id !== financeSolution.id,
      ),
    }

    try {
      const response = await databaseSwitchboardInstance.saveIndicatorSet(
        projectId,
        updatedIndicatorSet,
      )

      setIndicatorSet(response)

      toast.success(...getToastArguments(t('success.gfcr_finance_solution_delete')))
    } catch (error) {
      if (error) {
        toast.error(...getToastArguments(t('error.gfcr_finance_solution_delete')))

        handleHttpResponseError({
          error,
        })
      }
    }

    setIsDeleting(false)
    onDismiss(formik.resetForm)
  }, [
    databaseSwitchboardInstance,
    financeSolution,
    formik.resetForm,
    handleHttpResponseError,
    indicatorSet,
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

  const [SFMShowHelperText, setSFMShowHelperText] = useState()

  useEffect(() => {
    setSFMShowHelperText(displayHelp)
  }, [displayHelp])

  const handleSFMInfoIconClick = (event) => {
    setSFMShowHelperText(!SFMShowHelperText)

    event.stopPropagation()
  }

  const cancelButton = (
    <ButtonSecondary type="button" onClick={() => onDismiss(formik.resetForm)}>
      {t('gfcr_modals.finance_solution.cancel')}
    </ButtonSecondary>
  )

  const footer = (
    <StyledModalFooterWrapper>
      <StyledModalLeftFooter>
        {!!financeSolution && (
          <ButtonCaution onClick={handleDelete} disabled={isDeleting}>
            {t('gfcr_modals.finance_solution.remove')}
          </ButtonCaution>
        )}
      </StyledModalLeftFooter>
      <RightFooter>
        {cancelButton}
        <SaveButton
          formId="finance-solution-form"
          unsavedTitle={financeSolution ? t('gfcr_modals.finance_solution.save') : t('gfcr_modals.finance_solution.add')}
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
          <InputNoRowWithLabelAndValidation
            label={t('gfcr_modals.finance_solution.name')}
            id="finance-solution-input"
            type="text"
            {...formik.getFieldProps('name')}
            helperText={
              <Trans
                i18nKey="gfcr_modals.finance_solution.name_helper"
                components={{
                  a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
                }}
              />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr_modals.finance_solution.sector')}
            id="sector-select"
            {...formik.getFieldProps('sector')}
            options={getOptions(choices.sectors.data)}
            helperText={
              <Trans
                i18nKey="gfcr_modals.finance_solution.sector_helper"
                components={{
                  a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
                }}
              />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr_modals.finance_solution.used_an_incubator')}
            id="used-an-incubator-select"
            {...formik.getFieldProps('used_an_incubator')}
            options={[
              { value: 'none', label: t('gfcr_modals.finance_solution.no') },
              ...getOptions(choices.incubatortypes.data),
            ]}
            helperText={
              <Trans
                i18nKey="gfcr_modals.finance_solution.used_an_incubator_helper"
                components={{
                  a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
                }}
              />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr_modals.finance_solution.local_enterprise')}
            id="local-enterprise-select"
            {...formik.getFieldProps('local_enterprise')}
            options={[
              { value: true, label: t('gfcr_modals.finance_solution.yes') },
              { value: false, label: t('gfcr_modals.finance_solution.no') },
            ]}
            helperText={
              <Trans
                i18nKey="gfcr_modals.finance_solution.local_enterprise_helper"
                components={{
                  a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
                }}
              />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr_modals.finance_solution.gender_smart')}
            id="gender-smart-select"
            {...formik.getFieldProps('gender_smart')}
            options={[
              { value: true, label: t('gfcr_modals.finance_solution.yes') },
              { value: false, label: t('gfcr_modals.finance_solution.no') },
            ]}
            helperText={
              <Trans
                i18nKey="gfcr_modals.finance_solution.gender_smart_helper"
                components={{
                  twoXLink: <HelperTextLink href="https://www.2xchallenge.org/2xcriteria" target="_blank" />,
                  a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
                }}
              />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <label
            id="sustainable-finance-mechanisms-label"
            htmlFor="sustainable-finance-mechanisms-select"
          >
            {t('gfcr_modals.finance_solution.sustainable_finance_mechanisms')}
            <IconButton type="button" onClick={(event) => handleSFMInfoIconClick(event)}>
              <IconInfo aria-label="info" />
            </IconButton>
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
                : t('placeholders.select')
            }
            displayEmpty={true}
          >
            {choices.sustainablefinancemechanisms.data.map((option) => (
              <CustomMenuItem
                key={option.id}
                value={option.id}
                sx={{ fontSize: theme.typography.defaultFontSize }}
              >
                <Checkbox
                  checked={formik
                    .getFieldProps('sustainable_finance_mechanisms')
                    .value.includes(option.id)}
                />
                {option.name}
              </CustomMenuItem>
            ))}
          </CustomMuiSelect>
          {displayHelp || SFMShowHelperText ? (
            <HelperText id="sfm-helper">
              <Trans
                i18nKey="gfcr_modals.finance_solution.sustainable_finance_mechanisms_helper"
                components={{
                  a: <HelperTextLink href="https://globalfundcoralreefs.org/wp-content/uploads/2024/09/GFCR-ME-Toolkit_09.2024_compressed.pdf" target="_blank" />
                }}
              />
            </HelperText>
          ) : null}
        </StyledModalInputRow>
        <hr />
        <StyledModalInputRow>
          <label id="notes-label" htmlFor="notes-input">
            {t('gfcr_modals.finance_solution.notes')}
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
      title={financeSolution ? t('gfcr_modals.finance_solution.title_update') : t('gfcr_modals.finance_solution.title_add')}
      mainContent={financeSolutionForm()}
      footerContent={footer}
      maxWidth="65rem"
    />
  )
}

FinanceSolutionModal.propTypes = {
  indicatorSet: PropTypes.object,
  setIndicatorSet: PropTypes.func.isRequired,
  choices: choicesPropType.isRequired,
  financeSolution: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  displayHelp: PropTypes.bool,
}

export default FinanceSolutionModal
