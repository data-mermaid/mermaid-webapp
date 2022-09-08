import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React from 'react'
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

  const copyExistingProject = () =>
    databaseSwitchboardInstance
      .addProject(project.id, `Copy of ${project.name}`)
      .then(() => {
        toast.success(...getToastArguments(language.success.projectCopied))
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            if (error.response.status === 500) {
              toast.error(...getToastArguments(language.error.generic))
            } else {
              toast.error(...getToastArguments(language.error.duplicateNewProject))
            }
          },
        })
      })

  const formik = useFormik({
    initialValues: { name: `Copy of ${project.name}` },
  })

  const handleOnSubmit = () => {
    copyExistingProject()
    onDismiss()
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

const checkProps = (propType) => {
  if (propType === undefined) {
    return undefined
  }

  return projectPropType.isRequired
}

ProjectModal.defaultProps = {
  project: { checkProps },
}

export default ProjectModal
