import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import { toast } from 'react-toastify'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'

// TODO: In future, PATCH_SIZE will come from API
const PATCH_SIZE = 224

// TODO: Assumes that the max dimension for height and width are the same.
// This can change depending on final implementation, hardcoded for now.
const MAX_DIMENSION = 1000

const IMAGE_CLASSIFICATION_COLOR_EXP = [
  'case',
  ['get', 'isConfirmed'],
  COLORS.confirmed,
  COLORS.unconfirmed,
]

const ImageAnnotationModalMap = ({ dataToReview, setDataToReview, highlightedPoints }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [dimensions, setDimensions] = useState()

  const _getImageDimensions = useEffect(() => {
    const imageForMap = new Image()
    imageForMap.src = dataToReview.image
    imageForMap.onload = () => {
      const longerSide = Math.max(imageForMap.naturalWidth, imageForMap.naturalHeight)
      const imageScale = longerSide > MAX_DIMENSION ? MAX_DIMENSION / longerSide : 1

      setDimensions({
        height: imageForMap.naturalHeight * imageScale,
        width: imageForMap.naturalWidth * imageScale,
        scale: imageScale,
      })
    }

    imageForMap.onerror = () => {
      setDataToReview()
      toast.error('There was a problem displaying this image, please contact if issue persists.')
    }
    // eslint-disable-next-line
  }, [])

  const _renderImageViaMap = useEffect(() => {
    if (!dimensions) {
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
                (point.column - PATCH_SIZE / 2) * dimensions.scale,
                (point.row - PATCH_SIZE / 2) * dimensions.scale,
              ])
              const bottomLeft = map.current.unproject([
                (point.column - PATCH_SIZE / 2) * dimensions.scale,
                (point.row + PATCH_SIZE / 2) * dimensions.scale,
              ])
              const bottomRight = map.current.unproject([
                (point.column + PATCH_SIZE / 2) * dimensions.scale,
                (point.row + PATCH_SIZE / 2) * dimensions.scale,
              ])
              const topRight = map.current.unproject([
                (point.column + PATCH_SIZE / 2) * dimensions.scale,
                (point.row - PATCH_SIZE / 2) * dimensions.scale,
              ])
              return {
                type: 'Feature',
                properties: {
                  id: point.id,
                  isConfirmed: point.annotations[0].is_confirmed,
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
            'line-width': 5, // TODO: This will be based on a property in geojson
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
  }, [dimensions, dataToReview])

  const _highlightPoints = useEffect(() => {
    if (!map.current) {
      return
    }

    // prettier-ignore
    map.current.setPaintProperty('patches-layer', 'line-color', [
      'case',
      ['in', // checks if the id is in the list of highlighted points
        ['get', 'id'],
        ['literal', highlightedPoints.map((point) => point.id)] 
      ],
      COLORS.highlighted, // if true, set to highlighted color
      IMAGE_CLASSIFICATION_COLOR_EXP, // fallback to default expression
    ])
  }, [highlightedPoints])

  return (
    <div
      style={{
        width: dimensions?.width,
        height: dimensions?.height,
        marginTop: '2rem',
      }}
      ref={mapContainer}
    />
  )
}

ImageAnnotationModalMap.propTypes = {
  setDataToReview: PropTypes.func.isRequired,
  dataToReview: PropTypes.shape({
    image: PropTypes.string.isRequired,
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
}

export default ImageAnnotationModalMap
