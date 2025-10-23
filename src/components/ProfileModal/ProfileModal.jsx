import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSave } from '../icons'
import { Input } from '../generic/form'
import { getToastArguments } from '../../library/getToastArguments'
import Modal, { RightFooter, ModalInputRow } from '../generic/Modal'
import { getProfileInitialValues } from './profileFormInitialValues'
import { useCurrentUser } from '../../App/CurrentUserContext'

const ProfileModal = ({ isOpen, onDismiss }) => {
  const { t } = useTranslation()
  const { currentUser, saveUserProfile } = useCurrentUser()
  const initialFormValues = useMemo(() => getProfileInitialValues(currentUser), [currentUser])

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
  })

  const handleOnSubmit = () => {
    saveUserProfile(formik.values)
    onDismiss()
    toast.success(...getToastArguments(t('success.user_profile_update')))
  }

  const modalContent = (
    <>
      <ModalInputRow>
        <h4>Email address</h4>
        <div>{formik.values.email}</div>
      </ModalInputRow>
      <ModalInputRow>
        <label id="modal-input-for-firstname-label" htmlFor="modal-input-for-firstname">
          First Name
        </label>
        <Input
          aria-labelledby="modal-input-for-firstname-label"
          id="modal-input-for-firstname"
          value={formik.values.first_name}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus // IMPORTANT we should reconsider autofocus use. See: https://trello.com/c/4pe1zgS9/1331-accessibility-linting-issues-deferred
          onChange={(event) => formik.setFieldValue('first_name', event.target.value)}
        />
      </ModalInputRow>
      <ModalInputRow>
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
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonPrimary onClick={handleOnSubmit}>
        <IconSave />
        Save Changes
      </ButtonPrimary>
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
