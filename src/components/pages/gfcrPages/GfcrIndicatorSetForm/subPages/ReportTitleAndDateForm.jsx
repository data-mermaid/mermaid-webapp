import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation, Trans } from 'react-i18next'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formik/formikPropType'
import { StyledGfcrInputWrapper } from './subPages.styles'
import DeleteRecordButton from '../../../../DeleteRecordButton/DeleteRecordButton'
import { HelperTextLink } from '../../../../generic/links'
import { useDatabaseSwitchboardInstance } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../../../library/getToastArguments'
import { ensureTrailingSlash } from '../../../../../library/strings/ensureTrailingSlash'
import useCurrentProjectPath from '../../../../../library/useCurrentProjectPath'
import { useHttpResponseErrorHandler } from '../../../../../App/HttpResponseErrorHandlerContext'
import { resetEmptyFormikFieldToInitialValue } from '../../../../../library/formik/resetEmptyFormikFieldToInitialValue'

const ReportTitleAndDateForm = ({ formik, isNewIndicatorSet, displayHelp }) => {
  const { t } = useTranslation()
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
        toast.success(...getToastArguments(t('success.gfcr_indicator_set_delete')))
        navigate(`${ensureTrailingSlash(currentProjectPath)}gfcr/`)
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
        })
        toast.error(...getToastArguments(t('error.gfcr_indicator_set_delete')))
        setIsDeletingIndicatorSet(false)
      })
  }

  return (
    <StyledGfcrInputWrapper>
      <InputWithLabelAndValidation
        required
        label={t('gfcr_indicator_set.indicator_set_title')}
        id="gfcr-title"
        type="text"
        textAlign="left"
        {...formik.getFieldProps('title')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        showHelperText={displayHelp}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.indicator_set_title_helper"
            components={{
              a: (
                <HelperTextLink
                  href="https://globalfundcoralreefs.org/wp-content/uploads/2024/02/GFCR-Monitoring-and-Evaluation-Toolkit-February-2024.pdf"
                  target="_blank"
                />
              ),
            }}
          />
        }
      />
      <InputWithLabelAndValidation
        label={t('gfcr_indicator_set.indicator_set_reporting_date')}
        id="gfcr-report_date"
        type="date"
        {...formik.getFieldProps('report_date')}
        onBlur={(event) =>
          resetEmptyFormikFieldToInitialValue({ formik, event, fieldName: 'report_date' })
        }
        showHelperText={displayHelp}
        helperText={
          <Trans
            i18nKey="gfcr_indicator_set.indicator_set_reporting_date_helper"
            components={{
              a: (
                <HelperTextLink
                  href="https://globalfundcoralreefs.org/wp-content/uploads/2024/02/GFCR-Monitoring-and-Evaluation-Toolkit-February-2024.pdf"
                  target="_blank"
                />
              ),
            }}
          />
        }
      />
      <DeleteRecordButton
        currentPage={1}
        errorData={[]}
        isLoading={isDeletingIndicatorSet}
        isNewRecord={isNewIndicatorSet}
        isOpen={isDeleteIndicatorSetModalOpen}
        modalText={{
          title: t('delete_record.title', { pageName: 'Indicator Set' }),
          prompt: t('delete_record.prompt', { pageName: 'indicator set' }),
          yes: t('delete_record.yes', { pageName: 'Indicator Set' }),
          no: t('delete_record.no'),
        }}
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
}

export default ReportTitleAndDateForm
