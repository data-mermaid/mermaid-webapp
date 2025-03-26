import getCentroid from '@turf/centroid'

export const getPatchesCenters = (patchesGeoJson: GeoJSON.FeatureCollection) =>
  ({
    type: 'FeatureCollection',
    features: patchesGeoJson?.features?.map((feature) => getCentroid(feature)),
  } as GeoJSON.FeatureCollection)
