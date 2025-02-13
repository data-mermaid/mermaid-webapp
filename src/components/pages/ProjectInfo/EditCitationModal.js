import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import {
  CitationDefinitionList,
  CitationLabel,
  CitationModalColumn,
  MainContentWrapper,
  ProjectInfoWrapper,
} from './EditCitationModal.styles'
import { ButtonPrimary, ButtonSecondary } from '../../generic/buttons'
import { HelpTextWithIcon } from '../../generic/HelpTextWithIcon/HelpTextWithIcon'
import language from '../../../language'
import Modal, { RightFooter } from '../../generic/Modal/Modal'
import { Textarea } from '../../generic/form'

const modalLanguage = language.pages.projectInfo.editCitationModal

export const EditCitationModal = ({
  citationToUse,
  isOpen,
  onDismiss,
  projectBeingEdited,
  projectProfiles,
  setCitationToUse,
}) => {
  const [editCitationValue, setEditCitationValue] = useState('')

  const isEditCitationValueDirty = citationToUse !== editCitationValue
  const isEditCitationValueDefined = !!editCitationValue.trim()

  const {
    updated_on,
    countries = [],
    name,
    default_citation,
    citation_retrieved_text,
  } = projectBeingEdited ?? {}

  const admins = projectProfiles
    .filter((profile) => profile.is_admin)
    .map((profile) => profile.profile_name)
    .join(', ')

  const otherProjectMembers = projectProfiles
    .filter((profile) => !profile.is_admin && profile.profile_name !== '(pending user)')
    .map((profile) => profile.profile_name)
    .join(', ')

  const latestSampleEventDate = new Date(updated_on).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const projectCountries = countries.join(', ')

  useEffect(
    function initializeEditCitationValue() {
      setEditCitationValue(citationToUse)
    },
    [citationToUse],
  )

  const handleEditCitationChange = (event) => {
    setEditCitationValue(event.target.value)
  }

  const handleUpdateCitation = () => {
    if (!isEditCitationValueDefined) {
      setCitationToUse(default_citation)
      setEditCitationValue(default_citation)
    }
    if (isEditCitationValueDefined) {
      setCitationToUse(editCitationValue)
    }
    onDismiss()
  }

  const handleCancel = () => {
    setEditCitationValue(citationToUse)
    onDismiss()
  }

  const citationPreview = editCitationValue.trim()
    ? `${editCitationValue} ${citation_retrieved_text}`
    : `${default_citation} ${citation_retrieved_text}`

  const mainContent = (
    <MainContentWrapper>
      <CitationModalColumn>
        <HelpTextWithIcon>{modalLanguage.helper}</HelpTextWithIcon>
        <ProjectInfoWrapper>
          <CitationDefinitionList>
            <dt>{modalLanguage.projectName}</dt>
            <dd>{name}</dd>
            <dt>{modalLanguage.projectAdmins}</dt>
            <dd>{admins}</dd>
            <dt>{modalLanguage.otherProjectMembers}</dt>
            <dd>{otherProjectMembers}</dd>
            <dt>{modalLanguage.latestSampleEventDate}</dt>
            <dd>{latestSampleEventDate}</dd>
            <dt>{modalLanguage.countries}</dt>
            <dd>{projectCountries}</dd>
          </CitationDefinitionList>
        </ProjectInfoWrapper>
      </CitationModalColumn>

      <CitationModalColumn>
        <CitationDefinitionList>
          <dt>{modalLanguage.defaultCitation}</dt>
          <dd>{default_citation}</dd>
        </CitationDefinitionList>
        <form>
          <CitationLabel htmlFor="editCitation">{modalLanguage.editCitation}</CitationLabel>
          <Textarea
            id="editCitation"
            value={editCitationValue}
            onChange={handleEditCitationChange}
          />
        </form>

        <CitationLabel>{modalLanguage.citationPreview}</CitationLabel>
        <div>{citationPreview}</div>
      </CitationModalColumn>
    </MainContentWrapper>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary type="button" onClick={handleCancel}>
        {modalLanguage.cancel}
      </ButtonSecondary>
      <ButtonPrimary
        type="button"
        disabled={!isEditCitationValueDirty || !isEditCitationValueDefined}
        onClick={handleUpdateCitation}
      >
        {modalLanguage.updateCitation}
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleCancel}
      title={modalLanguage.title}
      mainContent={mainContent}
      footerContent={footerContent}
      contentOverflowIsVisible={false}
    />
  )
}

EditCitationModal.propTypes = {
  citationToUse: PropTypes.string,
  initialEditableCitation: PropTypes.string,
  isOpen: PropTypes.bool,
  onDismiss: PropTypes.func,
  projectBeingEdited: PropTypes.object,
  setCitationToUse: PropTypes.func,
  projectProfiles: PropTypes.array,
}
