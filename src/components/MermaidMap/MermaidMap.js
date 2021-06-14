import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import maplibregl from 'maplibre-gl'
import theme from '../../theme'
import LegendSlider from '../LegendSlider'
import { satelliteBaseMap, loadACALayers } from '../../library/mapService'

const MapWrapper = styled.div`
  height: 400px;
  border-top: ${theme.spacing.borderXLarge} solid ${theme.color.secondaryColor};
  border-bottom: ${theme.spacing.borderXLarge} solid
    ${theme.color.secondaryColor};
`

const MapContainer = styled.div`
  position: relative;
  overflow: hidden;
`

const recordMarker = new maplibregl.Marker({ draggable: true })
const defaultCenter = [0, 0]
const defaultZoom = 11

const MermaidMap = ({
  formLatitudeValue,
  formLongitudeValue,
  handleLatitudeChange,
  handleLongitudeChange,
}) => {
  const coralMosaicLocalStorage = localStorage.getItem('coral_mosaic')
  const [coralMosaicLayer, setCoralMosaicLayer] = useState(
    coralMosaicLocalStorage !== null ? JSON.parse(coralMosaicLocalStorage) : 1,
  )
  const [coralMosaicChecked, setCoralMosaicChecked] = useState(
    coralMosaicLocalStorage !== null
      ? JSON.parse(coralMosaicLocalStorage) === 1
      : true,
  )

  const mapContainer = useRef(null)
  const map = useRef(null)

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

    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        showZoom: true,
      }),
      'top-left',
    )
    map.current.dragRotate.disable()
    map.current.touchZoomRotate.disableRotation()

    const mapOpts = { rasterOpacityExpression: coralMosaicLayer }

    map.current.on('load', () => {
      loadACALayers(map.current, mapOpts)
    })

    // clean up on unmount
    return () => map.current.remove()
  }, [])

  const _loadMapLayers = useEffect(() => {
    if (!map.current) return

    if (map.current.getLayer('atlas-planet') !== undefined) {
      map.current.setPaintProperty(
        'atlas-planet',
        'raster-opacity',
        coralMosaicLayer,
      )
    }
  }, [coralMosaicLayer])

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

  const handleCoralMosaicChecked = () => {
    const coralMosaicResult = coralMosaicChecked ? 0 : 1

    localStorage.setItem('coral_mosaic', coralMosaicResult)
    setCoralMosaicLayer(coralMosaicResult)
    setCoralMosaicChecked(!coralMosaicChecked)
  }

  return (
    <MapContainer>
      <MapWrapper ref={mapContainer} />
      <LegendSlider
        coralMosaicChecked={coralMosaicChecked}
        handleCoralMosaicChecked={handleCoralMosaicChecked}
      />
    </MapContainer>
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
