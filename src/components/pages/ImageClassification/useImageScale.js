import { useEffect, useState } from 'react'
import { calculateImageScale } from './ImageAnnotationModal/calculateImageScale'

export const useImageScale = ({ hasMapLoaded, dataToReview }) => {
  const [imageScale, setImageScale] = useState()

  useEffect(
    function initializeImageScale() {
      if (!dataToReview || imageScale) {
        return
      }

      setImageScale(calculateImageScale(dataToReview))
    },
    [dataToReview, imageScale],
  )

  const _setImageScaleOnWindowResize = useEffect(() => {
    if (!hasMapLoaded) {
      return
    }

    const updateImgScaleOnWindowResize = () => setImageScale(calculateImageScale(dataToReview))

    window.addEventListener('resize', updateImgScaleOnWindowResize)

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('resize', updateImgScaleOnWindowResize)
    }
  }, [hasMapLoaded, dataToReview])

  return { imageScale }
}
