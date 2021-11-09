import '@testing-library/jest-dom/extend-expect'
import { rest } from 'msw'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { screen, renderAuthenticatedOnline } from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import { getMockDexieInstanceAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import mockMermaidApiAllSuccessful from '../../../testUtilities/mockMermaidApiAllSuccessful'

const apiBaseUrl = process.env.REACT_APP_MERMAID_API

describe('Online', () => {
  test('Edit Fishbelt - Save button starts with Saved status, make changes, Saved change to Saving, and finally to Saved. Validate button is disabled during saving', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexieInstance,
    })

    userEvent.clear(await screen.findByLabelText('Depth'))
    userEvent.type(screen.getByLabelText('Depth'), '45')

    expect(screen.getByText('Save', { selector: 'button' }))

    expect(screen.getByText('Validate', { selector: 'button' })).toBeDisabled()

    userEvent.click(
      screen.getByText('Save', {
        selector: 'button',
      }),
    )

    expect(await screen.findByText('Saving', { selector: 'button' }))

    expect(await screen.findByText('Collect record saved.'))

    expect(await screen.findByText('Saved', { selector: 'button' }))
    expect(screen.getByText('Validate', { selector: 'button' })).toBeEnabled()
  })

  test('Edit Fishbelt - Validate button clicked -> send record to validate api endpoint -> Record is failed to validate, and ready to validate again.', async () => {
    const dexieInstance = getMockDexieInstanceAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

    renderAuthenticatedOnline(<App dexieInstance={dexieInstance} />, {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexieInstance,
    })

    userEvent.click(await screen.findByText('Validate', { selector: 'button' }))

    mockMermaidApiAllSuccessful.use(
      rest.post(`${apiBaseUrl}/projects/5/collecting/validate`, (req, res, ctx) => {
        const project = req.url.searchParams('projectId')

        if (!project) {
          return res.once(ctx.status(404))
        }

        return res(ctx.status(200))
      }),
    )

    expect(await screen.findByText('Validating', { selector: 'button' }))

    expect(await screen.findByText('Validate', { selector: 'button' }))
  })
})
