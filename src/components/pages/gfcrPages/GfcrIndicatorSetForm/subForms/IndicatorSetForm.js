import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import InputWithLabelAndValidation from '../../../../mermaidInputs/InputWithLabelAndValidation'
import { formikPropType } from '../../../../../library/formikPropType'
import { enforceNumberInput } from '../../../../../library/enforceNumberInput'
import { StyledGfcrInputWrapper } from './subForms.styles'
import DeleteRecordButton from '../../../../DeleteRecordButton/DeleteRecordButton'
import language from '../../../../../language'
import { useDatabaseSwitchboardInstance } from '../../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getToastArguments } from '../../../../../library/getToastArguments'
import { ensureTrailingSlash } from '../../../../../library/strings/ensureTrailingSlash'
import useCurrentProjectPath from '../../../../../library/useCurrentProjectPath'
import { useHttpResponseErrorHandler } from '../../../../../App/HttpResponseErrorHandlerContext'

const StyledYearInputWithLabelAndValidation = styled(InputWithLabelAndValidation)`
  width: 10rem;
`

const IndicatorSetForm = ({
  formik,
  handleInputBlur,
  setInputToDefaultValue,
  isNewIndicatorSet,
}) => {
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
        toast.success(...getToastArguments(language.success.gfcrIndicatorSetDelete))
        navigate(`${ensureTrailingSlash(currentProjectPath)}gfcr/`)
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
        })
        toast.error(...getToastArguments(language.error.gfcrIndicatorSetDelete))
        setIsDeletingIndicatorSet(false)
      })
  }

  return (
    <StyledGfcrInputWrapper>
      <InputWithLabelAndValidation
        required
        label="Title"
        id="gfcr-title"
        type="text"
        {...formik.getFieldProps('title')}
        validationType={formik.errors.title && formik.touched.title ? 'error' : null}
        validationMessages={formik.errors.title}
        helperText={'Example helper text'}
      />
      <InputWithLabelAndValidation
        label="Reporting Date"
        id="gfcr-report_date"
        type="date"
        {...formik.getFieldProps('report_date')}
        onBlur={(event) => handleInputBlur(formik, event, 'report_date')}
      />
      <StyledYearInputWithLabelAndValidation
        label="Reporting Year"
        id="gfcr-report-year"
        type="number"
        {...formik.getFieldProps('report_year')}
        onKeyDown={(event) => enforceNumberInput(event)}
        onBlur={(event) => {
          const { value } = event.target
          const trimmedValue = value.trim()

          if (
            trimmedValue === '' ||
            parseInt(trimmedValue) < 1900 ||
            parseInt(trimmedValue) > 2099
          ) {
            setInputToDefaultValue(formik, 'report_year')
          }
        }}
      />
      <DeleteRecordButton
        currentPage={1}
        errorData={[]}
        isLoading={isDeletingIndicatorSet}
        isNewRecord={isNewIndicatorSet}
        isOpen={isDeleteIndicatorSetModalOpen}
        modalText={language.deleteRecord('Indicator Set')}
        deleteRecord={deleteIndicatorSet}
        onDismiss={closeDeleteIndicatorSetModal}
        openModal={openDeleteIndicatorSetModal}
      />
    </StyledGfcrInputWrapper>
  )
}

IndicatorSetForm.propTypes = {
  formik: formikPropType.isRequired,
  handleInputBlur: PropTypes.func.isRequired,
  setInputToDefaultValue: PropTypes.func.isRequired,
  isNewIndicatorSet: PropTypes.bool.isRequired,
}

export default IndicatorSetForm
