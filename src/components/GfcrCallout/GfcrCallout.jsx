import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonCaution, ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconCloseCircle, IconGfcr } from '../icons'
import theme from '../../theme'
import { useNavigate } from 'react-router-dom'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import Modal, { RightFooter } from '../generic/Modal'
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
      <ButtonSecondary onClick={onDismiss}>{t('buttons.cancel')}</ButtonSecondary>
      <ButtonCaution
        onClick={() => {
          disableGfcr()
          onDismiss()
        }}
      >
        {t('gfcr.buttons.disable_gfcr')}
      </ButtonCaution>
    </RightFooter>
  )

  const mainContent = (
    <Trans
      i18nKey="gfcr.disabled_gfcr_info"
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
      title={t('gfcr.buttons.disable_gfcr')}
      isOpen={isOpen}
      onDismiss={onDismiss}
      mainContent={mainContent}
      footerContent={footerContent}
    />
  )
}

const GfcrCallout = ({ isGfcr = false, isLoading = false, handleUpdateIncludesGfcr }) => {
  const navigate = useNavigate()
  const currentProjectPath = useCurrentProjectPath()
  const { t } = useTranslation()

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <StyledGfcrCallout>
        <h3>{t('gfcr.gfcr', { context: 'long' })}</h3>
        {isGfcr ? (
          <>
            <StyledParagraph>{t('gfcr.remove_gfcr_indicators')}</StyledParagraph>
            <StyledGfcrEnableButtonsContainer>
              <StyledButtonPrimary
                type="button"
                disabled={isLoading}
                onClick={() => navigate(`${currentProjectPath}/gfcr/`)}
              >
                <StyledIconGfcr inline={true} /> {t('gfcr.buttons.go_to_gfcr')}
              </StyledButtonPrimary>
              <StyledButtonSecondary
                type="button"
                disabled={isLoading}
                onClick={() => setIsModalOpen(true)}
              >
                <StyledIconCloseCircle inline={true} /> {t('gfcr.buttons.disable_gfcr')}
              </StyledButtonSecondary>
            </StyledGfcrEnableButtonsContainer>
          </>
        ) : (
          <>
            <StyledParagraph>{t('gfcr.add_gfcr_indicators')}</StyledParagraph>
            <StyledButtonPrimary
              type="button"
              disabled={isLoading}
              onClick={() => handleUpdateIncludesGfcr(true)}
            >
              <StyledIconGfcr /> {t('gfcr.buttons.enable_gfcr')}
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
