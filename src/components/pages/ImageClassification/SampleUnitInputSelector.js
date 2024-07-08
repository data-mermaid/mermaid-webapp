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
  background-color: ${theme.color.grey3};
  margin-left: 1rem;
`

const SampleUnitInputSelector = ({ setObservationTableType }) => {
  const handleSampleUnitChange = (type) => () => {
    setObservationTableType(type)
  }

  return (
    <SelectorContainer>
      <H3 htmlFor="image-classification-selection">
        {language.imageClassification.sampleUnitInputSelector.title}
      </H3>
      <p>{language.imageClassification.sampleUnitInputSelector.description}</p>
      <ButtonContainer>
        <ButtonPrimary type="button" onClick={handleSampleUnitChange('image-classification')}>
          <IconSparkles />
          <ButtonText>{language.imageClassification.sampleUnitInputSelector.button1}</ButtonText>
        </ButtonPrimary>
      </ButtonContainer>
      <ButtonContainer>
        <ButtonSecondary type="button" onClick={handleSampleUnitChange('manual-input')}>
          <IconPen />
          <ButtonText>{language.imageClassification.sampleUnitInputSelector.button2}</ButtonText>
        </ButtonSecondary>
      </ButtonContainer>
    </SelectorContainer>
  )
}

SampleUnitInputSelector.propTypes = {
  setObservationTableType: PropTypes.func.isRequired,
}

export default SampleUnitInputSelector
