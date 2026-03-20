import React, { useState } from 'react'
import PropTypes from 'prop-types'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formik/formikPropType'
import { StyledGfcrInputWrapper } from './subPages.styles'
import DeleteRecordButton from '../../../../DeleteRecordButton/DeleteRecordButton'
import { useTranslation } from 'react-i18next'
import { useDatabaseSwitchboardInstance } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../../../library/getToastArguments'
import { ensureTrailingSlash } from '../../../../../library/strings/ensureTrailingSlash'
import useCurrentProjectPath from '../../../../../library/useCurrentProjectPath'
import { useHttpResponseErrorHandler } from '../../../../../App/HttpResponseErrorHandlerContext'
import { resetEmptyFormikFieldToInitialValue } from '../../../../../library/formik/resetEmptyFormikFieldToInitialValue'
import { getDeleteModalText } from '../../../../../library/getDeleteModalText'

const ReportTitleAndDateForm = ({ formik, isNewIndicatorSet, displayHelp }) => {
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

  return (
    <StyledGfcrInputWrapper>
      <InputWithLabelAndValidation
        required
        label={t('title')}
        id="gfcr-title"
        type="text"
        $textAlign="left"
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
}

export default ReportTitleAndDateForm
