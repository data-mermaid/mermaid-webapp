import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ThumbnailWrapper = styled.div`
  width: 150px;
  height: 150px;
  overflow: hidden;
`

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Thumbnail = ({ imageUrl }) => {
  return (
    <ThumbnailWrapper>
      <ThumbnailImage src={imageUrl} alt="image-upload-thumbnail" />
    </ThumbnailWrapper>
  )
}

Thumbnail.propTypes = {
  imageUrl: PropTypes.string.isRequired,
}

export default Thumbnail
