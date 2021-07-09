import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'

import { ButtonSecondary } from '../generic/buttons'
import { IconCheck, IconClose } from '../icons'
import { Table, Tr, TableOverflowWrapper } from '../generic/Table/table'
import language from '../../language'
import theme from '../../theme'
import Modal, { RightFooter } from '../generic/Modal/Modal'

const Thead = styled.th`
  text-align: center;
  background-color: ${theme.color.primaryColor};
  color: white;
  padding: 20px;
`

const Tcell = styled.td`
  padding: 10px;
  ${(props) =>
    props.cellWithText
      ? css`
          text-align: left;
        `
      : css`
          text-align: center;
          width: 100px;
        `};
`

const TcellWithIconClose = styled(Tcell)`
  color: ${theme.color.cautionColor};
`
const DataSharingInfoModal = ({ isOpen, onDismiss }) => {
  const modalContent = (
    <TableOverflowWrapper>
      <Table>
        <thead>
          <Tr>
            <Thead>Project-level information</Thead>
            <Thead>Private</Thead>
            <Thead>Public Summary (default)</Thead>
            <Thead>Public</Thead>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Tcell cellWithText>
              <strong>Contact info:</strong> organization, admin name and admin
              email
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
            <Tcell cellWithText>
              <strong>Metadata</strong> project name and notes, country, site
              name and location, survey date, depth, habitat (reef zone, reef
              type and exposure), management regime name, # of transects
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
            <Tcell cellWithText>
              <strong>Site-level averages</strong> accessible via summary API:
            </Tcell>
          </Tr>
          <Tr>
            <Tcell cellWithText>Average benthic cover, %</Tcell>
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
            <Tcell cellWithText>Average total reef fish biomass, kg/ha</Tcell>
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
            <Tcell cellWithText>
              <strong>Transec-level observations</strong> ​​​​​​​can be
              downloaded:
            </Tcell>
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
              Reef fish species, size and abundance, taxonomy and functional
              group information, biomass coefficients
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
      title={language.pages.dataSharing.moreInfoTitle}
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
