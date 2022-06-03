import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input, InputRow } from '../generic/form'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { getProfileInitialValues } from './profileFormInitialValues'
import { useCurrentUser } from '../../App/CurrentUserContext'

const ModalInputRow = styled(InputRow)`
  background: ${theme.color.white};
  display: block;
  border: none;
  h4 {
    margin: 0;
  }
  label {
    font-weight: bold;
  }
`
const ProfileModal = ({ isOpen, onDismiss }) => {
  const { currentUser, saveUserProfile } = useCurrentUser()
  const initialFormValues = useMemo(() => getProfileInitialValues(currentUser), [currentUser])

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
  })

  const handleOnSubmit = () => {
    saveUserProfile(formik.values)
    onDismiss()
    toast.success(...getToastArguments(language.success.userProfileUpdate))
  }

  const modalContent = (
    <>
      <ModalInputRow>
        <h4>Email address</h4>
        <div>{formik.values.email}</div>
      </ModalInputRow>
      <ModalInputRow>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="modal-input-for-firstname-label" htmlFor="modal-input-for-firstname">
          First Name
        </label>
        <Input
          aria-labelledby="modal-input-for-firstname-label"
          id="modal-input-for-firstname"
          value={formik.values.first_name}
          autoFocus
          onChange={(event) => formik.setFieldValue('first_name', event.target.value)}
        />
      </ModalInputRow>
      <ModalInputRow>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="modal-input-for-lastname-label" htmlFor="modal-input-for-lastname">
          Last Name
        </label>
        <Input
          aria-labelledby="modal-input-for-lastname-label"
          id="modal-input-for-lastname"
          value={formik.values.last_name}
          onChange={(event) => formik.setFieldValue('last_name', event.target.value)}
        />
      </ModalInputRow>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonPrimary onClick={handleOnSubmit}>
        <IconSend />
        Save Changes
      </ButtonPrimary>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={language.title.userProfileModal}
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
