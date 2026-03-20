import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
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
import { geomorphicColors, benthicColors, atlasLegendNames } from '../mapService'

const geomorphicKeys = Object.keys(geomorphicColors)
const benthicKeys = Object.keys(benthicColors)

const LegendCheckbox = ({
  labelName,
  checked = false,
  bgColor = '',
  fullWidth = false,
  handleCheckboxChange = () => {},
}) => {
  return (
    <CheckBoxLabel htmlFor={labelName} $fullWidth={fullWidth}>
      <input
        id={labelName}
        type="checkbox"
        value={checked}
        checked={checked}
        onChange={handleCheckboxChange}
      />
      {labelName}
      {bgColor && <LegendColor $bgColor={bgColor} />}
    </CheckBoxLabel>
  )
}

const AtlasLegendDrawer = ({
  updateCoralMosaicLayer,
  updateGeomorphicLayers,
  updateBenthicLayers,
}) => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(true)
  const coralMosaicLocalStorage = JSON.parse(localStorage.getItem('coral_mosaic'))
  const geomorphicLocalStorage = JSON.parse(localStorage.getItem('geomorphic_legend'))
  const benthicLocalStorage = JSON.parse(localStorage.getItem('benthic_legend'))

  const allenCoralAtlasText = t('map.legend.allen_coral_atlas')

  const loadLegendArrayLayer = (storageKeys, legendKeys) => {
    const legends = storageKeys || legendKeys

    return legendKeys.map((key) => ({
      id: key,
      name: t(`atlas_legend_drawer.${key}`),
      selected: legends.includes(key),
    }))
  }

  const [coralMosaicLayer, setCoralMosaicLayer] = useState(
    coralMosaicLocalStorage !== null ? coralMosaicLocalStorage : 1,
  )

  const [geomorphicLayer, setGeomorphicLayer] = useState(
    loadLegendArrayLayer(geomorphicLocalStorage, geomorphicKeys),
  )
  const [allGeomorphicLayersChecked, setAllGeomorphicLayersChecked] = useState(
    geomorphicLocalStorage ? geomorphicLocalStorage.length === geomorphicKeys.length : true,
  )
  const [benthicLayer, setBenthicLayer] = useState(
    loadLegendArrayLayer(benthicLocalStorage, benthicKeys),
  )

  const [allBenthicLayersChecked, setAllBenthicLayersChecked] = useState(
    benthicLocalStorage ? benthicLocalStorage.length === benthicKeys.length : true,
  )

  const handleLegendVisibilityToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const getUpdatedLayerOption = (layer, item) => {
    return layer.map((layerItem) => {
      if (layerItem.id === item.id) {
        return { ...layerItem, selected: !item.selected }
      }

      return layerItem
    })
  }

  const getSelectedLayerAtlasNames = (updatedLayer) =>
    updatedLayer.filter(({ selected }) => selected).map(({ id }) => atlasLegendNames[id])

  const getSelectedLayerIds = (updatedLayer) =>
    updatedLayer.filter(({ selected }) => selected).map(({ id }) => id)

  const handleCoralMosaicLayer = () => {
    const coralMosaicResult = coralMosaicLayer ? 0 : 1

    localStorage.setItem('coral_mosaic', coralMosaicResult)
    setCoralMosaicLayer(coralMosaicResult)
    updateCoralMosaicLayer(coralMosaicResult)
  }

  const handleGeomorphicOption = (item) => {
    const updatedLayers = getUpdatedLayerOption(geomorphicLayer, item)
    const selectedLayerNames = getSelectedLayerAtlasNames(updatedLayers)
    const selectedLayerIds = JSON.stringify(getSelectedLayerIds(updatedLayers))

    localStorage.setItem('geomorphic_legend', selectedLayerIds)
    setAllGeomorphicLayersChecked(selectedLayerNames.length === geomorphicLayer.length)
    setGeomorphicLayer(updatedLayers)
    updateGeomorphicLayers(selectedLayerNames)
  }

  const handleBenthicOption = (item) => {
    const updatedLayers = getUpdatedLayerOption(benthicLayer, item)
    const selectedLayerNames = getSelectedLayerAtlasNames(updatedLayers)
    const selectedLayerIds = JSON.stringify(getSelectedLayerIds(updatedLayers))

    localStorage.setItem('benthic_legend', selectedLayerIds)
    setAllBenthicLayersChecked(selectedLayerNames.length === benthicLayer.length)
    setBenthicLayer(updatedLayers)
    updateBenthicLayers(selectedLayerNames)
  }

  const handleSelectAllGeomorphicLayers = () => {
    const updatedLayers = geomorphicLayer.map((layer) => {
      return { ...layer, selected: !allGeomorphicLayersChecked }
    })

    const selectedLayerNames = getSelectedLayerAtlasNames(updatedLayers)
    const selectedLayerIds = JSON.stringify(getSelectedLayerIds(updatedLayers))

    localStorage.setItem('geomorphic_legend', selectedLayerIds)
    setAllGeomorphicLayersChecked(!allGeomorphicLayersChecked)
    setGeomorphicLayer(updatedLayers)
    updateGeomorphicLayers(selectedLayerNames)
  }

  const handleSelectAllBenthicLayers = () => {
    const updatedLayers = benthicLayer.map((layer) => {
      return { ...layer, selected: !allBenthicLayersChecked }
    })

    const selectedLayerNames = getSelectedLayerAtlasNames(updatedLayers)
    const selectedLayerIds = JSON.stringify(getSelectedLayerIds(updatedLayers))

    localStorage.setItem('benthic_legend', selectedLayerIds)
    setAllBenthicLayersChecked(!allBenthicLayersChecked)
    setBenthicLayer(updatedLayers)
    updateBenthicLayers(selectedLayerNames)
  }

  const geomorphicList = geomorphicLayer.map((geomorphicObj) => {
    return (
      <LegendCheckbox
        key={geomorphicObj.id}
        bgColor={geomorphicColors[geomorphicObj.id]}
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
        key={benthicObj.id}
        bgColor={benthicColors[benthicObj.id]}
        labelName={benthicObj.name}
        checked={benthicObj.selected}
        handleCheckboxChange={() => handleBenthicOption(benthicObj)}
        fullWidth
      />
    )
  })

  return (
    <>
      <SliderHandler $isOpen={drawerOpen} onClick={handleLegendVisibilityToggle}>
        <SliderHandlerName>{allenCoralAtlasText.replace(/\s/g, '\u00A0')}</SliderHandlerName>
      </SliderHandler>
      <SliderContainer $isOpen={drawerOpen}>
        <SliderLegendPanel $isOpen={drawerOpen}>
          <LegendHeader>
            {allenCoralAtlasText}{' '}
            <a
              href="https://allencoralatlas.org/atlas"
              target="_blank"
              rel="noreferrer"
              aria-label={t('map.legend.visit_allen_coral_atlas')}
            >
              <IconExternalLink />
            </a>
          </LegendHeader>
          <LegendBody>
            <LegendCheckbox
              labelName={t('map.legend.satellite_coral_reef_mosaic')}
              checked={coralMosaicLayer === 1}
              handleCheckboxChange={handleCoralMosaicLayer}
            />
            <details open>
              <summary>
                <LegendCheckbox
                  labelName={t('map.legend.geomorphic_analysis')}
                  checked={allGeomorphicLayersChecked}
                  handleCheckboxChange={handleSelectAllGeomorphicLayers}
                />
              </summary>
              {geomorphicList}
            </details>
            <details open>
              <summary>
                <LegendCheckbox
                  labelName={t('map.legend.benthic_analysis')}
                  checked={allBenthicLayersChecked}
                  handleCheckboxChange={handleSelectAllBenthicLayers}
                />
              </summary>
              {benthicOptions}
            </details>
          </LegendBody>
        </SliderLegendPanel>
      </SliderContainer>
    </>
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
