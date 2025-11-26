import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal'
import InlineMessage from '../generic/InlineMessage'
import theme from '../../theme'

const InlineFlex = styled('div')`
  display: inline-flex;
  margin-bottom: ${theme.spacing.small};
  align-items: center;
`

const RemoveUserModal = ({
  isOpen,
  onDismiss,
  onSubmit,
  userNameToBeRemoved = 'user',
  projectName,
  isLoading,
}) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)

  const goToPageOne = () => {
    setCurrentPage(1)
  }
  const goToPageTwo = () => {
    setCurrentPage(2)
  }

  const closeModal = () => {
    goToPageOne()
    onDismiss()
  }

  const handleOnSubmit = () => {
    onSubmit().then(() => {
      closeModal()
    })
  }

  const title = {
    1: t('users.delete_unsynced_sample_units'),
    2: t('users.remove_user_from_project'),
  }

  const mainContentPageOne = (
    <InlineFlex>
      <InlineMessage type="warning">
        <p
          dangerouslySetInnerHTML={{
            __html: t('users.delete_unsynced_warning', {
              userName: userNameToBeRemoved,
            }),
          }}
        />
      </InlineMessage>
    </InlineFlex>
  )

  const mainContentPageTwo = (
    <p
      dangerouslySetInnerHTML={{
        __html: t('users.remove_user_warning', {
          userName: userNameToBeRemoved,
          projectName: projectName,
        }),
      }}
    />
  )

  const mainContent = (
    <>
      {currentPage === 1 && mainContentPageOne}
      {currentPage === 2 && mainContentPageTwo}
    </>
  )

  const cancelButton = <ButtonSecondary onClick={closeModal}>{t('buttons.cancel')}</ButtonSecondary>

  const footerContentPageOne = (
    <RightFooter>
      {cancelButton}
      <ButtonCaution onClick={goToPageTwo} disabled={isLoading}>
        {t('users.delete_unsynced_sample_units')}
      </ButtonCaution>
    </RightFooter>
  )

  const footerContentPageTwo = (
    <RightFooter>
      {cancelButton}
      <ButtonCaution onClick={handleOnSubmit}>{t('users.remove_user')}</ButtonCaution>
    </RightFooter>
  )

  const footerContent = (
    <>
      {currentPage === 1 && footerContentPageOne}
      {currentPage === 2 && footerContentPageTwo}
    </>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={closeModal}
      title={title[currentPage]}
      mainContent={mainContent}
      footerContent={footerContent}
    />
  )
}

RemoveUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  userNameToBeRemoved: PropTypes.string,
  projectName: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default RemoveUserModal
