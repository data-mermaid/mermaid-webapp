import React, { useState, useEffect, useRef, useCallback } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import language from '../../../language'
import AtlasLegendDrawer from '../AtlasLegendDrawer'
import { sitePropType, choicesPropType } from '../../../App/mermaidData/mermaidDataProptypes'
import {
  satelliteBaseMap,
  addMapController,
  setCoralMosaicLayerProperty,
  setGeomorphicOrBenthicLayerProperty,
  loadACALayers,
  loadMapMarkers,
} from '../mapService'
import { MapContainer, MapWrapper, MapZoomHelpMessage } from '../Map.styles'
import Popup from '../Popup'

const defaultCenter = [20, 20]
const defaultZoom = 2

const ProjectSitesMap = ({ sites, choices, rowValues }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const popUpRef = useRef(new maplibregl.Popup({ offset: 10 }))
  const [displayHelpText, setDisplayHelpText] = useState(false)
  const filteredRecordIds = rowValues.map((record) => record.original.id)
  const filteredSiteRecords = sites.filter((site) => filteredRecordIds.includes(site.id))

  const handleMapOnWheel = useCallback((mapCurrent) => {
    mapCurrent.on('wheel', (e) => {
      if (e.originalEvent.ctrlKey) {
        e.originalEvent.preventDefault()
        setDisplayHelpText(false)
        if (!mapCurrent.scrollZoom._enabled) {
          mapCurrent.scrollZoom.enable()
        }
      } else {
        if (mapCurrent.scrollZoom._enabled) {
          mapCurrent.scrollZoom.disable()
        }
        setDisplayHelpText(true)
        setTimeout(() => {
          setDisplayHelpText(false)
        }, 1500)
      }
    })
  }, [])

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

    addMapController(map.current)

    map.current.on('load', () => {
      loadACALayers(map.current)
      loadMapMarkers(map.current, filteredSiteRecords)
      handleMapOnWheel(map.current)
    })

    // clean up on unmount
    return () => {
      map.current.remove()
    }
  }, [filteredSiteRecords, handleMapOnWheel])

  const _handleMapMarkers = useEffect(() => {
    if (!map.current) {
      return
    }

    map.current.on('click', 'mapMarkers', (e) => {
      const popupNode = document.createElement('div')
      const coordinates = e.features[0].geometry.coordinates.slice()
      const markerProperty = e.features[0].properties

      ReactDOM.render(<Popup properties={markerProperty} choices={choices} />, popupNode)
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
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  choices: choicesPropType.isRequired,
  rowValues: PropTypes.arrayOf(
    PropTypes.shape({
      original: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  ).isRequired,
}

export default ProjectSitesMap
