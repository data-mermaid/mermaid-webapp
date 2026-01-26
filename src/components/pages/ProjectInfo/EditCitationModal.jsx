import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CitationDefinitionList,
  CitationLabel,
  CitationModalColumn,
  MainContentWrapper,
  ProjectInfoWrapper,
  EditCitationLabelWrapper,
} from './EditCitationModal.styles'
import { ButtonPrimary, ButtonSecondary, ButtonSecondarySmall } from '../../generic/buttons'
import { DisabledText, PNoMargins } from '../../generic/text'
import { HelpTextWithIcon } from '../../generic/HelpTextWithIcon/HelpTextWithIcon'
import { IconRefresh } from '../../icons'
import { Textarea } from '../../generic/form'
import Modal, { RightFooter } from '../../generic/Modal'
import { getPendingUserProfileName } from '../../../App/currentUserProfileHelpers'

export const EditCitationModal = ({
  citationToUse,
  isOpen,
  onDismiss,
  projectBeingEdited,
  projectProfiles,
  setCitationToUse,
}) => {
  const { t } = useTranslation()
  const [editCitationValue, setEditCitationValue] = useState('')

  const isEditCitationValueDirty = citationToUse !== editCitationValue
  const isEditCitationValueDefined = !!editCitationValue?.trim()

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

  const otherProjectMembers = projectProfiles
    .filter((profile) => !profile.is_admin && profile.profile_name !== getPendingUserProfileName())
    .map((profile) => profile.profile_name)
  const otherProjectMembersString = otherProjectMembers.join(', ')

  const projectLastUpdatedString = new Date(updated_on).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const projectCountriesString = countries.join(', ')

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

  const citationPreview = editCitationValue?.trim() ? (
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
        <HelpTextWithIcon>{t('citation.copy_and_paste')}</HelpTextWithIcon>
        <ProjectInfoWrapper>
          <CitationDefinitionList>
            <dt>{t('projects.project_name')}</dt>
            <dd>{name}</dd>
            <dt>{t('projects.project_admin', { count: admins.length })}</dt>
            <dd>{adminsString}</dd>
            {otherProjectMembers.length ? (
              <>
                <dt>{t('projects.other_project_member', { count: otherProjectMembers.length })}</dt>
                <dd>{otherProjectMembersString}</dd>
              </>
            ) : null}

            <dt>{t('projects.project_last_updated')}</dt>
            <dd>{projectLastUpdatedString}</dd>
            {countries.length ? (
              <>
                <dt>{t('projects.country', { count: countries.length })}</dt>
                <dd>{projectCountriesString}</dd>
              </>
            ) : null}
          </CitationDefinitionList>
        </ProjectInfoWrapper>
      </CitationModalColumn>

      <CitationModalColumn>
        <form>
          <EditCitationLabelWrapper>
            <CitationLabel htmlFor="editCitation">{t('citation.edit_suggested')}</CitationLabel>
            <ButtonSecondarySmall type="button" onClick={applyDefaultCitation}>
              <IconRefresh /> {t('citation.use_default')}
            </ButtonSecondarySmall>
          </EditCitationLabelWrapper>

          <Textarea
            id="editCitation"
            value={editCitationValue}
            onChange={handleEditCitationChange}
          />
        </form>

        <CitationLabel>{t('citation.citation_preview')}</CitationLabel>
        <PNoMargins>{citationPreview}</PNoMargins>
      </CitationModalColumn>
    </MainContentWrapper>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary type="button" onClick={handleCancel}>
        {t('buttons.cancel')}
      </ButtonSecondary>
      <ButtonPrimary
        type="button"
        disabled={!isEditCitationValueDirty || !isEditCitationValueDefined}
        onClick={handleUpdateCitation}
      >
        {t('citation.update')}
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleCancel}
      title={t('citation.edit_suggested')}
      mainContent={mainContent}
      footerContent={footerContent}
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
