import React from 'react'
import { createRoot } from 'react-dom/client'
import Popup from './Popup'
import maplibregl from 'maplibre-gl'
import mapPin from '../../assets/map-pin.png'

const coralAtlasAppId = import.meta.env.VITE_CORAL_ATLAS_APP_ID

export const benthicColors = {
  coral_algae: 'rgb(255, 97, 97)',
  benthic_microalgae: 'rgb(155, 204, 79)',
  rock: 'rgb(177, 156, 58)',
  rubble: 'rgb(224, 208, 94)',
  sand: 'rgb(255, 255, 190)',
  seagrass: 'rgb(102, 132, 56)',
}

export const geomorphicColors = {
  back_reef_slope: 'rgb(190, 251, 255)',
  deep_lagoon: 'rgb(44, 162, 249)',
  inner_reef_flat: 'rgb(197, 167, 203)',
  outer_reef_flat: 'rgb(146, 115, 157)',
  patch_reefs: 'rgb(255, 186, 21)',
  plateau: 'rgb(205, 104, 18)',
  reef_crest: 'rgb(97, 66, 114)',
  reef_slope: 'rgb(40, 132, 113)',
  shallow_lagoon: 'rgb(119, 208, 252)',
  sheltered_reef_slope: 'rgb(16, 189, 166)',
  small_reef: 'rgb(230, 145, 19)',
  terrestrial_reef_flat: 'rgb(251, 222, 251)',
}

// Mapping of legend IDs to display names, not affected by localization, used for map expressions
export const atlasLegendNames = {
  coral_algae: 'Coral/Algae',
  benthic_microalgae: 'Benthic Microalgae',
  rock: 'Rock',
  rubble: 'Rubble',
  sand: 'Sand',
  seagrass: 'Seagrass',
  back_reef_slope: 'Back Reef Slope',
  deep_lagoon: 'Deep Lagoon',
  inner_reef_flat: 'Inner Reef Flat',
  outer_reef_flat: 'Outer Reef Flat',
  patch_reefs: 'Patch Reefs',
  plateau: 'Plateau',
  reef_crest: 'Reef Crest',
  reef_slope: 'Reef Slope',
  shallow_lagoon: 'Shallow Lagoon',
  sheltered_reef_slope: 'Sheltered Reef Slope',
  small_reef: 'Small Reef',
  terrestrial_reef_flat: 'Terrestrial Reef Flat',
}

const geomorphicFillColor = [
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

const geomorphicDefaultOpacityExpression = [
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

const benthicFillColor = [
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

const benthicDefaultOpacityExpression = [
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

export const lightBaseMap = {
  version: 8,
  name: 'light',
  sources: {
    worldmap: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
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
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
}

export const addZoomController = (map) => {
  map.addControl(
    new maplibregl.NavigationControl({
      showCompass: false,
      showZoom: true,
    }),
    'top-left',
  )

  map.dragRotate.disable()
  map.touchZoomRotate.disableRotation()
}

const applyOpacityExpression = (array) => {
  if (array === null) {
    return 0
  }

  const arrayExp = array.flatMap((item) => {
    const equalBenthic = [['==', ['get', 'class_name']], 1]

    equalBenthic[0].push(item)

    return equalBenthic
  })

  arrayExp.unshift('case')
  arrayExp.push(0)

  return array.length > 0 ? arrayExp : 0
}

export const setCoralMosaicLayerProperty = (map, dataLayerFromLocalStorage) => {
  map.setPaintProperty('atlas-planet', 'raster-opacity', dataLayerFromLocalStorage)
}

export const setGeomorphicOrBenthicLayerProperty = (map, property, dataLayerFromLocalStorage) => {
  map.setPaintProperty(property, 'fill-opacity', applyOpacityExpression(dataLayerFromLocalStorage))
}

export const loadACALayers = (map) => {
  // Get localStorage values
  const coralMosaicStorage = JSON.parse(localStorage.getItem('coral_mosaic'))
  const geomorphicStorage = JSON.parse(localStorage.getItem('geomorphic_legend'))
  const benthicStorage = JSON.parse(localStorage.getItem('benthic_legend'))

  // Calculate opacity values
  const getOpacityExpression = (storageData) => {
    return storageData
      ? applyOpacityExpression(storageData.map((item) => atlasLegendNames[item]))
      : null
  }

  const geomorphicOpacityExpression = getOpacityExpression(geomorphicStorage)
  const benthicOpacityExpression = getOpacityExpression(benthicStorage)

  // Set final opacity expressions
  const coralMosaicRasterOpacity = coralMosaicStorage ?? 1
  const geomorphicFillOpacity = geomorphicOpacityExpression ?? geomorphicDefaultOpacityExpression
  const benthicFillOpacity = benthicOpacityExpression ?? benthicDefaultOpacityExpression

  // Check if 'clusters' layer exists before adding layers before it
  const beforeLayerId = map.getLayer('clusters') ? 'clusters' : undefined

  map.addSource('atlas-planet', {
    type: 'raster',
    tiles: [
      `https://allencoralatlas.org/tiles/planet/visual/2019/{z}/{x}/{y}?appid=${coralAtlasAppId}`,
    ],
  })

  map.addSource('atlas-geomorphic', {
    type: 'vector',
    tiles: [`https://allencoralatlas.org/tiles/geomorphic/{z}/{x}/{y}?appid=${coralAtlasAppId}`],
    minZoom: 0,
    maxZoom: 22,
  })

  map.addSource('atlas-benthic', {
    type: 'vector',
    tiles: [`https://allencoralatlas.org/tiles/benthic/{z}/{x}/{y}?appid=${coralAtlasAppId}`],
    minZoom: 0,
    maxZoom: 22,
  })

  map.addLayer(
    {
      id: 'atlas-planet',
      type: 'raster',
      source: 'atlas-planet',
      'source-layer': 'planet',
      paint: {
        'raster-opacity': coralMosaicRasterOpacity,
      },
    },
    beforeLayerId,
  )

  map.addLayer(
    {
      id: 'atlas-geomorphic',
      type: 'fill',
      source: 'atlas-geomorphic',
      'source-layer': 'geomorphic',
      paint: {
        'fill-color': geomorphicFillColor,
        'fill-opacity': geomorphicFillOpacity,
      },
    },
    beforeLayerId,
  )

  map.addLayer(
    {
      id: 'atlas-benthic',
      type: 'fill',
      source: 'atlas-benthic',
      'source-layer': 'benthic',
      paint: {
        'fill-color': benthicFillColor,
        'fill-opacity': benthicFillOpacity,
      },
    },
    beforeLayerId,
  )
}

export const getMapMarkersFeature = (records) => {
  const bounds = new maplibregl.LngLatBounds()

  const data = {
    type: 'FeatureCollection',
    features: [],
  }

  for (const rec of records) {
    const rec_geo_data = {
      id: rec.id,
      name: rec.name,
      project_id: rec.project,
      exposure: rec.exposure,
      reef_type: rec.reef_type || rec.reefType,
      reef_zone: rec.reef_zone || rec.reefZone,
    }

    const recPoint = {
      type: 'Feature',
      geometry: rec.location,
      properties: rec_geo_data,
    }

    bounds.extend(rec.location.coordinates)
    data.features.push(recPoint)
  }

  return { markersData: data, bounds }
}

export const loadMapMarkersLayer = (map) => {
  map.loadImage(mapPin, (error, image) => {
    if (error) {
      console.error('Error loading image: ', error)
      return
    }

    map.addImage('custom-marker', image)

    map.addSource('mapMarkers', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })

    map.addLayer({
      id: 'mapMarkers',
      source: 'mapMarkers',
      type: 'symbol',
      layout: {
        'icon-image': 'custom-marker',
        'icon-size': 1,
      },
    })
  })
}

export const handleMapOnWheel = (mapCurrent, handleZoomDisplayHelpText) => {
  mapCurrent.on('wheel', (e) => {
    if (e.originalEvent.ctrlKey) {
      e.originalEvent.preventDefault()
      handleZoomDisplayHelpText(false)
      if (!mapCurrent.scrollZoom._enabled) {
        mapCurrent.scrollZoom.enable()
      }
    } else {
      if (mapCurrent.scrollZoom._enabled) {
        mapCurrent.scrollZoom.disable()
      }
      handleZoomDisplayHelpText(true)
      setTimeout(() => {
        handleZoomDisplayHelpText(false)
      }, 1500)
    }
  })
}

export const addClusterSourceAndLayers = (map) => {
  map.addSource('mapMarkers', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  })

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'mapMarkers',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#A53434', 100, '#f1f075', 750, '#f28cb1'],
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  })

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'mapMarkers',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size': 12,
    },
    paint: {
      'text-color': '#ffffff',
    },
  })

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'mapMarkers',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#A53434',
      'circle-radius': 9,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  })
}

export const addClusterEventListeners = (map, popUpRef, choices) => {
  map.on('click', 'clusters', ({ features }) => {
    const clusterId = features[0].properties.cluster_id

    map.getSource('mapMarkers').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return
      }

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom,
      })
    })
  })

  map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice()
    const markerProperty = e.features[0].properties
    const popupNode = document.createElement('div')
    const reactRoot = createRoot(popupNode)

    reactRoot.render(<Popup properties={markerProperty} choices={choices} />)

    popUpRef.current.setLngLat(coordinates).setDOMContent(popupNode).addTo(map)
  })

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = ''
  })

  map.on('mouseenter', 'unclustered-point', () => {
    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'unclustered-point', () => {
    map.getCanvas().style.cursor = ''
  })
}
