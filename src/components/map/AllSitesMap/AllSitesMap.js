import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import LegendDrawer from '../LegendDrawer'
import { sitePropType, choicesPropType } from '../../../App/mermaidData/mermaidDataProptypes'
import {
  satelliteBaseMap,
  addMapController,
  setCoralMosaicLayerProperty,
  setGeomorphicOrBenthicLayerProperty,
  loadACALayers,
  loadMapMarkers,
  createPopup,
  hideHelpText,
  showHelpText,
} from '../mapService'
import { MapContainer, MapWrapper } from '../Map.styles'

const defaultCenter = [20, 20]
const defaultZoom = 2

const AllSitesMap = ({ sites, choices }) => {
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

    addMapController(map.current)

    map.current.on('load', () => {
      loadACALayers(map.current)
      loadMapMarkers(map.current, sites)
    })

    // clean up on unmount
    return () => {
      map.current.remove()
    }
  }, [sites])

  const _handleMapOnWheel = useEffect(() => {
    if (!map.current) {
      return
    }

    // disabled mouse scroll when Ctrl is not enabled, and vice versa
    map.current.on('wheel', (event) => {
      if (event.originalEvent.ctrlKey) {
        event.originalEvent.preventDefault()
        hideHelpText(map.current)
        if (!map.current.scrollZoom._enabled) {
          map.current.scrollZoom.enable()
        }
      } else {
        if (map.current.scrollZoom._enabled) {
          map.current.scrollZoom.disable()
        }
        showHelpText(map.current)
        setTimeout(() => {
          hideHelpText(map.current)
        }, 1500)
      }
    })
  }, [])

  const _handleMapMarkers = useEffect(() => {
    if (!map.current) {
      return
    }

    // Add popup to map when marker is clicked
    map.current.on('click', 'mapMarkers', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice()
      const description = createPopup(e.features[0].properties, choices)

      new maplibregl.Popup().setLngLat(coordinates).setHTML(description).addTo(map.current)
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
      <LegendDrawer
        updateCoralMosaicLayer={updateCoralMosaicLayer}
        updateGeomorphicLayers={updateGeomorphicLayers}
        updateBenthicLayers={updateBenthicLayers}
      />
    </MapContainer>
  )
}

AllSitesMap.propTypes = {
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  choices: choicesPropType.isRequired,
}

export default AllSitesMap
