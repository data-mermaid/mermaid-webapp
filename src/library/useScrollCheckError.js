import { useState, useEffect } from 'react'

const getErrorPositionRelativeToCurrentlyVisibleViewportArea = (errorElementDOMRectangleObject) => {
  const html = document.documentElement

  let relativePositionToViewport = 'visible'

  if (
    errorElementDOMRectangleObject.bottom >= 0 &&
    errorElementDOMRectangleObject.top >= (window.innerHeight || html.clientHeight)
  ) {
    relativePositionToViewport = 'below'
  } else if (
    errorElementDOMRectangleObject.top <= 0 &&
    errorElementDOMRectangleObject.bottom <= (window.innerHeight || html.clientHeight)
  ) {
    relativePositionToViewport = 'above'
  }

  return relativePositionToViewport
}

const getPositionTypes = (errorElements) =>
  [...errorElements].map((errorElement) =>
    getErrorPositionRelativeToCurrentlyVisibleViewportArea(errorElement.getBoundingClientRect()),
  )

export const useScrollCheckError = () => {
  const [isErrorAbove, setIsErrorAbove] = useState(false)
  const [isErrorBelow, setIsErrorBelow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const errorAndWarningElements = document.querySelectorAll(
        'span[type="error"], span[type="warning"], li[type="error"], li[type="warning"]',
      )
      const positionTypes = getPositionTypes(errorAndWarningElements)

      const hasErrorPositionAbove = positionTypes.includes('above')
      const hasErrorPositionBelow = positionTypes.includes('below')

      setIsErrorAbove(hasErrorPositionAbove)
      setIsErrorBelow(hasErrorPositionBelow)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return { isErrorAbove, isErrorBelow }
}
