import React from 'react'
import { useTranslation } from 'react-i18next'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import {
  choicesPropType,
  submittedFishBeltPropType,
  fishNameConstantsPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  ObservationsSummaryStats,
  SubmittedObservationStickyTable,
  Tr,
  Td,
  Th,
} from '../../../generic/Table/table'
import { getObservationBiomass } from '../../collectRecordFormPages/FishBeltForm/fishBeltBiomass'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import { TheadItem, FormSubTitle, UnderTableRow } from '../SubmittedFormPage.styles'
import { InputWrapper } from '../../../generic/form'
import { StyledOverflowWrapper } from '../../collectRecordFormPages/CollectingFormPage.Styles'

const SubmittedFishBeltObservationTable = ({
  choices,
  fishNameOptions,
  fishNameConstants,
  submittedRecord = undefined,
}) => {
  const { t } = useTranslation()
  const { obs_belt_fishes } = submittedRecord
  const { width, len_surveyed } = submittedRecord.fishbelt_transect

  const observationsBiomass = obs_belt_fishes.map((observation) => ({
    id: observation.id,
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
    const fishBiomass = observationsBiomass.find((fish) => fish.id === observationId).biomass

    return roundToOneDecimal(fishBiomass)
  }

  const observationBeltFish = obs_belt_fishes.map((item, index) => (
    <Tr key={item.id}>
      <Td $align="center">{index + 1}</Td>
      <Td $align="left">{getFishName(item.fish_attribute)}</Td>
      <Td $align="right">{item.size}</Td>
      <Td $align="right">{item.count}</Td>
      <Td $align="right">{getFishBiomass(item.id)}</Td>
    </Tr>
  ))

  return (
    <InputWrapper>
      <FormSubTitle id="table-label">{t('observations.observations')}</FormSubTitle>
      <StyledOverflowWrapper>
        <SubmittedObservationStickyTable>
          <thead>
            <Tr>
              <TheadItem> </TheadItem>
              <TheadItem $align="left">{t('fish_name')}</TheadItem>
              <TheadItem $align="right">{`${t('sample_units.size')} (${t(
                'measurements.centimeter_short',
              )})`}</TheadItem>
              <TheadItem $align="right">{t('count')}</TheadItem>
              <TheadItem $align="right">{`${t('biomass')} (${t(
                'measurements.kilogram_per_hectare_short',
              )})`}</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationBeltFish}</tbody>
        </SubmittedObservationStickyTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <ObservationsSummaryStats>
          <tbody>
            <Tr>
              <Th>{t('total_biomass')}</Th>
              <Td>{totalBiomass}</Td>
            </Tr>
            <Tr>
              <Th>{t('total_abundance')}</Th>
              <Td>{totalAbundance.toFixed(1)}</Td>
            </Tr>
          </tbody>
        </ObservationsSummaryStats>
      </UnderTableRow>
    </InputWrapper>
  )
}

SubmittedFishBeltObservationTable.propTypes = {
  choices: choicesPropType.isRequired,
  fishNameOptions: inputOptionsPropTypes.isRequired,
  fishNameConstants: fishNameConstantsPropType.isRequired,
  submittedRecord: submittedFishBeltPropType,
}

export default SubmittedFishBeltObservationTable
