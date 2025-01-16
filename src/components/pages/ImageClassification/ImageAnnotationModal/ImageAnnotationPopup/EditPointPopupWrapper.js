import React, { useEffect } from 'react'
import maplibregl from 'maplibre-gl'
import PropTypes from 'prop-types'

// This component allows our popup to work with React State
// Solution based off here: https://sparkgeo.com/blog/create-a-working-react-mapbox-popup/
const EditPointPopupWrapper = ({ children, map, lngLat, anchor, popupRef }) => {
  useEffect(() => {
    new maplibregl.Popup({
      anchor,
      closeButton: false,
      maxWidth: 'none',
      className: 'edit-point-popup',
    })
      .setLngLat(lngLat)
      .setDOMContent(popupRef.current)
      .addTo(map)
  }, [anchor, children, lngLat, map, popupRef])

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
  anchor: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  popupRef: PropTypes.object.isRequired,
}

export default EditPointPopupWrapper
