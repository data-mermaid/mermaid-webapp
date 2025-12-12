import type { Meta, StoryObj } from '@storybook/react-vite'
import PrimaryButton from './PrimaryButton'

const meta = {
  component: PrimaryButton,
} satisfies Meta<typeof PrimaryButton>

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    onClick: () => {},
    disabled: false,
    testId: 'primary-button',
    label: 'Click me',
  },
}

export const Disabled: Story = {
  args: {
    onClick: () => {},
    disabled: true,
    testId: 'primary-button',
    label: 'Click me',
  },
}

export default meta
