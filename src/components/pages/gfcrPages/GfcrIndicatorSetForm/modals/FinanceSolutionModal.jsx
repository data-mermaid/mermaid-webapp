import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Checkbox, OutlinedInput } from '@mui/material'

import { useTranslation } from 'react-i18next'
import theme from '../../../../../theme'
import { HelperText, Textarea } from '../../../../generic/form'
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
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../../App/HttpResponseErrorHandlerContext'
import InputNoRowWithLabelAndValidation from '../../../../mermaidInputs/InputNoRowWithLabelAndValidation'
import InputNoRowSelectWithLabelAndValidation from '../../../../mermaidInputs/InputNoRowSelectWithLabelAndValidation'
import { getOptions } from '../../../../../library/getOptions'
import { IconInfo } from '../../../../icons'
import { displayErrorMessagesGFCR } from '../../../../../library/displayErrorMessagesGFCR'
import GfcrHelperLinks from '../subPages/GfcrHelperLinks'

const isTafNameVisible = (fs_type, used_an_incubator) =>
  ['business', 'financial_mechanism'].includes(fs_type) &&
  !!used_an_incubator &&
  used_an_incubator !== 'none'

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

  const indicatorSetSaveSuccessText = t('gfcr.success.indicator_set_save')
  const indicatorSetSaveFailedText = t('gfcr.errors.indicator_set_save_failed')

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
        geographical_coverage: formikValues.fs_type === 'ctf' ? formikValues.geographical_coverage : '',
        taf_name: isTafNameVisible(formikValues.fs_type, formikValues.used_an_incubator) ? formikValues.taf_name : '',
        number_of_solutions_supported_by: ['taf', 'ctf', 'financial_facility'].includes(
          formikValues.fs_type,
        )
          ? formikValues.number_of_solutions_supported_by
          : 0,
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
      financeSolution,
      handleHttpResponseError,
      indicatorSet,
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

      if (!values.name) {
        errors.name = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      const isStandardFsType = (choices.financesolutiontypes?.data || []).some(
        (c) => c.id === values.fs_type,
      )
      if (!values.fs_type || !isStandardFsType) {
        errors.fs_type = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (
        values.fs_type === 'programmatic_co_financing' &&
        financeSolution?.revenues?.length > 0
      ) {
        errors.fs_type = [
          {
            code: t('gfcr.forms.finance_solutions.pcf_revenues_error'),
            id: 'PCFRevenues',
          },
        ]
      }

      if (values.fs_type === 'business' && !values.sector) {
        errors.sector = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (values.fs_type === 'ctf' && !values.geographical_coverage) {
        errors.geographical_coverage = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (
        ['taf', 'ctf', 'financial_facility'].includes(values.fs_type) &&
        Number(values.number_of_solutions_supported_by) <= 0
      ) {
        errors.number_of_solutions_supported_by = [
          { code: t('forms.required_field'), id: 'Required' },
        ]
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
    financeSolution,
    formik.resetForm,
    handleHttpResponseError,
    indicatorSet,
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

  const fsTypeOptions = useMemo(() => {
    const standardData = choices.financesolutiontypes?.data || []
    const standard = getOptions(standardData)
    const storedFsType = financeSolution?.fs_type
    const isNonStandard = !!storedFsType && !standardData.some((c) => c.id === storedFsType)
    if (isNonStandard && formik.values.fs_type === storedFsType) {
      return [
        {
          value: storedFsType,
          label: `${storedFsType} ${t('gfcr.non_standard_title_suffix')}`,
        },
        ...standard,
      ]
    }
    return standard
  }, [choices.financesolutiontypes?.data, financeSolution?.fs_type, formik.values.fs_type, t])

  const showGeographicalCoverage = formik.values.fs_type === 'ctf'
  const showTafName = isTafNameVisible(formik.values.fs_type, formik.values.used_an_incubator)
  const showNumberOfSolutionsSupportedBy = ['taf', 'ctf', 'financial_facility'].includes(
    formik.values.fs_type,
  )

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
      {t('buttons.cancel')}
    </ButtonSecondary>
  )

  const footer = (
    <StyledModalFooterWrapper>
      <StyledModalLeftFooter>
        {!!financeSolution && (
          <ButtonCaution onClick={handleDelete} disabled={isDeleting}>
            {t('buttons.remove_row')}
          </ButtonCaution>
        )}
      </StyledModalLeftFooter>
      <RightFooter>
        {cancelButton}
        <SaveButton
          formId="finance-solution-form"
          unsavedTitle={
            financeSolution
              ? t('gfcr.forms.finance_solutions.save')
              : t('gfcr.forms.finance_solutions.add')
          }
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
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr.forms.finance_solutions.fs_type')}
            id="fs-type-select"
            {...formik.getFieldProps('fs_type')}
            options={fsTypeOptions}
            required={true}
            validationMessages={
              formik.errors.fs_type?.filter((e) => e.id === 'PCFRevenues') ?? []
            }
            validationType={
              formik.errors.fs_type?.some((e) => e.id === 'PCFRevenues') ? 'error' : undefined
            }
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowWithLabelAndValidation
            label={t('gfcr.forms.finance_solutions.business_finance_solution_name')}
            id="finance-solution-input"
            type="text"
            {...formik.getFieldProps('name')}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.finance_solutions.name_helper" />
            }
            showHelperText={displayHelp}
            required={true}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr.forms.finance_solutions.sector')}
            id="sector-select"
            {...formik.getFieldProps('sector')}
            options={getOptions(choices.sectors.data)}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.finance_solutions.sector_helper" />
            }
            showHelperText={displayHelp}
            required={formik.values.fs_type === 'business'}
          />
        </StyledModalInputRow>
        {showGeographicalCoverage && (
          <StyledModalInputRow>
            <InputNoRowSelectWithLabelAndValidation
              label={t('gfcr.forms.finance_solutions.geographical_coverage')}
              id="geographical-coverage-select"
              {...formik.getFieldProps('geographical_coverage')}
              options={getOptions(choices.geographicalcoverage?.data || [])}
              required={true}
            />
          </StyledModalInputRow>
        )}
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr.forms.finance_solutions.used_an_incubator')}
            id="used-an-incubator-select"
            {...formik.getFieldProps('used_an_incubator')}
            options={[
              { value: 'none', label: t('no') },
              ...getOptions(choices.incubatortypes.data),
            ]}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.finance_solutions.used_an_incubator_helper" />
            }
            showHelperText={displayHelp}
          />
        </StyledModalInputRow>
        {showTafName && (
          <StyledModalInputRow>
            <InputNoRowWithLabelAndValidation
              label={t('gfcr.forms.finance_solutions.taf_name')}
              id="taf-name-input"
              type="text"
              {...formik.getFieldProps('taf_name')}
            />
          </StyledModalInputRow>
        )}
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr.forms.finance_solutions.local_enterprise')}
            id="local-enterprise-select"
            {...formik.getFieldProps('local_enterprise')}
            options={[
              { value: true, label: t('yes') },
              { value: false, label: t('no') },
            ]}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.finance_solutions.local_enterprise_helper" />
            }
            showHelperText={displayHelp}
          />
        </StyledModalInputRow>
        <StyledModalInputRow>
          <InputNoRowSelectWithLabelAndValidation
            label={t('gfcr.forms.finance_solutions.gender_program_criteria')}
            id="gender-smart-select"
            {...formik.getFieldProps('gender_smart')}
            options={[
              { value: true, label: t('yes') },
              { value: false, label: t('no') },
            ]}
            helperText={
              <GfcrHelperLinks translationKey="gfcr.forms.finance_solutions.gender_program_criteria_helper" />
            }
            showHelperText={displayHelp}
          />
        </StyledModalInputRow>
        {showNumberOfSolutionsSupportedBy && (
          <StyledModalInputRow>
            <InputNoRowWithLabelAndValidation
              label={t('gfcr.forms.finance_solutions.number_of_solutions_supported_by')}
              id="number-of-solutions-input"
              type="number"
              min="1"
              {...formik.getFieldProps('number_of_solutions_supported_by')}
              required={true}
            />
          </StyledModalInputRow>
        )}
        <StyledModalInputRow>
          <label
            id="sustainable-finance-mechanisms-label"
            htmlFor="sustainable-finance-mechanisms-select"
          >
            {t('gfcr.forms.finance_solutions.sustainable_finance_mechanisms')}
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
                : `${t('choose')}...`
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
              <GfcrHelperLinks translationKey="gfcr.forms.finance_solutions.sustainable_finance_mechanisms_helper" />
            </HelperText>
          ) : null}
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
      title={
        financeSolution
          ? t('gfcr.forms.finance_solutions.update')
          : t('gfcr.forms.finance_solutions.add')
      }
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
