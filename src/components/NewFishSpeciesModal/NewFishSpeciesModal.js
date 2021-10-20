import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import {
  ButtonThatLooksLikeLink,
  ButtonPrimary,
  ButtonSecondary,
} from '../generic/buttons'
import { IconArrowBack, IconSend } from '../icons'
import { Input } from '../generic/form'
import { Row, RowSpaceBetween } from '../generic/positioning'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import InputAutocomplete from '../generic/InputAutocomplete'
import { Table, Td, Tr } from '../generic/Table/table'
import language from '../../language'
import Modal, { LeftFooter, RightFooter } from '../generic/Modal/Modal'
import theme from '../../theme'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import useIsMounted from '../../library/useIsMounted'

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
const MainContentContainer = styled.div``
const InputContainer = styled.div`
  width: 100%;
`
const NewFishSpeciesModal = ({
  isOpen,
  onDismiss,
  onSubmit,
  projectId,
  currentUser,
}) => {
  const isMounted = useIsMounted()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [generaOptions, setGeneraOptions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [projectName, setProjectName] = useState()
  const [genusName, setGenusName] = useState()
  const goToPage2 = () => {
    setCurrentPage(2)
  }
  const goToPage1 = () => {
    setCurrentPage(1)
  }

  const _loadGenera = useEffect(() => {
    if (databaseSwitchboardInstance && isMounted.current) {
      databaseSwitchboardInstance
        .getFishGenera()
        .then((genera) => {
          if (isMounted.current) {
            setGeneraOptions(
              genera.map((genus) => ({ label: genus.name, value: genus.id })),
            )
          }
        })
        .catch(() => {
          toast.error(language.error.generaUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isMounted])

  const _getProjectName = useEffect(() => {
    if (databaseSwitchboardInstance && isMounted.current) {
      databaseSwitchboardInstance
        .getProject(projectId)
        .then((project) => {
          if (isMounted.current) {
            setProjectName(project.name)
          }
        })
        .catch(() => {
          toast.error(language.error.projectsUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, projectId, isMounted])

  const formikPage1 = useFormik({
    initialValues: { genusId: '', species: '' },
    validationSchema: Yup.object().shape({
      genusId: Yup.string().required(language.error.formValidation.required),
      species: Yup.string().required(language.error.formValidation.required),
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

  const handleSpeciesChange = (event) => {
    formikPage1.setFieldValue('species', event.target.value.toLowerCase())
  }

  const handleOnSubmit = () => {
    onSubmit({
      genusId: formikPage1.values.genusId,
      genusName,
      speciesName: formikPage1.values.species,
    }).then(() => {
      resetAndCloseModal()
    })
  }

  const mainContentPage1 = (
    <form id="form-page-1" onSubmit={formikPage1.handleSubmit}>
      <StyledRow>
        <InputContainer>
          <label htmlFor="genus">{language.createFishSpecies.genus}</label>
          <InputAutocomplete
            id="genus"
            options={generaOptions}
            value={formikPage1.values.genusId}
            onChange={(selectedItem) => {
              formikPage1.setFieldValue('genusId', selectedItem.value)
              setGenusName(selectedItem.label)
            }}
          />
          {formikPage1.errors.genus && <div>{formikPage1.errors.genus}</div>}
        </InputContainer>
        <InputContainer>
          <label htmlFor="species">{language.createFishSpecies.species}</label>
          <Input
            id="species"
            aria-describedby="species-required"
            value={formikPage1.values.species}
            onChange={handleSpeciesChange}
          />
          {formikPage1.errors.species && (
            <span id="species-required">{formikPage1.errors.species}</span>
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
            <Td id="species-label">{language.createFishSpecies.species}</Td>
            <Td aria-labelledby="species-label">
              {formikPage1.values.species}
            </Td>
          </Tr>
          <Tr>
            <Td id="user-label">{language.createFishSpecies.user}</Td>
            <Td aria-labelledby="user-label">{currentUser.full_name}</Td>
          </Tr>
          <Tr>
            <Td id="project-label">{language.createFishSpecies.project}</Td>
            <Td aria-labelledby="project-label">{projectName}</Td>
          </Tr>
        </tbody>
      </DetailsTable>
      <p>{language.createFishSpecies.summaryText2}</p>
    </>
  )

  const mainContent = (
    <MainContentContainer>
      {currentPage === 1 && mainContentPage1}
      {currentPage === 2 && mainContentPage2}
    </MainContentContainer>
  )
  const cancelButton = (
    <ButtonSecondary type="button" onClick={resetAndCloseModal}>
      {language.createFishSpecies.cancel}
    </ButtonSecondary>
  )

  const footerPage1 = (
    <RightFooter>
      {cancelButton}
      <ButtonPrimary type="submit" form="form-page-1">
        {language.createFishSpecies.goToPage2}
      </ButtonPrimary>
    </RightFooter>
  )
  const footerPage2 = (
    <RowSpaceBetween>
      <LeftFooter>
        <ButtonThatLooksLikeLink type="button" onClick={goToPage1}>
          <IconArrowBack /> {language.createFishSpecies.back}
        </ButtonThatLooksLikeLink>
      </LeftFooter>

      <RightFooter>
        {cancelButton}
        <ButtonPrimary type="button" onClick={handleOnSubmit}>
          <IconSend /> {language.createFishSpecies.submit}
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
  currentUser: currentUserPropType.isRequired,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
}

export default NewFishSpeciesModal
