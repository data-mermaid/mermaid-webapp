import React, { useEffect, useState } from 'react'
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

// Ticking a box ignores that warning, which stops it being greyed, as the form does. An
// ignored message on an edited row is never greyed, so w1 starts without isStale.
const GroupWithIgnoreBoxes = () => {
  const store = useValidationDisclosureStore()
  const [messages, setMessages] = useState<Message[]>([
    { id: 'w1', status: 'ignore' },
    { id: 'w2', status: 'warning', isStale: true },
  ])
  const ignore = (id: string) =>
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, status: 'ignore', isStale: false } : message,
      ),
    )

  return (
    <ValidationDisclosureProvider store={store}>
      <ValidationMessageGroup disclosureKey="row:1" messages={messages}>
        {messages.map(({ id, status }) => (
          <label key={id}>
            <input type="checkbox" checked={status === 'ignore'} onChange={() => ignore(id)} />
            {`ignore ${id}`}
          </label>
        ))}
      </ValidationMessageGroup>
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

  describe('opened by Next', () => {
    const renderWithStore = () => {
      let exposedStore: ValidationDisclosureStore | undefined
      const { user } = renderUnauthenticatedOffline(
        <Form
          groups={{ 'field:a': twoWarningsAndAnError, 'row:1': twoWarningsAndAnError }}
          onStore={(store) => {
            exposedStore = store
          }}
        />,
      )

      return {
        user,
        open: (key: string) => act(() => exposedStore?.open(key)),
        close: () => act(() => exposedStore?.close()),
      }
    }

    test('opens the group Next lands on, and closes it when Next moves', () => {
      const { open, close } = renderWithStore()

      open('row:1')
      expect(getGroup('row:1').getByRole('button', { name: HIDE })).toBeInTheDocument()

      open('field:a')
      expect(getGroup('field:a').getByRole('button', { name: HIDE })).toBeInTheDocument()
      expect(getGroup('row:1').getByRole('button', { name: SHOW })).toBeInTheDocument()

      close()
      expect(getGroup('field:a').getByRole('button', { name: SHOW })).toBeInTheDocument()
    })

    test('closes a group the diver opened when Next opens another', async () => {
      const { user, open } = renderWithStore()

      await user.click(getGroup('field:a').getByRole('button', { name: SHOW }))
      open('row:1')

      expect(getGroup('field:a').getByRole('button', { name: SHOW })).toBeInTheDocument()
      expect(getGroup('row:1').getByRole('button', { name: HIDE })).toBeInTheDocument()
    })

    test('Hide closes a group Next opened', async () => {
      const { user, open } = renderWithStore()

      open('row:1')
      await user.click(getGroup('row:1').getByRole('button', { name: HIDE }))

      expect(getGroup('row:1').getByRole('button', { name: SHOW })).toBeInTheDocument()
    })
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

  test('ignoring the last greyed warning keeps the group open and its Ignore box focused', async () => {
    const { user } = renderUnauthenticatedOffline(<GroupWithIgnoreBoxes />)
    const box = screen.getByRole('checkbox', { name: 'ignore w2' })

    await user.click(box)

    expect(screen.getByRole('button', { name: HIDE })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('checkbox', { name: 'ignore w2' })).toBe(box)
    expect(box).toBeVisible()
    expect(box).toHaveFocus()
  })

  test('never collapses outside a form that provides the store', () => {
    renderUnauthenticatedOffline(<Group disclosureKey="field:a" messages={twoWarningsAndAnError} />)

    expect(screen.getByText('message w1')).toBeVisible()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
