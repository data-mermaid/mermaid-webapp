// importing from @turf/turf causes issues with tests, so import each utility individually
import { bbox } from '@turf/bbox'

export const useZoomToPointsByAttributeId = ({ patchesGeoJson, zoomToPaddedBounds }) => {
  const zoomToPointsByAttributeId = (attributeId) => {
    if (!patchesGeoJson?.features.length) {
      return
    }

    const featuresAssociatedWithAttribute = patchesGeoJson?.features?.filter(
      (feature) => feature.properties.ba_gr === attributeId,
    )

    const pointsBounds = bbox({
      type: 'FeatureCollection',
      features: featuresAssociatedWithAttribute,
    })
    zoomToPaddedBounds(pointsBounds)
  }

  return { zoomToPointsByAttributeId }
}
