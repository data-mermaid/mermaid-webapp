import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonCaution, ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { IconCloseCircle, IconGfcr } from '../icons'
import language from '../../language'
import theme from '../../theme'
import { useNavigate } from 'react-router-dom'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { useCurrentUser } from '../../App/CurrentUserContext'
import { useExploreLaunchFeature } from '../../library/useExploreLaunchFeature'

const { gfcrCallout: gfcrCalloutLanguage } = language.pages.projectInfo

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

const DisableIndicatorsModal = ({
  isOpen = false,
  disableGfcr,
  onDismiss,
  mermaidExploreLink,
  isExploreLaunchEnabledForUser,
}) => {
  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{'Cancel'}</ButtonSecondary>
      <ButtonCaution
        onClick={() => {
          disableGfcr()
          onDismiss()
        }}
      >
        {gfcrCalloutLanguage.disableButton}
      </ButtonCaution>
    </RightFooter>
  )

  const content = (
    <>
      Disabling GFCR Indicators for this project will not delete them, but just hide them from the{' '}
      <a href={mermaidExploreLink} target="_blank" rel="noreferrer">
        {isExploreLaunchEnabledForUser ? 'MERMAID Explore' : 'Global Dashboard'}
      </a>
      . No data will be lost. You can re-enable them at any time.
    </>
  )

  return (
    <Modal
      title={gfcrCalloutLanguage.disableButton}
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
  const { mermaidExploreLink, isExploreLaunchEnabledForUser } = useExploreLaunchFeature({
    currentUser,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <StyledGfcrCallout>
        <h3>{gfcrCalloutLanguage.calloutHeading}</h3>
        {isGfcr ? (
          <>
            <StyledParagraph>{gfcrCalloutLanguage.removeParagraph}</StyledParagraph>
            <StyledGfcrEnableButtonsContainer>
              <StyledButtonPrimary
                type="button"
                disabled={isLoading}
                onClick={() => navigate(`${currentProjectPath}/gfcr/`)}
              >
                <StyledIconGfcr inline={true} /> {gfcrCalloutLanguage.goToButton}
              </StyledButtonPrimary>
              <StyledButtonSecondary
                type="button"
                disabled={isLoading}
                onClick={() => setIsModalOpen(true)}
              >
                <StyledIconCloseCircle inline={true} /> {gfcrCalloutLanguage.disableButton}
              </StyledButtonSecondary>
            </StyledGfcrEnableButtonsContainer>
          </>
        ) : (
          <>
            <StyledParagraph>{gfcrCalloutLanguage.addParagraph}</StyledParagraph>
            <StyledButtonPrimary
              type="button"
              disabled={isLoading}
              onClick={() => handleUpdateIncludesGfcr(true)}
            >
              <StyledIconGfcr /> {gfcrCalloutLanguage.enableButton}
            </StyledButtonPrimary>
          </>
        )}
      </StyledGfcrCallout>
      <DisableIndicatorsModal
        isOpen={isModalOpen}
        disableGfcr={() => handleUpdateIncludesGfcr(false)}
        onDismiss={() => setIsModalOpen(false)}
        mermaidExploreLink={mermaidExploreLink}
        isExploreLaunchEnabledForUser={isExploreLaunchEnabledForUser}
      />
    </>
  )
}

DisableIndicatorsModal.propTypes = {
  isOpen: PropTypes.bool,
  disableGfcr: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  mermaidExploreLink: PropTypes.string.isRequired,
  isExploreLaunchEnabledForUser: PropTypes.bool.isRequired,
}

GfcrCallout.propTypes = {
  isGfcr: PropTypes.bool,
  isLoading: PropTypes.bool,
  handleUpdateIncludesGfcr: PropTypes.func.isRequired,
}

export default GfcrCallout
