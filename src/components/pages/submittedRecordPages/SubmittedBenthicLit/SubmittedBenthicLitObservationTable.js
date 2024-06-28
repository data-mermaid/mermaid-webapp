import React from 'react'
import {
  choicesPropType,
  benthicLitPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import { SubmittedObservationStickyTable, Tr, Td } from '../../../generic/Table/table'
import { TheadItem, FormSubTitle, UnderTableRow } from '../SubmittedFormPage.styles'
import { InputWrapper } from '../../../generic/form'
import { StyledOverflowWrapper } from '../../collectRecordFormPages/CollectingFormPage.Styles'
import { getObjectById } from '../../../../library/getObjectById'
import { getOptions } from '../../../../library/getOptions'
import BenthicPitLitObservationSummaryStats from '../../../BenthicPitLitObservationSummaryStats'

const SubmittedBenthicLitObservationTable = ({
  benthicAttributeOptions,
  choices,
  submittedRecord = undefined,
}) => {
  const { obs_benthic_lits } = submittedRecord
  const growthFormOptions = getOptions(choices.growthforms.data)

  const observationsBenthicLit = obs_benthic_lits.map((item, index) => (
    <Tr key={item.id}>
      <Td align="center">{index + 1}</Td>
      <Td align="right">{getObjectById(benthicAttributeOptions, item.attribute)?.label}</Td>
      <Td align="right">{getObjectById(growthFormOptions, item.growth_form)?.label}</Td>
      <Td align="left">{item.length}</Td>
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
              <TheadItem align="left">Length (cm)</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationsBenthicLit}</tbody>
        </SubmittedObservationStickyTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <BenthicPitLitObservationSummaryStats
          benthicAttributeSelectOptions={benthicAttributeOptions}
          observations={obs_benthic_lits}
        />
      </UnderTableRow>
    </InputWrapper>
  )
}

SubmittedBenthicLitObservationTable.propTypes = {
  choices: choicesPropType.isRequired,
  benthicAttributeOptions: inputOptionsPropTypes.isRequired,
  submittedRecord: benthicLitPropType,
}

export default SubmittedBenthicLitObservationTable
