import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { ButtonSecondary } from '../generic/buttons'
import { IconCheck, IconClose } from '../icons'
import { Table, Td, Tr, TableOverflowWrapper } from '../generic/Table/table'
import language from '../../language'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal/Modal'

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
const DataSharingInfoModal = ({ onDismiss }) => {
  const modalContent = (
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <TheadLeft>Project-level information</TheadLeft>
            <TheadCenter>Private</TheadCenter>
            <TheadCenter>
              <span>Public Summary</span>
              <small>(default)</small>
            </TheadCenter>
            <TheadCenter>Public</TheadCenter>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td colSpan="4">
              <strong>Contact info</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>Organization and admin names</Tcell>
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
              <strong>Metadata</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>
              Project name and notes, country, site name and location, survey date, depth, habitat
              (reef zone, reef type and exposure), management regime name, number of transects
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
              <strong>Site-level averages</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>Average benthic cover (%)</Tcell>
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
            <Tcell cellWithText>Average total reef fish biomass (kg/ha)</Tcell>
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
            <Tcell cellWithText>Average habitat complexity scores</Tcell>
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
            <Tcell cellWithText>Average colonies bleached (%)</Tcell>
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
              <strong>Transect-level observations</strong>
            </Td>
          </Tr>
          <Tr>
            <Tcell cellWithText>Benthic observations and growth forms</Tcell>
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
              Reef fish species, size and abundance, taxonomy and functional group information,
              biomass coefficients
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
            <Tcell cellWithText>Individual habitat complexity scores</Tcell>
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
            <Tcell cellWithText>Colonies bleached and benthic percent cover</Tcell>
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
      <ButtonSecondary onClick={onDismiss}>Close</ButtonSecondary>
    </RightFooter>
  )

  return (
    <Modal
      onDismiss={onDismiss}
      title={language.pages.dataSharing.moreInfoTitle}
      mainContent={modalContent}
      footerContent={footerContent}
    />
  )
}

DataSharingInfoModal.propTypes = {
  onDismiss: PropTypes.func.isRequired,
}

export default DataSharingInfoModal
