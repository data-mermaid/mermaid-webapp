import { useState, useCallback, RefObject } from 'react'

const VIEWPORT_MARGIN = 8

interface TooltipStyle {
  top: string
  left: string
  arrowOffset: string
}

const useTooltipPosition = (
  iconRef: RefObject<HTMLElement>,
  containerRef: RefObject<HTMLElement>,
  tooltipRef: RefObject<HTMLElement>,
): [TooltipStyle, () => void] => {
  const [tooltipStyle, setTooltipStyle] = useState<TooltipStyle>({
    top: '0px',
    left: '0px',
    arrowOffset: '50%',
  })

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
    let top = iconRect.top - containerRect.top - tooltipHeight

    const absLeft = containerRect.left + left
    const absRight = absLeft + tooltipWidth
    if (absRight > window.innerWidth - VIEWPORT_MARGIN) {
      left -= absRight - (window.innerWidth - VIEWPORT_MARGIN)
    }
    if (containerRect.left + left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN - containerRect.left
    }

    const absTop = containerRect.top + top
    if (absTop < VIEWPORT_MARGIN) {
      top = VIEWPORT_MARGIN - containerRect.top
    }

    const arrowOffset = `${iconCenterX - left}px`

    setTooltipStyle({ top: `${top}px`, left: `${left}px`, arrowOffset })
  }, [iconRef, containerRef, tooltipRef])

  return [tooltipStyle, computeTooltipPosition]
}

export default useTooltipPosition
