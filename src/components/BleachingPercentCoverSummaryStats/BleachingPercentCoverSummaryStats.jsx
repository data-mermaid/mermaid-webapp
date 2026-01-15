import React from 'react'
import { useTranslation } from 'react-i18next'

import { observationsPercentCoverProptype } from '../../App/mermaidData/mermaidDataProptypes'
import { getAverage } from '../../library/getAverage'
import { ObservationsSummaryStats, Tr, Td, Th } from '../generic/Table/table'

const BleachingPercentCoverSummaryStats = ({ observations = [] }) => {
  const { t } = useTranslation()
  const hardPercentages = observations.map((item) => Number(item.percent_hard))
  const softPercentages = observations.map((item) => Number(item.percent_soft))
  const algaePercentages = observations.map((item) => Number(item.percent_algae))
  const quadratCounts = observations.map((item) => Number(item.quadrat_number))

  return (
    <ObservationsSummaryStats>
      <tbody>
        <Tr>
          <Th>{t('observations.number_of_quadrats')}</Th>
          <Td>{quadratCounts.length}</Td>
        </Tr>
        <Tr>
          <Th>{t('observations.avg_hard_coral_cover')}</Th>
          <Td>{getAverage(hardPercentages)}</Td>
        </Tr>
        <Tr>
          <Th>{t('observations.avg_soft_coral_cover')}</Th>
          <Td>{getAverage(softPercentages)}</Td>
        </Tr>
        <Tr>
          <Th>{t('observations.avg_macroalgae_cover')}</Th>
          <Td>{getAverage(algaePercentages)}</Td>
        </Tr>
      </tbody>
    </ObservationsSummaryStats>
  )
}

BleachingPercentCoverSummaryStats.propTypes = {
  observations: observationsPercentCoverProptype,
}

export default BleachingPercentCoverSummaryStats
