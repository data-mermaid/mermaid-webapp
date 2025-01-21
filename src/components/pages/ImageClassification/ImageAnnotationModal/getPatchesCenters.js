import getCentroid from '@turf/centroid'

export const getPatchesCenters = (patchesGeoJson) => ({
  type: 'FeatureCollection',
  features: patchesGeoJson.features.map((feature) => getCentroid(feature)),
})
