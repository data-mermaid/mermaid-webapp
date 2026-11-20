import React, { useId, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { roundToOneDecimal } from '../library/numbers/roundToOneDecimal'
import { sortArrayByObjectKey } from '../library/arrays/sortArrayByObjectKey'
import { ObservationsSummaryStats, Td, Th, Tr } from './generic/Table/table'
import { ButtonThatLooksLikeLink } from './generic/buttons'
import { IconDown, IconUp } from './icons'
import { CoralAttributeIdsByType, getBleachedStatusPercents } from '../library/bleachingStatus'
import { useTranslation } from 'react-i18next'
import { InputOption } from '../App/mermaidData/mermaidDataTypes'

interface BenthicAttribute extends InputOption {
  topLevelCategory: string
}

interface Observation {
  attribute: string
  bleaching_status?: number | null
  growth_form: string
  id: string
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
  coralAttributeIdsByType?: CoralAttributeIdsByType
  includeBleaching?: boolean
  observations: Observation[]
  recordType: 'pit' | 'lit'
}

const CoralTypeToggle = styled(ButtonThatLooksLikeLink)`
  padding: 0;
  font-weight: inherit;
`

interface BleachingCoralTypeRowsProps {
  coralAttributeIds: Set<string>
  isOpenOnLoad: boolean
  label: string
  observations: Observation[]
  recordType: 'pit' | 'lit'
}

const BleachingCoralTypeRows = ({
  coralAttributeIds,
  isOpenOnLoad,
  label,
  observations,
  recordType,
}: BleachingCoralTypeRowsProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(isOpenOnLoad)
  const statusRowsId = useId()

  return (
    <>
      <tbody>
        <Tr>
          <Th colSpan={2}>
            <CoralTypeToggle
              type="button"
              aria-expanded={isOpen}
              aria-controls={statusRowsId}
              onClick={() => setIsOpen(!isOpen)}
            >
              {label} {isOpen ? <IconUp /> : <IconDown />}
            </CoralTypeToggle>
          </Th>
        </Tr>
      </tbody>
      <tbody id={statusRowsId} hidden={!isOpen}>
        {getBleachedStatusPercents(observations, coralAttributeIds, recordType).map(
          ({ id, translationKey, percent }) => (
            <Tr key={id}>
              <Th>{`% ${t(translationKey)}`}</Th>
              <Td>{percent}</Td>
            </Tr>
          ),
        )}
      </tbody>
    </>
  )
}

// TopLevelCategory = TLC
//LIT records: category percentage = (sum of TLC obs lengths / sum of all obs lengths) * 100
//PIT records: category percentage = (TLC obs count)  / (total category obs) * 100
/** These observation calculations are based on the observations provided in the table for on-the-fly user visualization of the total observations given so far. The total length of all observations is checked against the form recorded survey length in the API on validation**/
const BenthicPitLitObservationSummaryStats = ({
  benthicAttributeSelectOptions,
  coralAttributeIdsByType = undefined,
  includeBleaching = false,
  observations,
  recordType,
}: BenthicPitLitObservationSummaryStatsProps) => {
  const { t } = useTranslation()

  const missingBenthicAttributeLabel = t('benthic_observations.missing_benthic_attribute')

  const observationCategoryStats = useMemo(() => {
    const getBenthicAttributeById = (benthicAttributeId: string) =>
      benthicAttributeSelectOptions.find((benthic) => benthic.value === benthicAttributeId)

    const observationsMatchedWithCategories: ObservationWithAttributeCategory[] = observations.map(
      (observation: Observation) => {
        const benthicAttribute = getBenthicAttributeById(observation.attribute)
        const topLevelCategory = getBenthicAttributeById(benthicAttribute?.topLevelCategory)
        return {
          ...observation,
          topLevelCategoryName: topLevelCategory?.label || missingBenthicAttributeLabel,
        }
      },
    )

    //group observations TO the top level category name
    const observationsGroupedByTopLevelCategory: Record<string, Observation[]> =
      observationsMatchedWithCategories.reduce((accumulator, observation) => {
        const { topLevelCategoryName } = observation

        accumulator[topLevelCategoryName] = accumulator[topLevelCategoryName] || []
        accumulator[topLevelCategoryName].push(observation)

        return accumulator
      }, {})

    const topLevelCategoryStats: CategoryStat[] = Object.entries(
      observationsGroupedByTopLevelCategory,
    ).map(([topLevelCategory, categoryObservations]) => {
      let topLevelCategorySum: number
      let totalObservationsSum: number

      //LIT
      if (recordType === 'lit') {
        totalObservationsSum = observations.reduce((total, observation) => {
          return total + Number(observation.length)
        }, 0)
        if (totalObservationsSum === 0) {
          return { topLevelCategory, percent: '0.0' }
        }
        topLevelCategorySum = categoryObservations.reduce((total, observation) => {
          return total + Number(observation.length)
        }, 0)
      } else {
        //PIT
        topLevelCategorySum = categoryObservations.length
        totalObservationsSum = observations.length
      }

      const percent =
        topLevelCategorySum === 0 && totalObservationsSum === 0
          ? '0.0'
          : roundToOneDecimal((topLevelCategorySum / totalObservationsSum) * 100)

      return { topLevelCategory, percent }
    })

    return sortArrayByObjectKey(topLevelCategoryStats, 'topLevelCategory')
  }, [observations, benthicAttributeSelectOptions, recordType, missingBenthicAttributeLabel])

  return (
    <ObservationsSummaryStats>
      <tbody>
        <Tr>
          <Th colSpan={2}>{t('observations.benthic_cover_heading')}</Th>
        </Tr>
        {observationCategoryStats.map((occurrence: CategoryStat) => {
          return (
            <Tr key={occurrence.topLevelCategory}>
              <Th>{`% ${occurrence.topLevelCategory}`}</Th>
              <Td>{occurrence.percent}</Td>
            </Tr>
          )
        })}
      </tbody>
      {includeBleaching && coralAttributeIdsByType ? (
        <>
          <tbody>
            <Tr>
              <Th colSpan={2}>{t('observations.bleaching_summary_heading')}</Th>
            </Tr>
          </tbody>
          <BleachingCoralTypeRows
            coralAttributeIds={coralAttributeIdsByType.hardCoral}
            isOpenOnLoad={true}
            label={t('observations.hard_coral')}
            observations={observations}
            recordType={recordType}
          />
          <BleachingCoralTypeRows
            coralAttributeIds={coralAttributeIdsByType.softCoral}
            isOpenOnLoad={false}
            label={t('observations.soft_coral')}
            observations={observations}
            recordType={recordType}
          />
        </>
      ) : null}
    </ObservationsSummaryStats>
  )
}

export default BenthicPitLitObservationSummaryStats
