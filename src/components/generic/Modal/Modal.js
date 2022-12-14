import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import styled, { css } from 'styled-components/macro'
import { IconClose } from '../../icons'
import theme from '../../../theme'
import { CloseButton } from '../buttons'
import { mediaQueryPhoneOnly } from '../../../library/styling/mediaQueries'
import { InputRow } from '../form'
import { TableOverflowWrapper } from '../Table/table'

const StyledDialogOverlay = styled('div')`
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  display: grid;
  place-items: center;
  z-index: 103;
  cursor: default;
`
const StyledDialog = styled('div')`
  padding: 0;
  margin: 0;
  min-width: 30rem;
  width: calc(100vw - 4rem);
  max-width: 96rem;
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
  ${(props) =>
    !props.contentOverflowIsVisible &&
    css`
      overflow: auto;
    `}
  max-height: 80vh;
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

export const ModalTableOverflowWrapper = styled(TableOverflowWrapper)`
  max-width: 100%;
`
const Modal = ({
  title,
  mainContent,
  isOpen,
  onDismiss,
  footerContent,
  contentOverflowIsVisible,
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
          <ModalContent contentOverflowIsVisible={contentOverflowIsVisible} id="modal-content">
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
  contentOverflowIsVisible: PropTypes.bool,
  toolbarContent: PropTypes.node,
}

Modal.defaultProps = {
  contentOverflowIsVisible: false,
  toolbarContent: undefined,
}

export default Modal
export { LeftFooter, RightFooter, StyledDialogOverlay, ModalContent, ModalInputRow }
