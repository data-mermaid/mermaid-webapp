import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
import Thumbnail from '../../ImageClassification/ImageClassificationTable/Thumbnail'
import {
  ImageWrapper,
  TdWithHoverText,
} from '../../ImageClassification/ImageClassificationTable/ImageClassificationObservationTable.styles'

const SubmittedBenthicPhotoQuadratObservationTable = ({
  choices,
  benthicAttributeOptions,
  submittedRecord = undefined,
}) => {
  const { t } = useTranslation()
  const { obs_benthic_photo_quadrats, images, image_classification } = submittedRecord
  const growthFormOptions = getOptions(choices.growthforms.data)

  const quadratLengths = image_classification
    ? obs_benthic_photo_quadrats.reduce((acc, quadrat) => {
        const { quadrat_number } = quadrat

        if (acc[quadrat_number]) {
          acc[quadrat_number] += 1
        } else {
          acc[quadrat_number] = 1
        }

        return acc
      }, {})
    : null

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

  const getThumbnail = (observation, index) => {
    const isFirstRowOfQuadrat =
      observation.quadrat_number !== obs_benthic_photo_quadrats[index - 1]?.quadrat_number

    const image = images.find((img) => img.id === observation.image)

    return isFirstRowOfQuadrat ? (
      <TdWithHoverText
        data-tooltip={image?.original_image_name}
        rowSpan={quadratLengths[observation.quadrat_number]}
      >
        <ImageWrapper>
          <Thumbnail imageUrl={image?.thumbnail} />
        </ImageWrapper>
      </TdWithHoverText>
    ) : null
  }

  const observationBeltFish = obs_benthic_photo_quadrats.map((observation, index) => {
    const { id, quadrat_number, attribute, growth_form, num_points } = observation
    return (
      <Tr key={id}>
        {image_classification && getThumbnail(observation, index)}
        <Td align="center">{index + 1}</Td>
        <Td align="right">{quadrat_number}</Td>
        <Td align="right">{getObjectById(benthicAttributeOptions, attribute)?.label}</Td>
        <Td align="right">{getObjectById(growthFormOptions, growth_form)?.label}</Td>
        <Td align="right">{num_points}</Td>
      </Tr>
    )
  })

  return (
    <>
      <FormSubTitle id="table-label">{t('observations.observations')}</FormSubTitle>
      <Table>
        <thead>
          <Tr>
            {image_classification && <TheadItem>{t('image_classification.thumbnail')}</TheadItem>}
            <TheadItem> </TheadItem>
            <TheadItem align="right">{t('observations.quadrat')}</TheadItem>
            <TheadItem align="right">{t('benthic_observations.benthic_attribute')}</TheadItem>
            <TheadItem align="right">{t('observations.growth_form')}</TheadItem>
            <TheadItem align="right">{t('observations.number_of_points')}</TheadItem>
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
                    <Th>
                      {t('observations.percent_attribute', {
                        attribute: obs.benthicAttribute,
                      })}
                    </Th>
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
