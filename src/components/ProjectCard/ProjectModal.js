import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import React from 'react'
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

const CheckBoxLabel = styled.label`
  display: inline-block;
  input {
    margin: 0 ${theme.spacing.xsmall} 0 0;
    cursor: pointer;
  }
`

const StyledTextFooterModal = styled('div')`
  color: ${theme.color.black};
  float: left;
  position: relative;
  overflow-wrap: break-word;
  left: -85%;
`

const ProjectModal = ({ isOpen, onDismiss, project }) => {
  const formik = useFormik({
    initialValues: {
      name: `Copy of ${project.name}`,
      sendEmail: true,
    },
  })

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const copyExistingProject = () =>
    databaseSwitchboardInstance
      .addProject(project.id, formik.values.name, formik.values.sendEmail)
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

  const handleOnSubmit = () => {
    copyExistingProject()
    onDismiss()
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
        />
        <p>{language.projectModal.copyProjectMessage}</p>
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
    </>
  )

  const footerContent = (
    <RightFooter>
      <StyledTextFooterModal>{language.projectModal.footerMessage}</StyledTextFooterModal>
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
      title={language.projectModal.copyTitle}
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
