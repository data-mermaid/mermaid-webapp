import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import { lightBaseMap } from '../mapService'

const MiniMapWrapper = styled.div`
  position: absolute;
  width: 200px;
  height: 150px;
  border: 2px solid white;
  // chose opacity instead of display: none to avoid reflow
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`

const MiniMap = ({ mainMap }) => {
  const miniMapContainer = useRef(null)
  const miniMap = useRef(null)
  const trackingRectangleSource = useRef(null)
  const DEFAULT_ZOOM = 2
  const ZOOM_ADJUSTMENT = 5

  const [isVisible, setIsVisible] = useState(mainMap.getZoom() > DEFAULT_ZOOM)

  const updateTrackingRectangleGeometry = (bounds) => {
    if (trackingRectangleSource.current) {
      trackingRectangleSource.current.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [bounds.getWest(), bounds.getNorth()],
              [bounds.getEast(), bounds.getNorth()],
              [bounds.getEast(), bounds.getSouth()],
              [bounds.getWest(), bounds.getSouth()],
              [bounds.getWest(), bounds.getNorth()],
            ],
          ],
        },
      })
    }
  }

  const addTrackingRectangleLayers = () => {
    miniMap.current.addLayer({
      id: 'trackingRectOutline',
      type: 'line',
      source: 'trackingRectangle',
      paint: {
        'line-color': '#FF0000',
        'line-width': 2,
      },
    })

    miniMap.current.addLayer({
      id: 'trackingRectFill',
      type: 'fill',
      source: 'trackingRectangle',
      paint: {
        'fill-color': '#FF0000',
        'fill-opacity': 0.3,
      },
    })
  }

  useEffect(() => {
    if (!miniMapContainer.current || !mainMap) {
      return
    }

    const getMainMapCenter = () => {
      // prevents tests from failing due to maplibre-gl not being available
      try {
        return mainMap.getCenter()
      } catch (e) {
        return console.error('Error getting map center: ', e)
      }
    }

    const getIsMiniMapVisible = () => mainMap.getZoom() > DEFAULT_ZOOM

    const onMapLoad = () => {
      miniMap.current.addSource('trackingRectangle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Polygon', coordinates: [[]] },
        },
      })

      setIsVisible(getIsMiniMapVisible())

      addTrackingRectangleLayers()

      miniMap.current.jumpTo({
        center: getMainMapCenter(),
        zoom: mainMap.getZoom() - ZOOM_ADJUSTMENT,
      })

      trackingRectangleSource.current = miniMap.current.getSource('trackingRectangle')
      updateTrackingRectangleGeometry(mainMap.getBounds())
    }

    const initializeMap = () => {
      miniMap.current = new maplibregl.Map({
        container: miniMapContainer.current,
        style: lightBaseMap,
        center: getMainMapCenter(),
        zoom: DEFAULT_ZOOM,
        interactive: false,
      })

      miniMap.current.on('load', onMapLoad)
    }

    const handleMapMove = () => {
      miniMap.current.jumpTo({
        center: getMainMapCenter(),
        zoom: mainMap.getZoom() - ZOOM_ADJUSTMENT,
      })

      setIsVisible(getIsMiniMapVisible())
      updateTrackingRectangleGeometry(mainMap.getBounds())
    }

    initializeMap()
    mainMap.on('move', handleMapMove)

    // eslint-disable-next-line consistent-return
    return () => miniMap.current.remove()
  }, [mainMap])

  return <MiniMapWrapper ref={miniMapContainer} $visible={isVisible} />
}

MiniMap.propTypes = {
  // complex mapbox object
  mainMap: PropTypes.object.isRequired,
}

export default MiniMap
