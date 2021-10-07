import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import language from '../../language'
import { IconArrowRight } from '../icons'
import { Select } from '../generic/form'
import { Column } from '../generic/positioning'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import { pluralize } from '../../library/strings/pluralize'
import { getProfileNameOrEmailForPendingUser } from '../../library/getProfileNameOrEmailForPendingUser'

const ModalBoxItem = styled(Column)`
  background: ${theme.color.secondaryColor};
  border: none;
  padding: 20px;
`

const InputLabel = styled.label`
  margin-bottom: 10px;
`

const ModalBodyContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  padding: 0 20px;
  svg {
    width: 6rem;
    height: 6rem;
  }
`

const TransferSampleUnitsModal = ({
  isOpen,
  onDismiss,
  currentUserId,
  fromUser,
  userOptions,
  handleTransferSampleUnitChange,
  onSubmit,
}) => {
  const initialToUserIdInTransferModal =
    fromUser.profile === currentUserId ? '' : currentUserId
  const sampleUnitMsg = pluralize(
    fromUser.num_active_sample_units,
    'sample unit',
    'sample units',
  )
  const [isInitialToUserIdEmpty, setInitialIsToUserIdEmpty] = useState()

  const _checkTransferButtonDisabledWhenModalOpen = useEffect(() => {
    if (fromUser.profile === currentUserId) {
      setInitialIsToUserIdEmpty(true)
    } else {
      setInitialIsToUserIdEmpty(false)
    }
  }, [fromUser, currentUserId])

  const optionList = userOptions
    .filter(({ profile }) => profile !== fromUser.profile)
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
    <form>
      <ModalBodyContainer>
        <ModalBoxItem>
          <InputLabel as="div">
            Transfer {fromUser.num_active_sample_units} unsubmitted{' '}
            {sampleUnitMsg} from:
          </InputLabel>
          <strong>{getProfileNameOrEmailForPendingUser(fromUser)}</strong>
        </ModalBoxItem>
        <IconArrowRight />
        <ModalBoxItem>
          <InputLabel
            id="modal-transfer-units-to-label"
            htmlFor="modal-transfer-units-to"
          >
            Transfer sample units to
          </InputLabel>
          <div>
            <Select
              id="modal-transfer-units-to"
              aria-labelledby="aria-label-select-users"
              aria-describedby="aria-descp-select-users"
              defaultValue={initialToUserIdInTransferModal}
              onChange={(event) => {
                handleTransferSampleUnitChange(event.target.value)
                setInitialIsToUserIdEmpty(false)
              }}
            >
              <option value="" disabled>
                Choose...
              </option>
              {optionList}
            </Select>
          </div>
        </ModalBoxItem>
      </ModalBodyContainer>
    </form>
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
