import React from 'react'

import { observationsQuadratBenthicPercentPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { getAverage } from '../../library/getAverage'
import { ObservationsSummaryStats } from '../pages/collectRecordFormPages/CollectingFormPage.Styles'
import { Tr, Td, Th } from '../generic/Table/table'

const BleachingPercentCoverSummaryStats = ({ obs_quadrat_benthic_percent }) => {
  const hardPercentages = obs_quadrat_benthic_percent.map((item) => item.percent_hard)
  const softPercentages = obs_quadrat_benthic_percent.map((item) => item.percent_soft)
  const algaePercentages = obs_quadrat_benthic_percent.map((item) => item.percent_algae)
  const quadratCounts = obs_quadrat_benthic_percent.map((item) => item.quadrat_number)

  return (
    <ObservationsSummaryStats>
      <tbody>
        <Tr>
          <Th>Number of Quadrats</Th>
          <Td>{quadratCounts.length}</Td>
        </Tr>
        <Tr>
          <Th>Avg Hard Coral %</Th>
          <Td>{getAverage(hardPercentages)}</Td>
        </Tr>
        <Tr>
          <Th>Avg Soft Coral %</Th>
          <Td>{getAverage(softPercentages)}</Td>
        </Tr>
        <Tr>
          <Th>Avg Marcroalgae Cover %</Th>
          <Td>{getAverage(algaePercentages)}</Td>
        </Tr>
      </tbody>
    </ObservationsSummaryStats>
  )
}

BleachingPercentCoverSummaryStats.propTypes = {
  obs_quadrat_benthic_percent: observationsQuadratBenthicPercentPropType,
}
BleachingPercentCoverSummaryStats.defaultProps = { obs_quadrat_benthic_percent: [] }

export default BleachingPercentCoverSummaryStats
