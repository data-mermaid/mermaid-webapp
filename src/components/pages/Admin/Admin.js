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
import { CloseButton, ButtonThatLooksLikeLink } from '../../generic/buttons'
import theme from '../../../theme'
import language from '../../../language'
import NewOrganizationModal from '../../NewOrganizationModal'

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

  const initialFormValues = useMemo(
    () => getProjectInitialValues(projectBeingEdited),
    [projectBeingEdited],
  )

  const formikOptions = {
    initialValues: initialFormValues,
    enableReinitialize: true,
  }

  const noOrganizationResult = (
    <ButtonThatLooksLikeLink
      type="button"
      onClick={openNewOrganizationNameModal}
    >
      {language.pages.projectInfo.newOrganizationNameLink}
    </ButtonThatLooksLikeLink>
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

export default Admin
