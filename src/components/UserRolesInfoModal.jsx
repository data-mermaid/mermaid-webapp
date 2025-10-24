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
            <Thead>{t('admin.accessible_information')}</Thead>
            <Thead>{t('admin.admin')}</Thead>
            <Thead>{t('admin.collector')}</Thead>
            <Thead>{t('admin.read_only')}</Thead>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td colSpan="4">
              <strong>{t('admin.project_management')}</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell>{t('admin.project_info.edit')}</Tcell>
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
            <Tcell>{t('admin.project_info.set_up_data_sharing')}</Tcell>
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
            <Tcell>{t('admin.project_info.add_or_remove_project_members')}</Tcell>
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
            <Tcell>{t('admin.project_info.view_member_email')}</Tcell>
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
            <Tcell>{t('admin.project_info.delete')}</Tcell>
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
              <strong>{t('admin.data_collection.title')}</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell>{t('admin.data_collection.add_update_site_or_regimes')}</Tcell>
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
            <Tcell>{t('admin.data_collection.delete_site_or_regimes')}</Tcell>
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
            <Tcell>{t('admin.data_collection.download_sites_and_regimes')}</Tcell>
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
            <Tcell>{t('admin.data_collection.create_validate_submit_sample_units')}</Tcell>
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
            <Tcell>{t('admin.data_collection.delete_sample_units')}</Tcell>
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
            <Tcell>{t('admin.data_collection.edit_sample_units')}</Tcell>
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
            <Tcell>{t('admin.data_collection.transfer_sample_units')}</Tcell>
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
            <Tcell>{t('admin.data_collection.download_sample_units')}</Tcell>
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
            <Tcell>{t('admin.data_collection.view_observers_and_sample_units')}</Tcell>
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
            <Tcell>{t('admin.data_collection.view_regimes_overview')}</Tcell>
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
      title={t('user_table.more_info_title')}
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
