import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { useCurrentUser } from '../../App/CurrentUserContext'

const CheckBoxLabel = styled.label`
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
`

const ProjectModal = ({
  isOpen,
  onDismiss,
  project = projectPropType.isRequired,
  addProjectToProjectsPage,
}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [nameAlreadyExists, setNameAlreadyExists] = useState(false)
  const [existingName, setExistingName] = useState('')
  const { refreshCurrentUser } = useCurrentUser()
  // using same error format as Formik so message can be used in InputWithLabelAndValidation
  const nameExistsError = [
    { code: language.error.formValidation.projectNameExists, id: 'Name Exists' },
  ]

  const initialFormValues = project
    ? {
        name: `Copy of ${project.name}`,
        sendEmail: true,
      }
    : {
        name: '',
      }

  const formik = useFormik({
    initialValues: initialFormValues,
    validate: (values) => {
      const errors = {}

      if (!values.name) {
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      return errors
    },
  })

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const handleResponseError = (error) => {
    handleHttpResponseError({
      error,
      callback: () => {
        const isDuplicateError =
          error.response.status === 400 ||
          (error.response.status === 500 &&
            error.response.data?.new_project_name === 'Project name already exists')

        if (isDuplicateError) {
          setNameAlreadyExists(true)
          setExistingName(formik.values.name)
          toast.error(
            ...getToastArguments(...getToastArguments(language.error.projectWithSameName)),
          )
        }
      },
    })

    setIsLoading(false)
  }

  const handleSuccessResponse = (response, languageSuccessMessage) => {
    refreshCurrentUser() // this ensures the user has the right privaleges to the newly created project
    toast.success(...getToastArguments(languageSuccessMessage))
    formik.resetForm()
    addProjectToProjectsPage(response)
    setIsLoading(false)
    setNameAlreadyExists(false)
    setExistingName('')
    onDismiss()
    navigate(`/projects/${response.id}/sites`)
  }

  const copyExistingProject = () => {
    // setIsLoading and addProjectToProjectsPage are used in this function
    // to display the loading modal and pass the new project back to the
    // projects page.
    // This is done because the projects page does not re-render after the
    // sync has taken place.
    // As an alternative they could be removed and  we could make use of
    // setIsSyncInProgress in a way that is consistent with other components.
    setIsLoading(true)
    databaseSwitchboardInstance
      .copyProject(project.id, formik.values.name, formik.values.sendEmail)
      .then((response) => {
        handleSuccessResponse(response, language.success.projectCopied)
      })
      .catch((error) => {
        handleResponseError(error, 'Copying')
      })
  }

  const createNewProject = () => {
    setIsLoading(true)
    databaseSwitchboardInstance
      .addProject(formik.values.name)
      .then((response) => {
        handleSuccessResponse(response, language.success.projectCreated)
      })
      .catch((error) => {
        handleResponseError(error, 'Creating')
      })
  }

  const handleOnSubmit = () => {
    if (project) {
      copyExistingProject()
    }
    if (!project) {
      createNewProject()
    }
  }

  const checkValidationMessage = () => {
    let errorMessage = []

    if (formik.errors.name) {
      errorMessage = formik.errors.name
    } else if (nameAlreadyExists) {
      errorMessage = nameExistsError
    }

    return errorMessage
  }

  const getModalContent = (placeholderName) => {
    return (
      <ModalInputRow>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label id="modal-input-for-projectname-label" htmlFor="modal-input-for-projectname" />
        <InputWithLabelAndValidation
          required
          label="Project Name"
          id="name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          validationType={
            formik.errors.name || (existingName && existingName === formik.values.name)
              ? 'error'
              : null
          }
          placeholder={placeholderName || ''}
          validationMessages={checkValidationMessage()}
          setErrors={language.error.formValidation.required}
        />
      </ModalInputRow>
    )
  }
  const modalContent = project ? (
    <>
      {getModalContent('Name of project')}

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
      <p>{language.projectModal.copyMessage}</p>
      <p>{language.projectModal.footerMessage}</p>
    </>
  ) : (
    <>
      {getModalContent()}
      <p>{language.projectModal.footerMessage}</p>
    </>
  )

  const modalTitle = project ? language.projectModal.copyTitle : language.projectModal.createTitle

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonPrimary disabled={isLoading} onClick={handleOnSubmit}>
        <IconSend />
        {modalTitle}
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <>
      <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        title={modalTitle}
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

export default ProjectModal
