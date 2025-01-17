import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'

import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import { imageClassificationResponsePropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { IconReset } from '../../../icons'
import {
  ImageAnnotationMapWrapper,
  LoadingIndicatorImageClassificationImage,
  MapResetButton,
} from './ImageAnnotationModal.styles'
import ImageAnnotationPopup from './ImageAnnotationPopup/ImageAnnotationPopup'
import EditPointPopupWrapper from './ImageAnnotationPopup/EditPointPopupWrapper'

const DEFAULT_CENTER = [0, 0] // this value doesn't matter, default to null island
const DEFAULT_ZOOM = 2 // needs to be > 1 otherwise bounds become > 180 and > 85

const IMAGE_CLASSIFICATION_COLOR_EXP = [
  'case',

  ['get', 'isUnclassified'],
  COLORS.unclassified,

  ['get', 'isConfirmed'],
  COLORS.confirmed,

  COLORS.unconfirmed,
]

const zoomControl = new maplibregl.NavigationControl({ showCompass: false })
const pointLabelPopup = new maplibregl.Popup({
  anchor: 'center',
  closeButton: false,
})

const easeToDefaultView = (map) =>
  map.current.easeTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 500 })

// HACK: MapLibre's unproject() (used to get pixel coords) doesn't let you pass zoom as parameter.
// So to ensure that our points remain in the same position we:
// 1. store current lnglat/zoom, 2. reset map lnglat/zoom to default,
// 3. call unproject (to get pixel coords) 4. set back to current lnglat/zoom
const hackTemporarilySetMapToDefaultPosition = (map) => {
  map.current.setZoom(DEFAULT_ZOOM)
  map.current.setCenter(DEFAULT_CENTER)
}
const hackResetMapToCurrentPosition = (map, currentZoom, currentCenter) => {
  map.current.setZoom(currentZoom)
  map.current.setCenter(currentCenter)
}

const ImageAnnotationModalMap = ({
  dataToReview,
  setDataToReview,
  selectedAttributeId,
  hoveredAttributeId,
  databaseSwitchboardInstance,
  setIsDataUpdatedSinceLastSave,
  getPointsGeojson,
  hasMapLoaded,
  imageScale,
  map,
  setHasMapLoaded,
}) => {
  const [hoveredPointId, setHoveredPointId] = useState(null)
  const [selectedPoint, setSelectedPoint] = useState({
    id: null,
    popupAnchorLngLat: null,
    popupAnchorPosition: null,
  })
  const mapContainer = useRef(null)
  const popupRef = useRef()

  const closePopup = () => {
    setSelectedPoint({
      id: null,
      popupAnchorLngLat: null,
      popupAnchorPosition: null,
    })
    popupRef.current?.remove()
  }

  const updatePointsOnMap = useCallback(() => {
    const currentZoom = map.current.getZoom()
    const currentCenter = map.current.getCenter()

    hackTemporarilySetMapToDefaultPosition(map)

    map.current.getSource('patches').setData(getPointsGeojson())

    hackResetMapToCurrentPosition(map, currentZoom, currentCenter)
  }, [getPointsGeojson, map])

  const updateImageSizeOnMap = () => {
    const bounds = map.current.getBounds()

    map.current.getSource('benthicQuadratImage').setCoordinates([
      // spans the image across the entire map
      [bounds._sw.lng, bounds._ne.lat],
      [bounds._ne.lng, bounds._ne.lat],
      [bounds._ne.lng, bounds._sw.lat],
      [bounds._sw.lng, bounds._sw.lat],
    ])

    // Keep the max extent of the map to the size of the image
    map.current.setMaxBounds([
      [bounds._sw.lng, bounds._sw.lat],
      [bounds._ne.lng, bounds._ne.lat],
    ])
  }

  const _renderImageMapOnLoad = useEffect(() => {
    if (hasMapLoaded) {
      return
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: DEFAULT_ZOOM,
      renderWorldCopies: false, // prevents the image from repeating
      dragRotate: false,
    })

    map.current.addControl(zoomControl, 'top-left')

    const bounds = map.current.getBounds()

    map.current.setStyle({
      version: 8,
      name: 'image',
      sources: {
        benthicQuadratImage: {
          type: 'image',
          url: dataToReview.image,
          coordinates: [
            // spans the image across the entire map
            [bounds._sw.lng, bounds._ne.lat],
            [bounds._ne.lng, bounds._ne.lat],
            [bounds._ne.lng, bounds._sw.lat],
            [bounds._sw.lng, bounds._sw.lat],
          ],
        },
        patches: {
          type: 'geojson',
          data: getPointsGeojson(),
        },
      },
      layers: [
        {
          id: 'benthicQuadratImageLayer',
          type: 'raster',
          source: 'benthicQuadratImage',
        },
        {
          id: 'patches-status-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': 3,
            'line-offset': -3,
            'line-color': IMAGE_CLASSIFICATION_COLOR_EXP,
          },
        },
        {
          id: 'patches-inline-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': 3,
          },
        },
        {
          id: 'patches-outline-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': 3,
            'line-offset': -6,
          },
        },
        {
          id: 'patches-fill-layer',
          type: 'fill',
          source: 'patches',
          paint: {
            'fill-color': 'transparent',
          },
        },
      ],
    })

    // Keep the max extent of the map to the size of the image
    map.current.setMaxBounds([
      [bounds._sw.lng, bounds._sw.lat],
      [bounds._ne.lng, bounds._ne.lat],
    ])

    const handleMapLoad = () => {
      setHasMapLoaded(true)
    }
    const displayPointFeatureLabel = ({ features }) => {
      const [{ geometry, properties }] = features
      map.current.getCanvas().style.cursor = 'pointer'
      const label = properties.isUnclassified ? 'Unclassified' : properties.ba_gr_label
      pointLabelPopup.setLngLat(geometry.coordinates[0][0]).setHTML(label).addTo(map.current)
    }
    const hidePointFeatureLabel = () => {
      map.current.getCanvas().style.cursor = ''
      pointLabelPopup.remove()
    }
    map.current.on('load', handleMapLoad)
    map.current.on('mouseenter', 'patches-fill-layer', displayPointFeatureLabel)
    map.current.on('mouseleave', 'patches-fill-layer', hidePointFeatureLabel)

    const currentMap = map.current
    return () => {
      currentMap.off('load', handleMapLoad)
      currentMap.off('mouseenter', 'patches-fill-layer', displayPointFeatureLabel)
      currentMap.off('mouseleave', 'patches-fill-layer', hidePointFeatureLabel)
      currentMap.remove()
    }
    // eslint-disable-next-line
  }, [])

  const zoomToSelectedPoint = useCallback(() => {
    if (!selectedPoint.bounds || !map.current) {
      return
    }

    map.current.fitBounds(selectedPoint.bounds, { padding: 250 })
  }, [map, selectedPoint.bounds])

  const _displayEditPointPopupOnPointClick = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    const showFeaturePopup = ({ features }) => {
      const [{ geometry, properties }] = features

      const xAnchor = properties.isPointInLeftHalfOfImage ? 'left' : 'right'
      const yAnchor = properties.isPointInTopHalfOfImage ? 'top' : 'bottom'
      const topLeft = geometry.coordinates[0][0]
      const topRight = geometry.coordinates[0][1]
      const bottomRight = geometry.coordinates[0][2]
      const bottomLeft = geometry.coordinates[0][3]
      const bounds = new maplibregl.LngLatBounds(topLeft, bottomRight)
      const popupAnchorPosition = `${yAnchor}-${xAnchor}`
      const latLngLookupByAnchorPosition = {
        'top-left': bottomRight,
        'top-right': bottomLeft,
        'bottom-left': topRight,
        'bottom-right': topLeft,
      }
      map.current.fitBounds(bounds, { padding: 250 })

      setSelectedPoint({
        id: properties.id,
        popupAnchorLngLat: latLngLookupByAnchorPosition[popupAnchorPosition],
        popupAnchorPosition,
        bounds,
      })
    }

    const hideFeaturePopup = ({ point }) => {
      const [patches] = map.current.queryRenderedFeatures(point, { layers: ['patches-fill-layer'] })
      const isClickFromFeatureLayer = !!patches
      if (!isClickFromFeatureLayer) {
        closePopup()
      }
    }

    map.current.on('click', 'patches-fill-layer', showFeaturePopup)
    map.current.on('click', hideFeaturePopup)

    return () => {
      map.current.off('click', 'patches-fill-layer', showFeaturePopup)
      map.current.off('click', hideFeaturePopup)
    }
  }, [dataToReview, hasMapLoaded, map])

  const _updateStyleOnPointHover = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }
    const applyPointHoverStyle = ({ features }) => {
      if (features.length > 0) {
        const [{ properties }] = features
        setHoveredPointId(properties.id)
      }
    }
    const removePointHoverStyle = () => {
      setHoveredPointId(null)
    }
    map.current.on('mousemove', 'patches-fill-layer', applyPointHoverStyle)

    map.current.on('mouseleave', 'patches-fill-layer', removePointHoverStyle)

    const currentMap = map.current
    return () => {
      currentMap.off('mousemove', 'patches-fill-layer', applyPointHoverStyle)
      currentMap.off('mouseleave', 'patches-fill-layer', removePointHoverStyle)
    }
  }, [hasMapLoaded, map])

  const _updatePointsOnDataChange = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    updatePointsOnMap()
  }, [updatePointsOnMap, hasMapLoaded])

  // This effect is essentially triggered by the _setImageScaleOnWindowResize above.
  // It can be combined, but readability becomes comprimised.
  const _updateLayersOnImageScaleChange = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    map.current.resize()
    updatePointsOnMap()
    updateImageSizeOnMap()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageScale, hasMapLoaded])

  const _updateStylingForPoints = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    const lineColor = [
      'case',
      [
        '==', // checks if point on map is clicked
        ['get', 'id'],
        selectedPoint.id,
      ],
      COLORS.selected,

      [
        '==', // checks if point on map is in selected row in table
        ['get', 'ba_gr'],
        selectedAttributeId,
      ],
      COLORS.selected,

      [
        '==', // checks if point on map is clicked
        ['get', 'id'],
        hoveredPointId,
      ],
      COLORS.hover,

      [
        '==', // checks if point on map is in highlighted row in table
        ['get', 'ba_gr'],
        hoveredAttributeId,
      ],
      COLORS.hover,

      COLORS.outline, // resting outline color
    ]

    map.current.setPaintProperty('patches-inline-layer', 'line-color', lineColor)
    map.current.setPaintProperty('patches-outline-layer', 'line-color', lineColor)
  }, [selectedAttributeId, hoveredAttributeId, hoveredPointId, hasMapLoaded, selectedPoint, map])

  const resetZoom = () => easeToDefaultView(map)
  return (
    <ImageAnnotationMapWrapper>
      {!hasMapLoaded ? <LoadingIndicatorImageClassificationImage /> : null}
      <div
        ref={mapContainer}
        style={{
          width: dataToReview.original_image_width * imageScale,
          height: dataToReview.original_image_height * imageScale,
        }}
      />
      {hasMapLoaded ? (
        <MapResetButton type="button" onClick={resetZoom}>
          <IconReset />
        </MapResetButton>
      ) : null}

      {selectedPoint.id ? (
        <EditPointPopupWrapper
          map={map.current}
          lngLat={selectedPoint.popupAnchorLngLat}
          anchor={selectedPoint.popupAnchorPosition}
          popupRef={popupRef}
        >
          <ImageAnnotationPopup
            dataToReview={dataToReview}
            setDataToReview={setDataToReview}
            pointId={selectedPoint.id}
            databaseSwitchboardInstance={databaseSwitchboardInstance}
            setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
            closePopup={closePopup}
            resetZoom={resetZoom}
            zoomToSelectedPoint={zoomToSelectedPoint}
          />
        </EditPointPopupWrapper>
      ) : null}
    </ImageAnnotationMapWrapper>
  )
}

ImageAnnotationModalMap.propTypes = {
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  selectedAttributeId: PropTypes.string.isRequired,
  hoveredAttributeId: PropTypes.string.isRequired,
  databaseSwitchboardInstance: PropTypes.object.isRequired,
  setIsDataUpdatedSinceLastSave: PropTypes.func.isRequired,
  getPointsGeojson: PropTypes.func.isRequired,
  hasMapLoaded: PropTypes.bool.isRequired,
  imageScale: PropTypes.number.isRequired,
  map: PropTypes.object.isRequired,
  setHasMapLoaded: PropTypes.func.isRequired,
}

export default ImageAnnotationModalMap
