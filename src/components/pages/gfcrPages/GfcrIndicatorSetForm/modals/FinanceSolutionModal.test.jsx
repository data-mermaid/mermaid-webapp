import React from 'react'
import { describe, expect, it } from 'vitest'
import {
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../../../../testUtilities/testingLibraryWithHelpers'
import FinanceSolutionModal from './FinanceSolutionModal'

const choices = {
  financesolutiontypes: {
    data: [
      { id: 'business', name: 'Business solution' },
      { id: 'financial_mechanism', name: 'Financial facility' },
    ],
  },
  sectors: { data: [] },
  geographicalcoverage: { data: [] },
  incubatortypes: { data: [] },
  sustainablefinancemechanisms: { data: [] },
}

const indicatorSet = {
  id: 'current-set',
  finance_solutions: [
    { id: 'existing-1', name: 'Blue Reef Fund', fs_type: 'business' },
    { id: 'being-edited', name: 'Green Reef Fund', fs_type: 'business' },
  ],
}

const renderModal = (financeSolution) =>
  renderAuthenticatedOnline(
    <FinanceSolutionModal
      isOpen
      onDismiss={() => {}}
      financeSolution={financeSolution}
      indicatorSet={indicatorSet}
      setIndicatorSet={() => {}}
      choices={choices}
      displayHelp={false}
    />,
    { initialEntries: ['/projects/fake-project-id/gfcr'] },
  )

const nameInput = () => screen.getByLabelText(/business_finance_solution_name/)
const typeSelect = () => screen.getByLabelText(/finance_solutions.fs_type/)
const saveButton = () => screen.getByRole('button', { name: /finance_solution/i })
const duplicateError = () => screen.queryByText(/duplicate_error/)

describe('FinanceSolutionModal duplicate name validation', () => {
  it('flags a name and type that already exist in the indicator set, and blocks save', async () => {
    const { user } = renderModal()

    await user.selectOptions(typeSelect(), 'business')
    await user.type(nameInput(), 'blue reef fund ')

    expect(duplicateError()).toBeInTheDocument()
    expect(saveButton()).toBeDisabled()
  })

  it('does not flag a name that only matches under a different type', async () => {
    const { user } = renderModal()

    await user.selectOptions(typeSelect(), 'financial_mechanism')
    await user.type(nameInput(), 'Blue Reef Fund')

    expect(duplicateError()).not.toBeInTheDocument()
  })

  it('does not flag the row being edited against itself', async () => {
    const { user } = renderModal(indicatorSet.finance_solutions[1])

    // Retype the same name so formik revalidates
    await user.clear(nameInput())
    await user.type(nameInput(), 'Green Reef Fund')

    expect(duplicateError()).not.toBeInTheDocument()
  })

  it('renders the error in a wrapper the GFCR modal stylesheet can space', async () => {
    const { user } = renderModal()

    await user.selectOptions(typeSelect(), 'business')
    await user.type(nameInput(), 'Blue Reef Fund')

    // subPages.styles.js spaces the message off the input via `.validationWrapper:not(:empty)`,
    // so the class hook and the wrapper being empty when unused are both load bearing.
    const wrapper = duplicateError().closest('.validationWrapper')

    expect(wrapper).toBeInTheDocument()
    expect(wrapper).not.toBeEmptyDOMElement()
    expect(within(wrapper).getByTestId('message-pill-error')).toBeInTheDocument()
  })
})
