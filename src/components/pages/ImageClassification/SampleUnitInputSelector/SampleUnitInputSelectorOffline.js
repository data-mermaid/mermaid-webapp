import React from 'react'
import { SelectorContainer, TextContainer } from './SampleUnitInputSelector.styles'
import { H3 } from '../../../generic/text'
import language from '../../../../language'

const SampleUnitInputSelectorOffline = () => {
  return (
    <SelectorContainer>
      <TextContainer>
        <H3 htmlFor="image-classification-selection">
          {language.imageClassification.sampleUnitInputSelector.offlineHeader}
        </H3>
        <p>{language.imageClassification.sampleUnitInputSelector.offlineBody}</p>
      </TextContainer>
    </SelectorContainer>
  )
}

export default SampleUnitInputSelectorOffline