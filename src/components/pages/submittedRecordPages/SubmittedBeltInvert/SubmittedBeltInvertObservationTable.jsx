import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  choicesPropType,
  submittedBeltInvertPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  ObservationsSummaryStats,
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
  formatDensityToTwoDecimals,
  useBeltInvertDensityMetrics,
} from '../../../../library/macroinvertebrates/useBeltInvertDensityMetrics'
const EMPTY_OBSERVATIONS = []

const SubmittedBeltInvertObservationTable = ({
  choices,
  invertAttributes,
  submittedRecord = undefined,
}) => {
  const { t } = useTranslation()
  const obs_belt_inverts = submittedRecord?.obs_belt_inverts ?? EMPTY_OBSERVATIONS
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
      <Td $align="right">{item.count}</Td>
      <Td $align="right">{getInvertDensity(item)}</Td>
    </Tr>
  ))

  return (
    <InputWrapper>
      <FormSubTitle id="table-label">
        {t('submitted_macroinvertebrate.observations_title')}
      </FormSubTitle>
      <StyledOverflowWrapper>
        <SubmittedObservationStickyTable>
          <thead>
            <Tr>
              <TheadItem> </TheadItem>
              <TheadItem $align="left">{t('macroinvertebrate_observations.species')}</TheadItem>
              <TheadItem $align="right">{t('count')}</TheadItem>
              <TheadItem $align="right">{`${t(
                'submitted_macroinvertebrate.density_column_header',
              )}`}</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationBeltInverts}</tbody>
        </SubmittedObservationStickyTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <ObservationsSummaryStats>
          <tbody>
            {Object.entries(densityByGoi).map(([groupName, groupDensity]) => {
              return (
                <Tr key={groupName}>
                  <Th>{`${t(
                    'submitted_macroinvertebrate.density_per_group_of_interest',
                  )} - ${groupName}`}</Th>
                  <Td>{formatDensityToTwoDecimals(groupDensity)}</Td>
                </Tr>
              )
            })}
            <Tr>
              <Th>{t('submitted_macroinvertebrate.total_density_units')}</Th>
              <Td>{formatDensityToTwoDecimals(totalDensity)}</Td>
            </Tr>
            <Tr>
              <Th>{t('submitted_macroinvertebrate.abundance')}</Th>
              <Td>{abundance}</Td>
            </Tr>
          </tbody>
        </ObservationsSummaryStats>
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
