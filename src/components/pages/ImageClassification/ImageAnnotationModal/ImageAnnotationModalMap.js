import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'

// TODO: In future, PATCH_SIZE will come from API
const PATCH_SIZE = 224

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

const ImageAnnotationModalMap = ({ dataToReview, highlightedPoints, selectedPoints }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [hasMapLoaded, setHasMapLoaded] = useState(false)
  const imageScale = getImageScale(dataToReview)

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
          data: {
            type: 'FeatureCollection',
            features: dataToReview.points.map((point) => {
              // Row and Column represent the center of the patch in pixels,
              // Crop size is the size of the patch in pixels
              // We calculate the corners of the patch in pixels, then convert to lng, lat
              const topLeft = map.current.unproject([
                (point.column - PATCH_SIZE / 2) * imageScale,
                (point.row - PATCH_SIZE / 2) * imageScale,
              ])
              const bottomLeft = map.current.unproject([
                (point.column - PATCH_SIZE / 2) * imageScale,
                (point.row + PATCH_SIZE / 2) * imageScale,
              ])
              const bottomRight = map.current.unproject([
                (point.column + PATCH_SIZE / 2) * imageScale,
                (point.row + PATCH_SIZE / 2) * imageScale,
              ])
              const topRight = map.current.unproject([
                (point.column + PATCH_SIZE / 2) * imageScale,
                (point.row - PATCH_SIZE / 2) * imageScale,
              ])
              return {
                type: 'Feature',
                properties: {
                  id: point.id,
                  isUnclassified: point.annotations.length === 0,
                  isConfirmed: point.annotations[0]?.is_confirmed,
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
          },
        },
      },
      layers: [
        {
          id: 'benthicQuadratImageLayer',
          type: 'raster',
          source: 'benthicQuadratImage',
        },
        {
          id: 'patches-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': POLYGON_LINE_WIDTH,
            'line-color': IMAGE_CLASSIFICATION_COLOR_EXP,
          },
        },
      ],
    })

    // Keep the max extent of the map to the size of the image
    map.current.setMaxBounds([
      [bounds._sw.lng, bounds._sw.lat],
      [bounds._ne.lng, bounds._ne.lat],
    ])

    map.current.on('load', () => setHasMapLoaded(true))
    // eslint-disable-next-line
  }, [])

  const _highlightPoints = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    map.current.setPaintProperty('patches-layer', 'line-color', [
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

    map.current.setPaintProperty('patches-layer', 'line-width', [
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
    <div
      style={{
        width: dataToReview.original_image_width * imageScale,
        height: dataToReview.original_image_height * imageScale,
        marginTop: '2rem',
      }}
      ref={mapContainer}
    />
  )
}

// TODO: how to DRY this
ImageAnnotationModalMap.propTypes = {
  setDataToReview: PropTypes.func.isRequired,
  dataToReview: PropTypes.shape({
    image: PropTypes.string.isRequired,
    original_image_width: PropTypes.number.isRequired,
    original_image_height: PropTypes.number.isRequired,
    points: PropTypes.arrayOf(
      PropTypes.shape({
        row: PropTypes.number.isRequired,
        column: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  highlightedPoints: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired,
    }),
  ).isRequired,
  selectedPoints: PropTypes.arrayOf(
    PropTypes.shape({
      row: PropTypes.number.isRequired,
      column: PropTypes.number.isRequired,
    }),
  ).isRequired,
}

export default ImageAnnotationModalMap
