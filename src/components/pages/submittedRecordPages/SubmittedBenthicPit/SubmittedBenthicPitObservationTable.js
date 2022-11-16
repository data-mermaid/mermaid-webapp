import React from 'react'
import { submittedBenthicPitPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { SubmittedObservationStickyTable, Tr, Td, Th } from '../../../generic/Table/table'
import {
  TheadItem,
  FormSubTitle,
  ObservationsSummaryStats,
  UnderTableRow,
} from '../SubmittedFormPage.styles'
import { InputWrapper } from '../../../generic/form'
import { StyledOverflowWrapper } from '../../collectRecordFormPages/CollectingFormPage.Styles'

const SubmittedBenthicPitObservationTable = ({ submittedRecord }) => {
  const { obs_benthic_pits } = submittedRecord

  const observationsBenthicPit = obs_benthic_pits.map((item, index) => (
    <Tr key={item.id}>
      <Td align="center">{index + 1}</Td>
      <Td align="left">{item.interval}</Td>
      <Td align="right">{item.attribute}</Td>
      <Td align="right">{item.growth_form}</Td>
    </Tr>
  ))

  return (
    <InputWrapper>
      <FormSubTitle id="table-label">Observations</FormSubTitle>
      <StyledOverflowWrapper>
        <SubmittedObservationStickyTable>
          <thead>
            <Tr>
              <TheadItem> </TheadItem>
              <TheadItem align="left">Interval</TheadItem>
              <TheadItem align="right">Benthic Attribute</TheadItem>
              <TheadItem align="right">Growth Form</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationsBenthicPit}</tbody>
        </SubmittedObservationStickyTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <ObservationsSummaryStats>
          <tbody>
            <Tr>
              <Th>placeholder label</Th>
              <Td>placeholder item</Td>
            </Tr>
            <Tr>
              <Th>placeholder label</Th>
              <Td>placeholder item</Td>
            </Tr>
          </tbody>
        </ObservationsSummaryStats>
      </UnderTableRow>
    </InputWrapper>
  )
}

SubmittedBenthicPitObservationTable.propTypes = {
  submittedRecord: submittedBenthicPitPropType,
}

SubmittedBenthicPitObservationTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedBenthicPitObservationTable
