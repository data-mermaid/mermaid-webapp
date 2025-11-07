import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import { useTranslation } from 'react-i18next'
import { satelliteBaseMap, addZoomController } from '../mapService'
import { MapInputRow, MapContainer, MapWrapper } from '../Map.styles'

const defaultCenter = [0, 0]
const defaultZoom = 13

const ResolveDuplicateSiteMap = ({ formLatitudeValue = 0, formLongitudeValue = 0 }) => {
  const { t } = useTranslation()
  const mapContainer = useRef(null)
  const map = useRef(null)
  const recordMarker = useRef(null)

  const mapAttribution = t('map.attribution')

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
      customAttribution: mapAttribution,
    })

    addZoomController(map.current)

    recordMarker.current = new maplibregl.Marker(markerElement, { draggable: false })

    // clean up on unmount
    return () => {
      map.current.remove()
      recordMarker.current.remove()
    }
  }, [mapAttribution])

  const _handleMapMarker = useEffect(() => {
    if (!map.current) {
      return
    }

    recordMarker.current.setLngLat([formLongitudeValue, formLatitudeValue]).addTo(map.current)

    if (formLatitudeValue !== undefined && formLongitudeValue !== undefined) {
      map.current.jumpTo({
        center: [formLongitudeValue, formLatitudeValue],
        zoom: map.current.getZoom(),
      })
    }
  }, [formLatitudeValue, formLongitudeValue])

  return (
    <MapInputRow noBorderWidth>
      <MapContainer>
        <MapWrapper ref={mapContainer} minHeight="20vh" />
      </MapContainer>
    </MapInputRow>
  )
}

ResolveDuplicateSiteMap.propTypes = {
  formLatitudeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  formLongitudeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default ResolveDuplicateSiteMap
