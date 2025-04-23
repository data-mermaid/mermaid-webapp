import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { ButtonSecondary } from '../generic/buttons'
import { IconCheck, IconClose } from '../icons'
import { Table, Td, Tr, TableOverflowWrapper } from '../generic/Table/table'
import language from '../../language'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal/Modal'

const Thead = styled.th`
  text-align: center;
  background-color: ${theme.color.primaryColor};
  color: white;
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  vertical-align: top;
  span {
    white-space: nowrap;
  }
  small {
    display: block;
  }
  &:first-of-type{
  text-align: left;
  }
`

const Tcell = styled(Td)`
  ${(props) =>
    props.cellWithText
      ? css`
          text-align: left;
        `
      : css`
          text-align: center;
        `};
`

const TcellWithIconClose = styled(Tcell)`
  color: ${theme.color.cautionColor};
`
const UserRolesInfoModal = ({ isOpen, onDismiss }) => {
  const modalContent = (
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <Thead>Accessible Information</Thead>
            <Thead>Admin</Thead>
            <Thead>Collector</Thead>
            <Thead>Read-Only</Thead>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td colSpan="4">
              <strong>Project management</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>Edit project info</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>
          <Tr>
            <Tcell cellWithText>Set up data sharing policy</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>
          <Tr>
            <Tcell cellWithText>Add or remove project members</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>
          <Tr>
            <Tcell cellWithText>View project member email</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>
          <Tr>
            <Tcell cellWithText>Delete a project</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>

          <Tr>
            <Td colSpan="4" cellWithText>
              <strong>Data collection and management</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>Add/update site or management regimes</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>
          <Tr>
            <Tcell cellWithText>Delete a site or management regime</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>
          <Tr>
            <Tcell cellWithText>Download sites and management regimes</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
          <Tr>
            <Tcell cellWithText>Create, validate, and submit sample units</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>
          <Tr>
            <Tcell cellWithText>Delete unsubmited sample units</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>
          <Tr>
            <Tcell cellWithText>Edit submitted sample units</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>
          <Tr>
            <Tcell cellWithText>Transfer unsubmitted sample units</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
          </Tr>
          <Tr>
            <Tcell cellWithText>Download submitted sample units</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
          <Tr>
            <Tcell cellWithText>View observers and sample units overview</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
          <Tr>
            <Tcell cellWithText>View management regimes overview</Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
        </tbody>
      </Table>
    </TableOverflowWrapper>
  )
  const footerContent = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Close</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={language.pages.userTable.moreInfoTitle}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

UserRolesInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default UserRolesInfoModal
