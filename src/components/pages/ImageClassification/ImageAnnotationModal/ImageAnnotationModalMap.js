import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import {
  imageClassificationPointPropType,
  imageClassificationResponsePropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { ImageAnnotationMapContainer } from './ImageAnnotationModal.styles'
import ImageAnnotationPopup from './ImageAnnotationPopup'

// TODO: Assumes that the max dimension for height and width are the same.
// This can change depending on final implementation, hardcoded for now.
const MAX_DIMENSION = 1000

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

const getImageScale = (dataToReview) => {
  const longerSide = Math.max(dataToReview.original_image_width, dataToReview.original_image_height)
  return longerSide > MAX_DIMENSION ? MAX_DIMENSION / longerSide : 1
}

const ImageAnnotationModalMap = ({
  dataToReview,
  setDataToReview,
  highlightedPoints,
  selectedPoints,
  getBenthicAttributeLabel,
  getGrowthFormLabel,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [hasMapLoaded, setHasMapLoaded] = useState(false)
  const imageScale = getImageScale(dataToReview)
  const halfPatchSize = dataToReview.patch_size / 2
  const editPointPopup = new maplibregl.Popup({ closeButton: false })
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
            isUnclassified: !!point.is_unclassified || !point.annotations.length,
            isConfirmed: point.annotations[0]?.is_confirmed,
            annotations: point.annotations,
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
      center: [0, 0], // this value doesn't matter, default to null island
      zoom: 2, // needs to be > 1 otherwise bounds become > 180 and > 85
      renderWorldCopies: false, // prevents the image from repeating
    })

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
      map.current.getCanvas().style.cursor = 'pointer'
      pointLabelPopup.remove()

      const popupNode = document.createElement('div')
      const root = createRoot(popupNode)
      root.render(
        <ImageAnnotationPopup
          dataToReview={dataToReview}
          pointId={properties.id}
          getBenthicAttributeLabel={getBenthicAttributeLabel}
          getGrowthFormLabel={getGrowthFormLabel}
        />,
      )
      editPointPopup
        .setLngLat(geometry.coordinates[0][0])
        .setMaxWidth('none')
        .setDOMContent(popupNode)
        .addTo(map.current)
    })

    // eslint-disable-next-line
  }, [])

  const _updatePointsOnDataChange = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    map.current.getSource('patches').setData(getPointsGeojson())
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
    <>
      <ImageAnnotationMapContainer
        ref={mapContainer}
        $width={dataToReview.original_image_width * imageScale}
        $height={dataToReview.original_image_height * imageScale}
      />
    </>
  )
}

ImageAnnotationModalMap.propTypes = {
  setDataToReview: PropTypes.func.isRequired,
  dataToReview: imageClassificationResponsePropType.isRequired,
  highlightedPoints: PropTypes.arrayOf(imageClassificationPointPropType).isRequired,
  selectedPoints: PropTypes.arrayOf(imageClassificationPointPropType).isRequired,
  getBenthicAttributeLabel: PropTypes.func.isRequired,
  getGrowthFormLabel: PropTypes.func.isRequired,
}

export default ImageAnnotationModalMap
