import React, { useState } from 'react'
import { ButtonCallout, ButtonCaution, ButtonPrimary, ButtonSecondary } from '../buttons'
import { RowSpaceBetween } from '../positioning'

import Modal, { LeftFooter, RightFooter } from './Modal'

export default {
  title: 'Modal',
  component: Modal,
}
export const OneButton = () => {
  const [isOpen, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const mainContent = <>main content</>
  const footerContent = (
    <>
      <RightFooter>
        <ButtonPrimary type="button">one button</ButtonPrimary>
      </RightFooter>
    </>
  )

  return (
    <>
      <ButtonSecondary type="button" onClick={open}>
        Open one button Dialog
      </ButtonSecondary>
      <Modal
        isOpen={isOpen}
        onDismiss={close}
        title="I'm a title"
        mainContent={mainContent}
        footerContent={footerContent}
      />
    </>
  )
}

export const Basic = () => {
  const [isOpen, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const mainContent = <p>Send a message to your pal!</p>
  const footerContent = (
    <>
      <RightFooter>
        <ButtonSecondary type="button">Cancel</ButtonSecondary>
        <ButtonPrimary type="button">Send Message</ButtonPrimary>
      </RightFooter>
    </>
  )

  return (
    <>
      <ButtonSecondary type="button" onClick={open}>
        Long Title
      </ButtonSecondary>
      <Modal
        isOpen={isOpen}
        onDismiss={close}
        title="I'm a long title. Here I go being really really long. I can't stop!"
        mainContent={mainContent}
        footerContent={footerContent}
      />
    </>
  )
}

export const MultipleButtons = () => {
  const [isOpen, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const mainContent = <p>If you have this many buttons in a modal, you probably need a redesign.</p>
  const footerContent = (
    <RowSpaceBetween>
      <LeftFooter>
        <ButtonCallout type="button">LOOK!</ButtonCallout>
        <ButtonSecondary type="button">button 2</ButtonSecondary>
      </LeftFooter>
      <RightFooter>
        <ButtonSecondary type="button">btn 3</ButtonSecondary>
        <ButtonSecondary type="button">btn 4</ButtonSecondary>
        <ButtonCaution type="button">Delete it</ButtonCaution>
        <ButtonPrimary type="button">Submit</ButtonPrimary>
      </RightFooter>
    </RowSpaceBetween>
  )

  return (
    <>
      <ButtonSecondary type="button" onClick={open}>
        So many buttons
      </ButtonSecondary>
      <Modal
        isOpen={isOpen}
        onDismiss={close}
        title="I'm a title"
        mainContent={mainContent}
        footerContent={footerContent}
      />
    </>
  )
}

export const ButtonsAndText = () => {
  const [isOpen, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const mainContent = (
    <>
      <strong>MAIN CONTENT</strong>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
      </p>
      <hr />
      <p>One more thing, here are some words after a break.</p>
    </>
  )

  const footerContent = (
    <RowSpaceBetween>
      <LeftFooter>
        <p>Clicking buttons does stuff</p>
      </LeftFooter>
      <RightFooter>
        <ButtonSecondary type="button">button 2</ButtonSecondary>
        <ButtonSecondary type="button">button 3</ButtonSecondary>
      </RightFooter>
    </RowSpaceBetween>
  )

  return (
    <>
      <ButtonSecondary type="button" onClick={open}>
        Lots of content
      </ButtonSecondary>
      <Modal
        isOpen={isOpen}
        onDismiss={close}
        title="I'm a title"
        mainContent={mainContent}
        footerContent={footerContent}
      />
    </>
  )
}
