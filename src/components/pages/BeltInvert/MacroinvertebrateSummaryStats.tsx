import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  MacroinvertebrateObservationsSummaryStats,
  Tr,
  Td,
  Th,
} from '../../generic/Table/table'
import { roundToOneDecimal } from '../../../library/numbers/roundToOneDecimal'

interface MacroinvertebrateSummaryStatsProps {
  densityByGoi: Record<string, number>
  totalDensity: number
  abundance: number
}

const MacroinvertebrateSummaryStats = ({
  densityByGoi,
  totalDensity,
  abundance,
}: MacroinvertebrateSummaryStatsProps) => {
  const { t } = useTranslation()

  return (
    <MacroinvertebrateObservationsSummaryStats>
      {Object.entries(densityByGoi).length > 0 && (
        <thead>
          <Tr>
            <Th colSpan={2}>
              {t('macroinvertebrate_observations.density_by_group_of_interest_units')}
            </Th>
          </Tr>
        </thead>
      )}
      <tbody>
        {Object.entries(densityByGoi).map(([groupName, density]) => {
          return (
            <Tr key={groupName}>
              <Th className="goi-density">{groupName}</Th>
              <Td>{roundToOneDecimal(density)}</Td>
            </Tr>
          )
        })}
        <Tr>
          <Th>{t('observations.total_density_units')}</Th>
          <Td>{roundToOneDecimal(totalDensity)}</Td>
        </Tr>
        <Tr>
          <Th>{t('total_abundance')}</Th>
          <Td>{abundance.toFixed(1)}</Td>
        </Tr>
      </tbody>
    </MacroinvertebrateObservationsSummaryStats>
  )
}

export default MacroinvertebrateSummaryStats
