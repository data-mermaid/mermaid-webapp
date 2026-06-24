import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  choicesPropType,
  submittedBeltInvertPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  MacroinvertebrateObservationsSummaryStats,
  SubmittedObservationStickyTable,
  Tr,
  Td,
  Th,
} from '../../../generic/Table/table'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import { TheadItem, FormSubTitle, UnderTableRow } from '../SubmittedFormPage.styles'
import { InputWrapper } from '../../../generic/form'
import { StyledOverflowWrapper } from '../../collectRecordFormPages/CollectingFormPage.Styles'
import {
  formatDensityToOneDecimal,
  useBeltInvertDensityMetrics,
} from '../../../../library/macroinvertebrates/useBeltInvertDensityMetrics'

const SubmittedBeltInvertObservationTable = ({
  choices,
  invertAttributes,
  submittedRecord = undefined,
}) => {
  const { t } = useTranslation()
  const obs_belt_inverts = submittedRecord?.obs_belt_inverts ?? []
  const widthId = submittedRecord?.beltinvert_transect?.width
  const len_surveyed = submittedRecord?.beltinvert_transect?.len_surveyed ?? 0

  const { abundance, observationDensities, totalDensity, densityByGoi } =
    useBeltInvertDensityMetrics({
      observations: obs_belt_inverts,
      invertAttributes,
      choices,
      lenSurveyed: len_surveyed,
      widthId,
    })

  if (!submittedRecord) {
    return null
  }

  const getInvertName = (invertAttributeId) => {
    const found = invertAttributes.find((invert) => invert.id === invertAttributeId)

    return found ? found.display_name ?? found.name : ''
  }

  const getInvertDensity = (item) => {
    return roundToOneDecimal(observationDensities.get(item.id))
  }

  const observationBeltInverts = obs_belt_inverts.map((item, index) => (
    <Tr key={item.id}>
      <Td $align="center">{index + 1}</Td>
      <Td $align="left">{getInvertName(item.invert_attribute)}</Td>
      <Td $align="left">{item.size}</Td>
      <Td $align="right">{item.count}</Td>
      <Td $align="right">{item.notes}</Td>
      <Td $align="right">{getInvertDensity(item)}</Td>
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
              <TheadItem $align="left">{t('observations.macroinvertebrate_name')}</TheadItem>
              <TheadItem $align="left">{t('size_cm')}</TheadItem>
              <TheadItem $align="right">{t('count')}</TheadItem>
              <TheadItem $align="right">{t('notes')}</TheadItem>
              <TheadItem $align="right">{`${t('density')} (${t(
                'measurements.individuals_per_hectare_short',
              )})`}</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationBeltInverts}</tbody>
        </SubmittedObservationStickyTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <MacroinvertebrateObservationsSummaryStats>
          <thead>
            <Tr>
              <Th colSpan={2}>
                {t('macroinvertebrate_observations.density_by_group_of_interest_units')}
              </Th>
            </Tr>
          </thead>
          <tbody>
            {Object.entries(densityByGoi).map(([groupName, groupDensity]) => {
              return (
                <Tr key={groupName}>
                  <Th className="goi-density">{groupName}</Th>
                  <Td>{formatDensityToOneDecimal(groupDensity)}</Td>
                </Tr>
              )
            })}
            <Tr>
              <Th>{t('observations.total_density_units')}</Th>
              <Td>{formatDensityToOneDecimal(totalDensity)}</Td>
            </Tr>
            <Tr>
              <Th>{t('total_abundance')}</Th>
              <Td>{abundance}</Td>
            </Tr>
          </tbody>
        </MacroinvertebrateObservationsSummaryStats>
      </UnderTableRow>
    </InputWrapper>
  )
}

SubmittedBeltInvertObservationTable.propTypes = {
  choices: choicesPropType,
  invertAttributes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      display_name: PropTypes.string,
      group_of_interest: PropTypes.string,
    }),
  ),
  submittedRecord: submittedBeltInvertPropType,
}

export default SubmittedBeltInvertObservationTable
