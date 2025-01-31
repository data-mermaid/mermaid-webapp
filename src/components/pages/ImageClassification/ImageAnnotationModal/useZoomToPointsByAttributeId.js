// importing from @turf/turf causes issues with tests, so import each utility individually
import bbox from '@turf/bbox'
import buffer from '@turf/buffer'

export const useZoomToPointsByAttributeId = ({ getPointsGeojson, mapRef }) => {
  const zoomToPointsByAttributeId = (attributeId) => {
    // we need to zoom out first to reset the bounds so that zooming in works properly
    // since the points geojson is created using the maps current bounds
    mapRef.current.setZoom(0)

    const pointsGeoJson = getPointsGeojson()
    const featuresAssociatedWithAttribute = pointsGeoJson.features.filter(
      (feature) => feature.properties.ba_gr === attributeId,
    )
    const zoomInBounds = bbox(
      buffer(
        {
          type: 'FeatureCollection',
          features: featuresAssociatedWithAttribute,
        },
        500,
      ),
    )

    mapRef.current.fitBounds(zoomInBounds, { duration: 0 })
  }

  return { zoomToPointsByAttributeId }
}
