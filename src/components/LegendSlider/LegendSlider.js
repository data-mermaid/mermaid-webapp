import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  SliderContainer,
  SliderHandler,
  SliderHandlerName,
  SliderLegendPanel,
  LegendHeader,
  LegendBody,
  LegendColor,
  CheckBoxLabel,
} from './LegendSlider.styles'
import { IconExternalLink } from '../icons'

const benthicColors = {
  'Coral/Algae': 'rgb(255, 97, 97)',
  'Benthic Microalgae': 'rgb(155, 204, 79)',
  Rock: 'rgb(177, 156, 58)',
  Rubble: 'rgb(224, 208, 94)',
  Sand: 'rgb(255, 255, 190)',
  Seagrass: 'rgb(102, 132, 56)',
}

const geomorphicColors = {
  'Back Reef Slope': 'rgb(190, 251, 255)',
  'Deep Lagoon': 'rgb(44, 162, 249)',
  'Inner Reef Flat': 'rgb(197, 167, 203)',
  'Outer Reef Flat': 'rgb(146, 115, 157)',
  'Patch Reefs': 'rgb(255, 186, 21)',
  Plateau: 'rgb(205, 104, 18)',
  'Reef Crest': 'rgb(97, 66, 114)',
  'Reef Slope': 'rgb(40, 132, 113)',
  'Shallow Lagoon': 'rgb(119, 208, 252)',
  'Sheltered Reef Slope': 'rgb(16, 189, 166)',
  'Small Reef': 'rgb(230, 145, 19)',
  'Terrestrial Reef Flat': 'rgb(251, 222, 251)',
}

const geomorphicArray = Object.keys(geomorphicColors)
const benthicArray = Object.keys(benthicColors)

const InputCheckbox = ({ labelName, bgColor, fullWidth }) => {
  return (
    <CheckBoxLabel htmlFor={labelName} fullWidth={fullWidth}>
      <input id={labelName} type="checkbox" />
      {labelName}
      {bgColor && <LegendColor bgColor={bgColor} />}
    </CheckBoxLabel>
  )
}

const LegendSlider = () => {
  const [navbarOpen, setNavbarOpen] = useState(true)

  const handleNavbarOpen = () => {
    setNavbarOpen(!navbarOpen)
  }

  const geomorphicList = geomorphicArray.map((value) => {
    const geomorphicObj = { name: value, selected: true }

    return (
      <InputCheckbox
        key={geomorphicObj.name}
        labelName={geomorphicObj.name}
        bgColor={geomorphicColors[value]}
        fullWidth
      />
    )
  })

  const benthicOptions = benthicArray.map((value) => {
    const benthicObj = { name: value, selected: true }

    return (
      <InputCheckbox
        key={benthicObj.name}
        labelName={benthicObj.name}
        bgColor={benthicColors[value]}
        fullWidth
      />
    )
  })

  return (
    <SliderContainer open={navbarOpen}>
      <SliderHandler onClick={handleNavbarOpen}>
        <SliderHandlerName>Allen&nbsp;Coral&nbsp;Atlas</SliderHandlerName>
      </SliderHandler>
      <SliderLegendPanel open={navbarOpen}>
        <LegendHeader>
          Allen Coral Atlas{' '}
          <a
            href="https://allencoralatlas.org/atlas"
            target="_blank"
            rel="noreferrer"
          >
            <IconExternalLink />
          </a>
        </LegendHeader>
        <LegendBody>
          <InputCheckbox labelName="Satellite Coral Reef Mosaic" />
          <details open>
            <summary>
              <InputCheckbox labelName="Geomorphic Analysis" />
            </summary>
            {geomorphicList}
          </details>
          <details open>
            <summary>
              <InputCheckbox labelName="Benthic Analysis" />
            </summary>
            {benthicOptions}
          </details>
        </LegendBody>
      </SliderLegendPanel>
    </SliderContainer>
  )
}

InputCheckbox.propTypes = {
  labelName: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  fullWidth: PropTypes.bool,
}

InputCheckbox.defaultProps = {
  bgColor: '',
  fullWidth: false,
}
LegendSlider.propTypes = {}

export default LegendSlider
