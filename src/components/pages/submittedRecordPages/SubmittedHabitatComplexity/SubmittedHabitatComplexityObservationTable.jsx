import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  choicesPropType,
  submittedHabitatComplexityPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { SubmittedObservationStickyTable, Tr, Td } from '../../../generic/Table/table'
import { TheadItem, FormSubTitle } from '../SubmittedFormPage.styles'
import { InputWrapper } from '../../../generic/form'
import { StyledOverflowWrapper } from '../../collectRecordFormPages/CollectingFormPage.Styles'
import { getObjectById } from '../../../../library/getObjectById'
import { getOptions } from '../../../../library/getOptions'

const SubmittedHabitatComplexityObservationTable = ({ choices, submittedRecord = undefined }) => {
  const { t } = useTranslation()
  const { obs_habitat_complexities } = submittedRecord
  const habitatComplexityFormOptions = getOptions(choices.habitatcomplexityscores.data)

  const observationsHabitatComplexity = obs_habitat_complexities.map((item, index) => (
    <Tr key={item.id}>
      <Td $align="center">{index + 1}</Td>
      <Td $align="left">{item.interval}</Td>
      <Td $align="right">{getObjectById(habitatComplexityFormOptions, item.score)?.label}</Td>
    </Tr>
  ))

  return (
    <InputWrapper>
      <FormSubTitle id="table-label">{t('observations')}</FormSubTitle>
      <StyledOverflowWrapper>
        <SubmittedObservationStickyTable>
          <thead>
            <Tr>
              <TheadItem> </TheadItem>
              <TheadItem $align="left">{t('interval')}</TheadItem>
              <TheadItem $align="right">{t('habitat_complexity_score')}</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationsHabitatComplexity}</tbody>
        </SubmittedObservationStickyTable>
      </StyledOverflowWrapper>
    </InputWrapper>
  )
}

SubmittedHabitatComplexityObservationTable.propTypes = {
  choices: choicesPropType.isRequired,
  submittedRecord: submittedHabitatComplexityPropType,
}

export default SubmittedHabitatComplexityObservationTable
