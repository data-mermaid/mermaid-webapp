import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { lightBaseMap } from '../mapService'

const MiniMapWrapper = styled.div`
  position: absolute;
  width: 200px;
  height: 150px;
  border: 2px solid white;
`

const MiniMap = ({ mainMap }) => {
  const miniMapContainer = useRef(null)
  const miniMap = useRef(null)
  const trackingRectSource = useRef(null)
  const defaultZoom = 2
  const zoomAdjustment = 5

  const updateTrackingRectangle = (bounds) => {
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

  const _initializeMap = useEffect(() => {
    if (!miniMapContainer.current || !mainMap) {
      return
    }

    miniMap.current = new maplibregl.Map({
      container: miniMapContainer.current,
      style: lightBaseMap,
      center: mainMap.getCenter(),
      zoom: defaultZoom,
      interactive: false,
    })

    miniMap.current.on('load', () => {
      miniMap.current.addSource('trackingRect', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[]],
          },
        },
      })

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

      miniMap.current.jumpTo({
        center: mainMap.getCenter(),
        zoom: mainMap.getZoom() - zoomAdjustment,
      })

      trackingRectSource.current = miniMap.current.getSource('trackingRect')
      updateTrackingRectangle(mainMap.getBounds())
    })

    mainMap.on('move', () => {
      miniMap.current.jumpTo({
        center: mainMap.getCenter(),
        zoom: mainMap.getZoom() - zoomAdjustment,
      })
      updateTrackingRectangle(mainMap.getBounds())
    })

    // eslint-disable-next-line consistent-return
    return () => miniMap.current.remove()
  }, [mainMap])

  return <MiniMapWrapper ref={miniMapContainer} />
}

MiniMap.propTypes = {
  // complex mapbox object - cannot be more specific
  // eslint-disable-next-line react/forbid-prop-types
  mainMap: PropTypes.object.isRequired,
}

export default MiniMap
