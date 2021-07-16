import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import { Table, Tr, TableOverflowWrapper } from '../../../generic/Table/table'
import { H2 } from '../../../generic/text'
import { InputWrapper } from '../../../generic/form'
import { ContentPageLayout } from '../../../Layout'
import theme from '../../../../theme'

const Tcell = styled.td`
  padding: 10px;
  text-align: left;
  ${(props) =>
    props.cellWithText &&
    css`
      font-weight: bold;
      width: 250px;
      background: #f1f1f4;
    `};
`
const SubmittedFishBelt = () => {
  return (
    <ContentPageLayout
      content={
        <InputWrapper>
          <TableOverflowWrapper>
            <Table>
              <tbody>
                <Tr>
                  <Tcell cellWithText>Site</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Management</Tcell>
                  <Tcell>Management Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Sample Date Time</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Depth</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Transect Number</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Label</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Transect Length Surveyed</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Width</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Fish Size Bin</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Reef Slope</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Visibility</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Current</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Relative Depth</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Tide</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
                <Tr>
                  <Tcell cellWithText>Notes</Tcell>
                  <Tcell>Site Name</Tcell>
                </Tr>
              </tbody>
            </Table>
          </TableOverflowWrapper>
        </InputWrapper>
      }
      toolbar={
        <>
          <H2>Submitted Record</H2>
        </>
      }
    />
  )
}

SubmittedFishBelt.propTypes = {}

export default SubmittedFishBelt
