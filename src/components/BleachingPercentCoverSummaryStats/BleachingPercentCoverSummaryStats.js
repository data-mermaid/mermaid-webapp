/* eslint-disable no-console */
import React from 'react'

import { observationsQuadratBenthicPercentPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { getAverage } from '../../library/getAverage'
import { ObservationsSummaryStats } from '../pages/collectRecordFormPages/CollectingFormPage.Styles'
import { Tr, Td, Th } from '../generic/Table/table'

const BleachingPercentCoverSummaryStats = ({ observations }) => {
  const hardPercentages = observations.map((item) => Number(item.percent_hard))
  const softPercentages = observations.map((item) => Number(item.percent_soft))
  const algaePercentages = observations.map((item) => Number(item.percent_algae))
  const quadratCounts = observations.map((item) => Number(item.quadrat_number))

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
  observations: observationsQuadratBenthicPercentPropType,
}
BleachingPercentCoverSummaryStats.defaultProps = { observations: [] }

export default BleachingPercentCoverSummaryStats
