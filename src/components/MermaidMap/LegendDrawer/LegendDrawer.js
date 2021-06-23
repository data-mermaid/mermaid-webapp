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
} from './LegendDrawer.styles'
import { IconExternalLink } from '../../icons'
import { geomorphicColors, benthicColors } from '../mapService'

const LegendCheckbox = ({
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

const LegendDrawer = ({
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
  const [drawerOpen, setDrawerOpen] = useState(true)

  const handleLegendVisibilityToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const geomorphicList = geomorphicLayer.map((geomorphicObj) => {
    return (
      <LegendCheckbox
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
      <LegendCheckbox
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
    <SliderContainer isOpen={drawerOpen}>
      <SliderHandler onClick={handleLegendVisibilityToggle}>
        <SliderHandlerName>Allen&nbsp;Coral&nbsp;Atlas</SliderHandlerName>
      </SliderHandler>
      <SliderLegendPanel isOpen={drawerOpen}>
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
          <LegendCheckbox
            labelName="Satellite Coral Reef Mosaic"
            checked={coralMosaicLayer === 1}
            handleCheckboxChange={handleCoralMosaicLayer}
          />
          <details open>
            <summary>
              <LegendCheckbox
                labelName="Geomorphic Analysis"
                checked={allGeomorphicLayersChecked}
                handleCheckboxChange={handleSelectAllGeomorphicLayers}
              />
            </summary>
            {geomorphicList}
          </details>
          <details open>
            <summary>
              <LegendCheckbox
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

LegendDrawer.propTypes = {
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

LegendCheckbox.propTypes = {
  labelName: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  bgColor: PropTypes.string,
  fullWidth: PropTypes.bool,
  handleCheckboxChange: PropTypes.func,
}

LegendCheckbox.defaultProps = {
  checked: false,
  bgColor: '',
  fullWidth: false,
  handleCheckboxChange: () => {},
}
LegendDrawer.propTypes = {}

export default LegendDrawer
