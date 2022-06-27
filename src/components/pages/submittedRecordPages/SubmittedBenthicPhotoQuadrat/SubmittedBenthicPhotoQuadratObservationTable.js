import React from 'react'
import PropTypes from 'prop-types'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import {
  choicesPropType,
  submittedFishBeltPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { getOptions } from '../../../../library/getOptions'
import { Table, Tr, Td } from '../../../generic/Table/table'
import {
  TheadItem,
  FormSubTitle,
  ObservationsSummaryStats,
  UnderTableRow,
} from '../SubmittedFormPage.styles'

const SubmittedBenthicPhotoQuadratObservationTable = ({
  choices,
  benthicAttributeOptions,
  submittedRecord,
}) => {
  const { obs_benthic_photo_quadrats } = submittedRecord
  const growthFormOptions = getOptions(choices.growthforms)

  const getOptionLabel = (id, options) => options.find((option) => option.value === id)?.label || ''

  const observationBeltFish = obs_benthic_photo_quadrats.map((item, index) => (
    <Tr key={item.id}>
      <Td align="center">{index + 1}</Td>
      <Td align="center">{item.quadrat_number}</Td>
      <Td align="left">{getOptionLabel(item.attribute, benthicAttributeOptions)}</Td>
      <Td align="right">{getOptionLabel(item.growth_form, growthFormOptions)}</Td>
      <Td align="right">{item.num_points}</Td>
    </Tr>
  ))

  return (
    <>
      <FormSubTitle id="table-label">Observations</FormSubTitle>
      <Table>
        <thead>
          <Tr>
            <TheadItem> </TheadItem>
            <TheadItem align="right">Quadrat</TheadItem>
            <TheadItem align="left">Benthic Attribute</TheadItem>
            <TheadItem align="right">Growth Form</TheadItem>
            <TheadItem align="right">Number of Points</TheadItem>
          </Tr>
        </thead>
        <tbody>{observationBeltFish}</tbody>
      </Table>
      <UnderTableRow>
        <ObservationsSummaryStats>
          <tbody />
        </ObservationsSummaryStats>
      </UnderTableRow>
    </>
  )
}

SubmittedBenthicPhotoQuadratObservationTable.propTypes = {
  choices: choicesPropType.isRequired,
  benthicAttributeOptions: inputOptionsPropTypes.isRequired,
  submittedRecord: submittedFishBeltPropType,
}

SubmittedBenthicPhotoQuadratObservationTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedBenthicPhotoQuadratObservationTable
