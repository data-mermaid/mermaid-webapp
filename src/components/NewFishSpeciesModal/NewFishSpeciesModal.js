import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ButtonLink, ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconArrowBack, IconRequired, IconSend } from '../icons'
import { Input } from '../generic/form'
import { Column, Row, RowSpaceBetween } from '../generic/positioning'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import InputAutocomplete from '../generic/InputAutocomplete'
import language from '../../language'
import Modal, { LeftFooter, RightFooter } from '../generic/Modal/Modal'
import theme from '../../theme'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import useIsMounted from '../../library/useIsMounted'

const MainContentContainer = styled.div`
  border: solid thick magenta;
  padding: ${theme.spacing.xlarge};
`
const InputContainer = styled.div`
  flex-grow: 1;
  padding-right: ${theme.spacing.xlarge};
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
    let isMounted = true

    if (databaseSwitchboardInstance && isMounted) {
      databaseSwitchboardInstance
        .getFishGenera()
        .then((genera) => {
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

  const _getProjectName = useEffect(() => {
    if (databaseSwitchboardInstance && isMounted.current) {
      databaseSwitchboardInstance
        .getProject(projectId)
        .then((project) => {
          setProjectName(project.name)
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
      <Row>
        <InputContainer>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label id="genus-label">
            {language.createFishSpecies.genus} <IconRequired />
          </label>
          <InputAutocomplete
            id="genus"
            aria-labelledby="genus-label"
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
          <label htmlFor="species">
            {language.createFishSpecies.species} <IconRequired />
          </label>
          <Input
            id="species"
            value={formikPage1.values.species}
            onChange={handleSpeciesChange}
          />
          {formikPage1.errors.species && (
            <div>{formikPage1.errors.species}</div>
          )}
        </InputContainer>
      </Row>
    </form>
  )

  const mainContentPage2 = (
    <Column>
      <div>
        <div>
          {language.createFishSpecies.getSummaryText1({
            speciesName: `${genusName} ${formikPage1.values.species}`,
          })}
        </div>
        <h5>{language.createFishSpecies.details}</h5>
        <dl>
          <dt id="user-label">{language.createFishSpecies.user}</dt>
          <dd aria-labelledby="user-label">{currentUser.full_name}</dd>
          <dt id="project-label">{language.createFishSpecies.project}</dt>
          <dd aria-labelledby="project-label">{projectName}</dd>
        </dl>
      </div>
      <div>{language.createFishSpecies.summaryText2}</div>
    </Column>
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
      <ButtonPrimary type="submit" form="form-page-1">
        {language.createFishSpecies.goToPage2}
      </ButtonPrimary>
      {cancelButton}
    </RightFooter>
  )
  const footerPage2 = (
    <RowSpaceBetween>
      <LeftFooter>
        <ButtonLink type="button" onClick={goToPage1}>
          <IconArrowBack /> {language.createFishSpecies.back}
        </ButtonLink>
      </LeftFooter>

      <RightFooter>
        <ButtonPrimary type="button" onClick={handleOnSubmit}>
          <IconSend /> {language.createFishSpecies.submit}
        </ButtonPrimary>
        {cancelButton}
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
