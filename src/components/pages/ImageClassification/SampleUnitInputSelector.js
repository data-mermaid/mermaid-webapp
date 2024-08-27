import React from 'react'
import { ButtonPrimary, ButtonSecondary } from '../../generic/buttons'
import { H3 } from '../../generic/text'
import { IconSparkles, IconPen } from '../../icons'
import styled from 'styled-components/macro'
import language from '../../../language'
import theme from '../../../theme'
import PropTypes from 'prop-types'

const ButtonText = styled.span`
  margin-left: 0.8rem;
`

const ButtonContainer = styled.div`
  margin-bottom: 1rem;
`

const SelectorContainer = styled.div`
  padding: 1rem;
  background-color: ${theme.color.grey5};
  margin-left: 1rem;
  margin-top: 3rem;
`

const TextContainer = styled.div`
  max-width: 68rem;
`

const SampleUnitInputSelector = ({ setIsImageClassification }) => {
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
        <ButtonPrimary type="button" onClick={handleSampleUnitChange(true)}>
          <IconSparkles />
          <ButtonText>{language.imageClassification.sampleUnitInputSelector.button1}</ButtonText>
        </ButtonPrimary>
      </ButtonContainer>
      <ButtonContainer>
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
}

export default SampleUnitInputSelector
