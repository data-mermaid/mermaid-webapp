import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { Prompt, useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { CloseButton, ButtonCallout, ButtonThatLooksLikeLink } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { createUuid } from '../../../library/createUuid'
import { getOptions } from '../../../library/getOptions'
import { getProjectInitialValues } from './projectRecordInitialFormValue'
import { H2 } from '../../generic/text'
import { hoverState } from '../../../library/styling/mediaQueries'
import { IconClose, IconSave } from '../../icons'
import { InputWrapper, InputRow } from '../../generic/form'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InputAutocomplete from '../../generic/InputAutocomplete'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../language'
import NewOrganizationModal from '../../NewOrganizationModal'
import PageUnavailableOffline from '../PageUnavailableOffline'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import theme from '../../../theme'
import useBeforeUnloadPrompt from '../../../library/useBeforeUnloadPrompt'
import useIsMounted from '../../../library/useIsMounted'

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

const Admin = () => {
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectBeingEdited, setProjectBeingEdited] = useState()
  const [projectTagOptions, setProjectTagOptions] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { projectId } = useParams()
  const isMounted = useIsMounted()

  const [IsNewOrganizationNameModalOpen, setIsNewOrganizationNameModalOpen] = useState(false)
  const openNewOrganizationNameModal = () => setIsNewOrganizationNameModalOpen(true)
  const closeNewOrganizationNameModal = () => setIsNewOrganizationNameModalOpen(false)

  const _getSupportingData = useEffect(() => {
    if (isAppOnline && databaseSwitchboardInstance && projectId) {
      const promises = [
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getProjectTags(),
      ]

      Promise.all(promises)
        .then(([projectResponse, projectTagsResponse]) => {
          if (isMounted.current) {
            if (!projectResponse && projectId) {
              setIdsNotAssociatedWithData([projectId])
            }
            setProjectBeingEdited(projectResponse)
            setProjectTagOptions(getOptions(projectTagsResponse, false))
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(language.error.projectsUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, projectId, isMounted, isAppOnline])

  const initialFormValues = useMemo(
    () => getProjectInitialValues(projectBeingEdited),
    [projectBeingEdited],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      databaseSwitchboardInstance
        .saveProject({ projectId, editedValues: values })
        .then(() => {
          actions.resetForm({ values }) // resets formiks dirty state
          toast.success(language.success.projectSave)
        })
        .catch(() => {
          toast.error(language.error.projectSave)
        })
    },
    validate: (values) => {
      const errors = {}

      if (!values.name) {
        errors.name = [{ message: language.error.formValidation.required, id: 'Required' }]
      }

      return errors
    },
  }
  const formik = useFormik(formikOptions)

  useBeforeUnloadPrompt({ shouldPromptTrigger: formik.dirty })

  const doesFormikHaveErrors = Object.keys(formik.errors).length
  const isSaveButtonDisabled = !formik.dirty || doesFormikHaveErrors
  const noOrganizationResult = (
    <>
      <SuggestNewOrganizationButton type="button" onClick={openNewOrganizationNameModal}>
        {language.pages.projectInfo.newOrganizationNameLink}
      </SuggestNewOrganizationButton>
    </>
  )

  const content = isAppOnline ? (
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
    <PageUnavailableOffline />
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
        content={content}
        toolbar={
          <ContentPageToolbarWrapper>
            <H2>Project Info</H2>
            <ButtonCallout type="submit" form="project-info-form" disabled={isSaveButtonDisabled}>
              <IconSave />
              Save
            </ButtonCallout>
          </ContentPageToolbarWrapper>
        }
      />
      <Prompt when={formik.dirty} message={language.navigateAwayPrompt} />
    </>
  )
}

OrganizationList.propTypes = {
  organizations: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOrganizationsChange: PropTypes.func.isRequired,
}

export default Admin
