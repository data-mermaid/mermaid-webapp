import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input, InputRow, HelperText } from '../generic/form'
import language from '../../language'
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
    toast.success(language.success.newOrganizationAdd)
  }

  const id = 'modalInputId'
  const helperText = language.pages.projectInfo.suggestionOrganizationHelperText
  const modalContent = (
    <>
      <ModalInputRow>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id={`aria-label${id}`} htmlFor={id}>
          New Organization Name
        </label>
        <div>
          <Input
            aria-labelledby={`aria-label${id}`}
            aria-describedby={`aria-descsp${id}`}
            id={id}
          />
          {helperText && (
            <HelperText id={`aria-descp${id}`}>{helperText}</HelperText>
          )}
        </div>
      </ModalInputRow>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonPrimary onClick={handleOnSubmit}>
        <IconSend />
        Send to MERMAID for review
      </ButtonPrimary>
      <ButtonSecondary onClick={resetAndCloseModal}>Cancel</ButtonSecondary>
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
