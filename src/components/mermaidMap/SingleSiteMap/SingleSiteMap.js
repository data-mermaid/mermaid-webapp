import React, { useRef, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import styled from 'styled-components'
import language from '../../../language'
import AtlasLegendDrawer from '../AtlasLegendDrawer'
import {
  satelliteBaseMap,
  addZoomController,
  setCoralMosaicLayerProperty,
  setGeomorphicOrBenthicLayerProperty,
  loadACALayers,
  handleMapOnWheel,
} from '../mapService'
import { ButtonSecondary } from '../../generic/buttons'
import { IconMapMarker } from '../../icons'
import { MapInputRow, MapContainer, MapWrapper, MapZoomHelpMessage } from '../Map.styles'
import theme from '../../../theme'
import { roundToSixDecimalPlaces } from '../../../library/numbers/roundToSixDecimalPlaces'

const StyledPlaceMarkerButton = styled(ButtonSecondary)`
  padding: 0 5px;
  position: absolute;
  top: 10px;
  left: 50px;
  height: 29px;
  border-radius: 4px;
  border: none;
  outline: solid 2px ${theme.color.black.fade(0.9)};
  & > svg {
    margin-right: 1px;
  }
`

const defaultCenter = [0, 0]
const defaultZoom = 1

const SingleSiteMap = ({
  formLatitudeValue,
  formLongitudeValue,
  handleLatitudeChange,
  handleLongitudeChange,
  isReadOnlyUser,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const recordMarker = useRef(null)
  const [displayHelpText, setDisplayHelpText] = useState(false)
  const [isMarkerBeingPlaced, setIsMarkerBeingPlaced] = useState(false)

  const outOfRangeLatitude = formLatitudeValue > 90 || formLatitudeValue < -90

  const nullishLatitudeOrLongitude =
    (!formLatitudeValue && formLatitudeValue !== 0) ||
    (!formLongitudeValue && formLongitudeValue !== 0)

  const handleZoomDisplayHelpText = (displayValue) => setDisplayHelpText(displayValue)
  const handleMarkerLocationChange = useCallback(
    (lngLat) => {
      // Adjust lng at international dateline
      let adjustedLng = lngLat.lng

      if (lngLat.lng < -180) {
        adjustedLng = 360 + lngLat.lng
      } else if (lngLat.lng > 180) {
        adjustedLng = lngLat.lng - 360
      }

      handleLatitudeChange(roundToSixDecimalPlaces(lngLat.lat))
      handleLongitudeChange(roundToSixDecimalPlaces(adjustedLng))
    },
    [handleLatitudeChange, handleLongitudeChange],
  )

  const _initializeMap = useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: satelliteBaseMap,
      center: defaultCenter,
      zoom: nullishLatitudeOrLongitude ? defaultZoom : 13,
      maxZoom: 16,
      attributionControl: true,
      customAttribution: language.map.attribution,
    })

    recordMarker.current = new maplibregl.Marker({ draggable: !isReadOnlyUser })
    const recordMarkerElement = recordMarker.current.getElement()

    recordMarkerElement.id = 'marker'

    addZoomController(map.current)

    map.current.on('load', () => {
      loadACALayers(map.current)
      handleMapOnWheel(map.current, handleZoomDisplayHelpText)
    })

    recordMarker.current.on('dragend', () => {
      const lngLat = recordMarker.current.getLngLat()

      handleMarkerLocationChange(lngLat)
    })

    // clean up on unmount
    return () => {
      map.current.remove()
      recordMarker.current.remove()
    }
  }, [
    isReadOnlyUser,
    handleLatitudeChange,
    handleLongitudeChange,
    handleMarkerLocationChange,
    nullishLatitudeOrLongitude,
  ])

  const handleMapClick = useCallback(
    (event) => {
      if (!isReadOnlyUser) {
        const { lngLat } = event

        recordMarker.current.setLngLat(lngLat)

        handleMarkerLocationChange(lngLat)
      }
    },
    [handleMarkerLocationChange, isReadOnlyUser],
  )

  useEffect(
    function enableDisableMarkerPlacement() {
      if (isMarkerBeingPlaced) {
        map.current.getCanvas().style.cursor = 'crosshair'
        map.current.on('click', handleMapClick)
      }
      if (!isMarkerBeingPlaced) {
        map.current.getCanvas().style.cursor = 'grab'
        map.current.off('click', handleMapClick)
      }
    },
    [handleMapClick, isMarkerBeingPlaced],
  )

  useEffect(
    function centerMapOnMarker() {
      if (!map.current) {
        return
      }

      if (outOfRangeLatitude || nullishLatitudeOrLongitude) {
        recordMarker.current.remove()
      } else {
        recordMarker.current.setLngLat([formLongitudeValue, formLatitudeValue]).addTo(map.current)
      }

      if (
        formLatitudeValue !== undefined &&
        formLongitudeValue !== undefined &&
        !outOfRangeLatitude
      ) {
        map.current.jumpTo({
          center: [formLongitudeValue, formLatitudeValue],
          zoom: map.current.getZoom(),
        })
      }
    },
    [formLatitudeValue, formLongitudeValue, nullishLatitudeOrLongitude, outOfRangeLatitude],
  )

  const updateCoralMosaicLayer = (dataLayerFromLocalStorage) =>
    setCoralMosaicLayerProperty(map.current, dataLayerFromLocalStorage)

  const updateGeomorphicLayers = (dataLayerFromLocalStorage) =>
    setGeomorphicOrBenthicLayerProperty(map.current, 'atlas-geomorphic', dataLayerFromLocalStorage)

  const updateBenthicLayers = (dataLayerFromLocalStorage) =>
    setGeomorphicOrBenthicLayerProperty(map.current, 'atlas-benthic', dataLayerFromLocalStorage)
  const placeMarkerButtonText =
    formLatitudeValue && formLongitudeValue
      ? language.pages.siteForm.replaceMarker
      : language.pages.siteForm.placeMarker

  const handlePlaceMarkerClick = () => {
    setIsMarkerBeingPlaced(!isMarkerBeingPlaced)
  }

  const placeMarkerButton = (
    <StyledPlaceMarkerButton type="button" onClick={handlePlaceMarkerClick}>
      <IconMapMarker />
      {isMarkerBeingPlaced ? language.pages.siteForm.done : placeMarkerButtonText}
    </StyledPlaceMarkerButton>
  )

  return (
    <MapInputRow noBorderWidth={isReadOnlyUser}>
      <MapContainer>
        <MapWrapper ref={mapContainer} />
        {!isReadOnlyUser ? placeMarkerButton : null}
        {displayHelpText && (
          <MapZoomHelpMessage>{language.pages.siteTable.controlZoomText}</MapZoomHelpMessage>
        )}
        <AtlasLegendDrawer
          updateCoralMosaicLayer={updateCoralMosaicLayer}
          updateGeomorphicLayers={updateGeomorphicLayers}
          updateBenthicLayers={updateBenthicLayers}
        />
      </MapContainer>
    </MapInputRow>
  )
}

SingleSiteMap.propTypes = {
  formLatitudeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  formLongitudeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleLatitudeChange: PropTypes.func,
  handleLongitudeChange: PropTypes.func,
  isReadOnlyUser: PropTypes.bool,
}

SingleSiteMap.defaultProps = {
  formLatitudeValue: 0,
  formLongitudeValue: 0,
  handleLatitudeChange: () => {},
  handleLongitudeChange: () => {},
  isReadOnlyUser: false,
}

export default SingleSiteMap
