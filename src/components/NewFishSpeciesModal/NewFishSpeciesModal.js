import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ButtonLink, ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconRequired } from '../icons'
import { Input } from '../generic/form'
import { Row, RowSpaceBetween } from '../generic/positioning'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import InputAutocomplete from '../generic/InputAutocomplete'
import language from '../../language'
import Modal, { LeftFooter, RightFooter } from '../generic/Modal/Modal'
import theme from '../../theme'

const MainContentContainer = styled.div`
  border: solid thick magenta;
`
const InputContainer = styled.div`
  flex-grow: 1;
  padding-right: ${theme.spacing.xlarge};
`

const NewFishSpeciesModal = ({ isOpen, onDismiss, onSubmit }) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [generaOptions, setGeneraOptions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const goToPage2 = () => {
    setCurrentPage(2)
  }
  const goToPage1 = () => {
    setCurrentPage(1)
  }

  const _loadGenera = useEffect(() => {
    let isMounted = true

    if (databaseSwitchboardInstance && isMounted) {
      databaseSwitchboardInstance
        .getGenera()
        .then(({ results: genera }) => {
          setGeneraOptions(
            genera.map((genus) => ({ label: genus.name, value: genus.id })),
          )
        })
        .catch(() => {
          toast.error(language.error.generaUnavailable)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance])

  const formikPage1 = useFormik({
    initialValues: { genus: '', species: '' },
    validationSchema: Yup.object().shape({
      genus: Yup.string().required(language.error.formValidation.required),
      species: Yup.string().required(language.error.formValidation.required),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: () => {
      goToPage2()
    },
    enableReinitialize: true,
  })

  const handleOnDismiss = () => {
    goToPage1()
    formikPage1.resetForm()
    onDismiss()
  }
  const mainContentPage1 = (
    <form id="form-page-1" onSubmit={formikPage1.handleSubmit}>
      <Row>
        <InputContainer>
          <label htmlFor="genus">
            {language.createFishSpecies.genus} <IconRequired />
          </label>
          <InputAutocomplete
            id="genus"
            options={generaOptions}
            value={formikPage1.values.genus}
            onChange={(selectedItem) => {
              formikPage1.setFieldValue('genus', selectedItem.value)
            }}
          />
          {formikPage1.errors.genus && <div>{formikPage1.errors.genus}</div>}
        </InputContainer>
        <InputContainer>
          <label htmlFor="species">
            {language.createFishSpecies.species} <IconRequired />
          </label>
          <Input id="species" {...formikPage1.getFieldProps('species')} />
          {formikPage1.errors.species && (
            <div>{formikPage1.errors.species}</div>
          )}
        </InputContainer>
      </Row>
    </form>
  )
  const mainContentPage2 = <>view 2</>

  const mainContent = (
    <MainContentContainer>
      {currentPage === 1 && mainContentPage1}
      {currentPage === 2 && mainContentPage2}
    </MainContentContainer>
  )

  const footerPage1 = (
    <RightFooter>
      <ButtonPrimary type="submit" form="form-page-1">
        {language.createFishSpecies.goToPage2}
      </ButtonPrimary>
      <ButtonSecondary type="button" onClick={handleOnDismiss}>
        {language.createFishSpecies.cancel}
      </ButtonSecondary>
    </RightFooter>
  )
  const footerPage2 = (
    <RowSpaceBetween>
      <LeftFooter>
        <ButtonLink type="button" onClick={goToPage1}>
          Back
        </ButtonLink>
      </LeftFooter>
      <RightFooter>placeholder</RightFooter>
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
      onDismiss={handleOnDismiss}
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
