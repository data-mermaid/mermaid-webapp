import PropTypes from 'prop-types'
import React, { useState, useCallback, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { useFormik } from 'formik'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { getIndicatorSetFormInitialValues } from '../GfcrIndicatorSet/indicatorSetFormInitialValues'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import { ButtonSecondary } from '../../../generic/buttons'
import {
  StyledModalFooterWrapper,
  StyledModalInputRow,
  StyledModalLeftFooter,
} from '../GfcrIndicatorSetForm/subPages/subPages.styles'
import Modal, { RightFooter } from '../../../generic/Modal'
import SaveButton from '../GfcrIndicatorSetForm/modals/SaveButton'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import InputNoRowWithLabelAndValidation from '../../../mermaidInputs/InputNoRowWithLabelAndValidation'
import InputNoRowSelectWithLabelAndValidation from '../../../mermaidInputs/InputNoRowSelectWithLabelAndValidation'
import { displayErrorMessagesGFCR } from '../../../../library/displayErrorMessagesGFCR'
import { getOptions } from '../../../../library/getOptions'
import { TITLE_IDS_BY_TYPE } from '../GfcrIndicatorSetForm/subPages/ReportTitleAndDateForm'

const NewIndicatorSetModal = ({ indicatorSetType, isOpen, onDismiss }) => {
  const { t } = useTranslation()

  const indicatorSetSaveText = t('gfcr.create_indicator_set')
  const modalTitle =
    indicatorSetType === 'report'
      ? t('gfcr.create_report_indicator_set')
      : indicatorSetType === 'target'
        ? t('gfcr.create_target_indicator_set')
        : ''

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const navigate = useNavigate()
  const { isAppOnline } = useOnlineStatus()

  const [isLoading, setIsLoading] = useState(false)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [titleOptions, setTitleOptions] = useState([])

  useEffect(
    function loadTitleOptions() {
      if (!databaseSwitchboardInstance || !isAppOnline || !isOpen) {
        return
      }
      databaseSwitchboardInstance
        .getChoices()
        .then((choices) => {
          const validIds = TITLE_IDS_BY_TYPE[indicatorSetType] ?? []
          const allTitles = choices?.indicatorsettitles?.data ?? []
          setTitleOptions(getOptions(allTitles.filter(({ id }) => validIds.includes(id))))
        })
        .catch(() => {
          toast.error(...getToastArguments(t('gfcr.errors.indicator_sets_unavailable')))
        })
    },
    [databaseSwitchboardInstance, isAppOnline, indicatorSetType, isOpen],
  )

  const handleFormSubmit = useCallback(
    async (formikValues, formikActions) => {
      setIsLoading(true)

      try {
        let response = await databaseSwitchboardInstance.saveIndicatorSet(projectId, {
          ...formikValues,
          indicator_set_type: indicatorSetType,
        })

        setSaveButtonState(buttonGroupStates.saved)
        setIsFormDirty(false)
        formikActions.resetForm({ values: formikValues }) // this resets formik's dirty state

        navigate(`${ensureTrailingSlash(currentProjectPath)}gfcr/${response.id}`)
        toast.success(...getToastArguments(indicatorSetSaveText))
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        setSaveButtonState(buttonGroupStates.unsaved)

        if (error && isAppOnline) {
          displayErrorMessagesGFCR(error)

          handleHttpResponseError({
            error,
          })
        }
      }
    },
    [
      databaseSwitchboardInstance,
      projectId,
      indicatorSetType,
      navigate,
      currentProjectPath,
      isAppOnline,
      handleHttpResponseError,
      indicatorSetSaveText,
    ],
  )

  const { title, report_date } = getIndicatorSetFormInitialValues()

  const formik = useFormik({
    initialValues: { title, report_date },
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    validate: (values) => {
      const errors = {}

      const validTitleIds = TITLE_IDS_BY_TYPE[indicatorSetType] ?? []
      if (!values.title || !validTitleIds.includes(values.title)) {
        errors.title = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      if (!values.report_date) {
        errors.report_date = [{ code: t('forms.required_field'), id: 'Required' }]
      }

      return errors
    },
  })

  const _setIsFormDirty = useEffect(() => setIsFormDirty(!!formik.dirty), [formik.dirty])

  const footer = (
    <StyledModalFooterWrapper>
      <StyledModalLeftFooter>
        <ButtonSecondary onClick={() => onDismiss(formik.resetForm)} disabled={isLoading}>
          {t('buttons.cancel')}
        </ButtonSecondary>
      </StyledModalLeftFooter>
      <RightFooter>
        <SaveButton
          formId="new-indicator-set-modal-form"
          unsavedTitle={t('gfcr.create_indicator_set')}
          saveButtonState={saveButtonState}
          formHasErrors={!!Object.keys(formik.errors).length}
          formDirty={isFormDirty}
        />
      </RightFooter>
    </StyledModalFooterWrapper>
  )

  if (!indicatorSetType) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={() => onDismiss(formik.resetForm)}
      title={modalTitle}
      mainContent={
        <form id="new-indicator-set-modal-form" onSubmit={formik.handleSubmit}>
          <StyledModalInputRow>
            <InputNoRowSelectWithLabelAndValidation
              required
              label={t('title')}
              id="indicator-set-title-input"
              options={titleOptions}
              {...formik.getFieldProps('title')}
              validationType={formik.errors.title && formik.touched.title ? 'error' : null}
              validationMessages={formik.errors.title}
              helperText={t('gfcr.indicator_set_title_info')}
            />
          </StyledModalInputRow>
          <StyledModalInputRow>
            <InputNoRowWithLabelAndValidation
              required
              label={t('gfcr.reporting_date')}
              id="indicator-set-date-input"
              type="date"
              {...formik.getFieldProps('report_date')}
              helperText={t('gfcr.indicator_set_date_info')}
            />
          </StyledModalInputRow>
        </form>
      }
      footerContent={footer}
      maxWidth="65rem"
    />
  )
}

NewIndicatorSetModal.propTypes = {
  indicatorSetType: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default NewIndicatorSetModal
