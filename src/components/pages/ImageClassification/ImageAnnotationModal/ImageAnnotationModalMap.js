import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import {
  imageClassificationPointPropType,
  imageClassificationResponsePropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { IconReset } from '../../../icons'
import {
  ImageAnnotationMapContainer,
  ImageAnnotationMapWrapper,
  ImageAnnotationPopupContainer,
  MapResetButton,
} from './ImageAnnotationModal.styles'
import ImageAnnotationPopup from './ImageAnnotationPopup/ImageAnnotationPopup'

// Image/Map should be full height while maintaining aspect ratio. Set Max height to 80vh
const MAX_DIMENSION = (80 * (document?.documentElement?.clientHeight || window.innerHeight)) / 100

const DEFAULT_CENTER = [0, 0] // this value doesn't matter, default to null island
const DEFAULT_ZOOM = 2 // needs to be > 1 otherwise bounds become > 180 and > 85

const POLYGON_LINE_WIDTH = 5
const SELECTED_POLYGON_LINE_WIDTH = 10

const IMAGE_CLASSIFICATION_COLOR_EXP = [
  'case',

  ['get', 'isUnclassified'],
  COLORS.unclassified,

  ['get', 'isConfirmed'],
  COLORS.confirmed,

  COLORS.unconfirmed,
]

const zoomControl = new maplibregl.NavigationControl({ showCompass: false })

const flyToDefaultView = (map) =>
  map.current.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 500 })

const getImageScale = ({ original_image_height }) =>
  original_image_height > MAX_DIMENSION ? MAX_DIMENSION / original_image_height : 1

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
  highlightedPoints,
  selectedPoints,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
  databaseSwitchboardInstance,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [hasMapLoaded, setHasMapLoaded] = useState(false)
  const [editPointId, setEditPointId] = useState()
  const imageScale = getImageScale(dataToReview)
  const halfPatchSize = dataToReview.patch_size / 2
  const pointLabelPopup = new maplibregl.Popup({
    anchor: 'center',
    closeButton: false,
  })

  const getPointsGeojson = useCallback(
    () => ({
      type: 'FeatureCollection',
      features: dataToReview.points.map((point) => {
        // Row and Column represent the center of the patch in pixels,
        // Crop size is the size of the patch in pixels
        // We calculate the corners of the patch in pixels, then convert to lng, lat
        const topLeft = map.current.unproject([
          (point.column - halfPatchSize) * imageScale,
          (point.row - halfPatchSize) * imageScale,
        ])
        const bottomLeft = map.current.unproject([
          (point.column - halfPatchSize) * imageScale,
          (point.row + halfPatchSize) * imageScale,
        ])
        const bottomRight = map.current.unproject([
          (point.column + halfPatchSize) * imageScale,
          (point.row + halfPatchSize) * imageScale,
        ])
        const topRight = map.current.unproject([
          (point.column + halfPatchSize) * imageScale,
          (point.row - halfPatchSize) * imageScale,
        ])
        return {
          type: 'Feature',
          properties: {
            id: point.id,
            benthicAttributeId: point.annotations[0]?.benthic_attribute,
            growthFormId: point.annotations[0]?.growth_form,
            isUnclassified: !point.annotations.length,
            isConfirmed: !!point.annotations[0]?.is_confirmed,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [topLeft.lng, topLeft.lat],
                [bottomLeft.lng, bottomLeft.lat],
                [bottomRight.lng, bottomRight.lat],
                [topRight.lng, topRight.lat],
                [topLeft.lng, topLeft.lat],
              ],
            ],
          },
        }
      }),
    }),
    [dataToReview, imageScale, halfPatchSize],
  )

  const _renderImageViaMap = useEffect(() => {
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
          id: 'patches-line-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': POLYGON_LINE_WIDTH,
            'line-color': IMAGE_CLASSIFICATION_COLOR_EXP,
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

    // Map Listeners here on out
    map.current.on('load', () => setHasMapLoaded(true))

    // Display Label on point hover
    map.current.on('mouseenter', 'patches-fill-layer', ({ features }) => {
      const [{ geometry, properties }] = features
      map.current.getCanvas().style.cursor = 'pointer'
      const label = properties.isUnclassified
        ? 'Unclassified'
        : `${getBenthicAttributeLabel(properties.benthicAttributeId)} ${getGrowthFormLabel(
            properties.growthFormId,
          )}`
      pointLabelPopup.setLngLat(geometry.coordinates[0][0]).setHTML(label).addTo(map.current)
    })

    // Remove Label on point exit
    map.current.on('mouseleave', 'patches-fill-layer', () => {
      map.current.getCanvas().style.cursor = ''
      pointLabelPopup.remove()
    })

    // Display Edit Point Popup on point click
    map.current.on('click', 'patches-fill-layer', ({ features }) => {
      const [{ geometry, properties }] = features
      const topLeft = geometry.coordinates[0][0]
      const bottomRight = geometry.coordinates[0][2]
      const bounds = new maplibregl.LngLatBounds(topLeft, bottomRight)
      map.current.fitBounds(bounds, { padding: 300 })
      setEditPointId(properties.id)
    })

    // Remove Edit Point Popup when user clicks away
    map.current.on('click', ({ point }) => {
      const [patches] = map.current.queryRenderedFeatures(point, { layers: ['patches-fill-layer'] })
      if (!patches) {
        setEditPointId()
      }
    })

    // eslint-disable-next-line
  }, [])

  const _updatePointsOnDataChange = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    const currentZoom = map.current.getZoom()
    const currentCenter = map.current.getCenter()

    hackTemporarilySetMapToDefaultPosition(map)

    map.current.getSource('patches').setData(getPointsGeojson())

    hackResetMapToCurrentPosition(map, currentZoom, currentCenter)
  }, [dataToReview, hasMapLoaded, getPointsGeojson])

  const _highlightPoints = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    map.current.setPaintProperty('patches-line-layer', 'line-color', [
      'case',
      [
        'in', // checks if point on map is in selected row in table
        ['get', 'id'],
        ['literal', selectedPoints.map((point) => point.id)],
      ],
      COLORS.current,

      [
        'in', // checks if point on map is in highlighted row in table
        ['get', 'id'],
        ['literal', highlightedPoints.map((point) => point.id)],
      ],
      COLORS.highlighted,

      IMAGE_CLASSIFICATION_COLOR_EXP, // fallback to default expression
    ])

    map.current.setPaintProperty('patches-line-layer', 'line-width', [
      'case',
      [
        'in', // checks if point on map is in selected row in table
        ['get', 'id'],
        ['literal', selectedPoints.map((point) => point.id)],
      ],
      SELECTED_POLYGON_LINE_WIDTH,

      POLYGON_LINE_WIDTH, // fallback to default width
    ])
  }, [highlightedPoints, selectedPoints, hasMapLoaded])

  return (
    <ImageAnnotationMapWrapper>
      <ImageAnnotationMapContainer
        ref={mapContainer}
        $width={dataToReview.original_image_width * imageScale}
        $height={dataToReview.original_image_height * imageScale}
      />
      {editPointId ? (
        <ImageAnnotationPopupContainer>
          <ImageAnnotationPopup
            dataToReview={dataToReview}
            setDataToReview={setDataToReview}
            pointId={editPointId}
            databaseSwitchboardInstance={databaseSwitchboardInstance}
            getBenthicAttributeLabel={getBenthicAttributeLabel}
            getGrowthFormLabel={getGrowthFormLabel}
          />
        </ImageAnnotationPopupContainer>
      ) : null}
      <MapResetButton type="button" onClick={() => flyToDefaultView(map)}>
        <IconReset />
      </MapResetButton>
    </ImageAnnotationMapWrapper>
  )
}

ImageAnnotationModalMap.propTypes = {
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  highlightedPoints: PropTypes.arrayOf(imageClassificationPointPropType).isRequired,
  selectedPoints: PropTypes.arrayOf(imageClassificationPointPropType).isRequired,
  databaseSwitchboardInstance: PropTypes.object.isRequired,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ImageAnnotationModalMap
