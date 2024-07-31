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

const ImageAnnotationModal = ({ isModalDisplayed, setIsModalDisplayed }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  const _renderMap = useEffect(() => {
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
        image: {
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
          id: 'image-layer',
          type: 'raster',
          source: 'image',
        },
      ],
    })

    // This keeps the max extent of the map to the size of the image
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
          <div>legend goes here</div>
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
