import Dialog from '@reach/dialog'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components/macro'
import '@reach/dialog/styles.css'
import { IconClose } from '../../icons'
import theme from '../../../theme'
import {
  hoverState,
  mediaQueryPhoneOnly,
} from '../../../library/styling/mediaQueries'

const StyledDialog = styled(Dialog)`
  padding: 0;
  max-width: calc(100% - 1em);
  width: 900px;
  background: ${theme.color.white};
`
const TitleStyling = styled.div`
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
const ModalActions = styled.div`
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

const Modal = ({ title, mainContent, isOpen, onDismiss, bottomRowContent }) => {
  return (
    isOpen && (
      <StyledDialog onDismiss={onDismiss} aria-labelledby="dialog-content">
        <div id="dialog-content">
          <TitleStyling>
            <h2>{title}</h2>
            <button type="button" className="close-button" onClick={onDismiss}>
              <IconClose aria-label="close" />
            </button>
          </TitleStyling>
          <ModalContent>{mainContent}</ModalContent>
          <ModalActions>{bottomRowContent}</ModalActions>
        </div>
      </StyledDialog>
    )
  )
}

Modal.propTypes = {
  bottomRowContent: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  mainContent: PropTypes.node.isRequired,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default Modal
export { LeftFooter, RightFooter }
