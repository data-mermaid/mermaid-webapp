import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import maplibregl from 'maplibre-gl'
import Modal from '../../generic/Modal/Modal'

const MAX_WIDTH = 1450

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`

const Legend = styled.div`
  display: flex;
  gap: 8px;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
`

const LegendSquare = styled.div`
  width: 12px;
  height: 12px;
  margin-right: 2px;
  border: ${({ color }) => `2px solid ${color}`};
`

const ImageAnnotationModal = ({ setDataToReview, dataToReview }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [dimensions, setDimensions] = useState()

  const _getImageDimensions = useEffect(() => {
    const imageForMap = new Image()
    imageForMap.src = dataToReview.image
    imageForMap.onload = () => {
      // Assumes that the image will always be wider than it is tall
      // If assumption is incorrect, we will need to check for height as well
      const imageScale =
        imageForMap.naturalWidth > MAX_WIDTH ? MAX_WIDTH / imageForMap.naturalWidth : 1
      setDimensions({
        height: imageForMap.naturalHeight * imageScale,
        width: imageForMap.naturalWidth * imageScale,
        scale: imageScale,
      })
    }
    // eslint-disable-next-line
  }, [])

  const _renderImageViaMap = useEffect(() => {
    if (!dimensions) {
      return
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: [0, 0], // this value doesn't matter, default to null island
      zoom: 2, // needs to be > 1 otherwise bounds become > 180 and > 85
      renderWorldCopies: false, // prevents the image from repeating
    })

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
          data: {
            type: 'FeatureCollection',
            features: dataToReview.points.map((point) => {
              // TOOD: crop size might come from API?
              // Row and Column represent the center of the patch in pixels,
              // Crop size is the size of the patch in pixels
              // We calculate the corners of the patch in pixels, then convert to lng, lat
              const cropSize = 224 * dimensions.scale
              const topLeft = map.current.unproject([
                point.column - cropSize / 2,
                point.row - cropSize / 2,
              ])
              const bottomLeft = map.current.unproject([
                point.column - cropSize / 2,
                point.row + cropSize / 2,
              ])
              const bottomRight = map.current.unproject([
                point.column + cropSize / 2,
                point.row + cropSize / 2,
              ])
              const topRight = map.current.unproject([
                point.column + cropSize / 2,
                point.row - cropSize / 2,
              ])
              return {
                type: 'Feature',
                properties: {}, // TODO: Will use this to display confirmed, unconfirmed, unknown, etc.
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
          },
        },
      },
      layers: [
        {
          id: 'benthicQuadratImageLayer',
          type: 'raster',
          source: 'benthicQuadratImage',
        },
        {
          id: 'patches-layer',
          type: 'line',
          source: 'patches',
          paint: {
            'line-width': 5, // TODO: This will be based on a property in geojson
            'line-color': 'yellow', // TODO: This will be based on a property in geojson
          },
        },
      ],
    })

    // Keep the max extent of the map to the size of the image
    map.current.setMaxBounds([
      [bounds._sw.lng, bounds._sw.lat],
      [bounds._ne.lng, bounds._ne.lat],
    ])
  }, [dimensions, dataToReview])

  const handleCloseModal = () => {
    // TODO: Save content before closing
    setDataToReview()
  }

  return (
    <Modal
      title={dataToReview.original_image_name}
      isOpen
      onDismiss={handleCloseModal}
      maxWidth="100%"
      mainContent={
        <div>
          Quadrat: <b>4</b>
          <p>table goes here</p>
          <div
            style={{
              width: dimensions?.width,
              height: dimensions?.height,
              // width: '1450px',
              // height: '1088px',
            }}
            ref={mapContainer}
          />
        </div>
      }
      footerContent={
        <Footer>
          <Legend>
            <LegendItem>
              <LegendSquare color="#D4BC48" />
              Current
            </LegendItem>
            <LegendItem>
              <LegendSquare color="#B4BBE2" />
              Unconfirmed
            </LegendItem>
            <LegendItem>
              <LegendSquare color="#80CA72" />
              Confirmed
            </LegendItem>
            <LegendItem>
              <LegendSquare color="#BF6B69" />
              Unclassified
            </LegendItem>
          </Legend>
          <button onClick={handleCloseModal}>Close</button>
        </Footer>
      }
    />
  )
}

ImageAnnotationModal.propTypes = {
  setDataToReview: PropTypes.func.isRequired,
  dataToReview: PropTypes.shape({
    original_image_name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    points: PropTypes.arrayOf(
      PropTypes.shape({
        row: PropTypes.number.isRequired,
        column: PropTypes.number.isRequired,
        annotations: PropTypes.arrayOf(PropTypes.object).isRequired,
      }),
    ),
  }),
}

export default ImageAnnotationModal
