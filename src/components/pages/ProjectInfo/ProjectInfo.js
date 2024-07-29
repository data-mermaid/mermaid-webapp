import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { CloseButton, ButtonThatLooksLikeLink } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { createUuid } from '../../../library/createUuid'
import { getOptions } from '../../../library/getOptions'
import { getProjectInitialValues } from './projectRecordInitialFormValue'
import { H2, H3, P } from '../../generic/text'
import { buttonGroupStates } from '../../../library/buttonGroupStates'
import { hoverState } from '../../../library/styling/mediaQueries'
import { IconClose } from '../../icons'
import { InputWrapper, InputRow } from '../../generic/form'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import EnhancedPrompt from '../../generic/EnhancedPrompt'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InputAutocomplete from '../../generic/InputAutocomplete'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import NewOrganizationModal from '../../NewOrganizationModal'
import PageUnavailable from '../PageUnavailable'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import theme from '../../../theme'
import useIsMounted from '../../../library/useIsMounted'
import useDocumentTitle from '../../../library/useDocumentTitle'
import SaveButton from '../../generic/SaveButton'
import LoadingModal from '../../LoadingModal/LoadingModal'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import {
  getIsUserAdminForProject,
  getIsUserGfcrTester,
} from '../../../App/currentUserProfileHelpers'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import DeleteProjectButton from '../../DeleteProjectButton/DeleteProjectButton'
import GfcrCallout from '../../GfcrCallout'
import { useCurrentProject } from '../../../App/CurrentProjectContext'

const SuggestNewOrganizationButton = styled(ButtonThatLooksLikeLink)`
  ${hoverState(css`
    background-color: ${theme.color.primaryColor};
    color: ${theme.color.white};
  `)}
`
const TagStyleWrapper = styled.ul`
  padding: 0;
`
const ClearTagButton = styled(CloseButton)`
  position: relative;
  color: ${theme.color.textColor};
  opacity: 0;
  transition: 0;
  &:focus {
    opacity: 1;
  }
  &:hover,
  &:focus {
    & + span {
      display: block;
    }
  }
`
const TagStyle = styled.li`
  position: relative;
  color: ${theme.color.textColor};
  border-radius: 50px;
  background-color: ${theme.color.white};
  padding: 0 4rem 0 0;
  margin: 1rem 0.5rem;
  border: solid ${theme.spacing.borderMedium} ${theme.color.primaryColor};
  display: inline-block;
  white-space: nowrap;
  &:focus {
    ${ClearTagButton} {
      opacity: 1;
    }
  }
  ${hoverState(css`
    ${ClearTagButton} {
      opacity: 1;
    }
  `)}
  @media (hover: none) {
    ${ClearTagButton} {
      opacity: 1;
    }
  }
`

const TooltipPopup = styled('span')`
  display: none;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  clip-path: polygon(
    calc(20px - 10px) 15px,
    20px 0,
    calc(20px + 10px) 15px,
    100% 15px,
    100% 100%,
    0 100%,
    0 15px
  );
  padding: ${theme.spacing.small};
  padding-top: calc(4rem - 15px);
  top: 4rem;
  white-space: normal;
  text-align: start;
  line-height: ${theme.typography.lineHeight};
  z-index: 101;
  ${theme.typography.upperCase};
`
const InputAutocompleteWrapper = styled(InputRow)`
  height: 100px;
`

const OrganizationList = ({ organizations, handleOrganizationsChange }) => {
  return (
    organizations && (
      <TagStyleWrapper>
        {organizations.map((item) => {
          const uid = createUuid()

          return (
            <TagStyle tabIndex="0" key={item}>
              <ClearTagButton
                type="button"
                onClick={() => handleOrganizationsChange(item)}
                id={`remove-button-${uid}`}
                aria-labelledby={`aria-tooltip-label${uid}`}
              >
                <IconClose />
              </ClearTagButton>
              <TooltipPopup id={`aria-tooltip-label${uid}`}>
                {language.pages.projectInfo.removeOrganization}
              </TooltipPopup>
              {item}
            </TagStyle>
          )
        })}
      </TagStyleWrapper>
    )
  )
}

const ProjectInfo = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectTagOptions, setProjectTagOptions] = useState([])
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { currentProject: projectBeingEdited, setCurrentProject: setProjectBeingEdited } =
    useCurrentProject()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const { currentUser } = useCurrentUser()
  const navigate = useNavigate()
  const isMounted = useIsMounted()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)
  const isGfcrUserTester = getIsUserGfcrTester(currentUser)
  const [isUpdatingGfcr, setIsUpdatingGfcr] = useState(false)
  const [projectNameError, setProjectNameError] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false)

  useDocumentTitle(`${language.pages.projectInfo.title} - ${language.title.mermaid}`)

  const [IsNewOrganizationNameModalOpen, setIsNewOrganizationNameModalOpen] = useState(false)
  const openNewOrganizationNameModal = () => setIsNewOrganizationNameModalOpen(true)
  const closeNewOrganizationNameModal = () => setIsNewOrganizationNameModalOpen(false)

  const _getSupportingData = useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId) {
      const promises = [
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getProjectTags(),
        databaseSwitchboardInstance.getProjects(),
      ]

      Promise.all(promises)
        .then(([projectResponse, projectTagsResponse]) => {
          if (isMounted.current) {
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }

            setProjectBeingEdited(projectResponse)
            setProjectTagOptions(getOptions(projectTagsResponse))
            setIsLoading(false)
          }
        })
        .catch((error) => {
          const errorStatus = error.response?.status

          if ((errorStatus === 404 || errorStatus === 400) && isMounted.current) {
            setIdsNotAssociatedWithData([projectId])
            setIsLoading(false)
          }
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.projectsUnavailable))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    projectId,
    isMounted,
    isAppOnline,
    handleHttpResponseError,
    setProjectBeingEdited,
  ])

  const initialFormValues = useMemo(
    () => getProjectInitialValues(projectBeingEdited),
    [projectBeingEdited],
  )

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      setSaveButtonState(buttonGroupStates.saving)
      setProjectNameError(false)
      databaseSwitchboardInstance
        .saveProject({ projectId, editedValues: values })
        .then(() => {
          setSaveButtonState(buttonGroupStates.saved)
          toast.success(...getToastArguments(language.success.projectSave))
          actions.resetForm({ values }) // resets formiks dirty state
        })
        .catch((error) => {
          // validation error is a custom error (doesn't have the same structure as HTTP response error)
          if (error.message === 'Validation Error') {
            setProjectNameError(language.error.formValidation.projectNameExists)
            toast.error(...getToastArguments(language.error.projectNameError))
            setSaveButtonState(buttonGroupStates.unsaved)
          } else {
            setSaveButtonState(buttonGroupStates.unsaved)
            handleHttpResponseError({
              error,
              callback: () => {
                toast.error(...getToastArguments(language.error.projectSave))
              },
            })
          }
        })
    },
    validate: (values) => {
      const errors = {}

      if (!values.name) {
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      return errors
    },
  })

  const _setSaveButtonUnsaved = useEffect(() => {
    if (formik.dirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [formik.dirty])

  const noOrganizationResult = (
    <>
      <SuggestNewOrganizationButton type="button" onClick={openNewOrganizationNameModal}>
        {language.pages.projectInfo.newOrganizationNameLink}
      </SuggestNewOrganizationButton>
    </>
  )

  const checkValidationMessage = () => {
    let errorMessage = []

    if (formik.errors.name) {
      errorMessage = formik.errors.name
    } else if (projectNameError) {
      // using same error format as Formik so message can be used in InputWithLabelAndValidation
      errorMessage = [{ code: projectNameError, id: 'Name exists' }]
    }

    return errorMessage
  }

  const openDeleteProjectModal = () => {
    setIsDeleteProjectModalOpen(true)
  }
  const closeDeleteProjectModal = () => {
    setIsDeleteProjectModalOpen(false)
  }

  const deleteProject = () => {
    setIsDeletingProject(true)

    databaseSwitchboardInstance
      .deleteProject(projectBeingEdited, projectId)
      .then(() => {
        closeDeleteProjectModal()
        setIsDeletingProject(false)
        toast.success(...getToastArguments(language.success.projectDeleted))
        navigate(`/projects`)
      })
      .catch((error) => {
        setIsDeletingProject(false)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.projectDelete))
          },
        })
      })
  }

  const updateIncludesGfcr = (includesGfcrValue) => {
    const editedValues = { includes_gfcr: includesGfcrValue }

    setIsUpdatingGfcr(true)

    databaseSwitchboardInstance
      .saveProject({ projectId, editedValues })
      .then((updatedProject) => {
        setIsUpdatingGfcr(false)

        setProjectBeingEdited(updatedProject)

        if (includesGfcrValue) {
          toast.success(...getToastArguments(language.success.projectAddGfcr))
        }
        if (!includesGfcrValue) {
          toast.success(...getToastArguments(language.success.projectRemoveGfcr))
        }
      })
      .catch((error) => {
        setIsUpdatingGfcr(false)

        handleHttpResponseError({
          error,
          callback: () => {
            if (includesGfcrValue) {
              toast.error(...getToastArguments(language.error.projectAddGfcr))
            }
            if (!includesGfcrValue) {
              toast.error(...getToastArguments(language.error.projectRemoveGfcr))
            }
          },
        })
      })
  }

  const adminContent = (
    <form id="project-info-form" onSubmit={formik.handleSubmit}>
      <InputWrapper>
        <InputWithLabelAndValidation
          required
          label="Project Name"
          id="name"
          type="text"
          {...formik.getFieldProps('name')}
          validationType={formik.errors.name || projectNameError ? 'error' : null}
          validationMessages={checkValidationMessage()}
        />
        <TextareaWithLabelAndValidation
          label="Notes"
          id="notes"
          {...formik.getFieldProps('notes')}
        />
        <InputAutocompleteWrapper>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="organizations">Organizations</label>
          <InputAutocomplete
            id="organizations"
            options={projectTagOptions}
            helperText={language.pages.projectInfo.organizationsHelperText}
            onChange={(selectedItem) => {
              const { label: selectedItemLabel } = selectedItem
              const existingOrganizations = [...formik.getFieldProps('tags').value]

              const doesTagAlreadyExist = existingOrganizations.find(
                (item) => selectedItemLabel === item,
              )

              if (!doesTagAlreadyExist) {
                formik.setFieldValue('tags', [...existingOrganizations, selectedItemLabel])
              }
            }}
            noResultsText={language.pages.projectInfo.noOrganizationFound}
            noResultsAction={noOrganizationResult}
          />
        </InputAutocompleteWrapper>
        <OrganizationList
          organizations={formik.getFieldProps('tags').value}
          handleOrganizationsChange={(item) => {
            const existingOrganizations = [...formik.getFieldProps('tags').value]
            const foundItemIndex = existingOrganizations.indexOf(item)

            existingOrganizations.splice(foundItemIndex, 1)

            formik.setFieldValue('tags', existingOrganizations)
          }}
        />
        {isGfcrUserTester && (
          <GfcrCallout
            isGfcr={projectBeingEdited?.includes_gfcr}
            handleUpdateIncludesGfcr={updateIncludesGfcr}
            isLoading={isUpdatingGfcr}
          />
        )}
        <DeleteProjectButton
          isLoading={isDeletingProject}
          hasSampleUnits={!!projectBeingEdited?.num_active_sample_units}
          hasOtherUsers={projectBeingEdited?.members.length > 1}
          isOpen={isDeleteProjectModalOpen}
          modalText={language.deleteProject(projectBeingEdited?.name)}
          deleteProject={deleteProject}
          onDismiss={closeDeleteProjectModal}
          openModal={openDeleteProjectModal}
        />
      </InputWrapper>
      <NewOrganizationModal
        isOpen={IsNewOrganizationNameModalOpen}
        onDismiss={closeNewOrganizationNameModal}
        onSubmit={(selectedItemLabel) => {
          const existingOrganizations = [...formik.getFieldProps('tags').value]

          formik.setFieldValue('tags', [...existingOrganizations, selectedItemLabel])
        }}
      />
    </form>
  )

  const { name, notes, tags } = formik.values
  const readOnlyContent = (
    <InputWrapper>
      <H2>{name}</H2>
      <H3>{language.pages.projectInfo.notes}</H3>
      <P>{notes.length ? notes : <em>{language.pages.projectInfo.noNotes}</em>}</P>
      <H3>{language.pages.projectInfo.organizations}</H3>
      {tags.length ? (
        <ul>
          {tags.map((org) => (
            <li key={org}>{org}</li>
          ))}
        </ul>
      ) : (
        <em>{language.pages.projectInfo.noOrganization}</em>
      )}
    </InputWrapper>
  )

  const contentViewByRole = isAdminUser ? adminContent : readOnlyContent

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <>
      <ContentPageLayout
        isPageContentLoading={isLoading}
        content={
          isAppOnline ? (
            contentViewByRole
          ) : (
            <PageUnavailable mainText={language.error.pageUnavailableOffline} />
          )
        }
        toolbar={
          <ContentPageToolbarWrapper>
            <H2>{language.pages.projectInfo.title}</H2>
            {isAdminUser && (
              <SaveButton
                formId="project-info-form"
                saveButtonState={saveButtonState}
                formHasErrors={!!Object.keys(formik.errors).length}
                formDirty={formik.dirty}
              />
            )}
          </ContentPageToolbarWrapper>
        }
      />
      {saveButtonState === buttonGroupStates.saving && <LoadingModal />}
      {/* Prompt user if they attempt to navigate away from dirty form */}
      <EnhancedPrompt shouldPromptTrigger={formik.dirty} />
    </>
  )
}

OrganizationList.propTypes = {
  organizations: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOrganizationsChange: PropTypes.func.isRequired,
}

export default ProjectInfo
