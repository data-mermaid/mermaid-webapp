import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import PropTypes from 'prop-types'

// This component allows our popup to work with React State
// Solution based off here: https://sparkgeo.com/blog/create-a-working-react-mapbox-popup/
const EditPointPopupWrapper = ({ children, map, lngLat }) => {
  const popupRef = useRef()

  useEffect(() => {
    new maplibregl.Popup({
      anchor: 'top-left',
      closeButton: false,
      maxWidth: 'none',
      className: 'edit-point-popup',
    })
      .setLngLat(lngLat)
      .setDOMContent(popupRef.current)
      .addTo(map)
  }, [children, lngLat, map])

  return (
    <div style={{ display: 'none' }}>
      <div ref={popupRef}>{children}</div>
    </div>
  )
}

EditPointPopupWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  map: PropTypes.object.isRequired,
  lngLat: PropTypes.arrayOf(PropTypes.number).isRequired,
}

export default EditPointPopupWrapper