import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import { inputOptionsPropTypes } from '../../library/miscPropTypes'
import { roundToOneDecimal } from '../../library/numbers/roundToOneDecimal'
import { sortArrayByObjectKey } from '../../library/arrays/sortArrayByObjectKey'
import { ObservationsSummaryStats, Td, Th, Tr } from '../generic/Table/table'

const BenthicPitLitObservationSummaryStats = ({
  benthicAttributeSelectOptions,
  observations = [],
}) => {
  const observationTopLevelAttributeCategoryOccurance = useMemo(() => {
    const totalNumberOfObservations = observations.length

    const getBenthicAttributeById = (benthicAttributeId) =>
      benthicAttributeSelectOptions.find((benthic) => benthic.value === benthicAttributeId)

    const observationsWithTopLevelCategoryNames = observations.map((observation) => {
      const benthicAttribute = getBenthicAttributeById(observation.attribute)

      return {
        ...observation,
        topLevelCategoryName: getBenthicAttributeById(benthicAttribute?.topLevelCategory)?.label,
      }
    })

    const observationsGroupedByTopLevelCategory = observationsWithTopLevelCategoryNames.reduce(
      (accumulator, observation) => {
        const { topLevelCategoryName } = observation
        // eslint-disable-next-line no-param-reassign
        accumulator[topLevelCategoryName] = accumulator[topLevelCategoryName] || []
        accumulator[topLevelCategoryName].push(observation)

        return accumulator
      },
      {},
    )

    const topLevelCategoryNamesWithObservationOccurance = Object.entries(
      observationsGroupedByTopLevelCategory,
    ).map(([topLevelCategory, observationsBelongingToTopLevelCategory]) => ({
      topLevelCategory,
      percent: roundToOneDecimal(
        (observationsBelongingToTopLevelCategory.length / totalNumberOfObservations) * 100,
      ),
    }))

    return sortArrayByObjectKey(topLevelCategoryNamesWithObservationOccurance, 'topLevelCategory')
  }, [observations, benthicAttributeSelectOptions])

  return (
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
    </ObservationsSummaryStats>
  )
}

BenthicPitLitObservationSummaryStats.propTypes = {
  benthicAttributeSelectOptions: inputOptionsPropTypes.isRequired,
  observations: PropTypes.arrayOf(PropTypes.shape({})),
}

export default BenthicPitLitObservationSummaryStats
