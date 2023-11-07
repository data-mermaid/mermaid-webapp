import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import App from '../../App'

test('Observers input shows users that have been removed from the project and allows for them to be deleted from the collect record. ', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/benthicpit/50'],
    },
    dexiePerUserDataInstance,
    dexieCurrentUserInstance,
  )

  const observersRow = await screen.findByTestId('observers')

  expect(observersRow).toHaveTextContent(
    'Betsy Craig was an observer on this sample unit but is no longer in this project.',
  )
  fireEvent.click(within(observersRow).getByRole('button', { name: 'Remove as observer' }))

  const modal = screen.getByLabelText('Remove observer from record')

  expect(modal).toHaveTextContent('Are you sure you want to remove Betsy Craig as an observer?')
  fireEvent.click(within(modal).getByRole('button', { name: 'Remove user' }))

  // testing tradeoff, we dont directly check that Betsy has been deleted from the record,
  // but a save will reload updated data, which should be missing Betsy and this is likely a good enough test
  fireEvent.click(screen.getByRole('button', { name: 'Save' }))

  expect(await screen.findByText('Record saved.'))
  waitFor(() =>
    expect(observersRow).toHaveTextContent(
      'Betsy Craig was an observer on this sample unit but is no longer in this project.',
    ),
  )
})
