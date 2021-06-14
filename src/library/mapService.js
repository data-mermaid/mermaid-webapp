export const satelliteBaseMap = {
  version: 8,
  name: 'World Map',
  sources: {
    worldmap: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
    },
  },
  layers: [
    {
      id: 'base-map',
      type: 'raster',
      source: 'worldmap',
    },
  ],
}

export const loadACALayers = (map, opts) => {
  const { rasterOpacityExpression } = opts

  map.addSource('atlas-planet', {
    type: 'raster',
    tiles: ['https://allencoralatlas.org/tiles/planet/visual/2019/{z}/{x}/{y}'],
  })
  map.addLayer({
    id: 'atlas-planet',
    type: 'raster',
    source: 'atlas-planet',
    'source-layer': 'planet',
    paint: {
      'raster-opacity': rasterOpacityExpression,
    },
  })
}
