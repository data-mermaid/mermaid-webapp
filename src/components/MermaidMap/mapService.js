export const benthicColors = {
  'Coral/Algae': 'rgb(255, 97, 97)',
  'Benthic Microalgae': 'rgb(155, 204, 79)',
  Rock: 'rgb(177, 156, 58)',
  Rubble: 'rgb(224, 208, 94)',
  Sand: 'rgb(255, 255, 190)',
  Seagrass: 'rgb(102, 132, 56)',
}

export const geomorphicColors = {
  'Back Reef Slope': 'rgb(190, 251, 255)',
  'Deep Lagoon': 'rgb(44, 162, 249)',
  'Inner Reef Flat': 'rgb(197, 167, 203)',
  'Outer Reef Flat': 'rgb(146, 115, 157)',
  'Patch Reefs': 'rgb(255, 186, 21)',
  Plateau: 'rgb(205, 104, 18)',
  'Reef Crest': 'rgb(97, 66, 114)',
  'Reef Slope': 'rgb(40, 132, 113)',
  'Shallow Lagoon': 'rgb(119, 208, 252)',
  'Sheltered Reef Slope': 'rgb(16, 189, 166)',
  'Small Reef': 'rgb(230, 145, 19)',
  'Terrestrial Reef Flat': 'rgb(251, 222, 251)',
}

const geomorphicColorExpression = [
  'case',
  ['==', ['get', 'class_name'], 'Back Reef Slope'],
  'rgb(190, 251, 255)',
  ['==', ['get', 'class_name'], 'Deep Lagoon'],
  'rgb(44, 162, 249)',
  ['==', ['get', 'class_name'], 'Inner Reef Flat'],
  'rgb(197, 167, 203)',
  ['==', ['get', 'class_name'], 'Outer Reef Flat'],
  'rgb(146, 115, 157)',
  ['==', ['get', 'class_name'], 'Patch Reefs'],
  'rgb(255, 186, 21)',
  ['==', ['get', 'class_name'], 'Plateau'],
  'rgb(205, 104, 18)',
  ['==', ['get', 'class_name'], 'Reef Crest'],
  'rgb(97, 66, 114)',
  ['==', ['get', 'class_name'], 'Reef Slope'],
  'rgb(40, 132, 113)',
  ['==', ['get', 'class_name'], 'Shallow Lagoon'],
  'rgb(119, 208, 252)',
  ['==', ['get', 'class_name'], 'Sheltered Reef Slope'],
  'rgb(16, 189, 166)',
  ['==', ['get', 'class_name'], 'Small Reef'],
  'rgb(230, 145, 19)',
  ['==', ['get', 'class_name'], 'Terrestrial Reef Flat'],
  'rgb(251, 222, 251)',
  'rgb(201, 65, 216)', // Default / other
]

const geomorphicOpacityExpression = [
  'case',
  ['==', ['get', 'class_name'], 'Back Reef Slope'],
  1,
  ['==', ['get', 'class_name'], 'Deep Lagoon'],
  1,
  ['==', ['get', 'class_name'], 'Inner Reef Flat'],
  1,
  ['==', ['get', 'class_name'], 'Outer Reef Flat'],
  1,
  ['==', ['get', 'class_name'], 'Patch Reefs'],
  1,
  ['==', ['get', 'class_name'], 'Plateau'],
  1,
  ['==', ['get', 'class_name'], 'Reef Crest'],
  1,
  ['==', ['get', 'class_name'], 'Reef Slope'],
  1,
  ['==', ['get', 'class_name'], 'Shallow Lagoon'],
  1,
  ['==', ['get', 'class_name'], 'Sheltered Reef Slope'],
  1,
  ['==', ['get', 'class_name'], 'Small Reef'],
  1,
  ['==', ['get', 'class_name'], 'Terrestrial Reef Flat'],
  1,
  0, // Default / other
]

const benthicColorExpression = [
  'case',
  ['==', ['get', 'class_name'], 'Coral/Algae'],
  'rgb(255, 97, 97)',
  ['==', ['get', 'class_name'], 'Benthic Microalgae'],
  'rgb(155, 204, 79)',
  ['==', ['get', 'class_name'], 'Rock'],
  'rgb(177, 156, 58)',
  ['==', ['get', 'class_name'], 'Rubble'],
  'rgb(224, 208, 94)',
  ['==', ['get', 'class_name'], 'Sand'],
  'rgb(254, 254, 190)',
  ['==', ['get', 'class_name'], 'Seagrass'],
  'rgb(102, 132, 56)',
  'rgb(201, 65, 216)', // Default / other
]

const benthicOpacityExpression = [
  'case',
  ['==', ['get', 'class_name'], 'Sand'],
  1,
  ['==', ['get', 'class_name'], 'Seagrass'],
  1,
  ['==', ['get', 'class_name'], 'Rubble'],
  1,
  ['==', ['get', 'class_name'], 'Benthic Microalgae'],
  1,
  ['==', ['get', 'class_name'], 'Rock'],
  1,
  ['==', ['get', 'class_name'], 'Coral/Algae'],
  1,
  0, // Default / other
]

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

export const applyOpacityExpression = (array) => {
  if (array === null) return 0

  const arrayExp = array.flatMap((item) => {
    const equalBenthic = [['==', ['get', 'class_name']], 1]

    equalBenthic[0].push(item)

    return equalBenthic
  })

  arrayExp.unshift('case')
  arrayExp.push(0)

  return array.length > 0 ? arrayExp : 0
}

export const loadACALayers = (map) => {
  const coralMosaicLocalStorage = JSON.parse(
    localStorage.getItem('coral_mosaic'),
  )

  const fillGeomorphicOpacityValue = applyOpacityExpression(
    JSON.parse(localStorage.getItem('geomorphic_legend')),
  )

  const fillBenthicOpacityValue = applyOpacityExpression(
    JSON.parse(localStorage.getItem('benthic_legend')),
  )
  const isGeomorphicStorageNull =
    localStorage.getItem('geomorphic_legend') === null
  const isBenthicStorageNull = localStorage.getItem('benthic_legend') === null

  const rasterOpacityExpression =
    coralMosaicLocalStorage !== null ? coralMosaicLocalStorage : 1

  const fillGeomorphicOpacityExpression = isGeomorphicStorageNull
    ? geomorphicOpacityExpression
    : fillGeomorphicOpacityValue

  const fillBenthicOpacityExpression = isBenthicStorageNull
    ? benthicOpacityExpression
    : fillBenthicOpacityValue

  map.addSource('atlas-planet', {
    type: 'raster',
    tiles: ['https://allencoralatlas.org/tiles/planet/visual/2019/{z}/{x}/{y}'],
  })

  map.addSource('atlas-geomorphic', {
    type: 'vector',
    tiles: ['https://allencoralatlas.org/tiles/geomorphic/{z}/{x}/{y}'],
    minZoom: 0,
    maxZoom: 22,
  })

  map.addSource('atlas-benthic', {
    type: 'vector',
    tiles: ['https://allencoralatlas.org/tiles/benthic/{z}/{x}/{y}'],
    minZoom: 0,
    maxZoom: 22,
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

  map.addLayer({
    id: 'atlas-geomorphic',
    type: 'fill',
    source: 'atlas-geomorphic',
    'source-layer': 'geomorphic',
    paint: {
      'fill-color': geomorphicColorExpression,
      'fill-opacity': fillGeomorphicOpacityExpression,
    },
  })

  map.addLayer({
    id: 'atlas-benthic',
    type: 'fill',
    source: 'atlas-benthic',
    'source-layer': 'benthic',
    paint: {
      'fill-color': benthicColorExpression,
      'fill-opacity': fillBenthicOpacityExpression,
    },
  })
}
