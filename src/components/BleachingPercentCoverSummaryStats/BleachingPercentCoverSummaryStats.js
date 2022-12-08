import React from 'react'

import { bleachingRecordPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { getAverage } from '../../library/getAverage'
import { ObservationsSummaryStats } from '../pages/collectRecordFormPages/CollectingFormPage.Styles'
import { Tr, Td, Th } from '../generic/Table/table'

const BleachingPercentCoverSummaryStats = ({ observations }) => {
  const hardPercentages = observations.map((item) => item.percent_hard)
  const softPercentages = observations.map((item) => item.percent_soft)
  const algaePercentages = observations.map((item) => item.percent_algae)
  const quadratCounts = observations.map((item) => item.quadrat_number)

  return (
    <ObservationsSummaryStats>
      <tbody>
        <Tr>
          <Th>Number of Quadrats</Th>
          <Td>{quadratCounts.length}</Td>
        </Tr>
        <Tr>
          <Th>Avg Hard Coral %</Th>
          <Td>{getAverage(hardPercentages).toFixed(1)}</Td>
        </Tr>
        <Tr>
          <Th>Avg Soft Coral %</Th>
          <Td>{getAverage(softPercentages).toFixed(1)}</Td>
        </Tr>
        <Tr>
          <Th>Avg Marcroalgae Cover %</Th>
          <Td>{getAverage(algaePercentages).toFixed(1)}</Td>
        </Tr>
      </tbody>
    </ObservationsSummaryStats>
  )
}

BleachingPercentCoverSummaryStats.propTypes = { observations: bleachingRecordPropType }
BleachingPercentCoverSummaryStats.defaultProps = { observations: [] }

export default BleachingPercentCoverSummaryStats
