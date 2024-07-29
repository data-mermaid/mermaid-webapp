import React from 'react'
import {
  choicesPropType,
  observationsColoniesBleachedPropType,
} from '../../../../../App/mermaidData/mermaidDataProptypes'
import { inputOptionsPropTypes } from '../../../../../library/miscPropTypes'
import { SubmittedObservationStickyTable, Tr, Td } from '../../../../generic/Table/table'
import { TheadItem, FormSubTitle, UnderTableRow } from '../../SubmittedFormPage.styles'
import { InputWrapper } from '../../../../generic/form'
import { StyledOverflowWrapper } from '../../../collectRecordFormPages/CollectingFormPage.Styles'
import { getObjectById } from '../../../../../library/getObjectById'
import { getOptions } from '../../../../../library/getOptions'
import BleachincColoniesBleachedSummaryStats from '../../../../BleachingColoniesBleachedSummaryStats/BleachingColoniesBleachedSummaryStats'

const BleachingColoniesBleachedObservations = ({
  benthicAttributeOptions,
  choices,
  observationsColoniesBleached = [],
}) => {
  const growthFormOptions = getOptions(choices.growthforms.data)

  const observationsBleaching = observationsColoniesBleached.map((item, index) => (
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
        <BleachincColoniesBleachedSummaryStats
          observationsColoniesBleached={observationsColoniesBleached}
        />
      </UnderTableRow>
    </InputWrapper>
  )
}

BleachingColoniesBleachedObservations.propTypes = {
  choices: choicesPropType.isRequired,
  benthicAttributeOptions: inputOptionsPropTypes.isRequired,
  observationsColoniesBleached: observationsColoniesBleachedPropType,
}

export default BleachingColoniesBleachedObservations
