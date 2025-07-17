import { Slide, toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'

import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'

import { ButtonPrimary, ButtonSecondary, ButtonThatLooksLikeLink } from './generic/buttons'
import { IconArrowBack, IconSend } from './icons'
import { Input } from './generic/form'
import { Row, RowSpaceBetween } from './generic/positioning'
import InputAutocomplete from './generic/InputAutocomplete/InputAutocomplete'
import { Table, Td, Tr } from './generic/Table/table'
import Modal, { LeftFooter, RightFooter } from './generic/Modal'
import useIsMounted from '../library/useIsMounted'
import { useCurrentUser } from '../App/CurrentUserContext'
import { useHttpResponseErrorHandler } from '../App/HttpResponseErrorHandlerContext'
import { useDatabaseSwitchboardInstance } from '../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { Trans, useTranslation } from 'react-i18next'
import { links } from '../link_constants'
import style from '../style/NewAttributeModal.module.scss'
import { InputOption } from '../App/mermaidData/mermaidDataTypes'

interface FishBeltSubmission {
  genusId: string
  genusName: string | undefined
  speciesName: string
}

interface BenthicAttributeSubmission {
  benthicAttributeParentId: string
  benthicAttributeParentName: string | undefined
  newBenthicAttributeName: string
}

interface NewAttributeModalProps {
  isFishBeltSampleUnit: boolean
  isOpen: boolean
  onDismiss: () => void
  onSubmit: (submissionValues: FishBeltSubmission | BenthicAttributeSubmission) => Promise<void>
  modalAttributeOptions: InputOption[]
}

const NoResults = (
  <Trans
    i18nKey="taxonomies.genus_not_found"
    components={{
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      a: <a href={links.contactUs} target="_blank" rel="noopener noreferrer" />,
    }}
  />
)

const NewAttributeModal = ({
  isFishBeltSampleUnit,
  isOpen,
  onDismiss,
  onSubmit,
  modalAttributeOptions,
}: NewAttributeModalProps) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const isMounted = useIsMounted()
  const { projectId } = useParams()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { t } = useTranslation()
  const { currentUser } = useCurrentUser()

  const [currentPage, setCurrentPage] = useState<1 | 2>(1)
  const [projectName, setProjectName] = useState<string>('')
  const [attributeName, setAttributeName] = useState<string>('')

  const goToPageTwo = () => {
    setCurrentPage(2)
  }
  const goToPageOne = () => {
    setCurrentPage(1)
  }

  const dataUnavailableText = t('projects.data_unavailable')

  //Get Project Name
  useEffect(() => {
    if (databaseSwitchboardInstance && isMounted.current) {
      databaseSwitchboardInstance
        .getProject(projectId)
        .then((project: { name: string }) => {
          if (isMounted.current) {
            setProjectName(project.name)
          }
        })
        .catch((error: Error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(dataUnavailableText, {
                transition: Slide,
              })
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    projectId,
    isMounted,
    handleHttpResponseError,
    dataUnavailableText,
  ])

  const formValidationSchema = {
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: () => {
      goToPageTwo()
    },
    enableReinitialize: true,
  }
  const fishBeltProposalForm = useFormik({
    ...formValidationSchema,
    initialValues: { genusId: '', species: '' },
    validationSchema: Yup.object().shape({
      genusId: Yup.string().required(t('forms.required_field')),
      species: Yup.string().required(t('forms.required_field')),
    }),
  })
  const benthicAttributeProposalForm = useFormik({
    ...formValidationSchema,
    initialValues: { benthicAttributeParentId: '', newBenthicAttribute: '' },
    validationSchema: Yup.object().shape({
      benthicAttributeParentId: Yup.string().required(t('forms.required_field')),
      newBenthicAttribute: Yup.string().required(t('forms.required_field')),
    }),
  })
  const attributeProposalForm = isFishBeltSampleUnit
    ? fishBeltProposalForm
    : benthicAttributeProposalForm

  const resetAndCloseModal = () => {
    goToPageOne()
    attributeProposalForm.resetForm()
    onDismiss()
  }

  const fishBeltAttributes = {
    attributeId: 'genusId',
    attributeProperty: 'species',
  }

  const benthicAttributes = {
    attributeId: 'benthicAttributeParentId',
    attributeProperty: 'newBenthicAttribute',
  }

  const formAttributes = isFishBeltSampleUnit ? fishBeltAttributes : benthicAttributes

  const handleAttributeProposalFormValueChange = (selectedItem: InputOption) => {
    attributeProposalForm.setFieldValue(formAttributes.attributeId, selectedItem.value)
    setAttributeName(selectedItem.label)
  }

  const handleNewAttributeChange = (event) => {
    const valueToUse = isFishBeltSampleUnit ? event.target.value.toLowerCase() : event.target.value
    attributeProposalForm.setFieldValue(formAttributes.attributeProperty, valueToUse)
  }

  const fishBeltSampleUnitAssets = {
    modalTitle: t('taxonomies.add_fish_species'),
    proposedAttributeParentIdLabel: t('taxonomies.genus'),
    proposedAttributeParentId: fishBeltProposalForm.values.genusId,
    pageTwoFirstLabel: t('taxonomies.species'),
    proposedAttributeInputLabel: t('taxonomies.species'),
    proposedAttributeValue: fishBeltProposalForm.values.species,
    proposedParentIdError: fishBeltProposalForm.errors.genusId,
    proposedAttributeInputError: fishBeltProposalForm.errors.species,
    proposedSummary: t('benthic_observations.attribute_proposal_summary', {
      attribute: 'fish species',
    }),
  }

  const generalBenthicAttributeAssets = {
    modalTitle: t('benthic_observations.add_benthic_attribute'),
    proposedAttributeParentIdLabel: t('taxonomies.parent'),
    proposedAttributeParentId: benthicAttributeProposalForm.values.benthicAttributeParentId,
    pageTwoFirstLabel: t('benthic_observations.benthic_attribute'),
    proposedAttributeInputLabel: t('name'),
    proposedAttributeValue: benthicAttributeProposalForm.values.newBenthicAttribute,
    proposedParentIdError: benthicAttributeProposalForm.errors.benthicAttributeParentId,
    proposedAttributeInputError: benthicAttributeProposalForm.errors.newBenthicAttribute,
    proposedSummary: t('benthic_observations.attribute_proposal_summary', {
      attribute: 'benthic attribute',
    }),
  }

  const modalAssets = isFishBeltSampleUnit
    ? fishBeltSampleUnitAssets
    : generalBenthicAttributeAssets

  const fishBeltFormValues = {
    genusId: fishBeltProposalForm.values.genusId,
    genusName: attributeName,
    speciesName: fishBeltProposalForm.values.species,
  }

  const benthicAttributeFormValues = {
    benthicAttributeParentId: benthicAttributeProposalForm.values.benthicAttributeParentId,
    benthicAttributeParentName: attributeName,
    newBenthicAttributeName: benthicAttributeProposalForm.values.newBenthicAttribute,
  }

  const handleOnSubmit = () => {
    const submissionValues = isFishBeltSampleUnit ? fishBeltFormValues : benthicAttributeFormValues
    onSubmit(submissionValues).then(() => {
      resetAndCloseModal()
    })
  }

  const CancelButton = (
    <ButtonSecondary type="button" onClick={resetAndCloseModal}>
      {t('buttons.cancel')}
    </ButtonSecondary>
  )

  const ProposalFormFooter = (
    <RightFooter>
      {CancelButton}
      <ButtonPrimary type="submit" form="form-page-1" data-testid="next-form-page">
        {t('buttons.next_page')}
      </ButtonPrimary>
    </RightFooter>
  )
  const AttributeReviewFooter = (
    <RowSpaceBetween>
      <LeftFooter>
        <ButtonThatLooksLikeLink type="button" onClick={goToPageOne}>
          <IconArrowBack /> {t('buttons.back')}
        </ButtonThatLooksLikeLink>
      </LeftFooter>

      <RightFooter>
        {CancelButton}
        <ButtonPrimary type="button" data-testid="submit-proposal-button" onClick={handleOnSubmit}>
          <IconSend /> {t('forms.submit_for_review')}
        </ButtonPrimary>
      </RightFooter>
    </RowSpaceBetween>
  )

  const AttributeProposalForm = (
    <form id="form-page-1" onSubmit={attributeProposalForm.handleSubmit}>
      <Row className={style['styled-row']}>
        <div className={style['input-container']}>
          <label id="attribute-label" data-testid="attribute-label" htmlFor="attribute">
            {modalAssets.proposedAttributeParentIdLabel}
          </label>
          <InputAutocomplete
            id="attribute"
            aria-labelledby="attribute-label"
            options={modalAttributeOptions}
            value={modalAssets.proposedAttributeParentId}
            noResultsAction={NoResults}
            onChange={handleAttributeProposalFormValueChange}
          />
          {modalAssets.proposedParentIdError && (
            <span id="attribute-required">{modalAssets.proposedParentIdError}</span>
          )}
        </div>
        <div className={style['input-container']}>
          <label id="new-attribute-label" htmlFor="new-attribute">
            {modalAssets.proposedAttributeInputLabel}
          </label>
          <Input
            id="new-attribute"
            data-testid="new-attribute-name"
            aria-describedby="new-attribute-label"
            value={modalAssets.proposedAttributeValue}
            onChange={handleNewAttributeChange}
          />
          {modalAssets.proposedAttributeInputError && (
            <span id="new-attribute-required">{modalAssets.proposedAttributeInputError}</span>
          )}
        </div>
      </Row>
    </form>
  )
  const AttributeReview = (
    <>
      <Table className={style['details-table']}>
        <tbody>
          <Tr>
            <Td id="new-attribute-label">{modalAssets.pageTwoFirstLabel}</Td>
            <Td
              data-testid="proposed-attribute-type"
              aria-labelledby="new-attribute-label"
            >{`${attributeName} ${modalAssets.proposedAttributeValue}`}</Td>
          </Tr>
          <Tr>
            <Td id="user-label">{t('user')}</Td>
            <Td data-testid="proposed-attribute-user" aria-labelledby="user-label">
              {currentUser.full_name}
            </Td>
          </Tr>
          <Tr>
            <Td id="project-label">{t('projects.project')}</Td>
            <Td data-testid="proposed-attribute-project" aria-labelledby="project-label">
              {projectName}
            </Td>
          </Tr>
        </tbody>
      </Table>
      <p data-testid="proposed-summary">{modalAssets.proposedSummary}</p>
    </>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={resetAndCloseModal}
      title={modalAssets.modalTitle}
      contentOverflowStyle={'visible' as never}
      testId="attribute-proposal-modal"
      mainContent={
        <>
          {currentPage === 1 && AttributeProposalForm}
          {currentPage === 2 && AttributeReview}
        </>
      }
      footerContent={
        <>
          {currentPage === 1 && ProposalFormFooter}
          {currentPage === 2 && AttributeReviewFooter}
        </>
      }
    />
  )
}

export default NewAttributeModal
