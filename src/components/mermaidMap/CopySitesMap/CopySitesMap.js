import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import language from '../../../language'
import {
  satelliteBaseMap,
  addMapController,
  getMapMarkersFeature,
  loadMapMarkersLayer,
  handleMapOnWheel,
} from '../mapService'
import { copySitePropType } from '../../../App/mermaidData/mermaidDataProptypes'
import { MapContainer, MapZoomHelpMessage, MapWrapper } from '../Map.styles'
import usePrevious from '../../../library/usePrevious'

const defaultCenter = [20, 20]
const defaultZoom = 1

const CopySitesMap = ({ sitesForMapMarkers }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const previousSitesForMapMarkers = usePrevious(sitesForMapMarkers)
  const [displayHelpText, setDisplayHelpText] = useState(false)
  const [isMapInitialized, setIsMapInitialized] = useState(false)

  const handleZoomDisplayHelpText = (displayValue) => setDisplayHelpText(displayValue)

  const _initializeMap = useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: satelliteBaseMap,
      center: defaultCenter,
      zoom: defaultZoom,
      maxZoom: 17,
      attributionControl: true,
      customAttribution: language.map.attribution,
    })

    addMapController(map.current)

    map.current.on('load', () => {
      loadMapMarkersLayer(map.current)
      handleMapOnWheel(map.current, handleZoomDisplayHelpText)
      setIsMapInitialized(true)
    })

    // clean up on unmount
    return () => {
      map.current.remove()
    }
  }, [])

  const _updateMapMarkers = useEffect(() => {
    if (!map.current) {
      return
    }

    const { markersData, bounds } = getMapMarkersFeature(sitesForMapMarkers)

    if (
      isMapInitialized ||
      JSON.stringify(sitesForMapMarkers) !== JSON.stringify(previousSitesForMapMarkers)
    ) {
      if (map.current.getSource('mapMarkers') !== undefined) {
        map.current.getSource('mapMarkers').setData(markersData)
      }
      if (sitesForMapMarkers.length > 0) {
        map.current.fitBounds(bounds, { padding: 25, animate: false })
      }
    }
  }, [isMapInitialized, sitesForMapMarkers, previousSitesForMapMarkers])

  return (
    <MapContainer>
      <MapWrapper ref={mapContainer} minHeight="30vh" />
      {displayHelpText && (
        <MapZoomHelpMessage>{language.pages.siteTable.controlZoomText}</MapZoomHelpMessage>
      )}
    </MapContainer>
  )
}

CopySitesMap.propTypes = {
  sitesForMapMarkers: PropTypes.arrayOf(copySitePropType).isRequired,
}

export default CopySitesMap
