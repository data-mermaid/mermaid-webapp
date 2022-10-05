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
import { MapContainer, CopySitesMapWrapper, MapZoomHelpMessage } from '../Map.styles'
import usePrevious from '../../../library/usePrevious'

const defaultCenter = [20, 20]
const defaultZoom = 1

const CopySitesMap = ({ sitesForMapMarkers }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const previousSitesForMapMarkers = usePrevious(sitesForMapMarkers)
  const [displayHelpText, setDisplayHelpText] = useState(false)
  const [isMapInitialIzed, setIsMapInitialIzed] = useState(false)

  const handleZoomDisplayHelpText = (displayValue) => setDisplayHelpText(displayValue)

  const _initializeMap = useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: satelliteBaseMap,
      center: defaultCenter,
      zoom: defaultZoom,
      maxZoom: 17,
      attributionControl: true,
      customAttribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community &copy; <a href="http://www.allencoralatlas.org/"  style="font-size:1.25rem;">2019 Allen Coral Atlas Partnership and Vulcan, Inc.</a>',
    })

    addMapController(map.current)

    map.current.on('load', () => {
      loadMapMarkersLayer(map.current)
      handleMapOnWheel(map.current, handleZoomDisplayHelpText)
      setIsMapInitialIzed(true)
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
      isMapInitialIzed ||
      JSON.stringify(sitesForMapMarkers) !== JSON.stringify(previousSitesForMapMarkers)
    ) {
      if (map.current.getSource('mapMarkers') !== undefined) {
        map.current.getSource('mapMarkers').setData(markersData)
      }
      if (sitesForMapMarkers.length > 0) {
        map.current.fitBounds(bounds, { padding: 25, animate: false })
      }
    }
  }, [isMapInitialIzed, sitesForMapMarkers, previousSitesForMapMarkers])

  return (
    <MapContainer>
      <CopySitesMapWrapper ref={mapContainer} />
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
