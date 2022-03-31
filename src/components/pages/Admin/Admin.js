import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { CloseButton, ButtonThatLooksLikeLink } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { currentUserPropType } from '../../../App/mermaidData/mermaidDataProptypes'
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
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import EnhancedPrompt from '../../generic/EnhancedPrompt'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InputAutocomplete from '../../generic/InputAutocomplete'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import NewOrganizationModal from '../../NewOrganizationModal'
import PageUnavailableOffline from '../PageUnavailableOffline'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import theme from '../../../theme'
import useIsMounted from '../../../library/useIsMounted'
import useDocumentTitle from '../../../library/useDocumentTitle'
import SaveButton from '../../generic/SaveButton'
import LoadingModal from '../../LoadingModal/LoadingModal'

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

const ReadOnlyContentWrapper = styled(InputWrapper)`
  p {
    font-style: italic;
  }
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

const ReadOnlyAdminContent = ({ project }) => (
  <ReadOnlyContentWrapper>
    <H3>Notes</H3>
    <P>{project.notes.length ? project.notes : 'no notes for this project'}</P>
    <H3>Organizations</H3>
    {project.tags.map((org) => (
      <li key={org}>{org}</li>
    ))}
  </ReadOnlyContentWrapper>
)

const Admin = ({ currentUser }) => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectBeingEdited, setProjectBeingEdited] = useState()
  const [projectTagOptions, setProjectTagOptions] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [currentUserProfile, setCurrentUserProfile] = useState({})

  const [IsNewOrganizationNameModalOpen, setIsNewOrganizationNameModalOpen] = useState(false)
  const openNewOrganizationNameModal = () => setIsNewOrganizationNameModalOpen(true)
  const closeNewOrganizationNameModal = () => setIsNewOrganizationNameModalOpen(false)

  useDocumentTitle(`${language.pages.projectInfo.title} - ${language.title.mermaid}`)

  const _getSupportingData = useEffect(() => {
    if (isAppOnline && databaseSwitchboardInstance && !isSyncInProgress && projectId) {
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

            const filteredUserProfile = projectProfilesResponse.filter(
              ({ profile }) => currentUser.id === profile,
            )[0]

            setProjectBeingEdited(projectResponse)
            setProjectTagOptions(getOptions(projectTagsResponse, false))
            setCurrentUserProfile(filteredUserProfile)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.projectsUnavailable))
        })
    }
  }, [
    databaseSwitchboardInstance,
    projectId,
    isMounted,
    isAppOnline,
    isSyncInProgress,
    currentUser,
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
      databaseSwitchboardInstance
        .saveProject({ projectId, editedValues: values })
        .then(() => {
          setSaveButtonState(buttonGroupStates.saved)
          toast.success(...getToastArguments(language.success.projectSave))
          actions.resetForm({ values }) // resets formiks dirty state
        })
        .catch(() => {
          toast.error(...getToastArguments(language.error.projectSave))
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

  const _setSiteButtonUnsaved = useEffect(() => {
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

  const contentViewByRole = currentUserProfile.is_admin ? (
    <form id="project-info-form" onSubmit={formik.handleSubmit}>
      <InputWrapper>
        <InputWithLabelAndValidation
          required
          label="Project Name"
          id="name"
          type="text"
          {...formik.getFieldProps('name')}
          validationType={formik.errors.name ? 'error' : null}
          validationMessages={formik.errors.name}
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
  ) : (
    <ReadOnlyAdminContent project={formik.values} />
  )

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <>
      <ContentPageLayout
        isPageContentLoading={isAppOnline ? isLoading : false}
        content={isAppOnline ? contentViewByRole : <PageUnavailableOffline />}
        toolbar={
          <ContentPageToolbarWrapper>
            <H2>{language.pages.projectInfo.title}</H2>
            {currentUserProfile.is_admin && (
              <SaveButton
                formId="project-info-form"
                saveButtonState={saveButtonState}
                formik={formik}
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

Admin.propTypes = {
  currentUser: currentUserPropType.isRequired,
}

OrganizationList.propTypes = {
  organizations: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOrganizationsChange: PropTypes.func.isRequired,
}

ReadOnlyAdminContent.propTypes = {
  project: PropTypes.shape({
    notes: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
}

export default Admin
