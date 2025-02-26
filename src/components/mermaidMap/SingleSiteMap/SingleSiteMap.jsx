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
import {
  MapInputRow,
  MapContainer,
  MiniMapContainer,
  MapWrapper,
  MapZoomHelpMessage,
} from '../Map.styles'
import theme from '../../../theme'
import { roundToSixDecimalPlaces } from '../../../library/numbers/roundToSixDecimalPlaces'
import MiniMap from '../MiniMap'

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
const initialZoom = 13

const SingleSiteMap = ({
  formLatitudeValue = 0,
  formLongitudeValue = 0,
  handleLatitudeChange = () => {},
  handleLongitudeChange = () => {},
  isReadOnlyUser = false,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const recordMarker = useRef(null)
  const [displayHelpText, setDisplayHelpText] = useState(false)
  const [isMarkerBeingPlaced, setIsMarkerBeingPlaced] = useState(false)
  const [hasLatLngChanged, setHasLatLngChanged] = useState(false)

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
      setHasLatLngChanged(true)
    },
    [handleLatitudeChange, handleLongitudeChange],
  )

  const _initializeMap = useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: satelliteBaseMap,
      center: defaultCenter,
      zoom: defaultZoom,
      maxZoom: 16,
      attributionControl: true,
      customAttribution: language.map.attribution,
    })

    if (formLatitudeValue && formLongitudeValue) {
      // prevents tests from failing due to maplibre-gl not being available
      try {
        map.current.setCenter([formLongitudeValue, formLatitudeValue])
        map.current.setZoom(initialZoom)
      } catch (error) {
        console.error('Error setting center and zoom: ', error)
      }
    }

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
    // formLongitudeValue and formLatitudeValue are not used in the dependency array
    // we only want to set initial map center and zoom once
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        // prevents tests from failing due to maplibre-gl not being available
        try {
          map.current.flyTo({
            center: [formLongitudeValue, formLatitudeValue],
            zoom: map.current.getZoom(),
            duration: 800,
            easing(t) {
              return t
            },
          })
        } catch (e) {
          console.error('Error using map flyTo: ', e)
        }
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

  const handlePlaceMarkerClick = () => {
    setIsMarkerBeingPlaced(!isMarkerBeingPlaced)
    if (hasLatLngChanged) {
      setHasLatLngChanged(false)
    }
  }

  const placeMarkerButton = (
    <StyledPlaceMarkerButton type="button" onClick={handlePlaceMarkerClick}>
      <IconMapMarker />
      {language.pages.siteForm.placeMarker}
    </StyledPlaceMarkerButton>
  )

  return (
    <MapInputRow noBorderWidth={isReadOnlyUser}>
      <MapContainer>
        <MapWrapper ref={mapContainer} />
        {!isReadOnlyUser && nullishLatitudeOrLongitude ? placeMarkerButton : null}
        {displayHelpText && (
          <MapZoomHelpMessage>{language.pages.siteTable.controlZoomText}</MapZoomHelpMessage>
        )}
        <AtlasLegendDrawer
          updateCoralMosaicLayer={updateCoralMosaicLayer}
          updateGeomorphicLayers={updateGeomorphicLayers}
          updateBenthicLayers={updateBenthicLayers}
        />
        {map.current ? (
          <MiniMapContainer>
            <MiniMap mainMap={map.current} />
          </MiniMapContainer>
        ) : null}
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

export default SingleSiteMap
