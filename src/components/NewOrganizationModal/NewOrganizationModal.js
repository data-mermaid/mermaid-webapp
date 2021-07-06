import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input, InputRow } from '../generic/form'
import language from '../../language'
import Modal, { RightFooter } from '../generic/Modal/Modal'

const ModalMainContent = styled(InputRow)`
  grid-template-columns: auto 1fr;
`

const SubText = styled.div`
  grid-column: 1/2;
  font-size: small;
  color: grey;
  padding-top: 5px;
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

  const modalContent = (
    <>
      <ModalMainContent>
        <Input
          id="add-new-organization"
          type="text"
          {...formik.getFieldProps('newOrganizationSuggestion')}
        />
        <SubText>
          {language.pages.projectInfo.suggestionOrganizationInputText}
        </SubText>
      </ModalMainContent>
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
