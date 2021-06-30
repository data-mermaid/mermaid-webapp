import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { hoverState } from '../../../library/styling/mediaQueries'

import { getProjectInitialValues } from './projectRecordInitialFormValue'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import InputWithLabelAndValidation from '../../generic/InputWithLabelAndValidation'
import InputAutocomplete from '../../generic/InputAutocomplete'
import TextareaWithLabelAndValidation from '../../generic/TextareaWithLabelAndValidation'
import { InputWrapper, InputRow, Input } from '../../generic/form'
import { getOptions } from '../../../library/getOptions'
import { IconClose, IconSend } from '../../icons'
import {
  CloseButton,
  ButtonLink,
  ButtonCallout,
  ButtonSecondary,
} from '../../generic/buttons'
import theme from '../../../theme'
import language from '../../../language'
import Modal from '../../generic/Modal/Modal'

const TagStyleWrapper = styled.ul`
  padding: 0;
`

const ClearTagButton = styled(CloseButton)`
  color: white;
  visibility: hidden;
`

const TagStyle = styled.li`
  color: white;
  border-radius: 50px;
  background-color: ${theme.color.calloutColor};
  padding-right: 30px;
  margin: 10px 5px;
  display: inline-block;
  ${hoverState(css`
    ${ClearTagButton} {
      visibility: visible;
    }
  `)}
`

const InputAutocompleteWrapper = styled(InputRow)`
  height: 100px;
`

const ModalMainContent = styled(InputRow)`
  grid-template-columns: auto 1fr;
`

const ModalFooterContent = styled.div`
  display: flex;
  justify-content: flex-end;
`

const SubText = styled.div`
  grid-column: 1/2;
  font-size: small;
  color: grey;
  padding-top: 5px;
`

const OrganizationList = ({ organizations, handleOrganizationsChange }) => {
  return (
    organizations && (
      <TagStyleWrapper>
        {organizations.map((item) => (
          <TagStyle key={item}>
            <ClearTagButton
              type="button"
              onClick={() => handleOrganizationsChange(item)}
            >
              <IconClose />
            </ClearTagButton>
            {item}
          </TagStyle>
        ))}
      </TagStyleWrapper>
    )
  )
}

const ModalButtonGroup = ({
  suggestionOrganization,
  handleSuggestionModalChange,
  closeNewOrganizationNameModal,
  onChange,
}) => (
  <ModalFooterContent>
    <ButtonCallout
      onClick={() => {
        onChange(suggestionOrganization)
        handleSuggestionModalChange()
        closeNewOrganizationNameModal()
      }}
    >
      <IconSend />
      Send to MERMAID for review
    </ButtonCallout>
    <ButtonSecondary onClick={closeNewOrganizationNameModal}>
      Cancel
    </ButtonSecondary>
  </ModalFooterContent>
)

const Admin = () => {
  const { isOnline } = useOnlineStatus()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [projectTagOptions, setProjectTagOptions] = useState([])
  const [projectBeingEdited, setProjectBeingEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [suggestionOrganization, setSuggestionOrganization] = useState('')
  const { projectId } = useParams()

  const [
    IsNewOrganizationNameModalOpen,
    setIsNewOrganizationNameModalOpen,
  ] = useState(false)
  const openNewOrganizationNameModal = () =>
    setIsNewOrganizationNameModalOpen(true)
  const closeNewOrganizationNameModal = () =>
    setIsNewOrganizationNameModalOpen(false)

  const _getSupportingData = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getProject(projectId),
        databaseSwitchboardInstance.getProjectTags(),
      ]

      Promise.all(promises)
        .then(([projectResponse, projectTagsResponse]) => {
          if (isMounted) {
            setProjectBeingEdited(projectResponse)
            setProjectTagOptions(getOptions(projectTagsResponse.results, false))
            setIsLoading(false)
          }
        })
        .catch(() => {
          // Will update language file when adding user workflow like save/delete site to page.
          toast.error(`project error`)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance, projectId])

  const handleSuggestionModalChange = () => {
    setSuggestionOrganization('')
    toast.success(language.success.newOrganizationAdd)
  }

  const initialFormValues = useMemo(
    () => getProjectInitialValues(projectBeingEdited),
    [projectBeingEdited],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
  }

  const noOrganizationResult = (
    <ButtonLink type="button" onClick={openNewOrganizationNameModal}>
      {language.pages.projectInfo.newOrganizationNameLink}
    </ButtonLink>
  )

  const modalContent = (
    <>
      <ModalMainContent>
        <Input
          id="add-new-organization"
          type="text"
          value={suggestionOrganization}
          onChange={(e) => {
            setSuggestionOrganization(e.target.value)
          }}
        />
        <SubText>
          {language.pages.projectInfo.suggestionOrganizationInputText}
        </SubText>
      </ModalMainContent>
    </>
  )

  const content = isOnline ? (
    <Formik {...formikOptions}>
      {(formik) => (
        <>
          <InputWrapper>
            <InputWithLabelAndValidation
              label="Name"
              id="name"
              type="text"
              {...formik.getFieldProps('name')}
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
                onChange={(selectedItem) => {
                  const { label: selectedItemLabel } = selectedItem
                  const existingOrganizations = [
                    ...formik.getFieldProps('tags').value,
                  ]

                  const doesTagAlreadyExist = existingOrganizations.find(
                    (item) => selectedItemLabel === item,
                  )

                  if (!doesTagAlreadyExist) {
                    formik.setFieldValue('tags', [
                      ...existingOrganizations,
                      selectedItemLabel,
                    ])
                  }
                }}
                noResultsDisplay={noOrganizationResult}
              />
            </InputAutocompleteWrapper>
            <OrganizationList
              organizations={formik.getFieldProps('tags').value}
              handleOrganizationsChange={(item) => {
                const existingOrganizations = [
                  ...formik.getFieldProps('tags').value,
                ]
                const foundItemIndex = existingOrganizations.indexOf(item)

                existingOrganizations.splice(foundItemIndex, 1)

                formik.setFieldValue('tags', existingOrganizations)
              }}
            />
          </InputWrapper>
          <Modal
            isOpen={IsNewOrganizationNameModalOpen}
            onDismiss={closeNewOrganizationNameModal}
            title="Suggest a new organization"
            mainContent={modalContent}
            footerContent={
              <ModalButtonGroup
                suggestionOrganization={suggestionOrganization}
                handleSuggestionModalChange={handleSuggestionModalChange}
                closeNewOrganizationNameModal={closeNewOrganizationNameModal}
                onChange={(selectedItemLabel) => {
                  const existingOrganizations = [
                    ...formik.getFieldProps('tags').value,
                  ]

                  formik.setFieldValue('tags', [
                    ...existingOrganizations,
                    selectedItemLabel,
                  ])
                }}
              />
            }
          />
        </>
      )}
    </Formik>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      isLoading={isLoading}
      content={content}
      toolbar={
        <>
          <H2>Project Info</H2>
        </>
      }
    />
  )
}

OrganizationList.propTypes = {
  organizations: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOrganizationsChange: PropTypes.func.isRequired,
}

ModalButtonGroup.propTypes = {
  suggestionOrganization: PropTypes.string.isRequired,
  handleSuggestionModalChange: PropTypes.func.isRequired,
  closeNewOrganizationNameModal: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Admin
