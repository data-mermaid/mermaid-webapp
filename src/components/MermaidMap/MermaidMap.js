import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import maplibregl from 'maplibre-gl'
import theme from '../../theme'
import LegendDrawer from './LegendDrawer'
import {
  satelliteBaseMap,
  applyOpacityExpression,
  loadACALayers,
  geomorphicColors,
  benthicColors,
} from './mapService'

const MapWrapper = styled.div`
  height: 400px;
  border-top: ${theme.spacing.borderXLarge} solid ${theme.color.secondaryColor};
  border-bottom: ${theme.spacing.borderXLarge} solid
    ${theme.color.secondaryColor};
`

const MapContainer = styled.div`
  position: relative;
  overflow: hidden;
`

const geomorphicKeyNames = Object.keys(geomorphicColors)
const benthicKeyNames = Object.keys(benthicColors)

const recordMarker = new maplibregl.Marker({ draggable: true })
const defaultCenter = [0, 0]
const defaultZoom = 11

const MermaidMap = ({
  formLatitudeValue,
  formLongitudeValue,
  handleLatitudeChange,
  handleLongitudeChange,
}) => {
  // MermaidMap 'remembers' for each machine (doesnt care about multi user)
  // which layers were selected in the legend and visible on the map from the last visit
  // using local storage
  const coralMosaicLocalStorage = JSON.parse(
    localStorage.getItem('coral_mosaic'),
  )
  const geomorphicLocalStorage = JSON.parse(
    localStorage.getItem('geomorphic_legend'),
  )
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
    geomorphicLocalStorage
      ? geomorphicLocalStorage.length === geomorphicKeyNames.length
      : true,
  )
  const [benthicLayer, setBenthicLayer] = useState(
    loadLegendArrayLayer(benthicLocalStorage, benthicKeyNames),
  )
  const [allBenthicLayersChecked, setAllBenthicLayersChecked] = useState(
    benthicLocalStorage
      ? benthicLocalStorage.length === benthicKeyNames.length
      : true,
  )

  const mapContainer = useRef(null)
  const map = useRef(null)

  const _initializeMap = useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: satelliteBaseMap,
      center: defaultCenter,
      zoom: defaultZoom,
      maxZoom: 16,
      attributionControl: true,
      customAttribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community &copy; <a href="http://www.allencoralatlas.org/"  style="font-size:1.25rem;">2019 Allen Coral Atlas Partnership and Vulcan, Inc.</a>',
    })

    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        showZoom: true,
      }),
      'top-left',
    )
    map.current.dragRotate.disable()
    map.current.touchZoomRotate.disableRotation()

    map.current.on('load', () => {
      loadACALayers(map.current)
    })

    // clean up on unmount
    return () => map.current.remove()
  }, [])

  const _updateCoralMosaicLayer = useEffect(() => {
    if (!map.current) return

    if (map.current.getLayer('atlas-planet') !== undefined) {
      map.current.setPaintProperty(
        'atlas-planet',
        'raster-opacity',
        coralMosaicLayer,
      )
    }
  }, [coralMosaicLayer])

  const _updateGeomorphicLayers = useEffect(() => {
    if (!map.current) return

    if (map.current.getLayer('atlas-geomorphic') !== undefined) {
      map.current.setPaintProperty(
        'atlas-geomorphic',
        'fill-opacity',
        applyOpacityExpression(geomorphicLocalStorage),
      )
    }
  }, [geomorphicLocalStorage])

  const _updateBenthicLayers = useEffect(() => {
    if (!map.current) return

    if (map.current.getLayer('atlas-benthic') !== undefined) {
      map.current.setPaintProperty(
        'atlas-benthic',
        'fill-opacity',
        applyOpacityExpression(benthicLocalStorage),
      )
    }
  }, [benthicLocalStorage])

  const _handleMapMarker = useEffect(() => {
    if (!map.current) return

    recordMarker.remove()
    const outOfRangeLatLng =
      formLatitudeValue > 90 ||
      formLatitudeValue < -90 ||
      formLongitudeValue > 180 ||
      formLongitudeValue < -180

    if (outOfRangeLatLng) {
      // remove marker when lat/lng values are undefined or out of range.
      recordMarker.remove()
    } else {
      recordMarker
        .setLngLat([formLongitudeValue, formLatitudeValue])
        .addTo(map.current)
    }

    recordMarker.on('dragend', () => {
      const lngLat = recordMarker.getLngLat()

      handleLatitudeChange(lngLat.lat)
      handleLongitudeChange(lngLat.lng)
    })

    if (
      formLatitudeValue !== undefined &&
      formLongitudeValue !== undefined &&
      !outOfRangeLatLng
    ) {
      map.current.jumpTo({
        center: [formLongitudeValue, formLatitudeValue],
        zoom: defaultZoom,
      })
    }
  }, [formLatitudeValue, formLongitudeValue])

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
  }

  const handleGeomorphicOption = (item) => {
    const legendMaxLength = geomorphicLayer.length
    const updatedLayerOption = getUpdatedLayerOption(geomorphicLayer, item)

    const filterSelectedLayerOption = getFilterSelectedOption(
      updatedLayerOption,
    )

    localStorage.setItem(
      'geomorphic_legend',
      JSON.stringify(filterSelectedLayerOption),
    )
    setAllGeomorphicLayersChecked(
      filterSelectedLayerOption.length === legendMaxLength,
    )
    setGeomorphicLayer(updatedLayerOption)
  }

  const handleBenthicOption = (item) => {
    const legendMaxLength = benthicLayer.length
    const updatedLayerOption = getUpdatedLayerOption(benthicLayer, item)
    const filterSelectedLayerOption = getFilterSelectedOption(
      updatedLayerOption,
    )

    localStorage.setItem(
      'benthic_legend',
      JSON.stringify(filterSelectedLayerOption),
    )
    setAllBenthicLayersChecked(
      filterSelectedLayerOption.length === legendMaxLength,
    )
    setBenthicLayer(updatedLayerOption)
  }

  const handleSelectAllGeomorphicLayers = () => {
    const updatedLayerOption = geomorphicLayer.map((value) => {
      return { ...value, selected: !allGeomorphicLayersChecked }
    })

    const filterSelectedLayerOption = getFilterSelectedOption(
      updatedLayerOption,
    )

    localStorage.setItem(
      'geomorphic_legend',
      JSON.stringify(filterSelectedLayerOption),
    )
    setAllGeomorphicLayersChecked(!allGeomorphicLayersChecked)
    setGeomorphicLayer(updatedLayerOption)
  }

  const handleSelectAllBenthicLayers = () => {
    const updatedLayerOption = benthicLayer.map((value) => {
      return { ...value, selected: !allBenthicLayersChecked }
    })

    const filterSelectedLayerOption = getFilterSelectedOption(
      updatedLayerOption,
    )

    localStorage.setItem(
      'benthic_legend',
      JSON.stringify(filterSelectedLayerOption),
    )
    setAllBenthicLayersChecked(!allBenthicLayersChecked)
    setBenthicLayer(updatedLayerOption)
  }

  return (
    <MapContainer>
      <MapWrapper ref={mapContainer} />
      <LegendDrawer
        coralMosaicLayer={coralMosaicLayer}
        geomorphicLayer={geomorphicLayer}
        allGeomorphicLayersChecked={allGeomorphicLayersChecked}
        benthicLayer={benthicLayer}
        allBenthicLayersChecked={allBenthicLayersChecked}
        handleCoralMosaicLayer={handleCoralMosaicLayer}
        handleGeomorphicOption={handleGeomorphicOption}
        handleSelectAllGeomorphicLayers={handleSelectAllGeomorphicLayers}
        handleBenthicOption={handleBenthicOption}
        handleSelectAllBenthicLayers={handleSelectAllBenthicLayers}
      />
    </MapContainer>
  )
}

MermaidMap.propTypes = {
  formLatitudeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  formLongitudeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleLatitudeChange: PropTypes.func.isRequired,
  handleLongitudeChange: PropTypes.func.isRequired,
}

MermaidMap.defaultProps = {
  formLatitudeValue: 0,
  formLongitudeValue: 0,
}

export default MermaidMap
