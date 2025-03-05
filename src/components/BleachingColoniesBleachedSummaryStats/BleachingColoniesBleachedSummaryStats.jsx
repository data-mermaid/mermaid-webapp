import React from 'react'
import { observationsColoniesBleachedPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { ObservationsSummaryStats, Td, Th, Tr } from '../generic/Table/table'

const BleachincColoniesBleachedSummaryStats = ({ observationsColoniesBleached = [] }) => {
  const getTotalOfColonies = () => {
    const totals = observationsColoniesBleached.map((item) => {
      return (
        Number(item.count_20) +
        Number(item.count_50) +
        Number(item.count_80) +
        Number(item.count_100) +
        Number(item.count_dead) +
        Number(item.count_normal) +
        Number(item.count_pale)
      )
    })

    return totals.reduce((acc, currentVal) => acc + currentVal, 0)
  }

  const getTotalOfCoralGenera = () => {
    const attributeIds = observationsColoniesBleached.filter((item) => item.attribute)
    const uniqueAttributeIds = [...new Set(attributeIds)]

    return uniqueAttributeIds.length
  }

  const getPercentageOfColonies = (colonyType) => {
    if (!observationsColoniesBleached.length || getTotalOfColonies() === 0) {
      return 0
    }

    let totals

    if (colonyType === 'bleached') {
      totals = observationsColoniesBleached.map((item) => {
        return (
          Number(item.count_20) +
          Number(item.count_50) +
          Number(item.count_80) +
          Number(item.count_100) +
          Number(item.count_dead)
        )
      })
    } else {
      totals = observationsColoniesBleached.map((item) => Number(item[colonyType]))
    }

    return (
      (totals.reduce((acc, currentVal) => acc + currentVal, 0) / getTotalOfColonies()) *
      100
    ).toFixed(1)
  }

  return (
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
  )
}

BleachincColoniesBleachedSummaryStats.propTypes = {
  observationsColoniesBleached: observationsColoniesBleachedPropType,
}

export default BleachincColoniesBleachedSummaryStats
