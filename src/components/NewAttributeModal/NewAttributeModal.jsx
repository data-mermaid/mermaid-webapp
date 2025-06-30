import { Slide, toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'

import * as Yup from 'yup'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary, ButtonThatLooksLikeLink } from '../generic/buttons'
import { IconArrowBack, IconSend } from '../icons'
import { Input } from '../generic/form'
import { Row, RowSpaceBetween } from '../generic/positioning'
import InputAutocomplete from '../generic/InputAutocomplete/InputAutocomplete'
import { Table, Td, Tr } from '../generic/Table/table'
import Modal, { LeftFooter, RightFooter } from '../generic/Modal/Modal'
import theme from '../../theme'
import { inputOptionsPropTypes } from '../../library/miscPropTypes'
import useIsMounted from '../../library/useIsMounted'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { Trans, useTranslation } from 'react-i18next'
import { links } from '../../link_constants'

const DetailsTable = styled(Table)`
  border: solid 1px ${theme.color.secondaryColor};

  tr td:first-child {
    background: ${theme.color.tableRowEven};
  }
`
const StyledRow = styled(Row)`
  justify-content: space-between;
  gap: 1rem;
`
const InputContainer = styled.div`
  width: 100%;
`

const MainContentPages = ({
  currentPage,
  modalAttributeOptions,
  projectName = '',
  proposedSummary,
  pageOneFirstInputLabel,
  pageOneFirstInputValue,
  pageOneFirstInputError = undefined,
  pageOneSecondInputLabel,
  pageOneSecondInputValue,
  pageOneSecondInputError = undefined,
  pageTwoFirstLabel,
  handleFormikPageOneValueChange,
  handleNewAttributeChange,
  handleSubmit,
  attributeName,
}) => {
  const { currentUser } = useCurrentUser()
  const { t } = useTranslation()

  const NoResults = (
    <Trans
      i18nKey="taxonomies.genus_not_found"
      components={{
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        a: <a href={links.contactUs} target="_blank" rel="noopener noreferrer" />,
      }}
    />
  )

  const MainContentPageOne = (
    <form id="form-page-1" onSubmit={handleSubmit}>
      <StyledRow>
        <InputContainer>
          <label id="attribute-label" htmlFor="attribute">
            {pageOneFirstInputLabel}
          </label>
          <InputAutocomplete
            id="attribute"
            aria-labelledby="attribute-label"
            options={modalAttributeOptions}
            value={pageOneFirstInputValue}
            noResultsText={NoResults}
            onChange={handleFormikPageOneValueChange}
          />
          {pageOneFirstInputError && <span id="attribute-required">{pageOneFirstInputError}</span>}
        </InputContainer>
        <InputContainer>
          <label id="new-attribute-label" htmlFor="new-attribute">
            {pageOneSecondInputLabel}
          </label>
          <Input
            id="new-attribute"
            aria-describedby="new-attribute-label"
            value={pageOneSecondInputValue}
            onChange={handleNewAttributeChange}
          />
          {pageOneSecondInputError && (
            <span id="new-attribute-required">{pageOneSecondInputError}</span>
          )}
        </InputContainer>
      </StyledRow>
    </form>
  )

  const MainContentPageTwo = (
    <>
      <DetailsTable>
        <tbody>
          <Tr>
            <Td id="new-attribute-label">{pageTwoFirstLabel}</Td>
            <Td aria-labelledby="new-attribute-label">{`${attributeName} ${pageOneSecondInputValue}`}</Td>
          </Tr>
          <Tr>
            <Td id="user-label">{t('user')}</Td>
            <Td aria-labelledby="user-label">{currentUser.full_name}</Td>
          </Tr>
          <Tr>
            <Td id="project-label">{t('project')}</Td>
            <Td aria-labelledby="project-label">{projectName}</Td>
          </Tr>
        </tbody>
      </DetailsTable>
      <p>{proposedSummary}</p>
    </>
  )

  return (
    <>
      {currentPage === 1 && MainContentPageOne}
      {currentPage === 2 && MainContentPageTwo}
    </>
  )
}

const NewAttributeModal = ({
  isFishBeltSampleUnit,
  isOpen,
  onDismiss,
  onSubmit,
  modalAttributeOptions,
}) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const isMounted = useIsMounted()
  const { projectId } = useParams()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { t } = useTranslation()

  const [currentPage, setCurrentPage] = useState(1)
  const [projectName, setProjectName] = useState('')
  const [attributeName, setAttributeName] = useState()

  const goToPageTwo = () => {
    setCurrentPage(2)
  }
  const goToPageOne = () => {
    setCurrentPage(1)
  }

  const _getProjectName = useEffect(() => {
    if (databaseSwitchboardInstance && isMounted.current) {
      databaseSwitchboardInstance
        .getProject(projectId)
        .then((project) => {
          if (isMounted.current) {
            setProjectName(project.name)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(t('projects.data_unavailable'), {
                messageId: 'data-unavailable',
                transition: Slide,
              })
            },
          })
        })
    }
  }, [databaseSwitchboardInstance, projectId, isMounted, handleHttpResponseError, t])

  const fishBeltValidationSchema = {
    initialValues: { genusId: '', species: '' },
    validationSchema: Yup.object().shape({
      genusId: Yup.string().required(t('forms.required_field')),
      species: Yup.string().required(t('forms.required_field')),
    }),
  }
  const benthicAttributeValidationSchema = {
    initialValues: { benthicAttributeParentId: '', newBenthicAttribute: '' },
    validationSchema: Yup.object().shape({
      benthicAttributeParentId: Yup.string().required(t('forms.required_field')),
      newBenthicAttribute: Yup.string().required(t('forms.required_field')),
    }),
  }
  const formValuesAndValidationSchema = isFishBeltSampleUnit
    ? fishBeltValidationSchema
    : benthicAttributeValidationSchema

  const formikPageOne = useFormik({
    ...formValuesAndValidationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: () => {
      goToPageTwo()
    },
    enableReinitialize: true,
  })

  const resetAndCloseModal = () => {
    goToPageOne()
    formikPageOne.resetForm()
    onDismiss()
  }

  const handleFormikPageOneValueChange = (selectedItem) => {
    const attributeId = isFishBeltSampleUnit ? 'genusId' : 'benthicAttributeParentId'

    formikPageOne.setFieldValue(attributeId, selectedItem.value)
    setAttributeName(selectedItem.label)
  }

  const handleNewAttributeChange = (event) => {
    const attributeProperty = isFishBeltSampleUnit ? 'species' : 'newBenthicAttribute'
    const valueToUse = isFishBeltSampleUnit ? event.target.value.toLowerCase() : event.target.value

    formikPageOne.setFieldValue(attributeProperty, valueToUse)
  }

  const fishBeltSubmitValues = {
    genusId: formikPageOne.values.genusId,
    genusName: attributeName,
    speciesName: formikPageOne.values.species,
  }

  const benthicAttributeSubmitValues = {
    benthicAttributeParentId: formikPageOne.values.benthicAttributeParentId,
    benthicAttributeParentName: attributeName,
    newBenthicAttributeName: formikPageOne.values.newBenthicAttribute,
  }

  const handleOnSubmit = () => {
    let submissionValues = isFishBeltSampleUnit
      ? fishBeltSubmitValues
      : benthicAttributeSubmitValues
    onSubmit(submissionValues).then(() => {
      resetAndCloseModal()
    })
  }

  const CancelButton = (
    <ButtonSecondary type="button" onClick={resetAndCloseModal}>
      {t('buttons.cancel')}
    </ButtonSecondary>
  )

  const footerPageOne = (
    <RightFooter>
      {CancelButton}
      <ButtonPrimary type="submit" form="form-page-1">
        {t('buttons.next')}
      </ButtonPrimary>
    </RightFooter>
  )
  const footerPageTwo = (
    <RowSpaceBetween>
      <LeftFooter>
        <ButtonThatLooksLikeLink type="button" onClick={goToPageOne}>
          <IconArrowBack /> {t('buttons.back')}
        </ButtonThatLooksLikeLink>
      </LeftFooter>

      <RightFooter>
        {CancelButton}
        <ButtonPrimary type="button" onClick={handleOnSubmit}>
          <IconSend /> {t('buttons.submit')}
        </ButtonPrimary>
      </RightFooter>
    </RowSpaceBetween>
  )

  const footer = (
    <>
      {currentPage === 1 && footerPageOne}
      {currentPage === 2 && footerPageTwo}
    </>
  )

  const fishBeltSampleUnitText = {
    modalTitle: t('taxonomies.add_fish_species'),
    pageOneFirstInputLabel: formikPageOne.values.genusId,
    pageOneFirstInputValue: t(''),
    pageTwoFirstLabel: t('taxonomies.species'),
    pageOneSecondInputLabel: t('taxonomies.species'),
    pageOneSecondInputValue: formikPageOne.values.species,
    pageOneFirstInputError: formikPageOne.errors.genusId,
    pageOneSecondInputError: formikPageOne.errors.species,
    proposedSummary: t('benthic_observations.attribute_proposal_summary', {
      attribute: 'fish species',
    }),
  }

  const generalBenthicAttributeText = {
    modalTitle: t('benthic_observations.add_benthic_attribute'),
    pageOneFirstInputLabel: t('taxonomies.parent'),
    pageOneFirstInputValue: formikPageOne.values.benthicAttributeParentId,
    pageTwoFirstLabel: t('benthic_observations.benthic_attribute'),
    pageOneSecondInputLabel: t('name'),
    pageOneSecondInputValue: formikPageOne.values.newBenthicAttribute,
    pageOneFirstInputError: formikPageOne.errors.benthicAttributeParentId,
    pageOneSecondInputError: formikPageOne.errors.newBenthicAttribute,
    proposedSummary: t('benthic_observations.attribute_proposal_summary', {
      attribute: 'benthic attribute',
    }),
  }

  const modalText = isFishBeltSampleUnit ? fishBeltSampleUnitText : generalBenthicAttributeText

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={resetAndCloseModal}
      title={modalText.modalTitle}
      contentOverflowStyle="visible"
      mainContent={
        <MainContentPages
          currentPage={currentPage}
          projectName={projectName}
          proposedSummary={modalText.proposedSummary}
          modalAttributeOptions={modalAttributeOptions}
          pageOneFirstInputLabel={modalText.pageOneFirstInputLabel}
          pageOneFirstInputValue={modalText.pageOneFirstInputValue}
          pageOneFirstInputError={modalText.pageOneFirstInputError}
          pageOneSecondInputLabel={modalText.pageOneSecondInputLabel}
          pageOneSecondInputValue={modalText.pageOneSecondInputValue}
          pageOneSecondInputError={modalText.pageOneSecondInputError}
          pageTwoFirstLabel={modalText.pageTwoFirstLabel}
          handleSubmit={formikPageOne.handleSubmit}
          attributeName={attributeName}
          handleNewAttributeChange={handleNewAttributeChange}
          handleFormikPageOneValueChange={handleFormikPageOneValueChange}
        />
      }
      footerContent={footer}
    />
  )
}

MainContentPages.propTypes = {
  currentPage: PropTypes.number.isRequired,
  modalAttributeOptions: inputOptionsPropTypes.isRequired,
  projectName: PropTypes.string,
  proposedSummary: PropTypes.string.isRequired,
  pageOneFirstInputLabel: PropTypes.string.isRequired,
  pageOneFirstInputValue: PropTypes.string.isRequired,
  pageOneFirstInputError: PropTypes.string,
  pageOneSecondInputLabel: PropTypes.string.isRequired,
  pageOneSecondInputValue: PropTypes.string.isRequired,
  pageOneSecondInputError: PropTypes.string,
  pageTwoFirstLabel: PropTypes.string.isRequired,
  handleFormikPageOneValueChange: PropTypes.func.isRequired,
  handleNewAttributeChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  attributeName: PropTypes.string,
}

NewAttributeModal.propTypes = {
  isFishBeltSampleUnit: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  modalAttributeOptions: inputOptionsPropTypes.isRequired,
}

export default NewAttributeModal
