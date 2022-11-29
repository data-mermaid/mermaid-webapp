import React from 'react'
import {
  choicesPropType,
  submittedBleachingPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { SubmittedObservationStickyTable, Tr, Td, Th } from '../../../generic/Table/table'
import {
  TheadItem,
  FormSubTitle,
  ObservationsSummaryStats,
  UnderTableRow,
} from '../SubmittedFormPage.styles'
import { InputWrapper } from '../../../generic/form'
import { StyledOverflowWrapper } from '../../collectRecordFormPages/CollectingFormPage.Styles'
import { getObjectById } from '../../../../library/getObjectById'
import { getOptions } from '../../../../library/getOptions'

const SubmittedBleachingObservationTable = ({
  benthicAttributeOptions,
  choices,
  submittedRecord,
}) => {
  const { obs_colonies_bleached } = submittedRecord
  const growthFormOptions = getOptions(choices.growthforms)

  const observationsBleaching = obs_colonies_bleached.map((item, index) => (
    <Tr key={item.id}>
      <Td align="center">{index + 1}</Td>
      <Td align="right">{getObjectById(benthicAttributeOptions, item.attribute)?.label}</Td>
      <Td align="right">{getObjectById(growthFormOptions, item.growth_form)?.label}</Td>
      <Td align="right">{item.count_normal}</Td>
      <Td align="right">{item.count_pale}</Td>
      <Td align="right">{item.count_20}</Td>
      <Td align="right">{item.count_50}</Td>
      <Td align="right">{item.count_80}</Td>
      <Td align="right">{item.count_100}</Td>
      <Td align="right">{item.count_dead}</Td>
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
              <TheadItem align="right">Benthic Attribute</TheadItem>
              <TheadItem align="right">Growth Form</TheadItem>
              <TheadItem align="right">Normal</TheadItem>
              <TheadItem align="right">Pale</TheadItem>
              <TheadItem align="right">0-20% Bleached</TheadItem>
              <TheadItem align="right">20-50% Bleached</TheadItem>
              <TheadItem align="right">50-80% Bleached</TheadItem>
              <TheadItem align="right">80-100% Bleached</TheadItem>
              <TheadItem align="right">Recently dead</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationsBleaching}</tbody>
        </SubmittedObservationStickyTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <ObservationsSummaryStats>
          <tbody>
            <Tr>
              <Th>Total number of colonies</Th>
              <Td>placeholder item</Td>
            </Tr>
            <Tr>
              <Th>Total number of coral genera</Th>
              <Td>placeholder item</Td>
            </Tr>
            <Tr>
              <Th>% Normal colonies</Th>
              <Td>placeholder item</Td>
            </Tr>
            <Tr>
              <Th>% Pale colonies</Th>
              <Td>placeholder item</Td>
            </Tr>
            <Tr>
              <Th>% Bleached colonies</Th>
              <Td>placeholder item</Td>
            </Tr>
          </tbody>
        </ObservationsSummaryStats>
      </UnderTableRow>
    </InputWrapper>
  )
}

SubmittedBleachingObservationTable.propTypes = {
  choices: choicesPropType.isRequired,
  benthicAttributeOptions: inputOptionsPropTypes.isRequired,
  submittedRecord: submittedBleachingPropType,
}

SubmittedBleachingObservationTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedBleachingObservationTable
