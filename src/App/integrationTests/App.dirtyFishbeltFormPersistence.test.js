import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  renderAuthenticatedOnline,
  within,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'

test('Unsaved NEW fishbelt form edits clear when the user navigates away and back', async () => {
  const navigateToNewFishbeltFormFromCollecting = async () => {
    userEvent.click(
      await screen.findByRole('button', {
        name: /Add Sample Unit/i,
      }),
    )
    const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

    userEvent.click(
      within(sampleUnitNav).getByRole('link', {
        name: /fish belt/i,
      }),
    )
  }

  renderAuthenticatedOnline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  const projectCard = screen.getAllByRole('listitem')[0]

  userEvent.click(within(projectCard).getByText(/collecting/i))

  await navigateToNewFishbeltFormFromCollecting()

  const form = await screen.findByRole('form')

  expect(within(form).getByLabelText(/depth/i)).not.toHaveValue()

  // enter a depth
  userEvent.type(await within(form).findByLabelText(/depth/i), '45')

  expect(await within(form).findByLabelText(/depth/i)).toHaveValue(45)

  // nav away
  userEvent.click(screen.getByRole('link', { name: /collecting/i }))

  await navigateToNewFishbeltFormFromCollecting()
  const formAfterNav = await screen.findByRole('form')

  expect(within(formAfterNav).getByLabelText(/depth/i)).not.toHaveValue()
})

test('Unsaved EDIT fishbelt form edits clear when the user navigates away and back', async () => {
  const navigateToEditFormFromCollecting = async () => {
    const table = await screen.findByRole('table')

    userEvent.click(
      within(table).getAllByRole('link', {
        name: /fish belt/i,
      })[0],
    )
  }

  renderAuthenticatedOnline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )
  const projectCard = screen.getAllByRole('listitem')[0]

  userEvent.click(within(projectCard).getByText(/collecting/i))

  await navigateToEditFormFromCollecting()

  const form = await screen.findByRole('form')

  // initial unedited depth value
  expect(within(form).getByLabelText(/depth/i)).toHaveValue(10)

  // enter a depth
  const depthInput = await within(form).findByLabelText(/depth/i)

  userEvent.clear(depthInput)
  userEvent.type(depthInput, '45')

  expect(await within(form).findByLabelText(/depth/i)).toHaveValue(45)

  // nav away
  userEvent.click(
    screen.getByRole('link', {
      name: /collecting/i,
    }),
  )

  // nav back
  await navigateToEditFormFromCollecting()
  const formAfterNav = await screen.findByRole('form')

  // initial unedited depth value
  expect(within(formAfterNav).getByLabelText(/depth/i)).toHaveValue(10)
})

test('Unsaved fishbelt form edits persist through online/offline status change', () => {
  // After M103 - user controlled offline toggle wireup
})
