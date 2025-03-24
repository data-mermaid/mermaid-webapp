import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import getBounds from '@turf/bbox'
import { buffer } from '@turf/buffer'
import { bboxPolygon } from '@turf/bbox-polygon'
import { booleanContains } from '@turf/boolean-contains'

import {
  IMAGE_CLASSIFICATION_COLORS as COLORS,
  IMAGE_CLASSIFICATION_COLORS,
} from '../../../../library/constants/constants'
import { imageClassificationResponsePropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { IconCircle, IconLabel, IconRefresh, IconTable } from '../../../icons'
import {
  ImageAnnotationMapWrapper,
  LabelPopup,
  LoadingIndicatorImageClassificationImage,
  MapControlButton,
  MapResetTooltip,
  ToggleLabelsTooltip,
  ToggleTableTooltip,
} from './ImageAnnotationModal.styles'
import ImageAnnotationPopup from './ImageAnnotationPopup/ImageAnnotationPopup'
import EditPointPopupWrapper from './ImageAnnotationPopup/EditPointPopupWrapper'
import { getPatchesCenters } from './getPatchesCenters'
import {
  DEFAULT_MAP_ANIMATION_DURATION,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from '../imageClassificationConstants'

const IMAGE_CLASSIFICATION_COLOR_EXP = [
  'case',

  ['get', 'isUnclassified'],
  COLORS.unclassified,

  ['get', 'isConfirmed'],
  COLORS.confirmed,

  COLORS.unconfirmed,
]

const zoomControl = new maplibregl.NavigationControl({ showCompass: false })
const pointLabelPopup = new maplibregl.Popup({
  anchor: 'bottom',
  closeButton: false,
})

const easeToDefaultView = (map) =>
  map.current.easeTo({
    center: DEFAULT_MAP_CENTER,
    zoom: DEFAULT_MAP_ZOOM,
    duration: DEFAULT_MAP_ANIMATION_DURATION,
    linear: true,
  })

// HACK: MapLibre's unproject() (used to get pixel coords) doesn't let you pass zoom as parameter.
// So to ensure that our points remain in the same position we:
// 1. store current lnglat/zoom, 2. reset map lnglat/zoom to default,
// 3. call unproject (to get pixel coords) 4. set back to current lnglat/zoom
const hackTemporarilySetMapToDefaultPosition = (map) => {
  map.current.setZoom(DEFAULT_MAP_ZOOM)
  map.current.setCenter(DEFAULT_MAP_CENTER)
}
const hackResetMapToCurrentPosition = (map, currentZoom, currentCenter) => {
  map.current.setZoom(currentZoom)
  map.current.setCenter(currentCenter)
}

const ImageAnnotationModalMap = ({
  databaseSwitchboardInstance,
  dataToReview,
  getPointsGeojson,
  getPointsLabelAnchorsGeoJson,
  hasMapLoaded,
  hoveredAttributeId,
  imageScale,
  isTableShowing,
  map,
  patchesGeoJson,
  selectedAttributeId,
  setDataToReview,
  setHasMapLoaded,
  setIsDataUpdatedSinceLastSave,
  setIsTableShowing,
  setPatchesGeoJson,
  zoomToPaddedBounds,
}) => {
  const [areLabelsShowing, setAreLabelsShowing] = useState(false)
  const [hoveredPointId, setHoveredPointId] = useState(null)
  const [selectedPoint, setSelectedPoint] = useState({
    id: null,
    popupAnchorLngLat: null,
    popupAnchorPosition: null,
  })
  const mapContainer = useRef(null)
  const popupRef = useRef()

  const closePopup = () => {
    setSelectedPoint({
      id: null,
      popupAnchorLngLat: null,
      popupAnchorPosition: null,
    })
    popupRef.current?.remove()
  }

  const toggleTable = () => {
    setIsTableShowing(!isTableShowing)
  }

  const toggleLabels = () => {
    const newAreLabelsShowing = !areLabelsShowing
    setAreLabelsShowing(newAreLabelsShowing)

    if (!map.current) {
      return
    }

    if (newAreLabelsShowing) {
      map.current.addLayer({
        id: 'patches-label-layer',
        type: 'symbol',
        source: 'patches-labels',
        layout: {
          'text-field': ['get', 'ba_gr_label'],
          'text-radial-offset': 1.2,
          'text-anchor': 'bottom',
          'icon-text-fit': 'both',
          'icon-image': 'label-background',
          'text-size': 11,
        },
      })

      return
    }

    if (map.current.getLayer('patches-label-layer')) {
      map.current.removeLayer('patches-label-layer')
    }
  }

  const updatePointsOnMap = useCallback(() => {
    const currentZoom = map.current?.getZoom()
    const currentCenter = map.current?.getCenter()

    hackTemporarilySetMapToDefaultPosition(map)
    const patches = getPointsGeojson()
    const patchesCenters = getPatchesCenters(patches)
    setPatchesGeoJson(patches)

    map.current?.getSource('patches')?.setData(patches)
    map.current?.getSource('patches-center')?.setData(patchesCenters)
    map.current?.getSource('patches-labels')?.setData(getPointsLabelAnchorsGeoJson())

    hackResetMapToCurrentPosition(map, currentZoom, currentCenter)
  }, [getPointsGeojson, getPointsLabelAnchorsGeoJson, map, setPatchesGeoJson])

  const updateImageSizeOnMap = () => {
    const bounds = map.current.getBounds()

    map.current?.getSource('benthicQuadratImage')?.setCoordinates([
      // spans the image across the entire map
      [bounds._sw.lng, bounds._ne.lat],
      [bounds._ne.lng, bounds._ne.lat],
      [bounds._ne.lng, bounds._sw.lat],
      [bounds._sw.lng, bounds._sw.lat],
    ])

    // Keep the max extent of the map to the size of the image
    map.current.setMaxBounds([
      [bounds._sw.lng, bounds._sw.lat],
      [bounds._ne.lng, bounds._ne.lat],
    ])
  }

  const _initializeMapAndData = useEffect(() => {
    if (hasMapLoaded) {
      return
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      minZoom: DEFAULT_MAP_ZOOM,
      renderWorldCopies: false, // prevents the image from repeating
      dragRotate: false,
      accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
      touchPitch: false,
    })

    map.current.addControl(zoomControl, 'top-left')

    const bounds = map.current.getBounds()
    const patches = getPointsGeojson()
    const patchesCenters = getPatchesCenters(patches)
    setPatchesGeoJson(patches)

    map.current.setStyle({
      version: 8,
      name: 'image',
      glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
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
          data: patches,
        },
        'patches-center': {
          type: 'geojson',
          data: patchesCenters,
        },
        'patches-labels': { type: 'geojson', data: getPointsLabelAnchorsGeoJson() },
      },
      layers: [
        {
          id: 'benthicQuadratImageLayer',
          type: 'raster',
          source: 'benthicQuadratImage',
        },
        {
          id: 'patches-status-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': 3,
            'line-offset': -3,
            'line-color': IMAGE_CLASSIFICATION_COLOR_EXP,
          },
        },
        {
          id: 'patches-inline-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': 3,
          },
        },
        {
          id: 'patches-outline-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': 3,
            'line-offset': -6,
          },
        },
        {
          id: 'patches-fill-layer',
          type: 'fill',
          source: 'patches',
          paint: {
            'fill-color': 'transparent',
          },
        },
      ],
    })

    // Keep the max extent of the map to the size of the image
    map.current.setMaxBounds([
      [bounds._sw.lng, bounds._sw.lat],
      [bounds._ne.lng, bounds._ne.lat],
    ])

    const handleMapLoad = () => {
      setHasMapLoaded(true)

      map.current.loadImage('/cross-hair.png', (error, image) => {
        if (error) {
          return
        }
        map.current.addImage('cross-hair', image)
        map.current.addLayer({
          id: 'patches-center-layer',
          type: 'symbol',
          source: 'patches-center',
          layout: {
            'icon-image': 'cross-hair',
          },
        })
      })

      map.current.loadImage('/label-background.png', (error, image) => {
        if (error) {
          return
        }

        map.current.addImage('label-background', image, {
          // this configuration allows the image to stretch around the label text
          stretchX: [[5, 135]],
          stretchY: [[5, 135]],
          content: [5, 5, 135, 135],
          pixelRatio: 2,
        })
      })
    }

    map.current.on('load', handleMapLoad)

    const currentMap = map.current
    // eslint-disable-next-line consistent-return
    return () => {
      currentMap.off('load', handleMapLoad)
      currentMap.remove()
    }
    // eslint-disable-next-line
  }, [])

  useEffect(
    function configurePatchesLabels() {
      if (!map.current) {
        return
      }
      const handlePatchMouseEnter = ({ features }) => {
        map.current.getCanvas().style.cursor = 'pointer'

        if (areLabelsShowing) {
          return
        }
        const [{ properties }] = features
        const label = properties.isUnclassified ? 'Unclassified' : properties.ba_gr_label
        const confirmedStatus = properties.isConfirmed ? 'confirmed' : 'unconfirmed'
        const pointStatus = properties.isUnclassified ? 'unclassified' : confirmedStatus
        const popupContent = (
          <LabelPopup>
            <IconCircle style={{ color: IMAGE_CLASSIFICATION_COLORS[pointStatus] }} /> {label}
          </LabelPopup>
        )
        const popupContentHack = document.createElement('div')
        ReactDOM.createRoot(popupContentHack).render(popupContent)

        pointLabelPopup
          .setLngLat(JSON.parse(properties.labelAnchor))
          .setDOMContent(popupContentHack)
          .addTo(map.current)

        pointLabelPopup.once('open', () => {
          const popupElementForStylingHack = document.querySelector('.mapboxgl-popup-content')

          if (popupElementForStylingHack) {
            popupElementForStylingHack.style.padding = '0'
          }
        })
      }
      const handlePatchMouseLeave = () => {
        map.current.getCanvas().style.cursor = ''
        pointLabelPopup.remove()
      }

      map.current.on('mouseenter', 'patches-fill-layer', handlePatchMouseEnter)
      map.current.on('mouseleave', 'patches-fill-layer', handlePatchMouseLeave)

      const currentMap = map.current
      // eslint-disable-next-line consistent-return
      return () => {
        currentMap.off('mouseenter', 'patches-fill-layer', handlePatchMouseEnter)
        currentMap.off('mouseleave', 'patches-fill-layer', handlePatchMouseLeave)
      }
    },
    [areLabelsShowing, map],
  )

  const zoomToSelectedPoint = useCallback(() => {
    if (!selectedPoint.bounds || !map.current) {
      return
    }

    zoomToPaddedBounds(selectedPoint.bounds)
  }, [map, selectedPoint.bounds, zoomToPaddedBounds])

  const selectFeature = useCallback((feature) => {
    const { properties } = feature

    const xAnchor = properties.isPointInLeftHalfOfImage ? 'left' : 'right'
    const yAnchor = properties.isPointInTopHalfOfImage ? 'top' : 'bottom'
    const popupAnchorPosition = `${yAnchor}-${xAnchor}`

    const bounds = new maplibregl.LngLatBounds(getBounds(feature))
    const topLeft = bounds.getNorthWest().toArray()
    const topRight = bounds.getNorthEast().toArray()
    const bottomRight = bounds.getSouthEast().toArray()
    const bottomLeft = bounds.getSouthWest().toArray()

    const latLngLookupByAnchorPosition = {
      'top-left': bottomRight,
      'top-right': bottomLeft,
      'bottom-left': topRight,
      'bottom-right': topLeft,
    }
    const selectedPointToUse = {
      id: properties.id,
      popupAnchorLngLat: latLngLookupByAnchorPosition[popupAnchorPosition],
      popupAnchorPosition,
      bounds,
    }
    setSelectedPoint(selectedPointToUse)

    return selectedPointToUse
  }, [])

  const selectNextUnconfirmedPoint = useCallback(() => {
    const patchesFeatures = patchesGeoJson?.features
    if (!patchesFeatures?.length) {
      return
    }

    const selectedPointFeaturesIndex = patchesFeatures.findIndex(
      (feature) => feature.properties.id === selectedPoint.id,
    )
    const backSectionOfFeaturesArray = patchesFeatures.slice(selectedPointFeaturesIndex + 1)

    const frontSectionOfFeaturesArray = patchesFeatures.slice(0, selectedPointFeaturesIndex)
    const featuresArrayOrderedForSearching = [
      ...backSectionOfFeaturesArray,
      ...frontSectionOfFeaturesArray,
    ]
    const nextUnconfirmedFeature = featuresArrayOrderedForSearching.find(
      (feature) => !feature.properties.isConfirmed,
    )

    zoomToPaddedBounds(getBounds(nextUnconfirmedFeature))

    selectFeature(nextUnconfirmedFeature)
  }, [patchesGeoJson, selectFeature, selectedPoint.id, zoomToPaddedBounds])

  const _displayEditPointPopupOnPointClick = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    const showFeaturePopupOnClick = ({ features }) => {
      const feature = features[0]
      const { popupAnchorLngLat } = selectFeature(feature)

      const bufferedFeature = buffer(feature, 1500) // the buffer unit is set by feel for laptop sized screens, it may need to be tweaked as we go
      const mapBoundsFeature = bboxPolygon(map.current.getBounds().toArray().flat())
      const isBufferedFeatureCompletelyWithinMapBounds = booleanContains(
        mapBoundsFeature,
        bufferedFeature,
      )
      const shouldAlsoZoom = map.current.getZoom() > 4.5
      const easeToOptions = {
        center: popupAnchorLngLat,
        duration: DEFAULT_MAP_ANIMATION_DURATION,
      }
      if (shouldAlsoZoom) {
        // Setting null zoom on easeTo will zoom all the way out;
        // setting undefined will cause errors, so we need to make
        // the zoom setting conditional.
        easeToOptions.zoom = 4.5
      }

      if (!isBufferedFeatureCompletelyWithinMapBounds) {
        map.current.easeTo(easeToOptions)
      }
    }

    const hideFeaturePopup = ({ point }) => {
      const [patches] = map.current.queryRenderedFeatures(point, { layers: ['patches-fill-layer'] })
      const isClickFromFeatureLayer = !!patches
      if (!isClickFromFeatureLayer) {
        closePopup()
      }
    }

    map.current.on('click', 'patches-fill-layer', showFeaturePopupOnClick)
    map.current.on('click', hideFeaturePopup)

    // eslint-disable-next-line consistent-return
    return () => {
      map.current.off('click', 'patches-fill-layer', showFeaturePopupOnClick)
      map.current.off('click', hideFeaturePopup)
    }
  }, [hasMapLoaded, map, selectFeature, zoomToPaddedBounds])

  const _updateStyleOnPointHover = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }
    const applyPointHoverStyle = ({ features }) => {
      if (features.length > 0) {
        const [{ properties }] = features
        setHoveredPointId(properties.id)
      }
    }
    const removePointHoverStyle = () => {
      setHoveredPointId(null)
    }
    map.current.on('mousemove', 'patches-fill-layer', applyPointHoverStyle)

    map.current.on('mouseleave', 'patches-fill-layer', removePointHoverStyle)

    const currentMap = map.current
    // eslint-disable-next-line consistent-return
    return () => {
      currentMap.off('mousemove', 'patches-fill-layer', applyPointHoverStyle)
      currentMap.off('mouseleave', 'patches-fill-layer', removePointHoverStyle)
    }
  }, [hasMapLoaded, map])

  const _updatePointsOnDataChange = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    updatePointsOnMap()
  }, [updatePointsOnMap, hasMapLoaded])

  // This effect is essentially triggered by the _setImageScaleOnWindowResize above.
  // It can be combined, but readability becomes comprimised.
  const _updateLayersOnImageScaleChange = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    map.current.resize()
    updatePointsOnMap()
    updateImageSizeOnMap()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageScale, hasMapLoaded])

  const _updateStylingForPoints = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    const lineColor = [
      'case',
      [
        '==', // checks if point on map is clicked
        ['get', 'id'],
        selectedPoint.id,
      ],
      COLORS.selected,

      [
        '==', // checks if point on map is in selected row in table
        ['get', 'ba_gr'],
        selectedAttributeId,
      ],
      COLORS.selected,

      [
        '==', // checks if point on map is clicked
        ['get', 'id'],
        hoveredPointId,
      ],
      COLORS.hover,

      [
        '==', // checks if point on map is in highlighted row in table
        ['get', 'ba_gr'],
        hoveredAttributeId,
      ],
      COLORS.hover,

      COLORS.outline, // resting outline color
    ]

    map.current.setPaintProperty('patches-inline-layer', 'line-color', lineColor)
    map.current.setPaintProperty('patches-outline-layer', 'line-color', lineColor)
  }, [selectedAttributeId, hoveredAttributeId, hoveredPointId, hasMapLoaded, selectedPoint, map])

  const resetZoom = () => {
    map.current.setBearing(0) // If on a touch device, reset the rotation before calling the easeTo function to avoid any potential issues.
    easeToDefaultView(map)
  }
  return (
    <ImageAnnotationMapWrapper>
      {!hasMapLoaded ? <LoadingIndicatorImageClassificationImage /> : null}
      <div
        ref={mapContainer}
        style={{
          width: dataToReview.original_image_width * imageScale,
          height: dataToReview.original_image_height * imageScale,
        }}
      />
      {hasMapLoaded ? (
        <MapResetTooltip tooltipText="Reset Zoom" id="reset-zoom" position="right">
          <MapControlButton type="button" onClick={resetZoom} title="reset zoom">
            <IconRefresh />
          </MapControlButton>
        </MapResetTooltip>
      ) : null}
      <ToggleTableTooltip
        tooltipText="Toggle Table Visibility"
        id="table-visibility"
        position="right"
      >
        <MapControlButton type="button" onClick={toggleTable} $isSelected={isTableShowing}>
          <IconTable />
        </MapControlButton>
      </ToggleTableTooltip>
      <ToggleLabelsTooltip
        tooltipText="Toggle Labels Visibility"
        id="toggle-labels"
        position="right"
      >
        <MapControlButton type="button" onClick={toggleLabels} $isSelected={areLabelsShowing}>
          <IconLabel />
        </MapControlButton>
      </ToggleLabelsTooltip>
      {selectedPoint.id ? (
        <EditPointPopupWrapper
          map={map.current}
          lngLat={selectedPoint.popupAnchorLngLat}
          anchor={selectedPoint.popupAnchorPosition}
          popupRef={popupRef}
        >
          <ImageAnnotationPopup
            dataToReview={dataToReview}
            setDataToReview={setDataToReview}
            pointId={selectedPoint.id}
            databaseSwitchboardInstance={databaseSwitchboardInstance}
            setIsDataUpdatedSinceLastSave={setIsDataUpdatedSinceLastSave}
            resetZoom={resetZoom}
            zoomToSelectedPoint={zoomToSelectedPoint}
            selectNextUnconfirmedPoint={selectNextUnconfirmedPoint}
          />
        </EditPointPopupWrapper>
      ) : null}
    </ImageAnnotationMapWrapper>
  )
}

ImageAnnotationModalMap.propTypes = {
  databaseSwitchboardInstance: PropTypes.object.isRequired,
  dataToReview: imageClassificationResponsePropType.isRequired,
  getPointsGeojson: PropTypes.func.isRequired,
  getPointsLabelAnchorsGeoJson: PropTypes.func.isRequired,
  hasMapLoaded: PropTypes.bool.isRequired,
  hoveredAttributeId: PropTypes.string.isRequired,
  imageScale: PropTypes.number.isRequired,
  isTableShowing: PropTypes.bool.isRequired,
  map: PropTypes.object.isRequired,
  patchesGeoJson: PropTypes.object.isRequired,
  selectedAttributeId: PropTypes.string.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  setHasMapLoaded: PropTypes.func.isRequired,
  setIsDataUpdatedSinceLastSave: PropTypes.func.isRequired,
  setIsTableShowing: PropTypes.func.isRequired,
  setPatchesGeoJson: PropTypes.func,
  zoomToPaddedBounds: PropTypes.func.isRequired,
}

export default ImageAnnotationModalMap
