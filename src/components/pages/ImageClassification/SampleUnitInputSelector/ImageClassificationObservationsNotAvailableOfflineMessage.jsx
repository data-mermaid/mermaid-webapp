import React from 'react'
import { SelectorContainer, TextContainer } from './BpqObservationTypeSelector.styles'
import { H3 } from '../../../generic/text'
import { useTranslation } from 'react-i18next'

const ImageClassificationObservationsNotAvailableOfflineMessage = () => {
  const { t } = useTranslation()
  return (
    <SelectorContainer>
      <TextContainer>
        <H3 htmlFor="image-classification-selection">
          {t('sample_units.errors.observations_unavailable_offline')}
        </H3>
        <p>{t('sample_units.errors.classification_unavailable_offline')}</p>
      </TextContainer>
    </SelectorContainer>
  )
}

export default ImageClassificationObservationsNotAvailableOfflineMessage
