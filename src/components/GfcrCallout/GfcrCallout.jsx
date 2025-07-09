import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonCaution, ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconCloseCircle, IconGfcr } from '../icons'
import theme from '../../theme'
import { useNavigate } from 'react-router-dom'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import Modal, { RightFooter } from '../generic/Modal'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { Trans, useTranslation } from 'react-i18next'

const StyledGfcrCallout = styled('div')`
  padding: 10px;
  margin-bottom: 1em;
  background-color: ${theme.color.grey5};
`

const StyledGfcrEnableButtonsContainer = styled('div')`
  display: flex;
  gap: 2rem;
`

const buttonStyle = `
  display: flex;
  align-items: center;
  padding: 1rem;
`

const iconStyle = `
  height: 2rem;
  width: 2rem;
  margin-right: 1rem;
`

const StyledButtonPrimary = styled(ButtonPrimary)`
  ${buttonStyle}
`

const StyledButtonSecondary = styled(ButtonSecondary)`
  ${buttonStyle}
`

const StyledIconCloseCircle = styled(IconCloseCircle)`
  ${iconStyle}
`

const StyledIconGfcr = styled(IconGfcr)`
  ${iconStyle}
`

const StyledParagraph = styled('p')`
  max-width: ${theme.spacing.maxTextWidth};
`

const DisableIndicatorsModal = ({ isOpen = false, disableGfcr, onDismiss }) => {
  const { t } = useTranslation()

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('cancel')}</ButtonSecondary>
      <ButtonCaution
        onClick={() => {
          disableGfcr()
          onDismiss()
        }}
      >
        {t('disable_gfcr')}
      </ButtonCaution>
    </RightFooter>
  )

  const mainContent = (
    <Trans
      i18nKey="disabled_gfcr_info"
      components={{
        a: (
          <a
            href={import.meta.env.VITE_MERMAID_EXPLORE_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            MERMAID Explore
          </a>
        ),
      }}
    />
  )

  return (
    <Modal
      title={t('disable_gfcr')}
      isOpen={isOpen}
      onDismiss={onDismiss}
      mainContent={content}
      footerContent={footerContent}
    />
  )
}

const GfcrCallout = ({ isGfcr = false, isLoading = false, handleUpdateIncludesGfcr }) => {
  const navigate = useNavigate()
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()
  const { t } = useTranslation()

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <StyledGfcrCallout>
        <h3>{t('titles.gfcr')}</h3>
        {isGfcr ? (
          <>
            <StyledParagraph>{t('remove_gfcr_Indicators')}</StyledParagraph>
            <StyledGfcrEnableButtonsContainer>
              <StyledButtonPrimary
                type="button"
                disabled={isLoading}
                onClick={() => navigate(`${currentProjectPath}/gfcr/`)}
              >
                <StyledIconGfcr inline={true} /> {t('go_to_gfcr')}
              </StyledButtonPrimary>
              <StyledButtonSecondary
                type="button"
                disabled={isLoading}
                onClick={() => setIsModalOpen(true)}
              >
                <StyledIconCloseCircle inline={true} /> {t('disable_gfcr')}
              </StyledButtonSecondary>
            </StyledGfcrEnableButtonsContainer>
          </>
        ) : (
          <>
            <StyledParagraph>{t('add_gfcr_indicators')}</StyledParagraph>
            <StyledButtonPrimary
              type="button"
              disabled={isLoading}
              onClick={() => handleUpdateIncludesGfcr(true)}
            >
              <StyledIconGfcr /> {t('enable_gfcr')}
            </StyledButtonPrimary>
          </>
        )}
      </StyledGfcrCallout>
      <DisableIndicatorsModal
        isOpen={isModalOpen}
        disableGfcr={() => handleUpdateIncludesGfcr(false)}
        onDismiss={() => setIsModalOpen(false)}
      />
    </>
  )
}

DisableIndicatorsModal.propTypes = {
  isOpen: PropTypes.bool,
  disableGfcr: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

GfcrCallout.propTypes = {
  isGfcr: PropTypes.bool,
  isLoading: PropTypes.bool,
  handleUpdateIncludesGfcr: PropTypes.func.isRequired,
}

export default GfcrCallout
