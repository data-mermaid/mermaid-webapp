import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import { inputOptionsPropTypes } from '../../library/miscPropTypes'
import {
  choicesPropType,
  submittedFishBeltPropType,
} from '../../App/mermaidData/mermaidDataProptypes'
import { Table, Tr, Td, Th } from '../generic/Table/table'
import { mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'
import { RowRight } from '../generic/positioning'
import { getObservationBiomass } from '../pages/collectRecordFormPages/FishBelt/fishbeltBiomas'
import { roundToOneDecimal } from '../../library/Numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../library/summarizeArrayObjectValuesByProperty'
import language from '../../language'
import theme from '../../theme'

const TheadItem = styled(Th)``
const StyledH2 = styled('h2')`
  padding: 0 ${theme.spacing.medium};
`

const ObservationsSummaryStats = styled(Table)`
  width: 25%;
  table-layout: auto;
  min-width: auto;
  max-width: 40rem;
  border: solid 1px ${theme.color.secondaryColor};
  tr:nth-child(even),
  tr:nth-child(odd) {
    background-color: ${theme.color.white};
  }
  ${mediaQueryTabletLandscapeOnly(css`
    font-size: smaller;
  `)}
`

const UnderTableRow = styled(RowRight)`
  display: flex;
  align-items: flex-end;
  margin-top: ${theme.spacing.medium};
  ${mediaQueryTabletLandscapeOnly(css`
    flex-direction: column;
    gap: ${theme.spacing.small};
  `)}
`

const SubmittedFishBeltObservationTable = ({
  choices,
  fishNameOptions,
  fishNameConstants,
  submittedRecord,
}) => {
  const { obs_belt_fishes } = submittedRecord
  const { width, len_surveyed } = submittedRecord.fishbelt_transect

  const observationsBiomass = obs_belt_fishes.map((observation) => ({
    uiId: observation.id,
    biomass: getObservationBiomass({
      choices,
      fishNameConstants,
      observation,
      transectLengthSurveyed: len_surveyed,
      widthId: width,
    }),
  }))

  const totalBiomass = roundToOneDecimal(
    summarizeArrayObjectValuesByProperty(observationsBiomass, 'biomass'),
  )

  const totalAbundance = summarizeArrayObjectValuesByProperty(obs_belt_fishes, 'count')

  const getFishName = (fishAttributeId) => {
    const foundFishName = fishNameOptions.find((fish) => fish.value === fishAttributeId)

    return foundFishName ? foundFishName.label : ''
  }

  const getFishBiomass = (observationId) => {
    const fishBiomass = observationsBiomass.find((fish) => fish.uiId === observationId).biomass

    return roundToOneDecimal(fishBiomass)
  }

  const observationBeltFish = obs_belt_fishes.map((item, index) => (
    <Tr key={item.id}>
      <Td align="center">{index + 1}</Td>
      <Td align="left">{getFishName(item.fish_attribute)}</Td>
      <Td align="right">{item.size}</Td>
      <Td align="right">{item.count}</Td>
      <Td align="right">{getFishBiomass(item.id)}</Td>
    </Tr>
  ))

  return (
    <>
      <StyledH2 id="table-label">Observations</StyledH2>
      <Table>
        <thead>
          <Tr>
            <TheadItem> </TheadItem>
            <TheadItem align="left">Fish Name</TheadItem>
            <TheadItem align="right">Size (cm)</TheadItem>
            <TheadItem align="right">Count</TheadItem>
            <TheadItem align="right">Biomass (kg/ha)</TheadItem>
          </Tr>
        </thead>
        <tbody>{observationBeltFish}</tbody>
      </Table>
      <UnderTableRow>
        <ObservationsSummaryStats>
          <tbody>
            <Tr>
              <Th>{language.pages.collectRecord.totalBiomassLabel}</Th>
              <Td>{totalBiomass}</Td>
            </Tr>
            <Tr>
              <Th>{language.pages.collectRecord.totalAbundanceLabel}</Th>
              <Td>{totalAbundance}</Td>
            </Tr>
          </tbody>
        </ObservationsSummaryStats>
      </UnderTableRow>
    </>
  )
}

SubmittedFishBeltObservationTable.propTypes = {
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
  submittedRecord: submittedFishBeltPropType,
}

SubmittedFishBeltObservationTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedFishBeltObservationTable
