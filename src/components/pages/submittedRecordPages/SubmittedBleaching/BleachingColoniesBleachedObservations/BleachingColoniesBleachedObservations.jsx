import React from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const growthFormOptions = getOptions(choices.growthforms.data)

  const observationsBleaching = observationsColoniesBleached.map((item, index) => (
    <Tr key={item.id}>
      <Td $align="center">{index + 1}</Td>
      <Td $align="right">{getObjectById(benthicAttributeOptions, item.attribute)?.label}</Td>
      <Td $align="right">{getObjectById(growthFormOptions, item.growth_form)?.label}</Td>
      <Td $align="right">{item.count_normal}</Td>
      <Td $align="right">{item.count_pale}</Td>
      <Td $align="right">{item.count_20}</Td>
      <Td $align="right">{item.count_50}</Td>
      <Td $align="right">{item.count_80}</Td>
      <Td $align="right">{item.count_100}</Td>
      <Td $align="right">{item.count_dead}</Td>
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
              <TheadItem $align="right">{t('benthic_observations.benthic_attribute')}</TheadItem>
              <TheadItem $align="right">{t('observations.growth_form')}</TheadItem>
              <TheadItem $align="right">{t('observations.normal')}</TheadItem>
              <TheadItem $align="right">{t('observations.pale')}</TheadItem>
              <TheadItem $align="right">{t('observations.percent_0_20')}</TheadItem>
              <TheadItem $align="right">{t('observations.percent_20_50')}</TheadItem>
              <TheadItem $align="right">{t('observations.percent_50_80')}</TheadItem>
              <TheadItem $align="right">{t('observations.percent_80_100')}</TheadItem>
              <TheadItem $align="right">{t('observations.recently_dead')}</TheadItem>
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
