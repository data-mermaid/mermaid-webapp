import React from 'react'
import { ButtonPrimary, ButtonSecondary } from '../../../generic/buttons'
import { H3 } from '../../../generic/text'
import { IconSparkles, IconPen } from '../../../icons'
import language from '../../../../language'
import PropTypes from 'prop-types'
import {
  ButtonContainer,
  ButtonText,
  OfflineText,
  SelectorContainer,
  TextContainer,
} from './SampleUnitInputSelector.styles'

const SampleUnitInputSelector = ({ setIsImageClassification, isAppOnline }) => {
  const handleSampleUnitChange = (type) => () => {
    setIsImageClassification(type)
  }

  return (
    <SelectorContainer>
      <TextContainer>
        <H3 htmlFor="image-classification-selection">
          {language.imageClassification.sampleUnitInputSelector.title}
        </H3>
        <p>{language.imageClassification.sampleUnitInputSelector.description}</p>
      </TextContainer>
      <ButtonContainer>
        <div>
        {!isAppOnline ? <OfflineText>Unavailable offline.</OfflineText> : null}
        <ButtonPrimary type="button" onClick={handleSampleUnitChange(true)} disabled={!isAppOnline}>
          <IconSparkles />
          <ButtonText>{language.imageClassification.sampleUnitInputSelector.button1}</ButtonText>
        </ButtonPrimary>
        </div>
        <ButtonSecondary type="button" onClick={handleSampleUnitChange(false)}>
          <IconPen />
          <ButtonText>{language.imageClassification.sampleUnitInputSelector.button2}</ButtonText>
        </ButtonSecondary>
      </ButtonContainer>
    </SelectorContainer>
  )
}

SampleUnitInputSelector.propTypes = {
  setIsImageClassification: PropTypes.func.isRequired,
  isAppOnline: PropTypes.bool.isRequired,
}

export default SampleUnitInputSelector
