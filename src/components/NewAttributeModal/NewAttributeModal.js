import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'

import * as Yup from 'yup'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'

import { ButtonThatLooksLikeLink, ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconArrowBack, IconSend } from '../icons'
import { Input } from '../generic/form'
import { Row, RowSpaceBetween } from '../generic/positioning'
import InputAutocomplete from '../generic/InputAutocomplete'
import { Table, Td, Tr } from '../generic/Table/table'
import language from '../../language'
import { getToastArguments } from '../../library/getToastArguments'
import Modal, { LeftFooter, RightFooter } from '../generic/Modal/Modal'
import theme from '../../theme'
import { inputOptionsPropTypes } from '../../library/miscPropTypes'
import useIsMounted from '../../library/useIsMounted'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { useHttpResponseErrorHandler } from '../../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'

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

  const mainContentPageOne = (
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
            noResultsText={language.createNewOptionModal.genusNotFound()}
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

  const mainContentPageTwo = (
    <>
      <DetailsTable>
        <tbody>
          <Tr>
            <Td id="new-attribute-label">{pageTwoFirstLabel}</Td>
            <Td aria-labelledby="new-attribute-label">{`${attributeName} ${pageOneSecondInputValue}`}</Td>
          </Tr>
          <Tr>
            <Td id="user-label">{language.createNewOptionModal.user}</Td>
            <Td aria-labelledby="user-label">{currentUser.full_name}</Td>
          </Tr>
          <Tr>
            <Td id="project-label">{language.createNewOptionModal.project}</Td>
            <Td aria-labelledby="project-label">{projectName}</Td>
          </Tr>
        </tbody>
      </DetailsTable>
      <p>{proposedSummary}</p>
    </>
  )

  return (
    <>
      {currentPage === 1 && mainContentPageOne}
      {currentPage === 2 && mainContentPageTwo}
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

  const [currentPage, setCurrentPage] = useState(1)
  const [projectName, setProjectName] = useState('')
  const [attributeName, setAttributeName] = useState()
  const {
    createNewOptionModal: {
      addNewAttributeTitle,
      proposedSummaryText,
      genus: genusText,
      species: speciesText,
      newBenthicAttribute: newBenthicAttributeText,
      benthicAttributeParent: benthicAttributeParentText,
      newBenthicAttributeName: newBenthicAttributeNameText,
      goToNextPage: goToNextPageText,
      cancel: cancelText,
      back: backText,
      submit: submitText,
    },
    error: { projectsUnavailable: projectsUnavailableText },
  } = language

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
              toast.error(...getToastArguments(projectsUnavailableText))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    projectId,
    isMounted,
    handleHttpResponseError,
    projectsUnavailableText,
  ])

  const formValuesAndValidationSchema = isFishBeltSampleUnit
    ? {
        initialValues: { genusId: '', species: '' },
        validationSchema: Yup.object().shape({
          genusId: Yup.string().required(language.error.formValidation.required),
          species: Yup.string().required(language.error.formValidation.required),
        }),
      }
    : {
        initialValues: { benthicAttributeParentId: '', newBenthicAttribute: '' },
        validationSchema: Yup.object().shape({
          benthicAttributeParentId: Yup.string().required(language.error.formValidation.required),
          newBenthicAttribute: Yup.string().required(language.error.formValidation.required),
        }),
      }

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

  const formValuesOnSubmit = isFishBeltSampleUnit
    ? {
        genusId: formikPageOne.values.genusId,
        genusName: attributeName,
        speciesName: formikPageOne.values.species,
      }
    : {
        benthicAttributeParentId: formikPageOne.values.benthicAttributeParentId,
        benthicAttributeParentName: attributeName,
        newBenthicAttributeName: formikPageOne.values.newBenthicAttribute,
      }

  const handleOnSubmit = () => {
    onSubmit(formValuesOnSubmit).then(() => {
      resetAndCloseModal()
    })
  }

  const cancelButton = (
    <ButtonSecondary type="button" onClick={resetAndCloseModal}>
      {cancelText}
    </ButtonSecondary>
  )

  const footerPageOne = (
    <RightFooter>
      {cancelButton}
      <ButtonPrimary type="submit" form="form-page-1">
        {goToNextPageText}
      </ButtonPrimary>
    </RightFooter>
  )
  const footerPageTwo = (
    <RowSpaceBetween>
      <LeftFooter>
        <ButtonThatLooksLikeLink type="button" onClick={goToPageOne}>
          <IconArrowBack /> {backText}
        </ButtonThatLooksLikeLink>
      </LeftFooter>

      <RightFooter>
        {cancelButton}
        <ButtonPrimary type="button" onClick={handleOnSubmit}>
          <IconSend /> {submitText}
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

  const modalTitle = isFishBeltSampleUnit
    ? addNewAttributeTitle('Fish Species')
    : addNewAttributeTitle('Benthic Attribute')
  const pageOneFirstInputLabel = isFishBeltSampleUnit ? genusText : benthicAttributeParentText
  const pageOneFirstInputValue = isFishBeltSampleUnit
    ? formikPageOne.values.genusId
    : formikPageOne.values.benthicAttributeParentId
  const pageTwoFirstLabel = isFishBeltSampleUnit ? speciesText : newBenthicAttributeText
  const pageOneSecondInputLabel = isFishBeltSampleUnit ? speciesText : newBenthicAttributeNameText
  const pageOneSecondInputValue = isFishBeltSampleUnit
    ? formikPageOne.values.species
    : formikPageOne.values.newBenthicAttribute
  const pageOneFirstInputError = isFishBeltSampleUnit
    ? formikPageOne.errors.genusId
    : formikPageOne.errors.benthicAttributeParentId
  const pageOneSecondInputError = isFishBeltSampleUnit
    ? formikPageOne.errors.species
    : formikPageOne.errors.newBenthicAttribute
  const proposedSummary = isFishBeltSampleUnit
    ? proposedSummaryText('fish species')
    : proposedSummaryText('benthic attribute')

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={resetAndCloseModal}
      title={modalTitle}
      mainContent={
        <MainContentPages
          currentPage={currentPage}
          projectName={projectName}
          proposedSummary={proposedSummary}
          modalAttributeOptions={modalAttributeOptions}
          pageOneFirstInputLabel={pageOneFirstInputLabel}
          pageOneFirstInputValue={pageOneFirstInputValue}
          pageOneFirstInputError={pageOneFirstInputError}
          pageOneSecondInputLabel={pageOneSecondInputLabel}
          pageOneSecondInputValue={pageOneSecondInputValue}
          pageOneSecondInputError={pageOneSecondInputError}
          pageTwoFirstLabel={pageTwoFirstLabel}
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
