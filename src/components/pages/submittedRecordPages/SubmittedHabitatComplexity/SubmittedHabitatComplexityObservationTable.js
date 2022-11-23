import React from 'react'
import {
  choicesPropType,
  submittedHabitatComplexityPropType,
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

const SubmittedHabitatComplexityObservationTable = ({
  benthicAttributeOptions,
  choices,
  submittedRecord,
}) => {
  const { obs_habitat_complexities } = submittedRecord
  const growthFormOptions = getOptions(choices.growthforms)

  const observationsHabitatComplexity = obs_habitat_complexities.map((item, index) => (
    <Tr key={item.id}>
      <Td align="center">{index + 1}</Td>
      <Td align="left">{item.interval}</Td>
      <Td align="right">{getObjectById(benthicAttributeOptions, item.habitatcomplexity)?.label}</Td>
      <Td align="right">{getObjectById(growthFormOptions, item.score)?.label}</Td>
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
              <TheadItem align="right">Habitat Complexity</TheadItem>
              <TheadItem align="right">Score</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationsHabitatComplexity}</tbody>
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

SubmittedHabitatComplexityObservationTable.propTypes = {
  choices: choicesPropType.isRequired,
  benthicAttributeOptions: inputOptionsPropTypes.isRequired,
  submittedRecord: submittedHabitatComplexityPropType,
}

SubmittedHabitatComplexityObservationTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedHabitatComplexityObservationTable
