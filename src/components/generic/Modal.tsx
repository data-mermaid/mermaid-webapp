import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { IconClose } from '../icons'
import theme from '../../theme'
import { CloseButton } from './buttons'
import { mediaQueryPhoneOnly } from '../../library/styling/mediaQueries'
import { InputRow } from './form'
import { TableOverflowWrapper } from './Table/table'
import { useTranslation } from 'react-i18next'

export const MODAL_CONTENT_HEIGHT = '80vh'

interface StyledDialogProps {
  maxWidth?: string
  padding?: string
}

const StyledDialogOverlay = styled('div')`
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  display: grid;
  place-items: center;
  z-index: ${theme.zIndex.modal};
`

const StyledDialog = styled('div')<StyledDialogProps>`
  padding: ${(props) => props.padding || '0'};
  margin: 0;
  min-width: 30rem;
  width: calc(100vw - 4rem);
  max-width: ${(props) =>
    props.maxWidth || '96rem'}; // Default to 96rem if maxWidth prop is not provided
  background: ${theme.color.white};
  max-height: 98vh;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
`
const ModalTitle = styled.div`
  padding: ${theme.spacing.medium};
  display: grid;
  color: ${theme.color.textColor};
  grid-template-columns: auto auto;

  h2 {
    justify-self: start;
    align-self: center;
    margin: 0;
  }

  button {
    align-self: top;
    justify-self: end;
  }
`

const ModalToolbar = styled.div`
  padding: 0 ${theme.spacing.medium};
`
const ModalContent = styled.div`
  overflow: auto;
  display: block;
  max-height: ${MODAL_CONTENT_HEIGHT};
  padding: ${theme.spacing.medium};
`
const ModalFooter = styled.div`
  padding: ${theme.spacing.medium};
  display: grid;
  grid-auto-columns: auto auto;
  background: ${theme.color.tableRowEven};

  ${mediaQueryPhoneOnly(css`
    > * {
      display: block;
      text-align: center;
    }

    * > button {
      margin-top: ${theme.spacing.buttonSpacing};
      margin-bottom: ${theme.spacing.buttonSpacing};
    }
  `)}
  * > button {
    svg {
      margin-right: ${theme.spacing.small};
    }

    &:not(:last-child) {
      margin-right: ${theme.spacing.buttonSpacing};
    }

    &:first-child {
      margin-left: 0;
    }
  }
`
const ModalLoadingIndicatorWrapper = styled('div')`
  position: static;
  width: 100%;
  padding: 5rem 0;

  .loadingWrapper {
    position: static;

    .objectWrapper {
      div {
        background-color: ${theme.color.background};
      }
    }

    .loadingPrimary {
      color: ${theme.color.background};
      width: auto;
      position: relative;
      top: -55%;
    }
  }
`
const LeftFooter = styled('div')`
  justify-self: start;
`
const RightFooter = styled('div')`
  justify-self: end;
  display: flex;
  gap: ${theme.spacing.buttonSpacing};
`

const ModalInputRow = styled(InputRow)`
  background: ${theme.color.white};
  color: ${theme.color.primaryColor};
  display: block;
  border: none;

  h4 {
    margin: 0;
  }

  label {
    font-weight: bold;
  }
`

export const ModalTableOverflowWrapper = styled(TableOverflowWrapper)`
  max-width: 100%;
`
const Modal = ({
  title,
  mainContent,
  isOpen,
  onDismiss,
  footerContent,
  toolbarContent = null,
  maxWidth = null,
  testId = '',
  maxWidth = null,
  padding = null,
  displayCloseIcon = true,
  allowCloseWithEscapeKey = true,
  contentOverflowStyle = null,
}) => {
  const { t } = useTranslation()
  const _closeModalWithEscapeKey = useEffect(() => {
    const close = (event) => {
      if (allowCloseWithEscapeKey && event.code === 'Escape') {
        onDismiss()
      }
    }

    window.addEventListener('keydown', close)

    return () => window.removeEventListener('keydown', close)
  }, [onDismiss, allowCloseWithEscapeKey])

  return (
    isOpen && (
      <StyledDialogOverlay aria-label={`${title} Modal`} data-testid={testId}>
        <StyledDialog
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-content"
          maxWidth={maxWidth}
          padding={padding}
        >
          <ModalTitle>
            <h2 id="modal-title">{title}</h2>
            {displayCloseIcon && (
              <CloseButton type="button" className="close-button" onClick={onDismiss}>
                <IconClose aria-label={t('buttons.close')} />
              </CloseButton>
            )}
          </ModalTitle>
          <ModalToolbar>{toolbarContent}</ModalToolbar>
          <ModalContent id="modal-content" style={{ overflow: contentOverflowStyle ?? 'auto' }}>
            {mainContent}
          </ModalContent>
          <ModalFooter>{footerContent}</ModalFooter>
        </StyledDialog>
      </StyledDialogOverlay>
    )
  )
}

Modal.propTypes = {
  allowCloseWithEscapeKey: PropTypes.bool,
  footerContent: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  mainContent: PropTypes.node.isRequired,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  toolbarContent: PropTypes.node,
  maxWidth: PropTypes.string,
  testId: PropTypes.string,
  padding: PropTypes.string,
  displayCloseIcon: PropTypes.bool,
  contentOverflowStyle: PropTypes.string,
}

export default Modal
export {
  ModalLoadingIndicatorWrapper,
  LeftFooter,
  RightFooter,
  StyledDialogOverlay,
  ModalContent,
  ModalInputRow,
}
