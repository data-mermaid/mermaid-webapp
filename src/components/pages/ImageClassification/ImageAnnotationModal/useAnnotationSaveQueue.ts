import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import type { AxiosError } from 'axios'
import useIsMounted from '../../../../library/useIsMounted'

// Waits before each automatic retry. These sit on top of axios-retry's quick retries, so a
// short server outage is ridden out before the user is told the save failed.
export const RETRY_DELAYS_MS = [2000, 5000, 15000]

// No response (network error or timeout) or a 5xx may succeed later. A 4xx won't.
const isRetryable = (error: unknown) => {
  const status = (error as AxiosError)?.response?.status

  return status === undefined || status >= 500
}

// Resolves after ms, or as soon as the function left in skipRef is called
const waitBeforeRetry = (ms: number, skipRef: RefObject<(() => void) | null>) =>
  new Promise<void>((resolve) => {
    const finishWaiting = () => {
      clearTimeout(timeoutId)
      skipRef.current = null
      resolve()
    }
    const timeoutId = setTimeout(finishWaiting, ms)

    skipRef.current = finishWaiting
  })

interface UseAnnotationSaveQueueProps<Point extends { id: string }> {
  points: Point[] | undefined
  savePoints: (points: Point[]) => Promise<unknown>
  onSaveFailed: (error: unknown) => void
}

// Saves changed points in the background, one request at a time. Points changed while a request
// is in flight go out together in the next one, read from the latest state, so saves can't land
// out of order. Points are sent whole: the API replaces a point's user annotations with the ones
// sent, so re-sending a point without its new annotation ids is safe.
export const useAnnotationSaveQueue = <Point extends { id: string }>({
  points,
  savePoints,
  onSaveFailed,
}: UseAnnotationSaveQueueProps<Point>) => {
  const isMounted = useIsMounted()
  const [changeCount, setChangeCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const pendingPointIds = useRef(new Set<string>())
  const drainPromise = useRef<Promise<void> | null>(null)
  const retryDelaysMs = useRef(RETRY_DELAYS_MS)
  const skipRetryWait = useRef<(() => void) | null>(null)

  // Read at send time, so each request carries the latest state
  const latest = useRef({ points, savePoints, onSaveFailed })
  latest.current = { points, savePoints, onSaveFailed }

  const updateStatus = useCallback(
    (isDraining: boolean) => {
      if (isMounted.current) {
        setIsSaving(isDraining)
        setHasUnsavedChanges(isDraining || pendingPointIds.current.size > 0)
      }
    },
    [isMounted],
  )

  const drain = useCallback(
    (retryDelays: number[]) => {
      if (drainPromise.current) {
        return drainPromise.current
      }

      retryDelaysMs.current = retryDelays
      updateStatus(true)

      const run = async () => {
        let failedAttempts = 0

        // Stops on unmount: a request already sent still completes, but nothing new is sent
        while (pendingPointIds.current.size && isMounted.current) {
          const pointIds = new Set(pendingPointIds.current)
          pendingPointIds.current.clear()

          try {
            const pointsToSave = (latest.current.points ?? []).filter(({ id }) => pointIds.has(id))
            await latest.current.savePoints(pointsToSave)
            failedAttempts = 0
          } catch (error) {
            pointIds.forEach((id) => pendingPointIds.current.add(id))

            if (!isRetryable(error) || failedAttempts >= retryDelaysMs.current.length) {
              if (isMounted.current) {
                latest.current.onSaveFailed(error)
              }
              break
            }

            await waitBeforeRetry(retryDelaysMs.current[failedAttempts], skipRetryWait)
            failedAttempts += 1
          }
        }
      }

      drainPromise.current = run().finally(() => {
        drainPromise.current = null
        updateStatus(false)
      })

      return drainPromise.current
    },
    [isMounted, updateStatus],
  )

  const _saveChangedPoints = useEffect(() => {
    if (changeCount) {
      drain(RETRY_DELAYS_MS)
    }
  }, [changeCount, drain])

  // Call in the same event handler as the state update, so the save reads the updated points.
  // isSaving goes true straight away, so nothing reads the gap before the save starts as failed.
  const markPointsChanged = useCallback((pointIds: string[]) => {
    pointIds.forEach((id) => pendingPointIds.current.add(id))
    setHasUnsavedChanges(true)
    setIsSaving(true)
    setChangeCount((count) => count + 1)
  }, [])

  // Saves what's pending now, without waiting out retries, and resolves true if nothing is left
  const flush = useCallback(async () => {
    if (drainPromise.current) {
      retryDelaysMs.current = []
      skipRetryWait.current?.()
      await drainPromise.current
    } else if (pendingPointIds.current.size) {
      await drain([])
    }

    return pendingPointIds.current.size === 0
  }, [drain])

  return { markPointsChanged, flush, hasUnsavedChanges, isSaving }
}
