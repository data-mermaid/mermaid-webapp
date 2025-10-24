import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'

import { ButtonSecondary } from '../generic/buttons'
import { IconCheck, IconClose } from '../icons'
import { Table, Td, Tr, TableOverflowWrapper } from '../generic/Table/table'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal'

const thStyles = css`
  text-align: left;
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
`

const TheadLeft = styled.th`
  ${thStyles}
  text-align: left;
`

const TheadCenter = styled.th`
  ${thStyles}
  text-align: center;
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
const DataSharingInfoModal = ({ isOpen, onDismiss }) => {
  const { t } = useTranslation()
  const modalContent = (
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <TheadLeft>{t('data_sharing_info.project_level_info')}</TheadLeft>
            <TheadCenter>{t('data_sharing_info.private')}</TheadCenter>
            <TheadCenter>
              <span>{t('data_sharing_info.public_summary')}</span>
              <small>{t('data_sharing_info.public_summary_default')}</small>
            </TheadCenter>
            <TheadCenter>{t('data_sharing_info.public')}</TheadCenter>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td colSpan="4">
              <strong>{t('data_sharing_info.contact_info')}</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>{t('data_sharing_info.org_and_admin_names')}</Tcell>
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
            <Td colSpan="4" cellWithText>
              <strong>{t('data_sharing_info.metadata')}</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>
              {t('data_sharing_info.metadata_description')}
            </Tcell>
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
            <Td colSpan="4" cellWithText>
              <strong>{t('data_sharing_info.site_level_averages')}</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>{t('data_sharing_info.avg_benthic_cover')}</Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
          <Tr>
            <Tcell cellWithText>{t('data_sharing_info.avg_fish_biomass')}</Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
          <Tr>
            <Tcell cellWithText>{t('data_sharing_info.avg_habitat_complexity')}</Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
          <Tr>
            <Tcell cellWithText>{t('data_sharing_info.avg_colonies_bleached')}</Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <Tcell>
              <IconCheck />
            </Tcell>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
          <Tr>
            <Td colSpan="4" cellWithText>
              <strong>{t('data_sharing_info.transect_level_obs')}</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>{t('data_sharing_info.benthic_obs_growth_forms')}</Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
          <Tr>
            <Tcell cellWithText>
              {t('data_sharing_info.fish_species_description')}
            </Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
          <Tr>
            <Tcell cellWithText>{t('data_sharing_info.individual_habitat_scores')}</Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <Tcell>
              <IconCheck />
            </Tcell>
          </Tr>
          <Tr>
            <Tcell cellWithText>{t('data_sharing_info.colonies_bleached_percent_cover')}</Tcell>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
            <TcellWithIconClose>
              <IconClose />
            </TcellWithIconClose>
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
      title={t('data_sharing_info.modal_title')}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

DataSharingInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default DataSharingInfoModal
