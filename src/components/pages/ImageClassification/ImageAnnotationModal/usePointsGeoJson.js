import { useCallback } from 'react'

export const usePointsGeoJson = ({ dataToReview, map, imageScale }) => {
  const halfPatchSize = dataToReview ? dataToReview.patch_size / 2 : undefined

  const getPointsGeojson = useCallback(
    () => ({
      type: 'FeatureCollection',
      features: dataToReview.points.map((point) => {
        // Row and Column represent the center of the patch in pixels,
        // Crop size is the size of the patch in pixels
        // We calculate the corners of the patch in pixels, then convert to lng, lat
        const topCenter = map.current.unproject([
          point.column * imageScale,
          (point.row - halfPatchSize) * imageScale,
        ])
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
        const isPointInLeftHalfOfImage = point.column < dataToReview.original_image_width / 2
        const isPointInTopHalfOfImage = point.row < dataToReview.original_image_height / 2

        return {
          type: 'Feature',
          properties: {
            id: point.id,
            ba_gr: point.annotations[0]?.ba_gr,
            ba_gr_label: point.annotations[0]?.ba_gr_label ?? 'Unclassified',
            isUnclassified: !point.annotations.length,
            isUnconfirmed: !point.annotations[0]?.is_confirmed,
            isConfirmed: !!point.annotations[0]?.is_confirmed,
            isPointInLeftHalfOfImage,
            isPointInTopHalfOfImage,
            labelAnchor: topCenter,
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
    [
      dataToReview?.original_image_height,
      dataToReview?.original_image_width,
      dataToReview?.points,
      halfPatchSize,
      imageScale,
      map,
    ],
  )

  const getPointsLabelAnchorsGeoJson = useCallback(
    () => ({
      type: 'FeatureCollection',
      features: dataToReview.points.flatMap((point) => {
        const labelPosition = map.current.unproject([
          point.column * imageScale,
          (point.row - halfPatchSize) * imageScale,
        ])

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [labelPosition.lng, labelPosition.lat],
          },
          properties: {
            id: point.id,
            ba_gr_label: point.annotations[0]?.ba_gr_label ?? 'Unclassified',
          },
        }
      }),
    }),
    [dataToReview, map, imageScale, halfPatchSize],
  )

  return { getPointsGeojson, getPointsLabelAnchorsGeoJson }
}
