import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { getToastArguments } from '../../library/getToastArguments'
import Modal, { RightFooter, ModalInputRow } from '../generic/Modal'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import handleHttpResponseError from '../../library/handleHttpResponseError'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import theme from '../../theme'
import InputWithLabelAndValidation from '../mermaidInputs/InputWithLabelAndValidation'
import LoadingModal from '../LoadingModal/LoadingModal'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { useTranslation } from 'react-i18next'
import { internalNavigation } from '../../link_constants'

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
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [nameAlreadyExists, setNameAlreadyExists] = useState(false)
  const [existingName, setExistingName] = useState('')
  const { refreshCurrentUser } = useCurrentUser()
  // using same error format as Formik so message can be used in InputWithLabelAndValidation
  const nameExistsError = [{ code: t('projects.errors.project_name_exists'), id: 'Name Exists' }]

  const initialFormValues = project
    ? {
        name: t('projects.copy_of_project_name', { projectName: project.name }),
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
        errors.name = [{ code: t('forms.required_field'), id: 'Required' }]
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
          toast.error(...getToastArguments(t('projects.errors.duplicate_name')))
        }
      },
    })

    setIsLoading(false)
  }

  const handleSuccessResponse = (response, languageSuccessMessage) => {
    refreshCurrentUser() // this ensures the user has the right privileges to the newly created project
    toast.success(...getToastArguments(languageSuccessMessage))
    formik.resetForm()
    addProjectToProjectsPage(response)
    setIsLoading(false)
    setNameAlreadyExists(false)
    setExistingName('')
    onDismiss()
    navigate(internalNavigation.projectStartPage(response.id))
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
        handleSuccessResponse(response, t('projects.success.project_copied'))
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
        handleSuccessResponse(response, t('projects.success.project_created'))
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
          label={t('projects.project_name')}
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
          setErrors={t('forms.required_field')}
        />
      </ModalInputRow>
    )
  }
  const modalContent = project ? (
    <>
      {getModalContent(t('projects.name_of_project'))}
      <ModalInputRow>
        <CheckBoxLabel>
          <input
            type="checkbox"
            value={formik.values.sendEmail}
            name="sendEmail"
            checked={formik.values.sendEmail}
            onChange={formik.handleChange}
          />
          {t('projects.notify_user_email')}
        </CheckBoxLabel>
      </ModalInputRow>
      <p>{t('projects.data_copy_to_project')}</p>
      <p>{t('projects.admin_for_project')}</p>
    </>
  ) : (
    <>
      {getModalContent()}
      <p>{t('projects.admin_for_project')}</p>
    </>
  )

  const modalTitle = project ? t('projects.copy_project') : t('projects.create_project')

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('buttons.cancel')}</ButtonSecondary>
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
