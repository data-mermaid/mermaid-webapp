const MODAL_PADDING = 64
const EST_TABLE_SIZE = 400 // estimated value if can't get by id

const calculate100ViewWidth = () =>
  (100 * (document?.documentElement?.clientWidth || window.innerWidth)) / 100

const calculate80ViewHeight = () =>
  (80 * (document?.documentElement?.clientHeight || window.innerHeight)) / 100

export const calculateImageScale = ({ original_image_width, original_image_height }) => {
  const modalTableWidth =
    document?.getElementById('annotation-modal-table')?.clientWidth || EST_TABLE_SIZE
  const maxWidthForImg = calculate100ViewWidth() - MODAL_PADDING - modalTableWidth
  const maxHeightForImg = calculate80ViewHeight() // Based on max-height of ModalContent el in <Modal/>
  const widthScale = maxWidthForImg / original_image_width
  const heightScale = maxHeightForImg / original_image_height

  // We want to scale by the smaller value to ensure the image always fits
  return widthScale < 1 || heightScale < 1 ? Math.min(widthScale, heightScale) : 1
}
