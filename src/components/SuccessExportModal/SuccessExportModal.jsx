import React from 'react'
import PropTypes from 'prop-types'
import theme from '../../theme'
import styled from 'styled-components'
import { Trans, useTranslation } from 'react-i18next'
import { useCurrentUser } from '../../App/CurrentUserContext'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { ButtonSecondary } from '../generic/buttons'

const CitationContainer = styled.div`
  background-color: ${theme.color.grey1};
  padding: 0.1rem 2rem;
  margin-bottom: 1rem;
`

const SuccessExportModal = ({ isOpen, onDismiss, protocolSampleEventCount }) => {
  const { t } = useTranslation()
  const { currentUser } = useCurrentUser()

  const modalContent = (
    <>
      <Trans
        i18nKey="modals.export_success.description"
        components={{ currentUserEmail: <strong>{currentUser?.email}</strong> }}
      />
      <CitationContainer>
        <h4>{t('modals.export_success.citation_1_header')}</h4>
        <ul>
          <li>{t('modals.export_success.metadata_export')}</li>
          <li>
            {t('modals.export_success.sample_event_level_export', {
              count: protocolSampleEventCount,
            })}{' '}
          </li>
          <li>
            {t('modals.export_success.observation_level_export', {
              count: protocolSampleEventCount,
            })}{' '}
          </li>
        </ul>
      </CitationContainer>
      <CitationContainer>
        <h4>{t('modals.export_success.citation_2_header')}</h4>
        <p>{t('modals.export_success.citation_2_description')}</p>
      </CitationContainer>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('buttons.done')}</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={t('modals.export_success.title')}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

SuccessExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  protocolSampleEventCount: PropTypes.number.isRequired,
}

export default SuccessExportModal
