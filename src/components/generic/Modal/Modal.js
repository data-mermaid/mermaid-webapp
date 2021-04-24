import Dialog from '@reach/dialog'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components/macro'

import { IconClose } from '../../icons'

import '@reach/dialog/styles.css'

const StyledDialog = styled(Dialog)`
  margin-top: 40vh;
`

const Modal = ({ children, isOpen, onDismiss }) => {
  return (
    isOpen && (
      <StyledDialog onDismiss={onDismiss} aria-labelledby="dialog-content">
        <button type="button" className="close-button" onClick={onDismiss}>
          <IconClose aria-label="close" />
        </button>
        <div id="dialog-content">{children}</div>
      </StyledDialog>
    )
  )
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onDismiss: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default Modal
