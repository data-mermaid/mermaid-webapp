import React, { useState } from 'react'

import Modal from './Modal'

export default {
  title: 'Modal',
  component: Modal,
}
export const Basic = () => {
  const [isOpen, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  return (
    <>
      <button type="button" onClick={open}>
        Open Dialog
      </button>
      <Modal isOpen={isOpen} onDismiss={close}>
        inner content
      </Modal>
    </>
  )
}
