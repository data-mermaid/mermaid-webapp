import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ButtonPrimary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { getOptions } from '../../../library/getOptions'
import { getProjectInitialValues } from './projectRecordInitialFormValue'
import { H2, H3, P, PSmall } from '../../generic/text'
import { buttonGroupStates } from '../../../library/buttonGroupStates'
import { IconPen } from '../../icons'
import { InputWrapper, InputRow } from '../../generic/form'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import EnhancedPrompt from '../../generic/EnhancedPrompt'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InputAutocomplete from '../../generic/InputAutocomplete/InputAutocomplete'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import { getToastArguments } from '../../../library/getToastArguments'
import NewOrganizationModal from '../../NewOrganizationModal'
import PageUnavailable from '../PageUnavailable'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import useIsMounted from '../../../library/useIsMounted'
import useDocumentTitle from '../../../library/useDocumentTitle'
import SaveButton from '../../generic/SaveButton'
import LoadingModal from '../../LoadingModal/LoadingModal'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { getIsUserAdminForProject } from '../../../App/currentUserProfileHelpers'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import DeleteProjectButton from '../../DeleteProjectButton/DeleteProjectButton'
import GfcrCallout from '../../GfcrCallout'
import { useCurrentProject } from '../../../App/CurrentProjectContext'
import { EditCitationModal } from './EditCitationModal'
import {
  BlockquoteInForm,
  InputAutocompleteWrapper,
  SuggestNewOrganizationButton,
} from './ProjectInfo.styles'
import { OrganizationList } from './OrganizationsList'

const getWhichServerCitationToUse = (project) =>
  project?.user_citation // false if empty string, which is how the server stores undefined
    ? project?.user_citation
    : project?.default_citation

const ProjectInfo = () => {
  const { t } = useTranslation()
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false)
  const [isDeletingProject, setIsDeletingProject] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [IsNewOrganizationNameModalOpen, setIsNewOrganizationNameModalOpen] = useState(false)
  const [isUpdatingGfcr, setIsUpdatingGfcr] = useState(false)
  const [projectNameError, setProjectNameError] = useState('')
  const [projectTagOptions, setProjectTagOptions] = useState([])
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [isEditCitationModalOpen, setIsEditCitationModalOpen] = useState(false)
  const [citationToUse, setCitationToUse] = useState('')
  const [projectProfiles, setProjectProfiles] = useState([])
  const [organizationAutocompleteSearchText, setOrganizationAutocompleteSearchText] = useState('')

  const { currentUser } = useCurrentUser()
  const { currentProject: projectBeingEdited, setCurrentProject: setProjectBeingEdited } =
    useCurrentProject()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const citationFromServerToUse = getWhichServerCitationToUse(projectBeingEdited)
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)
  const isMounted = useIsMounted()
  const { currentProject } = useCurrentProject()
  const isDemoProject = currentProject?.is_demo
  const isSuggestedCitationDirty = citationToUse !== citationFromServerToUse
  const navigate = useNavigate()

  const projectInfoTitle = t('projects.project_info')
  const notesText = t('notes')
  const organizationsText = t('organizations.organizations')
  const noNotesText = t('projects.no_notes')
  const noOrganizationsText = t('projects.no_organizations')
  const projectDataUnavailableToastText = t('projects.errors.data_unavailable')
  const projectSavedToastText = t('projects.success.project_saved')
  const duplicateProjectNameToastText = t('projects.errors.duplicate_name')
  const projectNameExistsErrorText = t('projects.errors.project_name_exists')
  const requiredFieldErrorText = t('forms.required_field')
  const projectSaveFailedToastText = t('projects.errors.not_saved')
  const projectDeletedToastText = t('projects.success.project_deleted')
  const projectDeleteFailedToastText = t('projects.errors.not_deleted')
  const gfcrEnabledToastText = t('gfcr.success.indicators_enabled')
  const gfcrDisabledToastText = t('gfcr.success.indicators_disabled')
  const gfcrEnableFailedToastText = t('gfcr.errors.indicators_enable_failed')
  const gfcrDisableFailedToastText = t('gfcr.errors.indicators_disable_failed')
  const openNewOrganizationNameModal = () => setIsNewOrganizationNameModalOpen(true)
  const closeNewOrganizationNameModal = () => setIsNewOrganizationNameModalOpen(false)
  const openEditCitationModal = () => setIsEditCitationModalOpen(true)
  const closeEditCitationModal = () => setIsEditCitationModalOpen(false)

  useDocumentTitle(`${projectInfoTitle} - ${t('mermaid')}`)

  // _getSupportingData
  useEffect(() => {
    if (!isAppOnline) {
      setIsLoading(false)
    }

    if (isAppOnline && databaseSwitchboardInstance && projectId) {
      const promises = [
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getProjectTags(),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
      ]

      Promise.all(promises)
        .then(([projectResponse, projectTagsResponse, projectProfilesResponse]) => {
          if (isMounted.current) {
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }

            const initialCitation = getWhichServerCitationToUse(projectResponse)

            setProjectBeingEdited(projectResponse)
            setCitationToUse(initialCitation)
            setProjectTagOptions(getOptions(projectTagsResponse))
            setProjectProfiles(projectProfilesResponse)
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
              toast.error(...getToastArguments(projectDataUnavailableToastText))
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
    projectDataUnavailableToastText,
  ])

  const initialFormValues = useMemo(
    () => getProjectInitialValues(projectBeingEdited),
    [projectBeingEdited],
  )

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      const valuesToUse = isSuggestedCitationDirty
        ? { ...values, user_citation: citationToUse }
        : values
      setSaveButtonState(buttonGroupStates.saving)
      setProjectNameError('')

      databaseSwitchboardInstance
        .saveProject({ projectId, editedValues: valuesToUse })
        .then((updatedProject) => {
          setProjectBeingEdited(updatedProject) // to ensure isSuggestedCitationDirty is fresh
          setSaveButtonState(buttonGroupStates.saved)
          toast.success(...getToastArguments(projectSavedToastText))
          actions.resetForm({ values }) // resets formik's dirty state
        })
        .catch((error) => {
          // validation error is a custom error (doesn't have the same structure as HTTP response error)
          if (error.message === 'Validation Error') {
            setProjectNameError(projectNameExistsErrorText)
            toast.error(...getToastArguments(duplicateProjectNameToastText))
            setSaveButtonState(buttonGroupStates.unsaved)
          } else {
            setSaveButtonState(buttonGroupStates.unsaved)
            handleHttpResponseError({
              error,
              callback: () => {
                toast.error(...getToastArguments(projectSaveFailedToastText))
              },
            })
          }
        })
    },
    validate: (values) => {
      const errors = {}

      if (!values.name) {
        errors.name = [{ code: requiredFieldErrorText, id: 'Required' }]
      }

      return errors
    },
  })

  //_setSaveButtonUnsaved
  useEffect(() => {
    if (formik.dirty || isSuggestedCitationDirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [formik.dirty, isSuggestedCitationDirty])

  const noOrganizationResult = (
    <>
      <SuggestNewOrganizationButton type="button" onClick={openNewOrganizationNameModal}>
        {t('organizations.suggest_new_organization')}
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
        toast.success(...getToastArguments(projectDeletedToastText))
        navigate(`/projects`)
      })
      .catch((error) => {
        setIsDeletingProject(false)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(projectDeleteFailedToastText))
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
          toast.success(...getToastArguments(gfcrEnabledToastText))
        }
        if (!includesGfcrValue) {
          toast.success(...getToastArguments(gfcrDisabledToastText))
        }
      })
      .catch((error) => {
        setIsUpdatingGfcr(false)

        handleHttpResponseError({
          error,
          callback: () => {
            if (includesGfcrValue) {
              toast.error(...getToastArguments(gfcrEnableFailedToastText))
            }
            if (!includesGfcrValue) {
              toast.error(...getToastArguments(gfcrDisableFailedToastText))
            }
          },
        })
      })
  }
  const citationMarkup = (
    <InputRow>
      <label htmlFor="suggested-citation">{t('citation.suggested')}</label>
      <div>
        <BlockquoteInForm id="suggested-citation">
          {citationToUse} {projectBeingEdited?.citation_retrieved_text}
        </BlockquoteInForm>
        <PSmall>{t('citation.more_info')}</PSmall>
        {isAdminUser ? (
          <ButtonPrimary type="button" onClick={openEditCitationModal}>
            <IconPen /> {t('citation.edit_suggested')}
          </ButtonPrimary>
        ) : null}
      </div>
    </InputRow>
  )

  const adminContent = (
    <form id="project-info-form" onSubmit={formik.handleSubmit}>
      <InputWrapper>
        <InputWithLabelAndValidation
          required
          label={t('projects.project_name')}
          id="name"
          type="text"
          {...formik.getFieldProps('name')}
          validationType={formik.errors.name || projectNameError ? 'error' : null}
          helperText={isDemoProject ? t('projects.demo.name_restrictions') : null}
          showHelperText={isDemoProject}
          disabled={isDemoProject}
          validationMessages={checkValidationMessage()}
        />
        <TextareaWithLabelAndValidation
          label={notesText}
          id="notes"
          {...formik.getFieldProps('notes')}
        />
        <InputAutocompleteWrapper>
          <label htmlFor="organizations">{organizationsText}</label>
          <InputAutocomplete
            id="organizations"
            options={projectTagOptions}
            helperText={t('organizations.type_to_search')}
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
            noResultsText={t('organizations.no_organization_found')}
            noResultsAction={noOrganizationResult}
            onInputValueChange={setOrganizationAutocompleteSearchText}
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
        {citationMarkup}

        <GfcrCallout
          isGfcr={projectBeingEdited?.includes_gfcr}
          handleUpdateIncludesGfcr={updateIncludesGfcr}
          isLoading={isUpdatingGfcr}
        />
        <DeleteProjectButton
          isLoading={isDeletingProject}
          hasSampleUnits={!!projectBeingEdited?.num_active_sample_units}
          hasOtherUsers={projectBeingEdited?.members.length > 1}
          isOpen={isDeleteProjectModalOpen}
          projectName={projectBeingEdited?.name}
          deleteProject={deleteProject}
          onDismiss={closeDeleteProjectModal}
          openModal={openDeleteProjectModal}
        />
      </InputWrapper>
    </form>
  )

  const { name, notes, tags } = formik.values
  const readOnlyContent = (
    <>
      <InputWrapper>
        <H2>{name}</H2>
        <H3>{notesText}</H3>
        <P>{notes.length ? notes : <em>{noNotesText}</em>}</P>
        <H3>{organizationsText}</H3>
        {tags.length ? (
          <ul>
            {tags.map((org) => (
              <li key={org}>{org}</li>
            ))}
          </ul>
        ) : (
          <em>{noOrganizationsText}</em>
        )}
      </InputWrapper>
      {citationMarkup}
    </>
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
            <PageUnavailable mainText={t('offline.page_unavailable_offline')} />
          )
        }
        toolbar={
          <ContentPageToolbarWrapper>
            <H2>{projectInfoTitle}</H2>
            {isAdminUser && (
              <SaveButton
                formId="project-info-form"
                saveButtonState={saveButtonState}
                formHasErrors={!!Object.keys(formik.errors).length}
                formDirty={formik.dirty || isSuggestedCitationDirty}
              />
            )}
          </ContentPageToolbarWrapper>
        }
      />
      {saveButtonState === buttonGroupStates.saving && <LoadingModal />}
      {/* Prompt user if they attempt to navigate away from dirty form */}
      <EnhancedPrompt shouldPromptTrigger={formik.dirty} />
      <NewOrganizationModal
        isOpen={IsNewOrganizationNameModalOpen}
        onDismiss={closeNewOrganizationNameModal}
        onSubmit={(selectedItemLabel) => {
          const existingOrganizations = [...formik.getFieldProps('tags').value]

          formik.setFieldValue('tags', [...existingOrganizations, selectedItemLabel])
        }}
        initialValue={organizationAutocompleteSearchText}
      />
      <EditCitationModal
        citationToUse={citationToUse}
        isOpen={isEditCitationModalOpen}
        onDismiss={closeEditCitationModal}
        projectBeingEdited={projectBeingEdited}
        projectProfiles={projectProfiles}
        setCitationToUse={setCitationToUse}
      />
    </>
  )
}

export default ProjectInfo
