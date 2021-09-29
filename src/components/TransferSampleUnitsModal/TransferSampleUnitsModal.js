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
  toUserProfileId,
  fromUser,
  userOptions,
  handleTransferSampleUnitChange,
  onSubmit,
}) => {
  const optionList = userOptions
    .filter(({ profile }) => profile !== fromUser.profileId)
    .map(({ profile, profile_name }) => (
      <option key={profile} value={profile}>
        {profile_name}
      </option>
    ))

  const handleOnSubmit = () => {
    onSubmit().then(() => {
      onDismiss()
    })
  }

  const modalContent = (
    <form>
      <ModalBodyContainer>
        <ModalBoxItem>
          <InputLabel as="div">
            Transfer unsubmitted Sample Unit from:
          </InputLabel>
          <strong>{fromUser.profileName}</strong>
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
              value={toUserProfileId}
              onChange={(event) =>
                handleTransferSampleUnitChange(event.target.value)
              }
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
      <ButtonPrimary onClick={handleOnSubmit}>
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
  toUserProfileId: PropTypes.string,
  fromUser: PropTypes.shape({
    profileId: PropTypes.string,
    profileName: PropTypes.string,
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

TransferSampleUnitsModal.defaultProps = {
  toUserProfileId: undefined,
}

export default TransferSampleUnitsModal
