import { expect, test } from 'vitest'
import '@testing-library/jest-dom'

import React from 'react'
import { Route, Routes } from 'react-router'
import { http, HttpResponse } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import ImageAnnotationModal from './ImageAnnotationModal'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API
const annotationsUrl = `${apiBaseUrl}/projects/5/classification/images/fake-image-id/`

const annotationsResponse = {
  original_image_name: 'fake-image.jpg',
  original_image_width: 1000,
  original_image_height: 800,
  patch_size: 100,
  points: [{ id: 'fake-point-id', row: 400, column: 500, annotations: [] }],
}

const renderModal = () =>
  renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/collecting/benthicpqt/:recordId"
        element={
          <ImageAnnotationModal
            imageId="fake-image-id"
            setImageId={() => {}}
            benthicAttributes={[]}
            growthForms={[]}
            onAnnotationSaveSuccess={() => {}}
          />
        }
      />
    </Routes>,
    { initialEntries: ['/projects/5/collecting/benthicpqt/fake-record-id'] },
  )

// Saving reads the fetched annotations, so enabling Save early throws and strands the button.
test('Save is disabled until the image annotations have loaded', async () => {
  mockMermaidApiAllSuccessful.use(
    http.get(annotationsUrl, () => HttpResponse.json(annotationsResponse)),
  )

  renderModal()

  // render is synchronous, so this asserts on the first paint, before the fetch can resolve
  const saveButton = screen.getByRole('button', { name: 'buttons.save_changes' })

  expect(saveButton).toBeDisabled()
  await waitFor(() => expect(saveButton).toBeEnabled())
})
