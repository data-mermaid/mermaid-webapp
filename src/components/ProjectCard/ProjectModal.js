import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import Modal, { RightFooter, ModalInputRow } from '../generic/Modal/Modal'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import handleHttpResponseError from '../../library/handleHttpResponseError'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import theme from '../../theme'
import InputWithLabelAndValidation from '../mermaidInputs/InputWithLabelAndValidation'
import LoadingModal from '../LoadingModal/LoadingModal'

const CheckBoxLabel = styled.label`
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
`

const ProjectModal = ({ isOpen, onDismiss, project, addProjectToProjectsPage }) => {
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: `Copy of ${project.name}`,
      sendEmail: true,
    },
    validate: (values) => {
      const errors = {}

      if (!values.name) {
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      return errors
    },
  })

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const copyExistingProject = () => {
    // setIsLoading and addProjectToProjectsPage are used in this function
    // to display the loading modal and pass the new project back to the
    // projects page.
    // This is done because the projects page does not re-render after the
    // sync has taken place.
    // As an alternative they could be removed and  we could make use of
    // setIsSyncInProgress in a way that is consitent with other components.
    setIsLoading(true)
    databaseSwitchboardInstance
      .addProject(project.id, formik.values.name, formik.values.sendEmail)
      .then((response) => {
        toast.success(...getToastArguments(language.success.projectCopied))
        formik.resetForm()
        addProjectToProjectsPage(response)
        setIsLoading(false)
        onDismiss()
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            const isDuplicateError = [500, 400].includes(error.response.status)
              && error.response.data?.detail === '[IntegrityError] Copying project'

            if (isDuplicateError) {
              toast.error(...getToastArguments(...getToastArguments(language.error.duplicateNewProject)))
            }
          },
        })
        setIsLoading(false)
      })
  }

  const handleOnSubmit = () => {
    copyExistingProject()
  }

  const modalContent = (
    <>
      <ModalInputRow>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="modal-input-for-projectname-label" htmlFor="modal-input-for-projectname" />
        <InputWithLabelAndValidation
          required
          label="Project Name"
          id="name"
          type="text"
          value={formik.values.name}
          placeholder="Name of project"
          onChange={formik.handleChange}
          validationType={formik.errors.name ? 'error' : null}
          validationMessages={formik.errors.name}
          setErrors={language.error.formValidation.required}
        />
      </ModalInputRow>
      <ModalInputRow>
        <CheckBoxLabel>
          <input
            type="checkbox"
            value={formik.values.sendEmail}
            name="sendEmail"
            checked={formik.values.sendEmail}
            onChange={formik.handleChange}
          />
          Notify users by email
        </CheckBoxLabel>
      </ModalInputRow>
      <p>{language.projectModal.copyProjectMessage}</p>
      <p>{language.projectModal.footerMessage}</p>
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
    <>
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        title={language.projectModal.copyTitle}
        mainContent={modalContent}
        footerContent={footerContent}
      />
      {isLoading && <LoadingModal />}
    </>

  )
}

ProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  project: projectPropType,
  addProjectToProjectsPage: PropTypes.func.isRequired,
}

ProjectModal.defaultProps = {
  project: projectPropType.isRequired,
}

export default ProjectModal
