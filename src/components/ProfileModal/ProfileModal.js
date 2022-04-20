import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input, InputRow } from '../generic/form'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal/Modal'

const ModalInputRow = styled(InputRow)`
  background: ${theme.color.white};
  display: block;
  border: none;
`
const ProfileModal = ({ isOpen, onDismiss }) => {
  const formik = useFormik({
    initialValues: { newOrganizationSuggestion: '' },
  })

  const resetAndCloseModal = () => {
    formik.resetForm()
    onDismiss()
  }

  const handleOnSubmit = () => {
    resetAndCloseModal()
    toast.success(...getToastArguments(language.success.newOrganizationAdd))
  }

  const modalContent = (
    <>
      <ModalInputRow>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="modal-input-for-firstname-label" htmlFor="modal-input-for-firstname">
          First Name
        </label>
        <div>
          <Input
            aria-labelledby="modal-input-for-firstname-label"
            aria-describedby="modal-input-for-firstname-descp"
            id="modal-input-for-firstname"
            value="first name"
            autoFocus
            onChange={(event) => {}}
          />
        </div>
      </ModalInputRow>
      <ModalInputRow>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="modal-input-for-lastname-label" htmlFor="modal-input-for-lastname">
          Last Name
        </label>
        <div>
          <Input
            aria-labelledby="modal-input-for-lastname-label"
            aria-describedby="modal-input-for-lastname-descp"
            id="modal-input-for-lastname"
            value="last name"
            onChange={(event) => {}}
          />
        </div>
      </ModalInputRow>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonPrimary onClick={() => {}}>
        <IconSend />
        Save Changes
      </ButtonPrimary>
      <ButtonSecondary onClick={resetAndCloseModal}>Cancel</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={resetAndCloseModal}
      title="Your Profile"
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

ProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default ProfileModal
