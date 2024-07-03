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
} from './AtlasLegendDrawer.styles'
import { IconExternalLink } from '../../icons'
import { geomorphicColors, benthicColors } from '../mapService'

const geomorphicKeyNames = Object.keys(geomorphicColors)
const benthicKeyNames = Object.keys(benthicColors)

const LegendCheckbox = ({
  labelName,
  checked = false,
  bgColor = '',
  fullWidth = false,
  handleCheckboxChange = () => {},
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

const AtlasLegendDrawer = ({
  updateCoralMosaicLayer,
  updateGeomorphicLayers,
  updateBenthicLayers,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const coralMosaicLocalStorage = JSON.parse(localStorage.getItem('coral_mosaic'))
  const geomorphicLocalStorage = JSON.parse(localStorage.getItem('geomorphic_legend'))
  const benthicLocalStorage = JSON.parse(localStorage.getItem('benthic_legend'))

  const loadLegendArrayLayer = (storageArray, legendKeyNameArray) => {
    const legendArray = storageArray || legendKeyNameArray

    return legendKeyNameArray.map((value) => {
      const updatedGeomorphic = {
        name: value,
        selected: legendArray.includes(value),
      }

      return updatedGeomorphic
    })
  }

  const [coralMosaicLayer, setCoralMosaicLayer] = useState(
    coralMosaicLocalStorage !== null ? coralMosaicLocalStorage : 1,
  )

  const [geomorphicLayer, setGeomorphicLayer] = useState(
    loadLegendArrayLayer(geomorphicLocalStorage, geomorphicKeyNames),
  )
  const [allGeomorphicLayersChecked, setAllGeomorphicLayersChecked] = useState(
    geomorphicLocalStorage ? geomorphicLocalStorage.length === geomorphicKeyNames.length : true,
  )
  const [benthicLayer, setBenthicLayer] = useState(
    loadLegendArrayLayer(benthicLocalStorage, benthicKeyNames),
  )
  const [allBenthicLayersChecked, setAllBenthicLayersChecked] = useState(
    benthicLocalStorage ? benthicLocalStorage.length === benthicKeyNames.length : true,
  )

  const handleLegendVisibilityToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const getUpdatedLayerOption = (layer, item) => {
    return layer.map((value) => {
      if (value.name === item.name) {
        return { ...value, selected: !item.selected }
      }

      return value
    })
  }

  const getFilterSelectedOption = (updatedLayer) =>
    updatedLayer.filter(({ selected }) => selected).map(({ name }) => name)

  const handleCoralMosaicLayer = () => {
    const coralMosaicResult = coralMosaicLayer ? 0 : 1

    localStorage.setItem('coral_mosaic', coralMosaicResult)
    setCoralMosaicLayer(coralMosaicResult)
    updateCoralMosaicLayer(coralMosaicResult)
  }

  const handleGeomorphicOption = (item) => {
    const legendMaxLength = geomorphicLayer.length
    const updatedLayerOption = getUpdatedLayerOption(geomorphicLayer, item)

    const filterSelectedLayerOption = getFilterSelectedOption(updatedLayerOption)

    localStorage.setItem('geomorphic_legend', JSON.stringify(filterSelectedLayerOption))
    setAllGeomorphicLayersChecked(filterSelectedLayerOption.length === legendMaxLength)
    setGeomorphicLayer(updatedLayerOption)
    updateGeomorphicLayers(filterSelectedLayerOption)
  }

  const handleBenthicOption = (item) => {
    const legendMaxLength = benthicLayer.length
    const updatedLayerOption = getUpdatedLayerOption(benthicLayer, item)
    const filterSelectedLayerOption = getFilterSelectedOption(updatedLayerOption)

    localStorage.setItem('benthic_legend', JSON.stringify(filterSelectedLayerOption))
    setAllBenthicLayersChecked(filterSelectedLayerOption.length === legendMaxLength)
    setBenthicLayer(updatedLayerOption)
    updateBenthicLayers(filterSelectedLayerOption)
  }

  const handleSelectAllGeomorphicLayers = () => {
    const updatedLayerOption = geomorphicLayer.map((value) => {
      return { ...value, selected: !allGeomorphicLayersChecked }
    })

    const filterSelectedLayerOption = getFilterSelectedOption(updatedLayerOption)

    localStorage.setItem('geomorphic_legend', JSON.stringify(filterSelectedLayerOption))
    setAllGeomorphicLayersChecked(!allGeomorphicLayersChecked)
    setGeomorphicLayer(updatedLayerOption)
    updateGeomorphicLayers(filterSelectedLayerOption)
  }

  const handleSelectAllBenthicLayers = () => {
    const updatedLayerOption = benthicLayer.map((value) => {
      return { ...value, selected: !allBenthicLayersChecked }
    })

    const filterSelectedLayerOption = getFilterSelectedOption(updatedLayerOption)

    localStorage.setItem('benthic_legend', JSON.stringify(filterSelectedLayerOption))
    setAllBenthicLayersChecked(!allBenthicLayersChecked)
    setBenthicLayer(updatedLayerOption)
    updateBenthicLayers(filterSelectedLayerOption)
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
            aria-label="Visit Allan Coral Atlas"
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

AtlasLegendDrawer.propTypes = {
  updateCoralMosaicLayer: PropTypes.func.isRequired,
  updateGeomorphicLayers: PropTypes.func.isRequired,
  updateBenthicLayers: PropTypes.func.isRequired,
}

LegendCheckbox.propTypes = {
  labelName: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  bgColor: PropTypes.string,
  fullWidth: PropTypes.bool,
  handleCheckboxChange: PropTypes.func,
}

AtlasLegendDrawer.propTypes = {}

export default AtlasLegendDrawer
