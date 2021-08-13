import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ButtonPrimary, ButtonSecondary } from '../generic/buttons'
import { currentUserPropType } from '../../App/mermaidData/mermaidDataProptypes'
import language from '../../language'
import { IconArrowRight } from '../icons'
import { Select } from '../generic/form'
import { Column } from '../generic/positioning'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal/Modal'

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
  currentUser,
  userTransferFrom,
  userOptions,
}) => {
  const currentUserName = currentUser && currentUser.full_name

  const optionList = userOptions
    .filter(({ profile_name }) => profile_name !== userTransferFrom)
    .map((user) => (
      <option key={user.id} value={user.profile_name}>
        {user.profile_name}
      </option>
    ))

  const modalContent = (
    <ModalBodyContainer>
      <ModalBoxItem>
        <InputLabel
          id="modal-transfer-units-from-label"
          htmlFor="modal-transfer-units-from"
        >
          Transfer unsubmitted Sample Unit from:
        </InputLabel>
        <strong>{userTransferFrom}</strong>
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
            aria-labelledby="aria-label-select-users"
            aria-describedby="aria-descp-select-users"
            value={currentUserName}
            onChange={() => {}}
          >
            <option value="" disabled>
              Choose...
            </option>
            {optionList}
          </Select>
        </div>
      </ModalBoxItem>
    </ModalBodyContainer>
  )

  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Cancel</ButtonSecondary>
      <ButtonPrimary onClick={onDismiss}>Transfer Sample Units</ButtonPrimary>
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
  currentUser: currentUserPropType,
  userTransferFrom: PropTypes.string.isRequired,
  userOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      profile_name: PropTypes.string,
    }),
  ).isRequired,
}

TransferSampleUnitsModal.defaultProps = {
  currentUser: undefined,
}

export default TransferSampleUnitsModal
