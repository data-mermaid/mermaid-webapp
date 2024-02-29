import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import PropTypes from 'prop-types'
import { satelliteBaseMap } from '../mapService'

const MiniMap = ({ mainMap }) => {
  const miniMapContainer = useRef(null)
  const miniMap = useRef(null)

  const _initializeMap = useEffect(() => {
    console.log({ mainMap })
    if (!miniMapContainer.current || !mainMap) {
      return
    }

    miniMap.current = new maplibregl.Map({
      container: miniMapContainer.current,
      style: satelliteBaseMap,
      center: mainMap.getCenter(), // Set mini-map center to main map center
      zoom: mainMap.getZoom() - 10, // Adjust zoom level for mini-map
      interactive: false, // Disable interaction with the mini-map
    })

    // Sync main map movements with mini-map
    mainMap.on('move', () => {
      miniMap.current.jumpTo({
        center: mainMap.getCenter(),
        zoom: mainMap.getZoom() - 2,
      })
    })

    // eslint-disable-next-line consistent-return
    return () => {
      miniMap.current.remove()
    }
  }, [mainMap])

  return (
    <div ref={miniMapContainer} style={{ position: 'absolute', width: '150px', height: '100px' }} />
  )
}

MiniMap.propTypes = {
  mainMap: PropTypes.object.isRequired,
}

export default MiniMap
