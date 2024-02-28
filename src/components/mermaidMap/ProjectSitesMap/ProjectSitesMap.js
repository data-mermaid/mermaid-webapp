import React, { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
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
  loadACALayers,
  getMapMarkersFeature,
  loadMapMarkersLayer,
  handleMapOnWheel,
} from '../mapService'
import { MapContainer, MapWrapper, MapZoomHelpMessage } from '../Map.styles'
import Popup from '../Popup'
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
      loadACALayers(map.current)
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

    const handleSourceData = () => {
      if (map.current.getSource('mapMarkers') !== undefined) {
        map.current.getSource('mapMarkers').setData(markersData)
      }
    }

    if (
      isMapInitialized ||
      JSON.stringify(sitesForMapMarkers) !== JSON.stringify(previousSitesForMapMarkers)
    ) {
      // Add event listener for sourcedata event
      map.current.on('sourcedata', handleSourceData)

      if (sitesForMapMarkers.length > 0) {
        map.current.fitBounds(bounds, { padding: 25, animate: false })
      }
    }

    // eslint-disable-next-line consistent-return
    return () => {
      map.current.off('sourcedata', handleSourceData)
    }
  }, [isMapInitialized, sitesForMapMarkers, previousSitesForMapMarkers])

  const _handleMapMarkersEvent = useEffect(() => {
    if (!map.current) {
      return
    }

    map.current.on('click', 'mapMarkers', (e) => {
      const popupNode = document.createElement('div')
      const reactRoot = createRoot(popupNode)
      const coordinates = e.features[0].geometry.coordinates.slice()
      const markerProperty = e.features[0].properties

      reactRoot.render(<Popup properties={markerProperty} choices={choices} />)
      popUpRef.current.setLngLat(coordinates).setDOMContent(popupNode).addTo(map.current)
    })

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.current.on('mouseenter', 'mapMarkers', () => {
      map.current.getCanvas().style.cursor = 'pointer'
    })

    // Change it back to a pointer when it leaves.
    map.current.on('mouseleave', 'mapMarkers', () => {
      map.current.getCanvas().style.cursor = ''
    })
  }, [choices])

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
    </MapContainer>
  )
}

ProjectSitesMap.propTypes = {
  sitesForMapMarkers: PropTypes.arrayOf(sitePropType).isRequired,
  choices: choicesPropType.isRequired,
}

export default ProjectSitesMap
