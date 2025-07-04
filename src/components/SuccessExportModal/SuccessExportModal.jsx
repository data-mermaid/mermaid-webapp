import React from 'react'
import PropTypes from 'prop-types'
import theme from '../../theme'
import styled from 'styled-components'
import { Trans, useTranslation } from 'react-i18next'
import { useCurrentUser } from '../../App/CurrentUserContext'
import Modal, { RightFooter } from '../generic/Modal'
import { ButtonSecondary } from '../generic/buttons'

const CitationContainer = styled.div`
  background-color: ${theme.color.grey1};
  padding: 0.1rem 2rem;
  margin-bottom: 1rem;
`

const SuccessExportModal = ({ isOpen, onDismiss, protocolSampleEventCount }) => {
  const { t } = useTranslation()
  const { currentUser } = useCurrentUser()

  const MainContent = (
    <>
      <Trans
        i18nKey="exports.email_sent"
        components={{ currentUserEmail: <strong>{currentUser?.email}</strong> }}
      />
      <CitationContainer>
        <h4>{t('exports.included_in_export')}</h4>
        <ul>
          <li>{t('exports.project_metadata')}</li>
          <li>
            {t('exports.sample_event_level_data', {
              count: protocolSampleEventCount,
            })}
          </li>
          <li>
            {t('exports.observation_level_data', {
              count: protocolSampleEventCount,
            })}{' '}
          </li>
        </ul>
      </CitationContainer>
      <CitationContainer>
        <h4>{t('exports.credit_request')}</h4>
        <p>{t('exports.citation_description')}</p>
      </CitationContainer>
    </>
  )

  const FooterContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('buttons.done')}</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={t('exports.success')}
      mainContent={MainContent}
      footerContent={FooterContent}
    />
  )
}

SuccessExportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  protocolSampleEventCount: PropTypes.number.isRequired,
}

export default SuccessExportModal
