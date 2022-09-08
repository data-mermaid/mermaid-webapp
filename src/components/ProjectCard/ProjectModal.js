import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input } from '../generic/form'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import Modal, { RightFooter, ModalInputRow } from '../generic/Modal/Modal'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import handleHttpResponseError from '../../library/handleHttpResponseError'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'

const ProjectModal = ({ isOpen, onDismiss, project }) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const fetchProjectProfiles = useCallback(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getProjectProfiles(project.id).catch(() => {
        toast.error(...getToastArguments(language.error.userRecordsUnavailable))
      })
    }
  }, [databaseSwitchboardInstance, project.id])

  const copyExistingProject = () =>
    databaseSwitchboardInstance
      .addProject(project.id, `Copy of ${project.name}`)
      .then(() => {
        fetchProjectProfiles()
        toast.success(...getToastArguments(language.success.projectCopied))
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            if (error.response.status === 500) {
              toast.error(...getToastArguments(language.error.duplicateNewProject))
            } else {
              toast.error(...getToastArguments(language.error.generic))
            }
          },
        })
      })

  const copyProject = () => {
    copyExistingProject()
  }
  const formik = useFormik({
    initialValues: { name: `Copy of ${project.name}` },
  })

  const handleOnSubmit = () => {
    copyProject()
    onDismiss()
    toast.success(...getToastArguments(language.success.projectCopied))
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
          type="text"
          value={formik.initialValues.name}
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

ProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  project: projectPropType,
}

ProjectModal.defaultProps = {
  project: projectPropType.isRequired,
}

export default ProjectModal
