import React, { useState } from 'react'
import { ButtonSecondary } from '../buttons'
import { RowSpaceBetween, RowLeft } from '../positioning'

import Modal, { ModalRightAlignedButtonSpacing } from './Modal'

export default {
  title: 'Modal',
  component: Modal,
}
export const Basic = () => {
  const [isOpen, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const mainContent = <>main content</>
  const bottomRowContent = (
    <>
      <ModalRightAlignedButtonSpacing>
        <ButtonSecondary type="button">some button</ButtonSecondary>
        <ButtonSecondary type="button">some other button</ButtonSecondary>
      </ModalRightAlignedButtonSpacing>
    </>
  )

  return (
    <>
      <ButtonSecondary type="button" onClick={open}>
        Open Dialog
      </ButtonSecondary>
      <Modal
        isOpen={isOpen}
        onDismiss={close}
        title="I'm a title"
        mainContent={mainContent}
        bottomRowContent={bottomRowContent}
      />
    </>
  )
}

export const MultipleButtons = () => {
  const [isOpen, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const mainContent = <>main content</>
  const bottomRowContent = (
    <RowSpaceBetween>
      <RowLeft>
        <ButtonSecondary type="button">button 1</ButtonSecondary>
      </RowLeft>
      <ModalRightAlignedButtonSpacing>
        <ButtonSecondary type="button">button 2</ButtonSecondary>
        <ButtonSecondary type="button">button 3</ButtonSecondary>
      </ModalRightAlignedButtonSpacing>
    </RowSpaceBetween>
  )

  return (
    <>
      <ButtonSecondary type="button" onClick={open}>
        Open Dialog
      </ButtonSecondary>
      <Modal
        isOpen={isOpen}
        onDismiss={close}
        title="I'm a title"
        mainContent={mainContent}
        bottomRowContent={bottomRowContent}
      />
    </>
  )
}
