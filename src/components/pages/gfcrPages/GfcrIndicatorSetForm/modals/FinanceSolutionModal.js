import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Checkbox, OutlinedInput } from '@mui/material'

import language from '../../../../../language'
import theme from '../../../../../theme'
import { HelperText, Textarea } from '../../../../generic/form'
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

const modalLanguage = language.gfcrFinanceSolutionModal

const FinanceSolutionModal = ({
  isOpen,
  onDismiss,
  financeSolution = undefined,
  indicatorSet,
  setIndicatorSet,
  choices,
  displayHelp,
}) => {
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
        local_enterprise: formikValues.local_enterprise === 'true',
        gender_smart: formikValues.gender_smart === 'true',
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

        toast.success(...getToastArguments(language.success.gfcrFinanceSolutionSave))
      } catch (error) {
        setSaveButtonState(buttonGroupStates.unsaved)

        if (error) {
          toast.error(...getToastArguments(language.error.gfcrFinanceSolutionSave))

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
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (!values.sector) {
        errors.sector = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (values.used_an_incubator === '') {
        errors.used_an_incubator = [
          { code: language.error.formValidation.required, id: 'Required' },
        ]
      }

      if (values.local_enterprise === '') {
        errors.local_enterprise = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (values.gender_smart === '') {
        errors.gender_smart = [{ code: language.error.formValidation.required, id: 'Required' }]
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

      toast.success(...getToastArguments(language.success.gfcrFinanceSolutionDelete))
    } catch (error) {
      if (error) {
        toast.error(...getToastArguments(language.error.gfcrFinanceSolutionDelete))

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
          <InputNoRowWithLabelAndValidation
            label={modalLanguage.name}
            id="finance-solution-input"
            type="text"
            {...formik.getFieldProps('name')}
            helperText={modalLanguage.getNameHelper()}
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={modalLanguage.sector}
            id="sector-select"
            {...formik.getFieldProps('sector')}
            options={getOptions(choices.sectors.data)}
            helperText={modalLanguage.getSectorHelper()}
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={modalLanguage.usedAnIncubator}
            id="used-an-incubator-select"
            {...formik.getFieldProps('used_an_incubator')}
            options={[
              { value: 'none', label: modalLanguage.none },
              ...getOptions(choices.incubatortypes.data),
            ]}
            helperText={modalLanguage.getUsedAnIncubatorHelper()}
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={modalLanguage.localEnterprise}
            id="local-enterprise-select"
            {...formik.getFieldProps('local_enterprise')}
            options={[
              { value: 'none', label: modalLanguage.none },
              { value: 'true', label: modalLanguage.yes },
              { value: 'false', label: modalLanguage.no },
            ]}
            helperText={modalLanguage.getLocalEnterpriseHelper()}
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={modalLanguage.genderSmart}
            id="gender-smart-select"
            {...formik.getFieldProps('gender_smart')}
            options={[
              { value: 'none', label: modalLanguage.none },
              { value: 'true', label: modalLanguage.yes },
              { value: 'false', label: modalLanguage.no },
            ]}
            helperText={modalLanguage.getGenderSmartHelper()}
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <label
            id="sustainable-finance-mechanisms-label"
            htmlFor="sustainable-finance-mechanisms-select"
          >
            {modalLanguage.sustainableFinanceMechanisms}
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
              {modalLanguage.getSustainableFinanceMechanismsHelper()}
            </HelperText>
          ) : null}
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
      title={financeSolution ? modalLanguage.titleUpdate : modalLanguage.titleAdd}
      mainContent={financeSolutionForm()}
      footerContent={footer}
      contentOverflowIsVisible={true}
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
