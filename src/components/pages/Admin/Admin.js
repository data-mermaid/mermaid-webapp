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
import { InputWrapper, InputRow } from '../../generic/form'
import { getOptions } from '../../../library/getOptions'
import { IconClose } from '../../icons'
import { CloseButton, ButtonSecondary } from '../../generic/buttons'
import theme from '../../../theme'
import language from '../../../language'
import NewOrganizationModal from '../../NewOrganizationModal'
import { createUuid } from '../../../library/createUuid'


const SuggestNewOrganizationButton = styled(ButtonSecondary)`
  font-size: smaller;
  text-align: start;
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
  const { isOnline } = useOnlineStatus()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [projectTagOptions, setProjectTagOptions] = useState([])
  const [projectBeingEdited, setProjectBeingEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
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
            setProjectTagOptions(getOptions(projectTagsResponse, false))
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

  const initialFormValues = useMemo(
    () => getProjectInitialValues(projectBeingEdited),
    [projectBeingEdited],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
  }

  const noOrganizationResult = (
    <>
      <p>{language.pages.projectInfo.noOrganizationFound}</p>
      <SuggestNewOrganizationButton
        type="button"
        onClick={openNewOrganizationNameModal}
      >
        {language.pages.projectInfo.newOrganizationNameLink}
      </SuggestNewOrganizationButton>
    </>
  )

  const content = isOnline ? (
    <Formik {...formikOptions}>
      {(formik) => (
        <>
          <InputWrapper>
            <InputWithLabelAndValidation
              label="Project Name"
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
                helperText={language.pages.projectInfo.organizationsHelperText}
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
          <NewOrganizationModal
            isOpen={IsNewOrganizationNameModalOpen}
            onDismiss={closeNewOrganizationNameModal}
            onSubmit={(selectedItemLabel) => {
              const existingOrganizations = [
                ...formik.getFieldProps('tags').value,
              ]

              formik.setFieldValue('tags', [
                ...existingOrganizations,
                selectedItemLabel,
              ])
            }}
          />
        </>
      )}
    </Formik>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      isPageContentLoading={isLoading}
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

export default Admin
