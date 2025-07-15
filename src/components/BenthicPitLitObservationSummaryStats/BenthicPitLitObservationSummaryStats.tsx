import React, { useMemo } from 'react'
import { roundToOneDecimal } from '../../library/numbers/roundToOneDecimal'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'
import { ObservationsSummaryStats, Td, Th, Tr } from '../generic/Table/table'
import { useTranslation } from 'react-i18next'
import { InputOption } from '../../App/mermaidData/mermaidDataTypes'

interface BenthicAttribute extends InputOption {
  topLevelCategory: string
}

interface Observation {
  attribute: string
  growth_form: string
  id: string
  interval?: string //PIT records
  interval_size?: number
  length?: number //LIT records
}

interface ObservationWithAttributeCategory extends Observation {
  topLevelCategoryName: string
}

interface CategoryStat {
  topLevelCategory: string
  percent: string
}

interface BenthicPitLitObservationSummaryStatsProps {
  benthicAttributeSelectOptions: BenthicAttribute[]
  observations?: Observation[]
  transectLengthSurveyed?: number
}

const BenthicPitLitObservationSummaryStats = ({
  benthicAttributeSelectOptions,
  observations,
  transectLengthSurveyed,
}: BenthicPitLitObservationSummaryStatsProps) => {
  const { t } = useTranslation()
  const missingBenthicAttributeLabel = t('benthic_observations.missing_benthic_attribute')

  const observationCategoryStats = useMemo(() => {
    const transectLengthSurveyedInCm = transectLengthSurveyed * 100

    const getBenthicAttributeById = (benthicAttributeId: string) =>
      benthicAttributeSelectOptions.find((benthic) => benthic.value === benthicAttributeId)

    const observationsWithTopLevelCategoryNames: ObservationWithAttributeCategory[] =
      observations.map((observation: Observation) => {
        const benthicAttribute = getBenthicAttributeById(observation.attribute)
        const topLevelCategory = getBenthicAttributeById(benthicAttribute?.topLevelCategory)
        return {
          ...observation,
          topLevelCategoryName: topLevelCategory?.label || missingBenthicAttributeLabel,
        }
      })

    //group observations TO the top level category name
    const observationsGroupedByTopLevelCategory: Record<string, Observation[]> =
      observationsWithTopLevelCategoryNames.reduce((accumulator, observation) => {
        const { topLevelCategoryName } = observation

        accumulator[topLevelCategoryName] = accumulator[topLevelCategoryName] || []
        accumulator[topLevelCategoryName].push(observation)

        return accumulator
      }, {})

    const topLevelCategoryStats: CategoryStat[] = Object.entries(
      observationsGroupedByTopLevelCategory,
    ).map(([topLevelCategory, categoryObservations]) => {
      let percent = '0'
      if (transectLengthSurveyedInCm === 0) {
        return { topLevelCategory, percent }
      }

      const topLevelCategoryTotalLength = categoryObservations.reduce((total, observation) => {
        const observationMeasurementLength = observation.interval_size
          ? observation.interval_size * 100
          : observation.length
        return total + observationMeasurementLength
      }, 0)

      percent = roundToOneDecimal((topLevelCategoryTotalLength / transectLengthSurveyedInCm) * 100)

      return { topLevelCategory, percent }
    })

    return sortArrayByObjectKey(topLevelCategoryStats, 'topLevelCategory')
  }, [
    observations,
    benthicAttributeSelectOptions,
    transectLengthSurveyed,
    missingBenthicAttributeLabel,
  ])

  return (
    <ObservationsSummaryStats>
      <tbody>
        {observationCategoryStats.map((occurrence: CategoryStat) => {
          return (
            <Tr key={occurrence.topLevelCategory}>
              <Th>{`% ${occurrence.topLevelCategory}`}</Th>
              <Td>{occurrence.percent}</Td>
            </Tr>
          )
        })}
      </tbody>
    </ObservationsSummaryStats>
  )
}

export default BenthicPitLitObservationSummaryStats
