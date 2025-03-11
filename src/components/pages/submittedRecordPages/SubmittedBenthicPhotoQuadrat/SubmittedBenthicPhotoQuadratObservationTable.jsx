import React, { useMemo } from 'react'
import { inputOptionsPropTypes } from '../../../../library/miscPropTypes'
import {
  choicesPropType,
  submittedBenthicPhotoQuadratPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { getObjectById } from '../../../../library/getObjectById'
import { getOptions } from '../../../../library/getOptions'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import { summarizeArrayObjectValuesByProperty } from '../../../../library/summarizeArrayObjectValuesByProperty'
import { ObservationsSummaryStats, Table, Tr, Td, Th } from '../../../generic/Table/table'
import { TheadItem, FormSubTitle, UnderTableRow } from '../SubmittedFormPage.styles'

const SubmittedBenthicPhotoQuadratObservationTable = ({
  choices,
  benthicAttributeOptions,
  submittedRecord = undefined,
}) => {
  const { obs_benthic_photo_quadrats } = submittedRecord
  const growthFormOptions = getOptions(choices.growthforms.data)

  const observationCategoryPercentages = useMemo(() => {
    const addTopCategoryInfoToObservation = obs_benthic_photo_quadrats.map((obs) => {
      const benthicAttribute = getObjectById(benthicAttributeOptions, obs.attribute)

      return { ...obs, top_level_category: benthicAttribute?.topLevelCategory }
    })

    const categoryGroups = addTopCategoryInfoToObservation.reduce((accumulator, obs) => {
      const benthicAttributeName = getObjectById(
        benthicAttributeOptions,
        obs.top_level_category,
      )?.label

      // eslint-disable-next-line no-param-reassign
      accumulator[benthicAttributeName] = accumulator[benthicAttributeName] || []
      accumulator[benthicAttributeName].push(obs)

      return accumulator
    }, {})

    const categoryNames = Object.keys(categoryGroups).sort()
    const totalNumberOfPoints = summarizeArrayObjectValuesByProperty(
      obs_benthic_photo_quadrats,
      'num_points',
    )
    const categoryPercentages = categoryNames.map((category) => {
      const categoryPercentage =
        (summarizeArrayObjectValuesByProperty(categoryGroups[category], 'num_points') /
          totalNumberOfPoints) *
        100

      return {
        benthicAttribute: category,
        benthicAttributePercentage: roundToOneDecimal(categoryPercentage),
      }
    })

    return categoryPercentages
  }, [obs_benthic_photo_quadrats, benthicAttributeOptions])

  const observationBeltFish = obs_benthic_photo_quadrats.map((item, index) => (
    <Tr key={item.id}>
      <Td align="center">{index + 1}</Td>
      <Td align="right">{item.quadrat_number}</Td>
      <Td align="right">{getObjectById(benthicAttributeOptions, item.attribute)?.label}</Td>
      <Td align="right">{getObjectById(growthFormOptions, item.growth_form)?.label}</Td>
      <Td align="right">{item.num_points}</Td>
    </Tr>
  ))

  return (
    <>
      <FormSubTitle id="table-label">Observations</FormSubTitle>
      <Table>
        <thead>
          <Tr>
            <TheadItem> </TheadItem>
            <TheadItem align="right">Quadrat</TheadItem>
            <TheadItem align="right">Benthic Attribute</TheadItem>
            <TheadItem align="right">Growth Form</TheadItem>
            <TheadItem align="right">Number of Points</TheadItem>
          </Tr>
        </thead>
        <tbody>{observationBeltFish}</tbody>
      </Table>
      <UnderTableRow>
        <ObservationsSummaryStats>
          <tbody>
            {observationCategoryPercentages.map((obs) => {
              const isPercentageAvailable = !Number.isNaN(
                parseFloat(obs.benthicAttributePercentage),
              )

              return (
                isPercentageAvailable && (
                  <Tr key={obs.benthicAttribute}>
                    <Th>{`% ${obs.benthicAttribute}`}</Th>
                    <Td>{obs.benthicAttributePercentage}</Td>
                  </Tr>
                )
              )
            })}
          </tbody>
        </ObservationsSummaryStats>
      </UnderTableRow>
    </>
  )
}

SubmittedBenthicPhotoQuadratObservationTable.propTypes = {
  choices: choicesPropType.isRequired,
  benthicAttributeOptions: inputOptionsPropTypes.isRequired,
  submittedRecord: submittedBenthicPhotoQuadratPropType,
}

export default SubmittedBenthicPhotoQuadratObservationTable
