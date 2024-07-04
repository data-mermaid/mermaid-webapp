import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import language from '../../../language'
import AtlasLegendDrawer from '../AtlasLegendDrawer'
import { sitePropType, choicesPropType } from '../../../App/mermaidData/mermaidDataProptypes'
import {
  satelliteBaseMap,
  addZoomController,
  setCoralMosaicLayerProperty,
  setGeomorphicOrBenthicLayerProperty,
  getMapMarkersFeature,
  handleMapOnWheel,
  addClusterSourceAndLayers,
  addClusterEventListeners,
} from '../mapService'
import { MapContainer, MiniMapContainer, MapWrapper, MapZoomHelpMessage } from '../Map.styles'
import MiniMap from '../MiniMap'
import usePrevious from '../../../library/usePrevious'

const defaultCenter = [20, 20]
const defaultZoom = 2

const ProjectSitesMap = ({ sitesForMapMarkers, choices }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const popUpRef = useRef(new maplibregl.Popup({ offset: 10 }))
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

    addZoomController(map.current)

    map.current.on('load', () => {
      addClusterSourceAndLayers(map.current, sitesForMapMarkers)
      addClusterEventListeners(map.current, popUpRef, choices)
      handleMapOnWheel(map.current, handleZoomDisplayHelpText)
      setIsMapInitialized(true)
    })

    // clean up on unmount
    return () => {
      map.current.remove()
    }
  }, [sitesForMapMarkers, choices])

  const _updateMapMarkers = useEffect(() => {
    if (!map.current || !isMapInitialized) {
      return
    }

    const { markersData, bounds } = getMapMarkersFeature(sitesForMapMarkers)

    const handleSourceData = () => {
      if (map.current.getSource('mapMarkers') !== undefined) {
        map.current.getSource('mapMarkers').setData(markersData)
      }
    }

    map.current.on('sourcedata', handleSourceData)

    if (sitesForMapMarkers.length > 0) {
      map.current.fitBounds(bounds, { padding: 25, animate: false })
    }

    // eslint-disable-next-line consistent-return
    return () => {
      map.current.off('sourcedata', handleSourceData)
    }
  }, [isMapInitialized, sitesForMapMarkers, previousSitesForMapMarkers])

  const updateCoralMosaicLayer = (dataLayerFromLocalStorage) =>
    setCoralMosaicLayerProperty(map.current, dataLayerFromLocalStorage)

  const updateGeomorphicLayers = (dataLayerFromLocalStorage) =>
    setGeomorphicOrBenthicLayerProperty(map.current, 'atlas-geomorphic', dataLayerFromLocalStorage)

  const updateBenthicLayers = (dataLayerFromLocalStorage) =>
    setGeomorphicOrBenthicLayerProperty(map.current, 'atlas-benthic', dataLayerFromLocalStorage)

  return (
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
      {map.current ? (
        <MiniMapContainer>
          <MiniMap mainMap={map.current} />
        </MiniMapContainer>
      ) : null}
    </MapContainer>
  )
}

ProjectSitesMap.propTypes = {
  sitesForMapMarkers: PropTypes.arrayOf(sitePropType).isRequired,
  choices: choicesPropType.isRequired,
}

export default ProjectSitesMap
