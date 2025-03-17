import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import language from '../../language'
import { IconArrowRightCircle } from '../icons'
import { Select } from '../generic/form'
import { Column } from '../generic/positioning'
import InlineMessage from '../generic/InlineMessage'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { pluralize } from '../../library/strings/pluralize'
import { getProfileNameOrEmailForPendingUser } from '../../library/getProfileNameOrEmailForPendingUser'
import theme from '../../theme'
import { getIsProjectProfileReadOnly } from '../../App/currentUserProfileHelpers'

const ModalBoxItem = styled(Column)`
  width: 100%;
`

const ModalBodyContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.1fr 1fr;
  gap: 2rem;
  justify-items: center;
  align-items: center;
  svg {
    width: 4rem;
    height: 4rem;
  }
`

const InlineFlex = styled('div')`
  display: inline-flex;
  margin-bottom: ${theme.spacing.small};
`

const TransferSampleUnitsModal = ({
  isOpen,
  onDismiss,
  currentUserId,
  fromUser,
  userOptions,
  showRemoveUserWithActiveSampleUnitsWarning,
  handleTransferSampleUnitChange,
  onSubmit,
}) => {
  const initialToUserIdInTransferModal = fromUser.profile === currentUserId ? '' : currentUserId
  const sampleUnitMsg = pluralize(fromUser.num_active_sample_units, 'sample unit', 'sample units')
  const [isInitialToUserIdEmpty, setInitialIsToUserIdEmpty] = useState()

  const _checkTransferButtonDisabledWhenModalOpen = useEffect(() => {
    if (fromUser.profile === currentUserId) {
      setInitialIsToUserIdEmpty(true)
    } else {
      setInitialIsToUserIdEmpty(false)
    }
  }, [fromUser, currentUserId])

  const optionList = userOptions
    .filter((projectProfile) => {
      const isProjectProfileReadOnly = getIsProjectProfileReadOnly(projectProfile)
      const isProjectProfileCurrentUser = projectProfile.profile === fromUser.profile

      return !isProjectProfileCurrentUser && !isProjectProfileReadOnly
    })
    .map((user) => {
      const profileName = getProfileNameOrEmailForPendingUser(user)

      return (
        <option key={user.profile} value={user.profile}>
          {profileName}
        </option>
      )
    })

  const handleOnSubmit = () => {
    onSubmit().then(() => {
      onDismiss()
      handleTransferSampleUnitChange(currentUserId)
    })
  }

  const modalContent = (
    <>
      {showRemoveUserWithActiveSampleUnitsWarning && (
        <InlineFlex>
          <InlineMessage type="warning">
            <p>{language.pages.userTable.warningTransferSampleUnits}</p>
          </InlineMessage>
        </InlineFlex>
      )}
      <form>
        <ModalBodyContainer>
          <ModalBoxItem>
            <p>
              Transfer {fromUser.num_active_sample_units} unsubmitted {sampleUnitMsg} from{' '}
              <strong>{getProfileNameOrEmailForPendingUser(fromUser)}</strong>
            </p>
          </ModalBoxItem>
          <IconArrowRightCircle />
          <ModalBoxItem>
            <label id="modal-transfer-units-to-label" htmlFor="modal-transfer-units-to">
              Transfer sample units to:
              <Select
                id="modal-transfer-units-to"
                defaultValue={initialToUserIdInTransferModal}
                onChange={(event) => {
                  handleTransferSampleUnitChange(event.target.value)
                  setInitialIsToUserIdEmpty(false)
                }}
              >
                <option value="" disabled>
                  {language.placeholders.select}
                </option>
                {optionList}
              </Select>
            </label>
          </ModalBoxItem>
        </ModalBodyContainer>
      </form>
    </>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonPrimary onClick={handleOnSubmit} disabled={isInitialToUserIdEmpty}>
        Transfer Sample Units
      </ButtonPrimary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={language.pages.userTable.transferSampleUnitsModalTitle}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

TransferSampleUnitsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired,
  fromUser: PropTypes.shape({
    profile: PropTypes.string,
    profile_name: PropTypes.string,
    email: PropTypes.string,
    num_active_sample_units: PropTypes.number,
  }).isRequired,
  showRemoveUserWithActiveSampleUnitsWarning: PropTypes.bool.isRequired,
  userOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      profile_name: PropTypes.string,
    }),
  ).isRequired,
  handleTransferSampleUnitChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default TransferSampleUnitsModal
