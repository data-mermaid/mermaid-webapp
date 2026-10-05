import { expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import { http, HttpResponse } from 'msw'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import mockMermaidData from '../../../../testUtilities/mockMermaidData'
import mockBenthicLitCollectRecords from '../../../../testUtilities/mockCollectRecords/mockBenthicLitCollectRecords'
import { mockT } from '../../../../testUtilities/mockT'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const validations = {
  status: 'error',
  results: {
    data: {
      benthic_transect: {
        depth: [{ code: 'required', status: 'error', validation_id: 'depth-error' }],
      },
    },
  },
}

// Validates a Benthic LIT record and clicks Next on the error chip. No protocol form opts in
// to validation navigation by hand: the shared input components tag every row from their own
// id, so any protocol would do here.
const validateThenClickNext = async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()
  const scrollIntoView = vi
    .spyOn(window.HTMLElement.prototype, 'scrollIntoView')
    .mockImplementation(() => {})

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () =>
      HttpResponse.json({}, { status: 200 }),
    ),

    http.post(`${apiBaseUrl}/pull/`, () =>
      HttpResponse.json({
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: {
          updates: [{ ...mockBenthicLitCollectRecords[0], validations }],
        },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      }),
    ),
  )

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    { initialEntries: ['/projects/5/collecting/benthiclit/70'] },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  await user.click(await screen.findByTestId('validate-button'), { timeout: 10000 })
  await waitFor(() => expect(screen.getByTestId('validate-button')))

  const depthRow = (await screen.findByTestId('depth')).closest('[data-validation-field]')

  scrollIntoView.mockClear()

  const nextButton = within(await screen.findByTestId('form-status-chip-error')).getByRole('button')

  await user.click(nextButton)

  return { depthRow, nextButton, scrollIntoView }
}

test('Next on the error chip scrolls to and highlights a Benthic LIT transect field', async () => {
  const { depthRow, scrollIntoView } = await validateThenClickNext()

  expect(depthRow).toHaveAttribute('data-validation-field', 'depth')
  expect(scrollIntoView).toHaveBeenCalledTimes(1)
  expect(scrollIntoView.mock.instances[0]).toBe(depthRow)
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' })
  await waitFor(() => expect(depthRow).toHaveClass('validation-target-highlight'))
}, 50000)

test('Next keeps focus on the chip and announces where it went', async () => {
  const { depthRow, nextButton } = await validateThenClickNext()

  // Focus stays put so the chip can be pressed again to cycle.
  expect(nextButton).toHaveFocus()

  // Which leaves the live region as the only thing telling a screen reader what happened.
  expect(screen.getByTestId('form-status-indicators')).toHaveAttribute('aria-live', 'polite')

  // The react-i18next mock drops interpolated values, so read them off the call instead.
  const announcements = mockT.mock.calls.filter(
    ([key]) => key === 'sample_units.validation_status.next_announcement',
  )

  expect(announcements.at(-1)?.[1]).toEqual({
    position: 1,
    total: 1,
    description: depthRow.textContent,
  })
}, 50000)

test('Next jumps instead of gliding when the user prefers reduced motion', async () => {
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  const { depthRow, scrollIntoView } = await validateThenClickNext()

  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'center' })

  // The row is still marked; only the movement is dropped.
  await waitFor(() => expect(depthRow).toHaveClass('validation-target-highlight'))
}, 50000)

test('The highlight waits for the page to stop moving', async () => {
  // The fade must not start until the target has stopped moving, or a long jump finishes
  // after the colour has gone. jsdom has no layout, so a moving rect stands in for the scroll.
  let top = 400
  let isTravelling = true

  vi.spyOn(window.HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => {
    if (isTravelling) {
      top -= 10
    }

    return { top }
  })

  const { depthRow } = await validateThenClickNext()

  expect(depthRow).not.toHaveClass('validation-target-highlight')

  isTravelling = false

  await waitFor(() => expect(depthRow).toHaveClass('validation-target-highlight'))
}, 50000)
