import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import styled, { css } from 'styled-components/macro'
import { IconClose } from '../../icons'
import theme from '../../../theme'
import { CloseButton } from '../buttons'
import { mediaQueryPhoneOnly } from '../../../library/styling/mediaQueries'
import { InputRow } from '../form'

const StyledDialogOverlay = styled('div')`
  background: rgba(0, 0, 0, 0.5);
  width: ${theme.spacing.fullViewportWidth};
  height: 100vh;
  right: 0;
  left: 0;
  bottom: 0;
  position: fixed;
  display: grid;
  place-items: center;
  grid-template-columns: 1fr;
  z-index: 103;
  cursor: default;
`
const StyledDialog = styled('div')`
  padding: 0;
  margin: 0;
  max-width: calc(100vw - 15rem);
  width: 100rem;
  background: ${theme.color.white};
`
const ModalTitle = styled.div`
  padding: ${theme.spacing.medium};
  display: grid;
  color: ${theme.color.primaryColor};
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
  ${(props) =>
    !props.contentOverflowIsvisible &&
    css`
      overflow: auto;
    `}
  max-height: 50vh;
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
const LeftFooter = styled('div')`
  justify-self: start;
`
const RightFooter = styled('div')`
  justify-self: end;
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

const Modal = ({
  title,
  mainContent,
  isOpen,
  onDismiss,
  footerContent,
  contentOverflowIsvisible,
  toolbarContent,
}) => {
  const _closeModalWithEscapeKey = useEffect(() => {
    const close = (event) => {
      if (event.code === 'Escape') {
        onDismiss()
      }
    }

    window.addEventListener('keydown', close)

    return () => window.removeEventListener('keydown', close)
  }, [onDismiss])

  return (
    isOpen && (
      <StyledDialogOverlay>
        <StyledDialog role="dialog" aria-labelledby="modal-title" aria-describedby="modal-content">
          <ModalTitle>
            <h2 id="modal-title">{title}</h2>
            <CloseButton type="button" className="close-button" onClick={onDismiss}>
              <IconClose aria-label="close" />
            </CloseButton>
          </ModalTitle>
          <ModalToolbar>{toolbarContent}</ModalToolbar>
          <ModalContent contentOverflowIsvisible={contentOverflowIsvisible} id="modal-content">
            {mainContent}
          </ModalContent>
          <ModalFooter>{footerContent}</ModalFooter>
        </StyledDialog>
      </StyledDialogOverlay>
    )
  )
}

Modal.propTypes = {
  footerContent: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  mainContent: PropTypes.node.isRequired,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  contentOverflowIsvisible: PropTypes.bool,
  toolbarContent: PropTypes.node,
}

Modal.defaultProps = {
  contentOverflowIsvisible: false,
  toolbarContent: undefined,
}

export default Modal
export { LeftFooter, RightFooter, StyledDialogOverlay, ModalContent, ModalInputRow }
