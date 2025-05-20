import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'

import getBounds from '@turf/bbox'
import { bboxPolygon } from '@turf/bbox-polygon'
import { booleanContains } from '@turf/boolean-contains'
import { buffer } from '@turf/buffer'
import maplibregl, {
  Expression,
  LngLatLike,
  MapboxGeoJSONFeature,
  MapMouseEvent,
  Popup,
} from 'maplibre-gl'
import crossHairIcon from '../../../../assets/cross-hair.png'
import labelBackgroundUrl from '../../../../assets/label-background.png'
import {
  ConnectedMapControlButtonContainer,
  MapButtonContainer,
  MapControlButton,
} from '../mapButtons/MapButtonContainer'

import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'

import { ImageClassificationResponse } from '../../../../App/mermaidData/mermaidDataTypes'
import { MapRef } from '../../../../types/map'
import { MuiTooltipDarkRight } from '../../../generic/MuiTooltip'
import { IconCircle, IconLabel, IconMinus, IconPlus, IconRefresh, IconTable } from '../../../icons'
import {
  DEFAULT_MAP_ANIMATION_DURATION,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from '../imageClassificationConstants'
import {
  ImageAnnotationMapWrapper,
  LabelPopup,
  LoadingIndicatorImageClassificationImage,
} from './ImageAnnotationModal.styles'
import EditPointPopupWrapper from './ImageAnnotationPopup/EditPointPopupWrapper'
import ImageAnnotationPopup from './ImageAnnotationPopup/ImageAnnotationPopup'
import { getPatchesCenters } from './getPatchesCenters'
import { usePointsGeoJson } from './usePointsGeoJson'
import language from '../../../../language'

interface SelectedPoint {
  id: string | null
  popupAnchorLngLat: LngLatLike | null
  popupAnchorPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null
  bounds: maplibregl.LngLatBounds | null
}

const IMAGE_CLASSIFICATION_COLOR_EXP = [
  'case',

  ['get', 'isUnclassified'],
  COLORS.unclassifiedPoint,

  ['get', 'isConfirmed'],
  COLORS.confirmedPoint,

  COLORS.unconfirmedPoint,
] as Expression

const pointLabelPopup = new maplibregl.Popup({
  anchor: 'bottom',
  closeButton: false,
})

const easeToDefaultView = (map: MapRef) =>
  map.current?.easeTo({
    center: DEFAULT_MAP_CENTER,
    zoom: DEFAULT_MAP_ZOOM,
    duration: DEFAULT_MAP_ANIMATION_DURATION,
    // @ts-expect-error - maplibre-gl types are incomplete
    linear: true,
  })

// HACK: MapLibre's unproject() (used to get pixel coords) doesn't let you pass zoom as parameter.
// So to ensure that our points remain in the same position we:
// 1. store current lnglat/zoom, 2. reset map lnglat/zoom to default,
// 3. call unproject (to get pixel coords) 4. set back to current lnglat/zoom
const hackTemporarilySetMapToDefaultPosition = (map: MapRef) => {
  map.current?.setZoom(DEFAULT_MAP_ZOOM)
  map.current?.setCenter(DEFAULT_MAP_CENTER)
}
const hackResetMapToCurrentPosition = (
  map: MapRef,
  currentZoom: number,
  currentCenter: LngLatLike,
) => {
  map.current?.setZoom(currentZoom)
  map.current?.setCenter(currentCenter)
}

const ImageAnnotationModalMap = ({
  databaseSwitchboardInstance,
  dataToReview,
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
}: {
  databaseSwitchboardInstance: object
  dataToReview: ImageClassificationResponse
  hasMapLoaded: boolean
  hoveredAttributeId?: string
  imageScale: number
  isTableShowing: boolean
  map: MapRef
  patchesGeoJson: GeoJSON.FeatureCollection
  selectedAttributeId?: string
  setDataToReview: Dispatch<SetStateAction<ImageClassificationResponse>>
  setHasMapLoaded: Dispatch<SetStateAction<boolean>>
  setIsDataUpdatedSinceLastSave: Dispatch<SetStateAction<boolean>>
  setIsTableShowing: Dispatch<SetStateAction<boolean>>
  setPatchesGeoJson: Dispatch<SetStateAction<GeoJSON.FeatureCollection>>
  zoomToPaddedBounds: (bounds: number[]) => void
}) => {
  const { getPointsGeojson, getPointsLabelAnchorsGeoJson } = usePointsGeoJson({
    dataToReview,
    imageScale,
    map,
  })
  const [areLabelsShowing, setAreLabelsShowing] = useState<boolean>(false)
  const [hoverPatchAttributeGuid, setHoverPatchAttributeGuid] = useState<string>('')

  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint>({
    id: null,
    popupAnchorLngLat: null,
    popupAnchorPosition: null,
    bounds: null,
  })
  const mapContainer = useRef<HTMLDivElement>(null)
  const popupRef = useRef<Popup>(null)

  const closePopup = () => {
    setSelectedPoint({
      id: null,
      popupAnchorLngLat: null,
      popupAnchorPosition: null,
      bounds: null,
    })
    popupRef.current?.remove()
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
    if (!map.current) {
      return
    }
    const currentZoom = map.current.getZoom()
    const currentCenter = map.current.getCenter()

    hackTemporarilySetMapToDefaultPosition(map)
    const patches = getPointsGeojson() as GeoJSON.FeatureCollection
    const patchesCenters = getPatchesCenters(patches)
    setPatchesGeoJson(patches)

    const patchesSource = map.current.getSource('patches') as maplibregl.GeoJSONSource
    const patchesCenterSource = map.current.getSource('patches-center') as maplibregl.GeoJSONSource
    const patchesLabelsSource = map.current.getSource('patches-labels') as maplibregl.GeoJSONSource
    patchesSource?.setData(patches)
    patchesCenterSource?.setData(patchesCenters)
    patchesLabelsSource?.setData(getPointsLabelAnchorsGeoJson() as GeoJSON.FeatureCollection)
    if (currentZoom && currentCenter) {
      hackResetMapToCurrentPosition(map, currentZoom, currentCenter)
    }
  }, [getPointsGeojson, getPointsLabelAnchorsGeoJson, map, setPatchesGeoJson])

  const updateImageSizeOnMap = useCallback(() => {
    const bounds = map.current?.getBounds()
    if (!bounds || !map.current) {
      return
    }
    const boundsWest = bounds.getWest()
    const boundsEast = bounds.getEast()
    const boundsNorth = bounds.getNorth()
    const boundsSouth = bounds.getSouth()

    const bpqSource = map.current.getSource('benthicQuadratImage') as maplibregl.ImageSource
    bpqSource?.setCoordinates([
      // spans the image across the entire map
      [boundsWest, boundsNorth],
      [boundsEast, boundsNorth],
      [boundsEast, boundsSouth],
      [boundsWest, boundsSouth],
    ])

    // Keep the max extent of the map to the size of the image
    map.current.setMaxBounds([
      [boundsWest, boundsSouth],
      [boundsEast, boundsNorth],
    ])
  }, [map])

  const _initializeMapAndData = useEffect(() => {
    if (hasMapLoaded) {
      return
    }

    map.current = new maplibregl.Map({
      // @ts-expect-error - maplibre-gl types are incomplete
      container: mapContainer.current,
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      minZoom: DEFAULT_MAP_ZOOM,
      renderWorldCopies: false, // prevents the image from repeating
      dragRotate: false,
      accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
      touchPitch: false,
    })

    const bounds = map.current.getBounds()
    const boundsWest = bounds.getWest()
    const boundsEast = bounds.getEast()
    const boundsNorth = bounds.getNorth()
    const boundsSouth = bounds.getSouth()
    const patches = getPointsGeojson() as GeoJSON.FeatureCollection
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
            [boundsWest, boundsNorth],
            [boundsEast, boundsNorth],
            [boundsEast, boundsSouth],
            [boundsWest, boundsSouth],
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
        'patches-labels': {
          type: 'geojson',
          data: getPointsLabelAnchorsGeoJson() as GeoJSON.FeatureCollection,
        },
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
      [boundsWest, boundsSouth],
      [boundsEast, boundsNorth],
    ])

    const handleMapLoad = () => {
      setHasMapLoaded(true)
      map.current?.loadImage(crossHairIcon, (error: Error, image: HTMLImageElement) => {
        if (error) {
          return
        }
        map.current?.addImage('cross-hair', image)
        map.current?.addLayer({
          id: 'patches-center-layer',
          type: 'symbol',
          source: 'patches-center',
          layout: {
            'icon-image': 'cross-hair',
          },
        })
      })

      map.current?.loadImage(labelBackgroundUrl, (error: Error, image: HTMLImageElement) => {
        if (error) {
          return
        }

        map.current?.addImage('label-background', image, {
          // this configuration allows the image to stretch around the label text
          // @ts-expect-error - maplibre-gl types are incomplete
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
      const handlePatchMouseEnter = (
        event: MapMouseEvent & { features?: MapboxGeoJSONFeature[] },
      ) => {
        const { features } = event
        if (!map.current) {
          return
        }
        map.current.getCanvas().style.cursor = 'pointer'

        if (areLabelsShowing) {
          return
        }
        const [{ properties }] = features ?? []
        const confirmedStatus = properties?.isConfirmed ? 'confirmed' : 'unconfirmed'
        const pointStatus = properties?.isUnclassified ? 'unclassified' : confirmedStatus
        const popupContent = (
          <LabelPopup>
            <IconCircle style={{ color: COLORS[pointStatus] }} /> {properties?.ba_gr_label}
          </LabelPopup>
        )
        const popupContentHack = document.createElement('div')
        ReactDOM.createRoot(popupContentHack).render(popupContent)
        let popupLngLat
        try {
          popupLngLat = JSON.parse(properties?.labelAnchor)
        } catch {
          console.warn('Unable to derive coordinates for label display on hover')
          return
        }

        pointLabelPopup.setLngLat(popupLngLat).setDOMContent(popupContentHack).addTo(map.current)

        pointLabelPopup.once('open', () => {
          const popupElementForStylingHack = document.querySelector('.mapboxgl-popup-content')

          if (popupElementForStylingHack) {
            // @ts-expect-error - style exists on this Element
            popupElementForStylingHack.style.padding = '0'
          }
        })
      }
      const handlePatchMouseLeave = () => {
        if (!map.current) {
          return
        }
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

    zoomToPaddedBounds(selectedPoint.bounds as unknown as number[])
  }, [map, selectedPoint.bounds, zoomToPaddedBounds])

  const selectFeature = useCallback((feature: GeoJSON.Feature) => {
    const { properties } = feature

    const xAnchor = properties?.isPointInLeftHalfOfImage ? 'left' : 'right'
    const yAnchor = properties?.isPointInTopHalfOfImage ? 'top' : 'bottom'
    const popupAnchorPosition = `${yAnchor}-${xAnchor}` as
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right'

    const bounds = new maplibregl.LngLatBounds(
      getBounds(feature) as unknown as [LngLatLike, LngLatLike],
    )
    const topLeft = bounds.getNorthWest().toArray() as LngLatLike
    const topRight = bounds.getNorthEast().toArray() as LngLatLike
    const bottomRight = bounds.getSouthEast().toArray() as LngLatLike
    const bottomLeft = bounds.getSouthWest().toArray() as LngLatLike

    const latLngLookupByAnchorPosition = {
      'top-left': bottomRight,
      'top-right': bottomLeft,
      'bottom-left': topRight,
      'bottom-right': topLeft,
    }
    const selectedPointToUse = {
      id: properties?.id,
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
      (feature) => feature.properties?.id === selectedPoint.id,
    )
    const backSectionOfFeaturesArray = patchesFeatures.slice(selectedPointFeaturesIndex + 1)

    const frontSectionOfFeaturesArray = patchesFeatures.slice(0, selectedPointFeaturesIndex)
    const featuresArrayOrderedForSearching = [
      ...backSectionOfFeaturesArray,
      ...frontSectionOfFeaturesArray,
    ]
    const nextUnconfirmedFeature = featuresArrayOrderedForSearching.find(
      (feature) => !feature.properties?.isConfirmed,
    )
    if (!nextUnconfirmedFeature) {
      return
    }
    zoomToPaddedBounds(getBounds(nextUnconfirmedFeature))

    selectFeature(nextUnconfirmedFeature)
  }, [patchesGeoJson, selectFeature, selectedPoint.id, zoomToPaddedBounds])

  const _displayEditPointPopupOnPointClick = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    const showFeaturePopupOnClick = (
      event: MapMouseEvent & { features?: MapboxGeoJSONFeature[] },
    ) => {
      const { features } = event
      if (!features || features.length === 0 || !map.current) {
        return
      }
      const feature = features[0]
      const { popupAnchorLngLat } = selectFeature(feature)

      const bufferedFeature = buffer(feature, 1500) // the buffer unit is set by feel for laptop sized screens, it may need to be tweaked as we go
      if (!bufferedFeature) {
        return
      }
      const flattenedMapBounds = map.current?.getBounds().toArray().flat()
      if (!flattenedMapBounds) {
        return
      }
      const mapBoundsFeature = bboxPolygon(flattenedMapBounds as [number, number, number, number])
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
        // @ts-expect-error - maplibre-gl types are incomplete
        easeToOptions.zoom = 4.5
      }

      if (!isBufferedFeatureCompletelyWithinMapBounds) {
        map.current.easeTo(easeToOptions)
      }
    }

    const hideFeaturePopup = ({ point }: MapMouseEvent) => {
      const [patches] =
        map.current?.queryRenderedFeatures(point, { layers: ['patches-fill-layer'] }) ?? []
      const isClickFromFeatureLayer = !!patches
      if (!isClickFromFeatureLayer) {
        closePopup()
      }
    }

    map.current?.on('click', 'patches-fill-layer', showFeaturePopupOnClick)
    map.current?.on('click', hideFeaturePopup)

    // eslint-disable-next-line consistent-return
    return () => {
      map.current?.off('click', 'patches-fill-layer', showFeaturePopupOnClick)
      map.current?.off('click', hideFeaturePopup)
    }
  }, [hasMapLoaded, map, selectFeature, zoomToPaddedBounds])

  const _updateStyleOnPointHover = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }
    const applyPointHoverStyle = ({
      features,
    }: MapMouseEvent & { features?: MapboxGeoJSONFeature[] }) => {
      if (features && features.length > 0) {
        const [{ properties }] = features
        setHoverPatchAttributeGuid(properties?.id)
      }
    }
    const removePointHoverStyle = () => {
      setHoverPatchAttributeGuid('')
    }
    map.current?.on('mousemove', 'patches-fill-layer', applyPointHoverStyle)

    map.current?.on('mouseleave', 'patches-fill-layer', removePointHoverStyle)

    const currentMap = map.current
    // eslint-disable-next-line consistent-return
    return () => {
      currentMap?.off('mousemove', 'patches-fill-layer', applyPointHoverStyle)
      currentMap?.off('mouseleave', 'patches-fill-layer', removePointHoverStyle)
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
    if (!hasMapLoaded || !map.current) {
      return
    }

    map.current.resize()
    updateImageSizeOnMap()
  }, [hasMapLoaded, imageScale, map, updateImageSizeOnMap])

  const _updateStylingForPoints = useEffect(() => {
    if (!hasMapLoaded || !map.current) {
      return
    }
    const lineColor = [
      'case',
      [
        '==', // checks if point on map is clicked
        ['get', 'id'],
        selectedPoint.id, //clicked patch id, Map based
      ],
      COLORS.selected,

      [
        '==', // checks if point on map is in selected row in table
        ['get', 'ba_gr'],
        selectedAttributeId, //table row ba_gr guid
      ],
      COLORS.selected,

      [
        '==', // checks if patch hovered on map
        ['get', 'id'],
        hoverPatchAttributeGuid, //hovered patch id, Map based
      ],
      COLORS.hover,

      [
        '==', // checks if hovered table row has a map point
        ['get', 'ba_gr'],
        hoveredAttributeId, //table row ba_gr guid
      ],
      COLORS.hover,

      COLORS.outline, // resting outline color
    ]

    map.current.setPaintProperty('patches-inline-layer', 'line-color', lineColor)
    map.current.setPaintProperty('patches-outline-layer', 'line-color', lineColor)
  }, [
    selectedAttributeId,
    hoveredAttributeId,
    hoverPatchAttributeGuid,
    hasMapLoaded,
    selectedPoint,
    map,
  ])

  const resetZoom = () => {
    map.current?.setBearing(0) // If on a touch device, reset the rotation before calling the easeTo function to avoid any potential issues.
    easeToDefaultView(map)
  }
  const zoomMapIn = () => {
    map.current?.zoomIn()
  }
  const zoomMapOut = () => {
    map.current?.zoomOut()
  }
  return (
    <ImageAnnotationMapWrapper>
      {!hasMapLoaded && <LoadingIndicatorImageClassificationImage />}
      <div
        ref={mapContainer}
        style={{
          width: dataToReview.original_image_width * imageScale,
          height: dataToReview.original_image_height * imageScale,
        }}
      />
      {hasMapLoaded && (
        <MapButtonContainer>
          <ConnectedMapControlButtonContainer>
            <MuiTooltipDarkRight
              title={language.imageClassification.imageClassficationModal.imageMap.zoomIn}
            >
              <MapControlButton type="button" onClick={zoomMapIn}>
                <IconPlus />
              </MapControlButton>
            </MuiTooltipDarkRight>
            <MuiTooltipDarkRight
              title={language.imageClassification.imageClassficationModal.imageMap.zoomOut}
            >
              <MapControlButton type="button" onClick={zoomMapOut}>
                <IconMinus />
              </MapControlButton>
            </MuiTooltipDarkRight>
          </ConnectedMapControlButtonContainer>
          <MuiTooltipDarkRight
            title={language.imageClassification.imageClassficationModal.imageMap.resetZoom}
          >
            <MapControlButton type="button" onClick={resetZoom}>
              <IconRefresh />
            </MapControlButton>
          </MuiTooltipDarkRight>
          <MuiTooltipDarkRight
            title={
              language.imageClassification.imageClassficationModal.imageMap.toggleTableVisibility
            }
          >
            <MapControlButton
              type="button"
              onClick={() => {
                setIsTableShowing(!isTableShowing)
              }}
              $isSelected={isTableShowing}
            >
              <IconTable />
            </MapControlButton>
          </MuiTooltipDarkRight>
          <MuiTooltipDarkRight
            title={
              language.imageClassification.imageClassficationModal.imageMap.toggleLabelVisibility
            }
          >
            <MapControlButton type="button" onClick={toggleLabels} $isSelected={areLabelsShowing}>
              <IconLabel />
            </MapControlButton>
          </MuiTooltipDarkRight>
        </MapButtonContainer>
      )}

      {selectedPoint.id && (
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
      )}
    </ImageAnnotationMapWrapper>
  )
}

export default ImageAnnotationModalMap
