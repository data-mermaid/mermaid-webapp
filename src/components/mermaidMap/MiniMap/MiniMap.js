import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { satelliteBaseMap } from '../mapService'

const MiniMapWrapper = styled.div`
  position: absolute;
  width: 150px;
  height: 100px;
`

const defaultZoom = 1

const MiniMap = ({ mainMap }) => {
  const miniMapContainer = useRef(null)
  const miniMap = useRef(null)

  const _initializeMap = useEffect(() => {
    if (!miniMapContainer.current || !mainMap) {
      return
    }

    miniMap.current = new maplibregl.Map({
      container: miniMapContainer.current,
      style: satelliteBaseMap,
      center: mainMap.getCenter(),
      zoom: defaultZoom,
      interactive: false,
    })
    // Sync main map movements with mini-map
    mainMap.on('move', () => {
      miniMap.current.jumpTo({
        center: mainMap.getCenter(),
        zoom: mainMap.getZoom() - 9,
      })
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
