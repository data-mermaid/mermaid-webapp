import { IMAGE_CLASSIFICATION_STATUS } from './imageClassificationConstants'

export const getIsImageProcessed = (status) => {
  return (
    status === IMAGE_CLASSIFICATION_STATUS.completed ||
    status === IMAGE_CLASSIFICATION_STATUS.failed
  )
}
