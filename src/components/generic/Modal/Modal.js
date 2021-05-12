import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components/macro'
import { IconClose } from '../../icons'
import theme from '../../../theme'
import {
  hoverState,
  mediaQueryPhoneOnly,
} from '../../../library/styling/mediaQueries'

const StyledDialogOverlay = styled('div')`
  background: rgba(0, 0, 0, 0.5);
  width: ${theme.spacing.fullViewportWidth};
  height: 100vh;
  right: 0;
  left: 0;
  bottom: 0;
  position: fixed;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 10001;
`
const StyledDialog = styled('div')`
  padding: 0;
  margin: 0;
  align-self: center;
  justify-self: center;
  max-width: calc(100vw - ${theme.spacing.medium});
  width: 900px;
  background: ${theme.color.white};
`
const ModalTitle = styled.div`
  padding: ${theme.spacing.medium};
  display: grid;
  grid-template-columns: auto auto;
  h2 {
    justify-self: start;
    align-self: center;
    margin: 0;
  }
  button {
    border-radius: 100%;
    background: transparent;
    border: none;
    padding: 0;
    line-height: 0;
    width: 4rem;
    height: 4rem;
    align-self: top;
    justify-self: end;
    transition: ${theme.timing.hoverTransition};
    ${hoverState(css`
      background: ${theme.color.secondaryHover};
    `)}
  }
`
const ModalContent = styled.div`
  padding: ${theme.spacing.medium};
`
const ModalFooter = styled.div`
  padding: ${theme.spacing.medium};
  display: grid;
  grid-auto-columns: auto auto;
  ${mediaQueryPhoneOnly(css`
    > * {
      display: block;
      text-align: center;
    }
    * > button {
      margin-top: ${theme.spacing.small};
      margin-bottom: ${theme.spacing.small};
    }
  `)}
  * > button {
    &:not(:last-child) {
      margin-right: ${theme.spacing.small};
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

const Modal = ({ title, mainContent, isOpen, onDismiss, footerContent }) => {
  return (
    isOpen && (
      <StyledDialogOverlay>
        <StyledDialog
          // id="dialog-content"
          onDismiss={onDismiss}
          aria-labelledby="dialog-content"
        >
          <ModalTitle>
            <h2>{title}</h2>
            <button type="button" className="close-button" onClick={onDismiss}>
              <IconClose aria-label="close" />
            </button>
          </ModalTitle>
          <ModalContent>{mainContent}</ModalContent>
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
}

export default Modal
export { LeftFooter, RightFooter }
