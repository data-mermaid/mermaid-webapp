import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input, InputRow, HelperText } from '../generic/form'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal/Modal'

const ModalInputRow = styled(InputRow)`
  background: ${theme.color.white};
  display: block;
  border: none;
`
const NewOrganizationModal = ({ isOpen, onDismiss, onSubmit }) => {
  const formik = useFormik({
    initialValues: { newOrganizationSuggestion: '' },
  })

  const resetAndCloseModal = () => {
    formik.resetForm()
    onDismiss()
  }

  const handleOnSubmit = () => {
    onSubmit(formik.values.newOrganizationSuggestion)
    resetAndCloseModal()
    toast.success(...getToastArguments(language.success.newOrganizationAdd))
  }

  const helperText = language.pages.projectInfo.suggestionOrganizationHelperText
  const modalContent = (
    <>
      <ModalInputRow>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="modal-input-for-org-label" htmlFor="modal-input-for-org">
          New Organization Name
        </label>
        <div>
          <Input
            aria-labelledby="modal-input-for-org-label"
            aria-describedby="modal-input-for-org-descp"
            id="modal-input-for-org"
            value={formik.values.newOrganizationSuggestion}
            autoFocus
            onChange={(event) =>
              formik.setFieldValue('newOrganizationSuggestion', event.target.value)
            }
          />
          {helperText && <HelperText id="modal-input-for-org-descp">{helperText}</HelperText>}
        </div>
      </ModalInputRow>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={resetAndCloseModal}>Cancel</ButtonSecondary>
      <ButtonPrimary onClick={handleOnSubmit}>
        <IconSend />
        Send to MERMAID for review
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={resetAndCloseModal}
      title={language.pages.projectInfo.createOrganizationTitle}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

NewOrganizationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default NewOrganizationModal
