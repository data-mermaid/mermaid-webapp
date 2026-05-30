import React, { useState } from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import InputSelectWithLabelAndValidation from '../../../../mermaidInputs/InputSelectWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formik/formikPropType'
import { StyledGfcrInputWrapper } from './subPages.styles'
import DeleteRecordButton from '../../../../DeleteRecordButton/DeleteRecordButton'
import { useTranslation } from 'react-i18next'
import { useDatabaseSwitchboardInstance } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../../../library/getToastArguments'
import { ensureTrailingSlash } from '../../../../../library/strings/ensureTrailingSlash'
import useCurrentProjectPath from '../../../../../library/useCurrentProjectPath'
import { useHttpResponseErrorHandler } from '../../../../../App/HttpResponseErrorHandlerContext'
import { resetEmptyFormikFieldToInitialValue } from '../../../../../library/formik/resetEmptyFormikFieldToInitialValue'
import { getDeleteModalText } from '../../../../../library/getDeleteModalText'
import { getOptions } from '../../../../../library/getOptions'
import { choicesPropType } from '../../../../../App/mermaidData/mermaidDataProptypes'

export const TITLE_IDS_BY_TYPE = {
  report: ['Baseline', 'Mid-year report', 'End-year report'],
  target: ['Phase 1 target', 'Mid-term target', 'Final target'],
}

const ReportTitleAndDateForm = ({ formik, isNewIndicatorSet, displayHelp, choices, indicatorSetType }) => {
  const { t } = useTranslation()

  const deleteModalText = getDeleteModalText(t('gfcr.indicator_set'))
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { indicatorSetId, projectId } = useParams()
  const navigate = useNavigate()
  const currentProjectPath = useCurrentProjectPath()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const [isDeleteIndicatorSetModalOpen, setIsDeleteIndicatorSetModalOpen] = useState(false)
  const [isDeletingIndicatorSet, setIsDeletingIndicatorSet] = useState(false)

  const openDeleteIndicatorSetModal = (event) => {
    event.preventDefault()
    setIsDeleteIndicatorSetModalOpen(true)
  }
  const closeDeleteIndicatorSetModal = () => {
    setIsDeleteIndicatorSetModalOpen(false)
  }

  const deleteIndicatorSet = () => {
    setIsDeletingIndicatorSet(true)

    databaseSwitchboardInstance
      .deleteIndicatorSet(projectId, indicatorSetId)
      .then(() => {
        closeDeleteIndicatorSetModal()
        setIsDeletingIndicatorSet(false)
        toast.success(...getToastArguments(t('gfcr.success.indicator_set_save')))
        navigate(`${ensureTrailingSlash(currentProjectPath)}gfcr/`)
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
        })
        toast.error(...getToastArguments(t('gfcr.errors.indicator_set_save_failed')))
        setIsDeletingIndicatorSet(false)
      })
  }

  const validTitleIds = TITLE_IDS_BY_TYPE[indicatorSetType] ?? []
  const allTitleChoices = choices?.indicatorsettitles?.data ?? []
  const standardOptions = getOptions(allTitleChoices.filter(({ id }) => validTitleIds.includes(id)))

  const currentTitle = formik.values.title
  const isNonStandard = !!currentTitle && !validTitleIds.includes(currentTitle)
  const titleOptions = isNonStandard
    ? [
        { value: currentTitle, label: `${currentTitle} ${t('gfcr.non_standard_title_suffix')}` },
        ...standardOptions,
      ]
    : standardOptions

  return (
    <StyledGfcrInputWrapper>
      <InputSelectWithLabelAndValidation
        required
        label={t('title')}
        id="gfcr-title"
        options={titleOptions}
        {...formik.getFieldProps('title')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        showHelperText={displayHelp}
        helperText={t('gfcr.indicator_set_title_info')}
      />
      <InputWithLabelAndValidation
        label={t('gfcr.reporting_date')}
        id="gfcr-report_date"
        type="date"
        {...formik.getFieldProps('report_date')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'report_date' })
        }
        showHelperText={displayHelp}
        helperText={t('gfcr.indicator_set_date_info')}
      />
      <DeleteRecordButton
        currentPage={1}
        errorData={[]}
        isLoading={isDeletingIndicatorSet}
        isNewRecord={isNewIndicatorSet}
        isOpen={isDeleteIndicatorSetModalOpen}
        modalText={deleteModalText}
        deleteRecord={deleteIndicatorSet}
        onDismiss={closeDeleteIndicatorSetModal}
        openModal={openDeleteIndicatorSetModal}
      />
    </StyledGfcrInputWrapper>
  )
}

ReportTitleAndDateForm.propTypes = {
  formik: formikPropType.isRequired,
  isNewIndicatorSet: PropTypes.bool.isRequired,
  displayHelp: PropTypes.bool,
  choices: choicesPropType,
  indicatorSetType: PropTypes.string,
}

export default ReportTitleAndDateForm
