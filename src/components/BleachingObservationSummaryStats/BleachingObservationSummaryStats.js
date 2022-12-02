import React from 'react'
import { obsColoniesBleachedPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { Tr, Td, Th } from '../generic/Table/table'
import {
  ObservationsSummaryStats,
  UnderTableRow,
} from '../pages/submittedRecordPages/SubmittedFormPage.styles'

const BleachingObservationSummaryStats = ({ obsColoniesBleached }) => {
  const getTotalOfColonies = () => {
    const totals = obsColoniesBleached.map(
      (item) =>
        item.count_20 +
        item.count_50 +
        item.count_80 +
        item.count_100 +
        item.count_dead +
        item.count_normal +
        item.count_pale,
    )

    return totals.reduce((acc, currentVal) => acc + currentVal, 0)
  }

  const getTotalOfCoralGenera = () => {
    const attributeIds = obsColoniesBleached.map((item) => item.attribute)
    const uniqueAttributeIds = [...new Set(attributeIds)]

    return uniqueAttributeIds.length
  }

  const getPercentageOfColonies = (colonyType) => {
    let totals = 0

    if (colonyType === 'bleached') {
      totals = obsColoniesBleached.map(
        (item) => item.count_20 + item.count_50 + item.count_80 + item.count_100 + item.count_dead,
      )
    } else {
      totals = obsColoniesBleached.map((item) => item[colonyType])
    }

    return (
      (totals.reduce((acc, currentVal) => acc + currentVal, 0) / getTotalOfColonies()) *
      100
    ).toFixed(1)
  }

  return (
    <UnderTableRow>
      <ObservationsSummaryStats>
        <tbody>
          <Tr>
            <Th>Total number of colonies</Th>
            <Td>{getTotalOfColonies()}</Td>
          </Tr>
          <Tr>
            <Th>Total number of coral genera</Th>
            <Td>{getTotalOfCoralGenera()}</Td>
          </Tr>
          <Tr>
            <Th>% Normal colonies</Th>
            <Td>{getPercentageOfColonies('count_normal')}</Td>
          </Tr>
          <Tr>
            <Th>% Pale colonies</Th>
            <Td>{getPercentageOfColonies('count_pale')}</Td>
          </Tr>
          <Tr>
            <Th>% Bleached colonies</Th>
            <Td>{getPercentageOfColonies('bleached')}</Td>
          </Tr>
        </tbody>
      </ObservationsSummaryStats>
    </UnderTableRow>
  )
}

BleachingObservationSummaryStats.propTypes = {
  obsColoniesBleached: obsColoniesBleachedPropType,
}

BleachingObservationSummaryStats.defaultProps = {
  obsColoniesBleached: undefined,
}

export default BleachingObservationSummaryStats
