import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input } from '../generic/form'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import Modal, { RightFooter, ModalInputRow } from '../generic/Modal/Modal'

const CopyProjectModal = ({ isOpen, onDismiss }) => {
  const formik = useFormik({
    initialValues: { name: '' },
  })

  const handleOnSubmit = () => {
    onDismiss()
    toast.success(...getToastArguments(language.success.userProfileUpdate))
  }

  const modalContent = (
    <>
      <ModalInputRow>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="modal-input-for-projectname-label" htmlFor="modal-input-for-projectname">
          <h4>Project Name</h4>
        </label>
        <Input
          aria-labelledby="modal-input-for-projectname-label"
          id="modal-input-for-name"
          name="name"
          //   value={formik.values.name}
          type="text"
          placeholder="Copy of Dev Team Test Project" // hardcoded for now
          onChange={(event) => formik.setFieldValue('name', event.target.value)}
        />
      </ModalInputRow>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonPrimary onClick={handleOnSubmit}>
        <IconSend />
        Copy project
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

CopyProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default CopyProjectModal
