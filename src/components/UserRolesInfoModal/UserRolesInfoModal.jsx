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
  text-align: center;
  &:first-of-type {
    text-align: left;
  }
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
            <Thead>{language.pages.admin.accessible_information}</Thead>
            <Thead>{language.pages.admin.admin}</Thead>
            <Thead>{language.pages.admin.collector}</Thead>
            <Thead>{language.pages.admin.readOnly}</Thead>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td colSpan="4">
              <strong>{language.pages.admin.projectManagement}</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>{language.pages.admin.projectInfo.edit}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.projectInfo.setUpDataSharing}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.projectInfo.addOrRemoveProjectMembers}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.projectInfo.viewMemberEmail}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.projectInfo.delete}</Tcell>
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
              <strong>{language.pages.admin.dataCollection.title}</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>{language.pages.admin.dataCollection.addUpdateSiteOrRegimes}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.dataCollection.deleteSiteOrRegimes}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.dataCollection.downloadSitesAndRegimes}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.dataCollection.createValidateSubmitSampleUnits}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.dataCollection.deleteSampleUnits}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.dataCollection.editSampleUnits}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.dataCollection.transferSampleUnits}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.dataCollection.downloadSampleUnits}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.dataCollection.viewObserversAndSampleUnits}</Tcell>
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
            <Tcell cellWithText>{language.pages.admin.dataCollection.viewRegimesOverview}</Tcell>
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
      <ButtonSecondary onClick={onDismiss}>{language.buttons.close}</ButtonSecondary>
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
