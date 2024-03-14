import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { lightBaseMap } from '../mapService'

const MiniMapWrapper = styled.div`
  position: absolute;
  width: 200px;
  height: 150px;
  border: 2px solid white;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`

const MiniMap = ({ mainMap }) => {
  const miniMapContainer = useRef(null)
  const miniMap = useRef(null)
  const trackingRectSource = useRef(null)
  const defaultZoom = 2
  const zoomAdjustment = 5
  const minZoomLevelForTrackingRectToDisplay = 2

  const getIsMiniMapVisible = () => mainMap.getZoom() > minZoomLevelForTrackingRectToDisplay

  const [isVisible, setIsVisible] = useState(getIsMiniMapVisible())

  const updateTrackingRectGeometry = (bounds) => {
    if (trackingRectSource.current) {
      trackingRectSource.current.setData({
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

  const addTrackingRectLayers = () => {
    miniMap.current.addLayer({
      id: 'trackingRectOutline',
      type: 'line',
      source: 'trackingRect',
      paint: {
        'line-color': '#FF0000',
        'line-width': 2,
      },
    })

    miniMap.current.addLayer({
      id: 'trackingRectFill',
      type: 'fill',
      source: 'trackingRect',
      paint: {
        'fill-color': '#FF0000',
        'fill-opacity': 0.3,
      },
    })
  }

  const onMapLoad = () => {
    miniMap.current.addSource('trackingRect', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [[]] },
      },
    })

    setIsVisible(getIsMiniMapVisible())

    addTrackingRectLayers()

    miniMap.current.jumpTo({
      center: mainMap.getCenter(),
      zoom: mainMap.getZoom() - zoomAdjustment,
    })

    trackingRectSource.current = miniMap.current.getSource('trackingRect')
    updateTrackingRectGeometry(mainMap.getBounds())
  }

  const initializeMap = () => {
    miniMap.current = new maplibregl.Map({
      container: miniMapContainer.current,
      style: lightBaseMap,
      center: mainMap.getCenter(),
      zoom: defaultZoom,
      interactive: false,
    })

    miniMap.current.on('load', onMapLoad)
  }

  const handleMapMove = () => {
    miniMap.current.jumpTo({
      center: mainMap.getCenter(),
      zoom: mainMap.getZoom() - zoomAdjustment,
    })

    setIsVisible(getIsMiniMapVisible())
    updateTrackingRectGeometry(mainMap.getBounds())
  }

  useEffect(() => {
    if (!miniMapContainer.current || !mainMap) {
      return
    }

    initializeMap()
    mainMap.on('move', handleMapMove)

    // eslint-disable-next-line consistent-return
    return () => miniMap.current.remove()

    // avoid unncessary re-renders for initializeMap and handleMapMove
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainMap])

  return <MiniMapWrapper ref={miniMapContainer} visible={isVisible} />
}

MiniMap.propTypes = {
  // complex mapbox object - cannot be more specific
  // eslint-disable-next-line react/forbid-prop-types
  mainMap: PropTypes.object.isRequired,
}

export default MiniMap
