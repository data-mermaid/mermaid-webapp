import { useState, useEffect } from 'react'

const getElementPosition = (rectObj) => {
  const html = document.documentElement

  let aboveBelow = 'visible'

  if (rectObj.bottom >= 0 && rectObj.top >= (window.innerHeight || html.clientHeight)) {
    aboveBelow = 'below'
  } else if (rectObj.top <= 0 && rectObj.bottom <= (window.innerHeight || html.clientHeight)) {
    aboveBelow = 'above'
  }

  return aboveBelow
}

const isInViewport = (element) => {
  const rects = []

  for (let i = 0; i < element.length; i++) {
    const rectPosition = getElementPosition(element[i].getBoundingClientRect())

    rects.push(rectPosition)
  }

  return rects
}

export const useScrollCheckError = (inputRef) => {
  const [isErrorAbove, setIsErrorAbove] = useState(false)
  const [isErrorBelow, setIsErrorBelow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const el = document.querySelectorAll('span[type="error"], span[type="warning"]')
      const positionClass = isInViewport(el)

      const hasErrorPositionAbove = positionClass.includes('above')
      const hasErrorPositionBelow = positionClass.includes('below')

      setIsErrorAbove(hasErrorPositionAbove)
      setIsErrorBelow(hasErrorPositionBelow)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [inputRef])

  return { isErrorAbove, isErrorBelow }
}
