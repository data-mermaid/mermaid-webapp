import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { ButtonSecondary } from './generic/buttons'
import { IconCheck, IconClose } from './icons'
import { Table, Td, Tr, TableOverflowWrapper } from './generic/Table/table'
import theme from '../theme'
import Modal, { RightFooter } from './generic/Modal'

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

  &:first-of-type {
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
  const { t } = useTranslation()
  const modalContent = (
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <Thead>{t('accessible_info')}</Thead>
            <Thead>{t('users.roles.admin')}</Thead>
            <Thead>{t('users.roles.collector')}</Thead>
            <Thead>{t('users.roles.read_only')}</Thead>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td colSpan="4">
              <strong>{t('project_management')}</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell>{t('projects.edit_project_info')}</Tcell>
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
            <Tcell>{t('data_sharing.setup_policy')}</Tcell>
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
            <Tcell>{t('projects.add_remove_members')}</Tcell>
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
            <Tcell>{t('projects.view_member_emails')}</Tcell>
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
            <Tcell>{t('projects.delete_project')}</Tcell>
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
            <Td colSpan="4">
              <strong>{t('data_collection_management')}</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell>{t('add_update_sites_regimes')}</Tcell>
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
            <Tcell>{t('delete_sites_regimes')}</Tcell>
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
            <Tcell>{t('download_sites_regimes')}</Tcell>
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
            <Tcell>{t('sample_units.create_validate')}</Tcell>
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
            <Tcell>{t('sample_units.delete_unsubmitted')}</Tcell>
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
            <Tcell>{t('sample_units.edit_submitted')}</Tcell>
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
            <Tcell>{t('sample_units.transfer_unsubmitted')}</Tcell>
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
            <Tcell>{t('sample_units.download_submitted')}</Tcell>
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
            <Tcell>{t('view_observers_units_overview')}</Tcell>
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
            <Tcell>{t('view_regimes_overview')}</Tcell>
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
      <ButtonSecondary onClick={onDismiss}>{t('buttons.close')}</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={t('users.user_roles')}
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
