import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconSend } from '../icons'
import { Input } from '../generic/form'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import Modal, { RightFooter, ModalInputRow } from '../generic/Modal/Modal'
import { projectPropType } from '../../App/mermaidData/mermaidDataProptypes'
import handleHttpResponseError from '../../library/handleHttpResponseError'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import theme from '../../theme'

const CheckBoxLabel = styled.label`
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
`
const ProjectModal = ({ isOpen, onDismiss, project, sendEmail }) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const copyExistingProject = () =>
    databaseSwitchboardInstance
      .addProject(project.id, `Copy of ${project.name}`, sendEmail)
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

  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked((current) => !current)
  }

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
          placeholder="Name of project"
          onChange={(event) => formik.setFieldValue('name', event.target.value)}
        />
        <p>
          Sites, Management Regimes, Data Sharing, and Users and their roles will be copied to the
          new project.
        </p>
        <CheckBoxLabel>
          <input type="checkbox" checked={checked} onChange={handleChange} />
          Notify users by email
        </CheckBoxLabel>
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
  sendEmail: projectPropType,
  project: projectPropType,
}

ProjectModal.defaultProps = {
  project: projectPropType.isRequired,
  sendEmail: projectPropType.bool,
}

export default ProjectModal
