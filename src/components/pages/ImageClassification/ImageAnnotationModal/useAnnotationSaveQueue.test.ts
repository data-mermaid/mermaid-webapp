import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useState } from 'react'
import { RETRY_DELAYS_MS, useAnnotationSaveQueue } from './useAnnotationSaveQueue'

interface FakePoint {
  id: string
  value: number
}

const initialPoints: FakePoint[] = [
  { id: 'a', value: 0 },
  { id: 'b', value: 0 },
  { id: 'c', value: 0 },
]

const noResponseError = { request: {} }
const badRequestError = { response: { status: 400 } }

// Changes a point and marks it in one handler, as the review window does
const useQueueWithPoints = (props: {
  savePoints: (points: FakePoint[]) => Promise<unknown>
  onSaveFailed?: (error: unknown) => void
}) => {
  const [points, setPoints] = useState(initialPoints)
  const queue = useAnnotationSaveQueue({ points, onSaveFailed: () => {}, ...props })

  const changePoint = (id: string, value: number) => {
    setPoints((previous) => previous.map((point) => (point.id === id ? { id, value } : point)))
    queue.markPointsChanged([id])
  }

  return { ...queue, changePoint }
}

const deferred = () => {
  let resolve: () => void = () => {}
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise
  })

  return { promise, resolve }
}

// Lets pending promises and effects settle, and moves fake time on by ms
const advance = (ms = 0) => act(() => vi.advanceTimersByTimeAsync(ms))

describe('useAnnotationSaveQueue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  test('saves a changed point with its updated data', async () => {
    const savePoints = vi.fn(() => Promise.resolve())
    const { result } = renderHook(() => useQueueWithPoints({ savePoints }))

    act(() => result.current.changePoint('a', 1))
    expect(result.current.hasUnsavedChanges).toBe(true)
    expect(result.current.isSaving).toBe(true)
    await advance()

    expect(savePoints).toHaveBeenCalledTimes(1)
    expect(savePoints).toHaveBeenCalledWith([{ id: 'a', value: 1 }])
    expect(result.current.hasUnsavedChanges).toBe(false)
    expect(result.current.isSaving).toBe(false)
  })

  test('sends changes made during a save together, in order, with their latest data', async () => {
    const firstSave = deferred()
    const savePoints = vi
      .fn<(points: FakePoint[]) => Promise<unknown>>()
      .mockReturnValueOnce(firstSave.promise)
      .mockResolvedValue(undefined)
    const { result } = renderHook(() => useQueueWithPoints({ savePoints }))

    act(() => result.current.changePoint('a', 1))
    await advance()
    act(() => {
      result.current.changePoint('b', 1)
      result.current.changePoint('a', 2)
    })
    act(() => result.current.changePoint('c', 1))
    await advance()

    expect(savePoints).toHaveBeenCalledTimes(1)
    expect(result.current.isSaving).toBe(true)

    firstSave.resolve()
    await advance()

    expect(savePoints).toHaveBeenCalledTimes(2)
    expect(savePoints).toHaveBeenLastCalledWith([
      { id: 'a', value: 2 },
      { id: 'b', value: 1 },
      { id: 'c', value: 1 },
    ])
    expect(result.current.hasUnsavedChanges).toBe(false)
  })

  test('retries a failed save after a wait, with the latest data', async () => {
    const savePoints = vi
      .fn<(points: FakePoint[]) => Promise<unknown>>()
      .mockRejectedValueOnce(noResponseError)
      .mockResolvedValue(undefined)
    const { result } = renderHook(() => useQueueWithPoints({ savePoints }))

    act(() => result.current.changePoint('a', 1))
    await advance()
    act(() => result.current.changePoint('a', 2))
    await advance(RETRY_DELAYS_MS[0] - 1)

    expect(savePoints).toHaveBeenCalledTimes(1)

    await advance(1)

    expect(savePoints).toHaveBeenCalledTimes(2)
    expect(savePoints).toHaveBeenLastCalledWith([{ id: 'a', value: 2 }])
    expect(result.current.hasUnsavedChanges).toBe(false)
  })

  test('gives up after the last retry, reports the error once, and keeps the change unsaved', async () => {
    const savePoints = vi.fn(() => Promise.reject(noResponseError))
    const onSaveFailed = vi.fn()
    const { result } = renderHook(() => useQueueWithPoints({ savePoints, onSaveFailed }))

    act(() => result.current.changePoint('a', 1))
    for (const delay of RETRY_DELAYS_MS) {
      await advance(delay)
    }

    expect(savePoints).toHaveBeenCalledTimes(RETRY_DELAYS_MS.length + 1)
    expect(onSaveFailed).toHaveBeenCalledTimes(1)
    expect(onSaveFailed).toHaveBeenCalledWith(noResponseError)
    expect(result.current.hasUnsavedChanges).toBe(true)
    expect(result.current.isSaving).toBe(false)
  })

  test('does not retry a request the server rejected', async () => {
    const savePoints = vi.fn(() => Promise.reject(badRequestError))
    const onSaveFailed = vi.fn()
    const { result } = renderHook(() => useQueueWithPoints({ savePoints, onSaveFailed }))

    act(() => result.current.changePoint('a', 1))
    await advance(RETRY_DELAYS_MS[0])

    expect(savePoints).toHaveBeenCalledTimes(1)
    expect(onSaveFailed).toHaveBeenCalledWith(badRequestError)
    expect(result.current.hasUnsavedChanges).toBe(true)
  })

  test('flush saves straight away instead of waiting out a retry', async () => {
    const savePoints = vi
      .fn<(points: FakePoint[]) => Promise<unknown>>()
      .mockRejectedValueOnce(noResponseError)
      .mockResolvedValue(undefined)
    const { result } = renderHook(() => useQueueWithPoints({ savePoints }))

    act(() => result.current.changePoint('a', 1))
    await advance()

    let isEverythingSaved = false
    await act(async () => {
      isEverythingSaved = await result.current.flush()
    })

    expect(isEverythingSaved).toBe(true)
    expect(savePoints).toHaveBeenCalledTimes(2)
    expect(result.current.hasUnsavedChanges).toBe(false)
  })

  test('flush tries a failed save again once and resolves false if it still fails', async () => {
    const savePoints = vi.fn(() => Promise.reject(badRequestError))
    const onSaveFailed = vi.fn()
    const { result } = renderHook(() => useQueueWithPoints({ savePoints, onSaveFailed }))

    act(() => result.current.changePoint('a', 1))
    await advance()

    let isEverythingSaved = true
    await act(async () => {
      isEverythingSaved = await result.current.flush()
    })

    expect(isEverythingSaved).toBe(false)
    expect(savePoints).toHaveBeenCalledTimes(2)
    expect(onSaveFailed).toHaveBeenCalledTimes(2)
    expect(result.current.hasUnsavedChanges).toBe(true)
  })

  test('flush resolves true when nothing is pending', async () => {
    const savePoints = vi.fn(() => Promise.resolve())
    const { result } = renderHook(() => useQueueWithPoints({ savePoints }))

    let isEverythingSaved = false
    await act(async () => {
      isEverythingSaved = await result.current.flush()
    })

    expect(isEverythingSaved).toBe(true)
    expect(savePoints).not.toHaveBeenCalled()
  })

  test('stops retrying and reports nothing once unmounted', async () => {
    const savePoints = vi.fn(() => Promise.reject(noResponseError))
    const onSaveFailed = vi.fn()
    const { result, unmount } = renderHook(() => useQueueWithPoints({ savePoints, onSaveFailed }))

    act(() => result.current.changePoint('a', 1))
    await advance()
    unmount()
    for (const delay of RETRY_DELAYS_MS) {
      await vi.advanceTimersByTimeAsync(delay)
    }

    expect(savePoints).toHaveBeenCalledTimes(1)
    expect(onSaveFailed).not.toHaveBeenCalled()
  })
})
