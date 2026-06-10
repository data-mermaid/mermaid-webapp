import { useState, useCallback } from 'react'

const VIEWPORT_MARGIN = 8

const useTooltipPosition = (iconRef, containerRef, tooltipRef) => {
  const [tooltipStyle, setTooltipStyle] = useState({ top: '0px', left: '0px', arrowOffset: '50%' })

  const computeTooltipPosition = useCallback(() => {
    if (!iconRef.current || !containerRef.current || !tooltipRef.current) {
      return
    }

    const iconRect = iconRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const tooltipWidth = tooltipRef.current.offsetWidth
    const tooltipHeight = tooltipRef.current.offsetHeight

    const iconCenterX = iconRect.left + iconRect.width / 2 - containerRect.left
    let left = iconCenterX - tooltipWidth / 2
    const top = -tooltipHeight

    const absLeft = containerRect.left + left
    const absRight = absLeft + tooltipWidth
    if (absRight > window.innerWidth - VIEWPORT_MARGIN) {
      left -= absRight - (window.innerWidth - VIEWPORT_MARGIN)
    }
    if (containerRect.left + left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN - containerRect.left
    }

    const arrowOffset = `${iconCenterX - left}px`

    setTooltipStyle({ top: `${top}px`, left: `${left}px`, arrowOffset })
  }, [iconRef, containerRef, tooltipRef])

  return [tooltipStyle, computeTooltipPosition]
}

export default useTooltipPosition
