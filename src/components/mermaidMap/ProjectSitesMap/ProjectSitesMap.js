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
  getMapMarkersFeature,
  handleMapOnWheel,
} from '../mapService'
import { MapContainer, MiniMapContainer, MapWrapper, MapZoomHelpMessage } from '../Map.styles'
import MiniMap from '../MiniMap'
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
      map.current.addSource('mapMarkers', {
        type: 'geojson',

        data: {
          type: 'FeatureCollection',

          features: sitesForMapMarkers.map((site) => ({
            type: 'Feature',

            geometry: {
              type: 'Point',

              coordinates: [site.longitude, site.latitude],
            },

            properties: site,
          })),
        },

        cluster: true,

        clusterMaxZoom: 14,

        clusterRadius: 50,
      })

      map.current.addLayer({
        id: 'clusters',

        type: 'circle',

        source: 'mapMarkers',

        filter: ['has', 'point_count'],

        paint: {
          'circle-color': [
            'step',

            ['get', 'point_count'],

            '#51bbd6',

            100,

            '#f1f075',

            750,

            '#f28cb1',
          ],

          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
        },
      })

      map.current.addLayer({
        id: 'cluster-count',

        type: 'symbol',

        source: 'mapMarkers',

        filter: ['has', 'point_count'],

        layout: {
          'text-field': ['get', 'point_count_abbreviated'],

          'text-font': ['Open Sans Regular,Arial Unicode MS Regular'],

          'text-size': 12,
        },
      })

      map.current.addLayer({
        id: 'unclustered-point',

        type: 'circle',

        source: 'mapMarkers',

        filter: ['!', ['has', 'point_count']],

        paint: {
          'circle-color': '#11b4da',

          'circle-radius': 4,

          'circle-stroke-width': 1,

          'circle-stroke-color': '#fff',
        },
      })

      map.current.on('click', 'clusters', ({ features }) => {
        const clusterId = features[0].properties.cluster_id

        map.current.getSource('mapMarkers').getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) {
            return
          }

          map.current.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          })
        })
      })

      map.current.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice()

        const markerProperty = e.features[0].properties

        const popupNode = document.createElement('div')

        const reactRoot = createRoot(popupNode)

        reactRoot.render(<Popup properties={markerProperty} choices={choices} />)

        popUpRef.current.setLngLat(coordinates).setDOMContent(popupNode).addTo(map.current)
      })

      map.current.on('mouseenter', 'clusters', () => {
        map.current.getCanvas().style.cursor = 'pointer'
      })

      map.current.on('mouseleave', 'clusters', () => {
        map.current.getCanvas().style.cursor = ''
      })

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
    // }

    // eslint-disable-next-line consistent-return
    return () => {
      map.current.off('sourcedata', handleSourceData)
    }
  }, [isMapInitialized, sitesForMapMarkers, previousSitesForMapMarkers])

  return (
    <MapContainer>
      <MapWrapper ref={mapContainer} />
      {displayHelpText && (
        <MapZoomHelpMessage>{language.pages.siteTable.controlZoomText}</MapZoomHelpMessage>
      )}
      <AtlasLegendDrawer
        updateCoralMosaicLayer={setCoralMosaicLayerProperty}
        updateGeomorphicLayers={setGeomorphicOrBenthicLayerProperty}
        updateBenthicLayers={setGeomorphicOrBenthicLayerProperty}
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
