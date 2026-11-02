import React, { useEffect } from 'react'
import { describe, expect, test } from 'vitest'

import {
  act,
  renderUnauthenticatedOffline,
  screen,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import {
  ValidationDisclosureProvider,
  useValidationDisclosureStore,
  type ValidationDisclosureStore,
} from './ValidationDisclosure'
import ValidationMessageGroup from './ValidationMessageGroup'
import { mockT } from '../../../testUtilities/mockT'

// The test setup's t() returns the key, so labels are asserted by key.
const SHOW = 'validations.show'
const HIDE = 'validations.hide'
const ERROR_CHIP = 'sample_units.validation_status.chip_label_error'
const WARNING_CHIP = 'sample_units.validation_status.chip_label_warning'

interface Message {
  id: string
  status: 'error' | 'warning' | 'ignore'
  isStale?: boolean
}

const twoWarningsAndAnError: Message[] = [
  { id: 'e', status: 'error' },
  { id: 'w1', status: 'warning' },
  { id: 'w2', status: 'warning' },
]

const Group = ({ disclosureKey, messages }: { disclosureKey: string; messages: Message[] }) => (
  <section aria-label={disclosureKey}>
    <ValidationMessageGroup disclosureKey={disclosureKey} messages={messages}>
      {messages.map(({ id }) => (
        <p key={id}>{`message ${id}`}</p>
      ))}
    </ValidationMessageGroup>
  </section>
)

const Form = ({
  groups,
  onStore = undefined,
}: {
  groups: Record<string, Message[]>
  onStore?: (store: ValidationDisclosureStore) => void
}) => {
  const store = useValidationDisclosureStore()

  useEffect(() => {
    onStore?.(store)
  }, [onStore, store])

  return (
    <ValidationDisclosureProvider store={store}>
      {Object.entries(groups).map(([key, messages]) => (
        <Group key={key} disclosureKey={key} messages={messages} />
      ))}
    </ValidationDisclosureProvider>
  )
}

const getGroup = (key: string) => within(screen.getByRole('region', { name: key }))

describe('ValidationMessageGroup', () => {
  test('shows a single message in full, with no toggle', () => {
    renderUnauthenticatedOffline(<Form groups={{ 'field:a': [{ id: 'w', status: 'warning' }] }} />)

    expect(screen.getByText('message w')).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('collapses two or more messages to a count chip per status and a Show button', () => {
    renderUnauthenticatedOffline(<Form groups={{ 'row:1': twoWarningsAndAnError }} />)

    expect(screen.getByTestId('validation-count-error')).toHaveTextContent(ERROR_CHIP)
    expect(screen.getByTestId('validation-count-warning')).toHaveTextContent(WARNING_CHIP)
    expect(mockT).toHaveBeenCalledWith(ERROR_CHIP, { count: 1 })
    expect(mockT).toHaveBeenCalledWith(WARNING_CHIP, { count: 2 })
    expect(screen.queryByTestId('validation-count-ignore')).not.toBeInTheDocument()
    expect(screen.getByText('message w1')).not.toBeVisible()

    const toggle = screen.getByRole('button', { name: SHOW })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAccessibleDescription(`${ERROR_CHIP}${WARNING_CHIP}`)
  })

  test('Show reveals the messages and Hide collapses them again', async () => {
    const { user } = renderUnauthenticatedOffline(
      <Form groups={{ 'row:1': twoWarningsAndAnError }} />,
    )

    await user.click(screen.getByRole('button', { name: SHOW }))

    expect(screen.getByText('message w1')).toBeVisible()
    expect(screen.getByRole('button', { name: HIDE })).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: HIDE }))

    expect(screen.getByText('message w1')).not.toBeVisible()
  })

  test('opening one field or row closes the one that was open', async () => {
    const { user } = renderUnauthenticatedOffline(
      <Form groups={{ 'field:a': twoWarningsAndAnError, 'row:1': twoWarningsAndAnError }} />,
    )

    await user.click(getGroup('field:a').getByRole('button', { name: SHOW }))
    await user.click(getGroup('row:1').getByRole('button', { name: SHOW }))

    expect(getGroup('row:1').getByRole('button', { name: HIDE })).toBeInTheDocument()
    expect(getGroup('field:a').getByRole('button', { name: SHOW })).toBeInTheDocument()
  })

  test('the store can open and close a group from outside it', () => {
    let exposedStore: ValidationDisclosureStore | undefined

    renderUnauthenticatedOffline(
      <Form
        groups={{ 'field:a': twoWarningsAndAnError, 'row:1': twoWarningsAndAnError }}
        onStore={(store) => {
          exposedStore = store
        }}
      />,
    )

    act(() => exposedStore?.open('row:1'))
    expect(getGroup('row:1').getByRole('button', { name: HIDE })).toBeInTheDocument()

    act(() => exposedStore?.close())
    expect(getGroup('row:1').getByRole('button', { name: SHOW })).toBeInTheDocument()
  })

  test('keeps a group with a greyed message open, with no toggle', () => {
    renderUnauthenticatedOffline(
      <Form
        groups={{
          'row:1': [
            { id: 'e', status: 'error', isStale: true },
            { id: 'w', status: 'warning' },
          ],
        }}
      />,
    )

    expect(screen.getByText('message e')).toBeVisible()
    expect(screen.getByText('message w')).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('never collapses outside a form that provides the store', () => {
    renderUnauthenticatedOffline(<Group disclosureKey="field:a" messages={twoWarningsAndAnError} />)

    expect(screen.getByText('message w1')).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
