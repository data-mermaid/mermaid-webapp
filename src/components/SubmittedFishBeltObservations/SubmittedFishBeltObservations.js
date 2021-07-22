import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { H2 } from '../generic/text'
import { InputWrapper } from '../generic/form'
import { inputOptionsPropTypes } from '../../library/miscPropTypes'
import { choicesPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../library/formikPropType'
import { Table, TableOverflowWrapper, Tr, Td, Th } from '../generic/Table/table'
import { getObservationBiomass } from '../pages/collectRecordFormPages/FishBelt/fishbeltBiomas'
import { roundToOneDecimal } from '../../library/Numbers/roundToOneDecimal'

const TheadItem = styled(Th)`
  background: #f1f1f4;
`

const SubmittedFishBeltObservations = ({
  formik,
  choices,
  fishNameOptions,
  fishNameConstants,
}) => {
  const { obs_belt_fishes, width, len_surveyed } = formik.values

  const getFishName = (fishAttributeId) => {
    const foundFishName = fishNameOptions.find(
      (fish) => fish.value === fishAttributeId,
    )

    return foundFishName ? foundFishName.label : ''
  }

  const getFishBiomass = (observation) => {
    const observationBiomass = getObservationBiomass({
      choices,
      fishNameConstants,
      observation,
      transectLengthSurveyed: len_surveyed,
      widthId: width,
    })

    return roundToOneDecimal(observationBiomass)
  }

  const observationBeltFish = obs_belt_fishes.map((item, index) => (
    <Tr key={item.id}>
      <Td align="center">{index + 1}</Td>
      <Td align="center">{getFishName(item.fish_attribute)}</Td>
      <Td align="center">{item.size}</Td>
      <Td align="center">{item.count}</Td>
      <Td align="center">{getFishBiomass(item)}</Td>
    </Tr>
  ))

  return (
    <InputWrapper>
      <H2 id="table-label">Observations</H2>
      <TableOverflowWrapper>
        <Table>
          <thead>
            <Tr>
              <TheadItem> </TheadItem>
              <TheadItem align="center">Fish Name</TheadItem>
              <TheadItem align="center">Size</TheadItem>
              <TheadItem align="center">Count</TheadItem>
              <TheadItem align="center">Biomass (kg/ha)</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationBeltFish}</tbody>
        </Table>
      </TableOverflowWrapper>
    </InputWrapper>
  )
}

SubmittedFishBeltObservations.propTypes = {
  formik: formikPropType.isRequired,
  choices: choicesPropType.isRequired,
  fishNameOptions: inputOptionsPropTypes.isRequired,
  fishNameConstants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      biomass_constant_a: PropTypes.number,
      biomass_constant_b: PropTypes.number,
      biomass_constant_c: PropTypes.number,
    }),
  ).isRequired,
}

export default SubmittedFishBeltObservations
