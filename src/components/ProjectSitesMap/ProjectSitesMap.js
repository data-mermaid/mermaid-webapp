import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import AtlasLegendDrawer from '../AtlasLegendDrawer'
import { sitePropType, choicesPropType } from '../../App/mermaidData/mermaidDataProptypes'
import {
  satelliteBaseMap,
  addMapController,
  setCoralMosaicLayerProperty,
  setGeomorphicOrBenthicLayerProperty,
  loadACALayers,
  loadMapMarkers,
} from '../../library/mapService'
import { MapContainer, MapWrapper } from '../../library/styling/mapStyles'

const defaultCenter = [20, 20]
const defaultZoom = 2

const Popup = () => <div>Popup here</div>

const ProjectSitesMap = ({ sites, choices }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const popUpRef = useRef(new maplibregl.Popup({ offset: 15 }))

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

    map.current.on('click', 'mapMarkers', () => {
      // const coordinates = e.features[0].geometry.coordinates.slice()
      // const popupNode = document.createElement('div')
      // ReactDOM.render(<Popup />, popupNode)
      // popUpRef.current.setLngLat(coordinates).setDOMContent(popupNode).addTo(map.current)
    })

    // clean up on unmount
    return () => {
      map.current.remove()
    }
  }, [sites])

  const _handleMapMarkers = useEffect(() => {
    if (!map.current) {
      return
    }

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
}

export default ProjectSitesMap
