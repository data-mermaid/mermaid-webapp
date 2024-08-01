import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import maplibregl from 'maplibre-gl'
import Modal from '../../generic/Modal/Modal'
import SampleImage from './sample-image.jpg'

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

const ImageAnnotationModal = ({ isModalDisplayed, setIsModalDisplayed }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  const _renderImageViaMap = useEffect(() => {
    if (!isModalDisplayed) {
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
          url: SampleImage, // TODO: Will be fetched from API
          coordinates: [
            // spans the image across the entire map
            [bounds._sw.lng, bounds._ne.lat],
            [bounds._ne.lng, bounds._ne.lat],
            [bounds._ne.lng, bounds._sw.lat],
            [bounds._sw.lng, bounds._sw.lat],
          ],
        },
      },
      layers: [
        {
          id: 'benthicQuadratImageLayer',
          type: 'raster',
          source: 'benthicQuadratImage',
        },
      ],
    })

    // Keep the max extent of the map to the size of the image
    map.current.setMaxBounds([
      [bounds._sw.lng, bounds._sw.lat],
      [bounds._ne.lng, bounds._ne.lat],
    ])
  }, [isModalDisplayed])

  const handleCloseModal = () => {
    // TODO: Save content before closing
    setIsModalDisplayed(false)
  }

  return (
    <Modal
      title="Placeholder value for image name"
      isOpen={isModalDisplayed}
      onDismiss={handleCloseModal}
      maxWidth="100%"
      mainContent={
        <div>
          Quadrat: <b>4</b>
          <p>table goes here</p>
          <div
            style={{
              // TODO: Set these programatically based on image size (when fetched from API)
              width: '1200px',
              height: '797px',
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
  isModalDisplayed: PropTypes.bool.isRequired,
  setIsModalDisplayed: PropTypes.func.isRequired,
}

export default ImageAnnotationModal
