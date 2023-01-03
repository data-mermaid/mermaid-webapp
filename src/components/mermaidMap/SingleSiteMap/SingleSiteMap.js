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
const defaultZoom = 1

const SingleSiteMap = ({
  formLatitudeValue,
  formLongitudeValue,
  handleLatitudeChange,
  handleLongitudeChange,
  isReadOnlyUser,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const recordMarker = useRef(null)
  const [displayHelpText, setDisplayHelpText] = useState(false)

  const handleZoomDisplayHelpText = (displayValue) => setDisplayHelpText(displayValue)

  const _initializeMap = useEffect(() => {
    const markerElement = document.createElement('div')

    markerElement.id = 'marker'

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: satelliteBaseMap,
      center: defaultCenter,
      zoom: defaultZoom,
      maxZoom: 16,
      attributionControl: true,
      customAttribution: language.map.attribution,
    })

    recordMarker.current = new maplibregl.Marker(markerElement)

    addMapController(map.current)

    map.current.on('load', () => {
      loadACALayers(map.current)
      handleMapOnWheel(map.current, handleZoomDisplayHelpText)
    })

    map.current.on('click', (event) => {
      if (!isReadOnlyUser) {
        const { lngLat } = event

        recordMarker.current.setLngLat(lngLat)

        // Adjust lng at international dateline
        let adjustedLng = lngLat.lng

        if (lngLat.lng < -180) {
          adjustedLng = 360 + lngLat.lng
        } else if (lngLat.lng > 180) {
          adjustedLng = lngLat.lng - 360
        }

        handleLatitudeChange(lngLat.lat)
        handleLongitudeChange(adjustedLng)
      }
    })

    // clean up on unmount
    return () => {
      map.current.remove()
      recordMarker.current.remove()
    }
  }, [isReadOnlyUser, handleLatitudeChange, handleLongitudeChange])

  useEffect(
    function centerMapOnMarker() {
      if (!map.current) {
        return
      }

      const outOfRangeLatitude = formLatitudeValue > 90 || formLatitudeValue < -90
      const nullishLatitudeOrLongitude = !formLatitudeValue || !formLongitudeValue

      if (outOfRangeLatitude || nullishLatitudeOrLongitude) {
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
          zoom: map.current.getZoom(),
        })
      }
    },
    [formLatitudeValue, formLongitudeValue],
  )

  const updateCoralMosaicLayer = (dataLayerFromLocalStorage) =>
    setCoralMosaicLayerProperty(map.current, dataLayerFromLocalStorage)

  const updateGeomorphicLayers = (dataLayerFromLocalStorage) =>
    setGeomorphicOrBenthicLayerProperty(map.current, 'atlas-geomorphic', dataLayerFromLocalStorage)

  const updateBenthicLayers = (dataLayerFromLocalStorage) =>
    setGeomorphicOrBenthicLayerProperty(map.current, 'atlas-benthic', dataLayerFromLocalStorage)

  return (
    <MapInputRow noBorderWidth={isReadOnlyUser}>
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
  handleLatitudeChange: PropTypes.func,
  handleLongitudeChange: PropTypes.func,
  isReadOnlyUser: PropTypes.bool,
}

SingleSiteMap.defaultProps = {
  formLatitudeValue: 0,
  formLongitudeValue: 0,
  handleLatitudeChange: () => {},
  handleLongitudeChange: () => {},
  isReadOnlyUser: false,
}

export default SingleSiteMap
