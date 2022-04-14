import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import language from '../../../language'
import AtlasLegendDrawer from '../AtlasLegendDrawer'
import {
  satelliteBaseMap,
  addMapController,
  setCoralMosaicLayerProperty,
  setGeomorphicOrBenthicLayerProperty,
  loadACALayers,
  handleMapOnWheel,
} from '../mapService'
import { MapInputRow, MapContainer, MapWrapper, MapZoomHelpMessage } from '../Map.styles'

const defaultCenter = [0, 0]
const defaultZoom = 11

const SingleSiteMap = ({
  formLatitudeValue,
  formLongitudeValue,
  handleLatitudeChange,
  handleLongitudeChange,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const recordMarker = useRef(null)
  const [displayHelpText, setDisplayHelpText] = useState(false)

  const handleZoomDisplayHelpText = (displayValue) => setDisplayHelpText(displayValue)

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

    recordMarker.current = new maplibregl.Marker({ draggable: true })

    addMapController(map.current)

    map.current.on('load', () => {
      loadACALayers(map.current)
      handleMapOnWheel(map.current, handleZoomDisplayHelpText)
    })

    // clean up on unmount
    return () => {
      map.current.remove()
      recordMarker.current.remove()
    }
  }, [])

  const _handleMapMarker = useEffect(() => {
    if (!map.current) {
      return
    }

    const outOfRangeLatitude = formLatitudeValue > 90 || formLatitudeValue < -90

    if (outOfRangeLatitude) {
      recordMarker.current.remove()
    } else {
      recordMarker.current.setLngLat([formLongitudeValue, formLatitudeValue]).addTo(map.current)
    }

    if (
      formLatitudeValue !== undefined &&
      formLongitudeValue !== undefined &&
      !outOfRangeLatitude
    ) {
      map.current.jumpTo({
        center: [formLongitudeValue, formLatitudeValue],
        zoom: defaultZoom,
      })
    }
  }, [formLatitudeValue, formLongitudeValue])

  const _handleMapMarkerOnDrag = useEffect(() => {
    recordMarker.current.on('dragend', () => {
      const lngLat = recordMarker.current.getLngLat()

      handleLatitudeChange(lngLat.lat)
      handleLongitudeChange(lngLat.lng)
    })
  }, [handleLatitudeChange, handleLongitudeChange])

  const updateCoralMosaicLayer = (dataLayerFromLocalStorage) =>
    setCoralMosaicLayerProperty(map.current, dataLayerFromLocalStorage)

  const updateGeomorphicLayers = (dataLayerFromLocalStorage) =>
    setGeomorphicOrBenthicLayerProperty(map.current, 'atlas-geomorphic', dataLayerFromLocalStorage)

  const updateBenthicLayers = (dataLayerFromLocalStorage) =>
    setGeomorphicOrBenthicLayerProperty(map.current, 'atlas-benthic', dataLayerFromLocalStorage)

  return (
    <MapInputRow>
      <MapContainer>
        <MapWrapper ref={mapContainer} />
        {displayHelpText && (
          <MapZoomHelpMessage>{language.pages.siteTable.controlZoomText}</MapZoomHelpMessage>
        )}
        <AtlasLegendDrawer
          updateCoralMosaicLayer={updateCoralMosaicLayer}
          updateGeomorphicLayers={updateGeomorphicLayers}
          updateBenthicLayers={updateBenthicLayers}
        />
      </MapContainer>
    </MapInputRow>
  )
}

SingleSiteMap.propTypes = {
  formLatitudeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  formLongitudeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleLatitudeChange: PropTypes.func.isRequired,
  handleLongitudeChange: PropTypes.func.isRequired,
}

SingleSiteMap.defaultProps = {
  formLatitudeValue: 0,
  formLongitudeValue: 0,
}

export default SingleSiteMap
