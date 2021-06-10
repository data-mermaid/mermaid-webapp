import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import mapboxgl from '!mapbox-gl' //eslint-disable-line
import theme from '../../theme'

const MapWrapper = styled.div`
  height: 400px;
  border: ${theme.spacing.borderXLarge} solid ${theme.color.secondaryColor};
`

const satelliteBaseMap = {
  version: 8,
  name: 'World Map',
  sources: {
    worldmap: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
    },
  },
  layers: [
    {
      id: 'base-map',
      type: 'raster',
      source: 'worldmap',
    },
  ],
}

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
const recordMarker = new mapboxgl.Marker({ draggable: true })
const defaultCenter = [0, 0]
const defaultZoom = 11

const MermaidMap = ({
  formLatitudeValue,
  formLongitudeValue,
  handleLatitudeChange,
  handleLongitudeChange,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  const _initializeMap = useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: satelliteBaseMap,
      center: defaultCenter,
      zoom: defaultZoom,
      maxZoom: 16,
      attributionControl: true,
      customAttribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community &copy; <a href="http://www.allencoralatlas.org/"  style="font-size:1.25rem;">2019 Allen Coral Atlas Partnership and Vulcan, Inc.</a>',
    })

    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true,
      }),
      'top-left',
    )

    // clean up on unmount
    return () => map.current.remove()
  }, [])

  const _handleMapMarker = useEffect(() => {
    if (!map.current) return

    recordMarker.remove()
    const outOfRangeLatLng =
      formLatitudeValue > 90 ||
      formLatitudeValue < -90 ||
      formLongitudeValue > 180 ||
      formLongitudeValue < -180

    if (outOfRangeLatLng) {
      // remove marker when lat/lng values are undefined or out of range.
      recordMarker.remove()
    } else {
      recordMarker
        .setLngLat([formLongitudeValue, formLatitudeValue])
        .addTo(map.current)
    }

    recordMarker.on('dragend', () => {
      const lngLat = recordMarker.getLngLat()

      handleLatitudeChange(lngLat.lat)
      handleLongitudeChange(lngLat.lng)
    })

    if (
      formLatitudeValue !== undefined &&
      formLongitudeValue !== undefined &&
      !outOfRangeLatLng
    ) {
      map.current.jumpTo({
        center: [formLongitudeValue, formLatitudeValue],
        zoom: defaultZoom,
      })
    }
  }, [formLatitudeValue, formLongitudeValue])

  return (
    <div>
      <MapWrapper ref={mapContainer} />
    </div>
  )
}

MermaidMap.propTypes = {
  formLatitudeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  formLongitudeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleLatitudeChange: PropTypes.func.isRequired,
  handleLongitudeChange: PropTypes.func.isRequired,
}

MermaidMap.defaultProps = {
  formLatitudeValue: 0,
  formLongitudeValue: 0,
}

export default MermaidMap
