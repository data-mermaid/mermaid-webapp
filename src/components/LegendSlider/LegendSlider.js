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
import { geomorphicColors, benthicColors } from '../../library/mapService'

const InputCheckbox = ({
  labelName,
  checked,
  bgColor,
  fullWidth,
  handleCheckboxChange,
}) => {
  return (
    <CheckBoxLabel htmlFor={labelName} fullWidth={fullWidth}>
      <input
        id={labelName}
        type="checkbox"
        value={checked}
        checked={checked}
        onChange={handleCheckboxChange}
      />
      {labelName}
      {bgColor && <LegendColor bgColor={bgColor} />}
    </CheckBoxLabel>
  )
}

const LegendSlider = ({
  coralMosaicLayer,
  geomorphicLayer,
  allGeomorphicLayersChecked,
  benthicLayer,
  allBenthicLayersChecked,
  handleGeomorphicOption,
  handleCoralMosaicLayer,
  handleSelectAllGeomorphicLayers,
  handleBenthicOption,
  handleSelectAllBenthicLayers,
}) => {
  const [navbarOpen, setNavbarOpen] = useState(true)

  const handleNavbarOpen = () => {
    setNavbarOpen(!navbarOpen)
  }

  const geomorphicList = geomorphicLayer.map((geomorphicObj) => {
    return (
      <InputCheckbox
        key={geomorphicObj.name}
        bgColor={geomorphicColors[geomorphicObj.name]}
        labelName={geomorphicObj.name}
        checked={geomorphicObj.selected}
        handleCheckboxChange={() => handleGeomorphicOption(geomorphicObj)}
        fullWidth
      />
    )
  })

  const benthicOptions = benthicLayer.map((benthicObj) => {
    return (
      <InputCheckbox
        key={benthicObj.name}
        bgColor={benthicColors[benthicObj.name]}
        labelName={benthicObj.name}
        checked={benthicObj.selected}
        handleCheckboxChange={() => handleBenthicOption(benthicObj)}
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
          <InputCheckbox
            labelName="Satellite Coral Reef Mosaic"
            checked={coralMosaicLayer === 1}
            handleCheckboxChange={handleCoralMosaicLayer}
          />
          <details open>
            <summary>
              <InputCheckbox
                labelName="Geomorphic Analysis"
                checked={allGeomorphicLayersChecked}
                handleCheckboxChange={handleSelectAllGeomorphicLayers}
              />
            </summary>
            {geomorphicList}
          </details>
          <details open>
            <summary>
              <InputCheckbox
                labelName="Benthic Analysis"
                checked={allBenthicLayersChecked}
                handleCheckboxChange={handleSelectAllBenthicLayers}
              />
            </summary>
            {benthicOptions}
          </details>
        </LegendBody>
      </SliderLegendPanel>
    </SliderContainer>
  )
}

LegendSlider.propTypes = {
  coralMosaicLayer: PropTypes.number.isRequired,
  geomorphicLayer: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, selected: PropTypes.bool }),
  ).isRequired,
  allGeomorphicLayersChecked: PropTypes.bool.isRequired,
  benthicLayer: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, selected: PropTypes.bool }),
  ).isRequired,
  allBenthicLayersChecked: PropTypes.bool.isRequired,
  handleCoralMosaicLayer: PropTypes.func.isRequired,
  handleGeomorphicOption: PropTypes.func.isRequired,
  handleSelectAllGeomorphicLayers: PropTypes.func.isRequired,
  handleBenthicOption: PropTypes.func.isRequired,
  handleSelectAllBenthicLayers: PropTypes.func.isRequired,
}

InputCheckbox.propTypes = {
  labelName: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  bgColor: PropTypes.string,
  fullWidth: PropTypes.bool,
  handleCheckboxChange: PropTypes.func,
}

InputCheckbox.defaultProps = {
  checked: false,
  bgColor: '',
  fullWidth: false,
  handleCheckboxChange: () => {},
}
LegendSlider.propTypes = {}

export default LegendSlider
