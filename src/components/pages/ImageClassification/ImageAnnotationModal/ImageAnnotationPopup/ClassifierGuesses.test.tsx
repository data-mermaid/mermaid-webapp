import { expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClassifierGuesses from './ClassifierGuesses'
import type {
  ImageClassificationPoint,
  ImageClassificationResponse,
} from '../../../../../App/mermaidData/mermaidDataTypes'

const makeGuess = (id: string, label: string, score: number, isConfirmed = false) => ({
  id,
  ba_gr: id,
  benthic_attribute: id,
  ba_gr_label: label,
  score,
  is_confirmed: isConfirmed,
  is_machine_created: true,
})

const selectedPoint: ImageClassificationPoint = {
  id: 'selected-point',
  row: 100,
  column: 100,
  annotations: [makeGuess('coral', 'Coral', 80, true), makeGuess('rubble', 'Rubble', 60)],
}

const otherPoint: ImageClassificationPoint = {
  id: 'other-point',
  row: 200,
  column: 200,
  annotations: [makeGuess('coral', 'Coral', 90, true)],
}

const dataToReview: ImageClassificationResponse = {
  image: 'image.jpg',
  original_image_width: 1000,
  original_image_height: 800,
  patch_size: 100,
  points: [selectedPoint, otherPoint],
}

// Picking a guess changes the point's class, which the save queue sends unconfirmed
test('Picking another classifier guess makes it current, unconfirms the point and marks it changed', async () => {
  const setDataToReview = vi.fn()
  const onPointsChanged = vi.fn()

  render(
    <ClassifierGuesses
      selectedPoint={selectedPoint}
      dataToReview={dataToReview}
      setDataToReview={setDataToReview}
      onPointsChanged={onPointsChanged}
    />,
  )

  expect(screen.getByRole('radio', { name: /Coral/ })).toBeChecked()

  await userEvent.click(screen.getByRole('radio', { name: /Rubble/ }))

  const [{ points }] = setDataToReview.mock.calls[0]
  const updatedPoint = points.find(({ id }) => id === selectedPoint.id)

  expect(updatedPoint.annotations.map(({ id }) => id)).toEqual(['rubble', 'coral'])
  expect(updatedPoint.annotations.every(({ is_confirmed }) => !is_confirmed)).toBe(true)
  expect(points.find(({ id }) => id === otherPoint.id)).toBe(otherPoint)
  expect(onPointsChanged).toHaveBeenCalledWith([selectedPoint.id])
})
