import { useFormik } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components/macro'

import { ButtonThatLooksLikeLink, ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconArrowBack, IconSend } from '../icons'
import { Input } from '../generic/form'
import { Row, RowSpaceBetween } from '../generic/positioning'
import InputAutocomplete from '../generic/InputAutocomplete'
import { Table, Td, Tr } from '../generic/Table/table'
import language from '../../language'
import Modal, { LeftFooter, RightFooter } from '../generic/Modal/Modal'
import theme from '../../theme'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { inputOptionsPropTypes } from '../../library/miscPropTypes'

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
const NewBenthicAttributeModal = ({
  isOpen,
  onDismiss,
  onSubmit,
  currentUser,
  projectName,
  benthicAttributeOptions,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [benthicAttributeParentName, setBenthicAttributeParentName] = useState()
  const goToPage2 = () => {
    setCurrentPage(2)
  }
  const goToPage1 = () => {
    setCurrentPage(1)
  }

  const formikPage1 = useFormik({
    initialValues: { benthicAttributeParentId: '', newBenthicAttribute: '' },
    validationSchema: Yup.object().shape({
      benthicAttributeParentId: Yup.string().required(language.error.formValidation.required),
      newBenthicAttribute: Yup.string().required(language.error.formValidation.required),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: () => {
      goToPage2()
    },
    enableReinitialize: true,
  })

  const resetAndCloseModal = () => {
    goToPage1()
    formikPage1.resetForm()
    onDismiss()
  }

  const handleNewBenthicAttributeNameChange = (event) => {
    formikPage1.setFieldValue('newBenthicAttribute', event.target.value.toLowerCase())
  }

  const handleOnSubmit = () => {
    onSubmit({
      benthicAttributeParentId: formikPage1.values.benthicAttributeParentId,
      benthicAttributeParentName,
      newBenthicAttributeName: formikPage1.values.newBenthicAttribute,
    }).then(() => {
      resetAndCloseModal()
    })
  }

  const mainContentPage1 = (
    <form id="form-page-1" onSubmit={formikPage1.handleSubmit}>
      <StyledRow>
        <InputContainer>
          <label id="benthic-attribute-parent-label" htmlFor="benthic-attribute-parent">
            {language.createNewOptionModal.benthicAttributeParent}
          </label>
          <InputAutocomplete
            id="benthic-attribute-parent"
            aria-labelledby="benthic-attribute-parent-label"
            options={benthicAttributeOptions}
            value={formikPage1.values.benthicAttributeParentId}
            noResultsText={language.autocomplete.noResultsDefault}
            onChange={(selectedItem) => {
              formikPage1.setFieldValue('benthicAttributeParentId', selectedItem.value)
              setBenthicAttributeParentName(selectedItem.label)
            }}
          />
          {formikPage1.errors.benthicAttributeParentId && (
            <span id="benthic-attribute-parent-required">
              {formikPage1.errors.benthicAttributeParentId}
            </span>
          )}
        </InputContainer>
        <InputContainer>
          <label id="new-benthic-attribute-label" htmlFor="new-benthic-attribute">
            {language.createNewOptionModal.newBenthicAttributeName}
          </label>
          <Input
            id="new-benthic-attribute"
            aria-describedby="new-benthic-attribute-label"
            value={formikPage1.values.newBenthicAttribute}
            onChange={handleNewBenthicAttributeNameChange}
          />
          {formikPage1.errors.newBenthicAttribute && (
            <span id="new-benthic-attribute-required">
              {formikPage1.errors.newBenthicAttribute}
            </span>
          )}
        </InputContainer>
      </StyledRow>
    </form>
  )

  const mainContentPage2 = (
    <>
      <DetailsTable>
        <tbody>
          <Tr>
            <Td id="new-benthic-attribute-label">
              {language.createNewOptionModal.newBenthicAttribute}
            </Td>
            <Td aria-labelledby="new-benthic-attribute-label">
              {formikPage1.values.newBenthicAttribute}
            </Td>
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
      <p>{language.createNewOptionModal.proposedSummaryText('benthic attribute')}</p>
    </>
  )

  const mainContent = (
    <div>
      {currentPage === 1 && mainContentPage1}
      {currentPage === 2 && mainContentPage2}
    </div>
  )
  const cancelButton = (
    <ButtonSecondary type="button" onClick={resetAndCloseModal}>
      {language.createNewOptionModal.cancel}
    </ButtonSecondary>
  )

  const footerPage1 = (
    <RightFooter>
      {cancelButton}
      <ButtonPrimary type="submit" form="form-page-1">
        {language.createNewOptionModal.goToPage2}
      </ButtonPrimary>
    </RightFooter>
  )
  const footerPage2 = (
    <RowSpaceBetween>
      <LeftFooter>
        <ButtonThatLooksLikeLink type="button" onClick={goToPage1}>
          <IconArrowBack /> {language.createNewOptionModal.back}
        </ButtonThatLooksLikeLink>
      </LeftFooter>

      <RightFooter>
        {cancelButton}
        <ButtonPrimary type="button" onClick={handleOnSubmit}>
          <IconSend /> {language.createNewOptionModal.submit}
        </ButtonPrimary>
      </RightFooter>
    </RowSpaceBetween>
  )

  const footer = (
    <>
      {currentPage === 1 && footerPage1}
      {currentPage === 2 && footerPage2}
    </>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={resetAndCloseModal}
      title={language.createNewOptionModal.addNewAttributeTitle('Benthic Attribute')}
      mainContent={mainContent}
      footerContent={footer}
      contentOverflowIsvisible={true}
    />
  )
}

NewBenthicAttributeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  currentUser: currentUserPropType.isRequired,
  projectName: PropTypes.string.isRequired,
  benthicAttributeOptions: inputOptionsPropTypes.isRequired,
}

export default NewBenthicAttributeModal
