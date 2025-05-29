import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import { inputOptionsPropTypes } from '../../library/miscPropTypes'
import { roundToOneDecimal } from '../../library/numbers/roundToOneDecimal'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'
import { ObservationsSummaryStats, Td, Th, Tr } from '../generic/Table/table'

const BenthicPitLitObservationSummaryStats = ({
  benthicAttributeSelectOptions,
  observations = [],
  transectLengthSurveyed = null
}) => {
  const observationTopLevelAttributeCategoryOccurance = useMemo(() => {
    const transectLengthSurveyedInCm = Number(transectLengthSurveyed) * 100

    const getBenthicAttributeById = (benthicAttributeId) =>
      benthicAttributeSelectOptions.find((benthic) => benthic.value === benthicAttributeId)

    const observationsWithTopLevelCategoryNames = observations.map((observation) => {
      const benthicAttribute = getBenthicAttributeById(observation.attribute)
      const topLevelCategory = getBenthicAttributeById(benthicAttribute?.topLevelCategory)
      
      return {
        ...observation,
        topLevelCategoryName: topLevelCategory?.label || 'Missing benthic attribute',
      }
    })

    const observationsGroupedByTopLevelCategory = observationsWithTopLevelCategoryNames.reduce(
      (accumulator, observation) => {
        const { topLevelCategoryName } = observation
        
        accumulator[topLevelCategoryName] = accumulator[topLevelCategoryName] || []
        accumulator[topLevelCategoryName].push(observation)

        return accumulator
      },
      {},
    )
    
    const topLevelCategoryStats = Object.entries(observationsGroupedByTopLevelCategory)
      .map(([topLevelCategory, categoryObservations]) => {
        if (transectLengthSurveyedInCm === 0) {
          return { topLevelCategory, percent: 0 }
        }

        const topLevelCategoryTotalLength = categoryObservations.reduce(
          (total, observation) => total + Number(observation.length || 0),
          0,
        )
        
        const percent = roundToOneDecimal(
          (topLevelCategoryTotalLength / transectLengthSurveyedInCm) * 100,
        )
        
        return { topLevelCategory, percent }
      })

    return sortArrayByObjectKey(topLevelCategoryStats, 'topLevelCategory')
  }, [observations, benthicAttributeSelectOptions, transectLengthSurveyed])

  return (transectLengthSurveyed ?
    <ObservationsSummaryStats>
      <tbody>
        {observationTopLevelAttributeCategoryOccurance.map((occurance) => {
          const isPercentageAvailable = !Number.isNaN(parseFloat(occurance.percent))

          return (
            isPercentageAvailable && (
              <Tr key={occurance.topLevelCategory}>
                <Th>{`% ${occurance.topLevelCategory}`}</Th>
                <Td>{occurance.percent}</Td>
              </Tr>
            )
          )
        })}
      </tbody>
    </ObservationsSummaryStats> : null
  )
}

BenthicPitLitObservationSummaryStats.propTypes = {
  benthicAttributeSelectOptions: inputOptionsPropTypes.isRequired,
  observations: PropTypes.arrayOf(PropTypes.shape({})),
  transectLengthSurveyed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default BenthicPitLitObservationSummaryStats
