import React from 'react'
import { useTranslation } from 'react-i18next'
import { observationsColoniesBleachedPropType } from '../../App/mermaidData/mermaidDataProptypes'
import { ObservationsSummaryStats, Td, Th, Tr } from '../generic/Table/table'

// Collect records are free-form JSON, so a row written by another client can leave a count out.
const toCount = (value) => Number(value) || 0

const BleachincColoniesBleachedSummaryStats = ({ observationsColoniesBleached = [] }) => {
  const { t } = useTranslation()
  const getTotalOfColonies = () => {
    const totals = observationsColoniesBleached.map((item) => {
      return (
        toCount(item.count_20) +
        toCount(item.count_50) +
        toCount(item.count_80) +
        toCount(item.count_100) +
        toCount(item.count_dead) +
        toCount(item.count_normal) +
        toCount(item.count_pale)
      )
    })

    return totals.reduce((acc, currentVal) => acc + currentVal, 0)
  }

  const getTotalOfCoralGenera = () =>
    new Set(observationsColoniesBleached.map((item) => item.attribute).filter(Boolean)).size

  const getPercentageOfColonies = (colonyType) => {
    if (!observationsColoniesBleached.length || getTotalOfColonies() === 0) {
      return 0
    }

    let totals

    if (colonyType === 'bleached') {
      totals = observationsColoniesBleached.map((item) => {
        return (
          toCount(item.count_20) +
          toCount(item.count_50) +
          toCount(item.count_80) +
          toCount(item.count_100) +
          toCount(item.count_dead)
        )
      })
    } else {
      totals = observationsColoniesBleached.map((item) => toCount(item[colonyType]))
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
          <Th>{t('observations.total_colonies')}</Th>
          <Td>{getTotalOfColonies()}</Td>
        </Tr>
        <Tr>
          <Th>{t('observations.total_coral_genera')}</Th>
          <Td>{getTotalOfCoralGenera()}</Td>
        </Tr>
        <Tr>
          <Th>{t('observations.percent_normal_colonies')}</Th>
          <Td>{getPercentageOfColonies('count_normal')}</Td>
        </Tr>
        <Tr>
          <Th>{t('observations.percent_pale_colonies')}</Th>
          <Td>{getPercentageOfColonies('count_pale')}</Td>
        </Tr>
        <Tr>
          <Th>{t('observations.percent_bleached_colonies')}</Th>
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
