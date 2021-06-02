import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOnline,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'

test('Unsaved NEW fishbelt form edits clear when the user navigates away and back', async () => {
  renderAuthenticatedOnline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    {
      initialEntries: ['/projects/fakewhatever/collecting/fishbelt/'],
    },
  )

  const form = await screen.findByRole('form')

  expect(within(form).getByLabelText(/depth/i)).not.toHaveValue()

  // enter a depth
  userEvent.type(await within(form).findByLabelText(/depth/i), '45')

  expect(await within(form).findByLabelText(/depth/i)).toHaveValue(45)

  // nav away
  const sideNav = await screen.findByTestId('content-page-side-nav')

  userEvent.click(within(sideNav).getByRole('link', { name: /collecting/i }))
  // nav back
  userEvent.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )
  const sampleUnitNav = await screen.findByTestId('new-sample-unit-nav')

  userEvent.click(
    within(sampleUnitNav).getByRole('link', {
      name: /fish belt/i,
    }),
  )

  const formAfterNav = await screen.findByRole('form')

  expect(within(formAfterNav).getByLabelText(/depth/i)).not.toHaveValue()
})

test('Unsaved EDIT fishbelt form edits clear when the user navigates away and back', async () => {
  renderAuthenticatedOnline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
    {
      initialEntries: ['/projects/fakewhatever/collecting/fishbelt/2'],
    },
  )

  const form = await screen.findByRole('form')

  // initial unedited depth value
  expect(within(form).getByLabelText(/depth/i)).toHaveValue(10)

  // enter a depth
  const depthInput = await within(form).findByLabelText(/depth/i)

  userEvent.clear(depthInput)
  userEvent.type(depthInput, '45')

  expect(await within(form).findByLabelText(/depth/i)).toHaveValue(45)

  // nav away
  const sideNav = screen.getByTestId('content-page-side-nav')

  userEvent.click(within(sideNav).getByRole('link', { name: /collecting/i }))

  // nav back
  const table = await screen.findByRole('table')

  userEvent.click(
    within(table).getAllByRole('link', {
      name: /fish belt/i,
    })[0],
  )

  const formAfterNav = await screen.findByRole('form')

  // initial unedited depth value
  expect(within(formAfterNav).getByLabelText(/depth/i)).toHaveValue(10)
})

test('Unsaved fishbelt form edits persist through online/offline status change', () => {
  // After M103 - user controlled offline toggle wireup
})
