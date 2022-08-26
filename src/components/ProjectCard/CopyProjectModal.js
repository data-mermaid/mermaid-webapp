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
  color: #000;
  display: block;
  border: none;
  h4 {
    margin: 0;
  }
  label {
    font-weight: bold;
  }
`
const CopyProjectModal = ({ isOpen, onDismiss }) => {
  const formik = useFormik({
    initialValues: { name: '' },
  })

  const handleOnSubmit = () => {
    // saveUserProfile(formik.values)
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
