import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <ThumbnailWrapper>
      <ThumbnailImage src={imageUrl} alt={t('media.image_upload_thumbnail')} />
    </ThumbnailWrapper>
  )
}

Thumbnail.propTypes = {
  imageUrl: PropTypes.string.isRequired,
}

export default Thumbnail
