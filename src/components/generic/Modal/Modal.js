import Dialog from '@reach/dialog'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'
import '@reach/dialog/styles.css'

import { IconClose } from '../../icons'

import { RowRight, RowSpaceBetween } from '../positioning'
import theme from '../../../theme'

const StyledDialog = styled(Dialog)`
  margin-top: 40vh;
`
const TitleStyling = styled.span``

const ModalRightAlignedButtonSpacing = styled(RowRight)`
  & > button {
    margin-left: ${theme.spacing.small};
  }
`

const Modal = ({ title, mainContent, isOpen, onDismiss, bottomRowContent }) => {
  return (
    isOpen && (
      <StyledDialog onDismiss={onDismiss} aria-labelledby="dialog-content">
        <div id="dialog-content">
          <RowSpaceBetween>
            <TitleStyling>{title}</TitleStyling>
            <button type="button" className="close-button" onClick={onDismiss}>
              <IconClose aria-label="close" />
            </button>
          </RowSpaceBetween>
          {mainContent}
          <RowRight>{bottomRowContent}</RowRight>
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
export { ModalRightAlignedButtonSpacing }
