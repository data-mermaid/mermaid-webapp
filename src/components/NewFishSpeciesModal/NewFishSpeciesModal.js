import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'

import { IconRequired } from '../icons'
import { Input } from '../generic/form'
import { Row, RowSpaceBetween } from '../generic/positioning'
import language from '../../language'
import Modal, { LeftFooter, RightFooter } from '../generic/Modal/Modal'
import theme from '../../theme'
import { ButtonLink, ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { Formik, useFormik } from 'formik'

const MainContentContainer = styled.div`
  border: solid thick magenta;
`
const InputContainer = styled.div`
  flex-grow: 1;
  padding-right: ${theme.spacing.xlarge};
`

const NewFishSpeciesModal = ({ isOpen, onDismiss, onSubmit }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const goToPage2 = () => {
    setCurrentPage(2)
  }
  const goToPage1 = () => {
    setCurrentPage(1)
  }

  const formik1 = useFormik({
    initialValues: { genus: '', species: '' },
    validate: (values) => {
      const errors = {}
      console.log('validate', values)

      if (!values.species || values.species === '') {
        errors.species = language.error.formValidation.required
      }

      return errors
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: () => {
      goToPage2()
    },
    enableReinitialize: true,
  })

  const mainContent1 = (
    <form id="form-content-1" onSubmit={formik1.handleSubmit}>
      <Row>
        <InputContainer>
          <label htmlFor="genus">
            {language.createFishSpecies.genus} <IconRequired />
          </label>
          <Input id="genus" />
        </InputContainer>
        <InputContainer>
          <label htmlFor="species">
            {language.createFishSpecies.species} <IconRequired />
          </label>
          <Input id="species" {...formik1.getFieldProps('species')} />
          {formik1.errors.species && <div>{formik1.errors.species}</div>}
        </InputContainer>
      </Row>
    </form>
  )
  const mainContent2 = <>view 2</>

  const mainContent = (
    <MainContentContainer>
      {currentPage === 1 && mainContent1}
      {currentPage === 2 && mainContent2}
    </MainContentContainer>
  )

  const footer1 = (
    <RightFooter>
      <ButtonPrimary type="submit" form="form-content-1">
        {language.createFishSpecies.goToView2}
      </ButtonPrimary>
      <ButtonSecondary type="button" onClick={onDismiss}>
        {language.createFishSpecies.cancel}
      </ButtonSecondary>
    </RightFooter>
  )
  const footer2 = (
    <RowSpaceBetween>
      <LeftFooter>
        <ButtonLink type="button" onClick={goToPage1}>
          Back
        </ButtonLink>
      </LeftFooter>
      <RightFooter></RightFooter>
    </RowSpaceBetween>
  )

  const footer = (
    <>
      {currentPage === 1 && footer1}
      {currentPage === 2 && footer2}
    </>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={language.createFishSpecies.title}
      mainContent={mainContent}
      footerContent={footer}
    />
  )
}

NewFishSpeciesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default NewFishSpeciesModal
