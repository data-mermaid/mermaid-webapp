import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import maplibregl from 'maplibre-gl'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'
import { imageClassificationResponsePropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { IconReset } from '../../../icons'
import { ImageAnnotationMapWrapper, MapResetButton } from './ImageAnnotationModal.styles'
import ImageAnnotationPopup from './ImageAnnotationPopup/ImageAnnotationPopup'
import EditPointPopupWrapper from './ImageAnnotationPopup/EditPointPopupWrapper'

const MODAL_PADDING = 64
const EST_TABLE_SIZE = 400 // estimated value if can't get by id

const DEFAULT_CENTER = [0, 0] // this value doesn't matter, default to null island
const DEFAULT_ZOOM = 2 // needs to be > 1 otherwise bounds become > 180 and > 85

const POLYGON_LINE_WIDTH = 3

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
  anchor: 'center',
  closeButton: false,
})

const calculate100ViewWidth = () =>
  (100 * (document?.documentElement?.clientWidth || window.innerWidth)) / 100

const calculate80ViewHeight = () =>
  (80 * (document?.documentElement?.clientHeight || window.innerHeight)) / 100

const calcImageScale = ({ original_image_width, original_image_height }) => {
  const modalTableWidth =
    document?.getElementById('annotation-modal-table')?.clientWidth || EST_TABLE_SIZE
  const maxWidthForImg = calculate100ViewWidth() - MODAL_PADDING - modalTableWidth
  const maxHeightForImg = calculate80ViewHeight() // Based on max-height of ModalContent el in <Modal/>
  const widthScale = maxWidthForImg / original_image_width
  const heightScale = maxHeightForImg / original_image_height

  // We want to scale by the smaller value to ensure the image always fits
  return widthScale < 1 || heightScale < 1 ? Math.min(widthScale, heightScale) : 1
}

const easeToDefaultView = (map) =>
  map.current.easeTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 500 })

// HACK: MapLibre's unproject() (used to get pixel coords) doesn't let you pass zoom as parameter.
// So to ensure that our points remain in the same position we:
// 1. store current lnglat/zoom, 2. reset map lnglat/zoom to default,
// 3. call unproject (to get pixel coords) 4. set back to current lnglat/zoom
const hackTemporarilySetMapToDefaultPosition = (map) => {
  map.current.setZoom(DEFAULT_ZOOM)
  map.current.setCenter(DEFAULT_CENTER)
}
const hackResetMapToCurrentPosition = (map, currentZoom, currentCenter) => {
  map.current.setZoom(currentZoom)
  map.current.setCenter(currentCenter)
}

const ImageAnnotationModalMap = ({
  dataToReview,
  setDataToReview,
  highlightedAttributeId,
  databaseSwitchboardInstance,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [hasMapLoaded, setHasMapLoaded] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState({ id: null, lngLat: null })
  const [imageScale, setImageScale] = useState(() => calcImageScale(dataToReview))
  const halfPatchSize = dataToReview.patch_size / 2

  const getPointsGeojson = () => ({
    type: 'FeatureCollection',
    features: dataToReview.points.map((point) => {
      // Row and Column represent the center of the patch in pixels,
      // Crop size is the size of the patch in pixels
      // We calculate the corners of the patch in pixels, then convert to lng, lat
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
      return {
        type: 'Feature',
        properties: {
          id: point.id,
          ba_gr: point.annotations[0]?.ba_gr,
          ba_gr_label: point.annotations[0]?.ba_gr_label,
          isUnclassified: !point.annotations.length,
          isConfirmed: !!point.annotations[0]?.is_confirmed,
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
  })

  const updatePointsOnMap = () => {
    const currentZoom = map.current.getZoom()
    const currentCenter = map.current.getCenter()

    hackTemporarilySetMapToDefaultPosition(map)

    map.current.getSource('patches').setData(getPointsGeojson())

    hackResetMapToCurrentPosition(map, currentZoom, currentCenter)
  }

  const updateImageSizeOnMap = () => {
    const bounds = map.current.getBounds()

    map.current.getSource('benthicQuadratImage').setCoordinates([
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

  const _renderImageMapOnLoad = useEffect(() => {
    if (hasMapLoaded) {
      return
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: DEFAULT_ZOOM,
      renderWorldCopies: false, // prevents the image from repeating
      dragRotate: false,
    })

    map.current.addControl(zoomControl, 'top-left')

    const bounds = map.current.getBounds()

    map.current.setStyle({
      version: 8,
      name: 'image',
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
          data: getPointsGeojson(),
        },
      },
      layers: [
        {
          id: 'benthicQuadratImageLayer',
          type: 'raster',
          source: 'benthicQuadratImage',
        },
        {
          id: 'patches-line-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': POLYGON_LINE_WIDTH,
            'line-color': IMAGE_CLASSIFICATION_COLOR_EXP,
          },
        },
        {
          id: 'patches-outline-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': POLYGON_LINE_WIDTH,
            'line-color': 'white',
            'line-offset': -POLYGON_LINE_WIDTH,
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

    // Map Listeners here on out
    map.current.on('load', () => setHasMapLoaded(true))

    // Display Label on point hover
    map.current.on('mouseenter', 'patches-fill-layer', ({ features }) => {
      const [{ geometry, properties }] = features
      map.current.getCanvas().style.cursor = 'pointer'
      const label = properties.isUnclassified ? 'Unclassified' : properties.ba_gr_label
      pointLabelPopup.setLngLat(geometry.coordinates[0][0]).setHTML(label).addTo(map.current)
    })

    // Remove Label on point exit
    map.current.on('mouseleave', 'patches-fill-layer', () => {
      map.current.getCanvas().style.cursor = ''
      pointLabelPopup.remove()
    })

    // eslint-disable-next-line
  }, [])

  const _displayEditPointPopupOnPointClick = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    map.current.on('click', 'patches-fill-layer', ({ features }) => {
      const [{ geometry, properties }] = features
      const topLeft = geometry.coordinates[0][0]
      const topRight = geometry.coordinates[0][1]
      const bottomRight = geometry.coordinates[0][2]
      const bounds = new maplibregl.LngLatBounds(topLeft, bottomRight)
      map.current.fitBounds(bounds, { padding: 250 })

      setSelectedPoint({ id: properties.id, lngLat: topRight })
    })

    // Remove Edit Point Popup when user clicks away
    map.current.on('click', ({ point }) => {
      const [patches] = map.current.queryRenderedFeatures(point, { layers: ['patches-fill-layer'] })
      if (!patches) {
        setSelectedPoint({ id: '', lngLat: '' })
      }
    })
  }, [dataToReview, hasMapLoaded])

  const _updatePointsOnDataChange = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    updatePointsOnMap()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataToReview, hasMapLoaded])

  const _setImageScaleOnWindowResize = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    const updateImgScaleOnWindowResize = () => setImageScale(calcImageScale(dataToReview))

    window.addEventListener('resize', updateImgScaleOnWindowResize)

    return () => {
      window.removeEventListener('resize', updateImgScaleOnWindowResize)
    }
  }, [hasMapLoaded, dataToReview])

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

    map.current.setPaintProperty('patches-outline-layer', 'line-color', [
      'case',
      [
        '==', // checks if point on map is clicked
        ['get', 'id'],
        selectedPoint.id,
      ],
      // clicked outline colour
      COLORS.selected,

      [
        '==', // checks if point on map is in highlighted row in table
        ['get', 'ba_gr'],
        highlightedAttributeId,
      ],
      // hover outline color
      COLORS.selected,

      // resting outline color
      COLORS.white,
    ])
    map.current.setPaintProperty('patches-line-layer', 'line-color', [
      'case',
      [
        '==', // checks if point on map is clicked
        ['get', 'id'],
        selectedPoint.id,
      ],
      //clicked line colour
      IMAGE_CLASSIFICATION_COLOR_EXP, // fallback to default expression
      // COLORS.hidden,

      [
        '==', // checks if point on map is in highlighted row in table
        ['get', 'ba_gr'],
        highlightedAttributeId,
      ],
      // hover line colour
      IMAGE_CLASSIFICATION_COLOR_EXP,

      // resting line colour
      IMAGE_CLASSIFICATION_COLOR_EXP,
    ])

    map.current.setPaintProperty('patches-line-layer', 'line-width', [
      'case',
      [
        '==', // checks if point on map is clicked
        ['get', 'id'],
        selectedPoint.id,
      ],
      POLYGON_LINE_WIDTH,

      POLYGON_LINE_WIDTH, // fallback to default width
    ])
  }, [highlightedAttributeId, hasMapLoaded, selectedPoint])

  return (
    <ImageAnnotationMapWrapper>
      <div
        ref={mapContainer}
        style={{
          width: dataToReview.original_image_width * imageScale,
          height: dataToReview.original_image_height * imageScale,
        }}
      />
      <MapResetButton type="button" onClick={() => easeToDefaultView(map)}>
        <IconReset />
      </MapResetButton>
      {selectedPoint.id ? (
        <EditPointPopupWrapper map={map.current} lngLat={selectedPoint.lngLat}>
          <ImageAnnotationPopup
            dataToReview={dataToReview}
            setDataToReview={setDataToReview}
            pointId={selectedPoint.id}
            databaseSwitchboardInstance={databaseSwitchboardInstance}
          />
        </EditPointPopupWrapper>
      ) : null}
    </ImageAnnotationMapWrapper>
  )
}

ImageAnnotationModalMap.propTypes = {
  dataToReview: imageClassificationResponsePropType.isRequired,
  setDataToReview: PropTypes.func.isRequired,
  highlightedAttributeId: PropTypes.string.isRequired,
  databaseSwitchboardInstance: PropTypes.object.isRequired,
}

export default ImageAnnotationModalMap
