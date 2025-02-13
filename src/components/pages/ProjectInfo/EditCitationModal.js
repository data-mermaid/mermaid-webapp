import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import {
  CitationDefinitionList,
  CitationLabel,
  CitationModalColumn,
  MainContentWrapper,
  ProjectInfoWrapper,
  EditCitationLabelWrapper,
} from './EditCitationModal.styles'
import { ButtonPrimary, ButtonSecondary, ButtonSecondarySmall } from '../../generic/buttons'
import { DisabledText, PTextCursor } from '../../generic/text'
import { HelpTextWithIcon } from '../../generic/HelpTextWithIcon/HelpTextWithIcon'
import { IconRefresh } from '../../icons'
import { Textarea } from '../../generic/form'
import language from '../../../language'
import Modal, { RightFooter } from '../../generic/Modal/Modal'

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

  const applyDefaultCitation = () => {
    setEditCitationValue(default_citation)
  }

  const admins = projectProfiles
    .filter((profile) => profile.is_admin)
    .map((profile) => profile.profile_name)
  const adminsString = admins.join(', ')
  const isAdminsPlural = admins.length > 1

  const otherProjectMembers = projectProfiles
    .filter((profile) => !profile.is_admin && profile.profile_name !== '(pending user)')
    .map((profile) => profile.profile_name)
  const otherProjectMembersString = otherProjectMembers.join(', ')
  const isOtherProjectMembersPlural = otherProjectMembers.length > 1

  const projectLastUpdatedString = new Date(updated_on).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const projectCountriesString = countries.join(', ')
  const isCountriesPlural = countries.length > 1

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

  const citationPreview = editCitationValue.trim() ? (
    <>
      {editCitationValue} <DisabledText>{citation_retrieved_text}</DisabledText>
    </>
  ) : (
    <>
      {default_citation} <DisabledText>{citation_retrieved_text}</DisabledText>
    </>
  )

  const mainContent = (
    <MainContentWrapper>
      <CitationModalColumn>
        <HelpTextWithIcon>{modalLanguage.helper}</HelpTextWithIcon>
        <ProjectInfoWrapper>
          <CitationDefinitionList>
            <dt>{modalLanguage.projectName}</dt>
            <dd>{name}</dd>
            <dt>{isAdminsPlural ? modalLanguage.projectAdmins : modalLanguage.projectAdmin}</dt>
            <dd>{adminsString}</dd>
            {otherProjectMembers.length ? (
              <>
                <dt>
                  {isOtherProjectMembersPlural
                    ? modalLanguage.otherProjectMembers
                    : modalLanguage.otherProjectMember}
                </dt>
                <dd>{otherProjectMembersString}</dd>
              </>
            ) : null}

            <dt>{modalLanguage.projectLastUpdated}</dt>
            <dd>{projectLastUpdatedString}</dd>
            {countries.length ? (
              <>
                <dt>{isCountriesPlural ? modalLanguage.countries : modalLanguage.country}</dt>
                <dd>{projectCountriesString}</dd>
              </>
            ) : null}
          </CitationDefinitionList>
        </ProjectInfoWrapper>
      </CitationModalColumn>

      <CitationModalColumn>
        <form>
          <EditCitationLabelWrapper>
            <CitationLabel htmlFor="editCitation">{modalLanguage.editCitation}</CitationLabel>
            <ButtonSecondarySmall type="button" onClick={applyDefaultCitation}>
              <IconRefresh /> {modalLanguage.useDefaultCitation}
            </ButtonSecondarySmall>
          </EditCitationLabelWrapper>

          <Textarea
            id="editCitation"
            value={editCitationValue}
            onChange={handleEditCitationChange}
          />
        </form>

        <CitationLabel>{modalLanguage.citationPreview}</CitationLabel>
        <PTextCursor>{citationPreview}</PTextCursor>
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
