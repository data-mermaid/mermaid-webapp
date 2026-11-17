import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import FilterIndicatorPill from './FilterIndicatorPill'

const meta = {
  component: FilterIndicatorPill,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Displays the current filter state when a table or list has active filters. Shows how many rows are visible out of the total, and provides a clear button to reset all filters.\n\nRender when at least one filter (`isSearchFilterEnabled` or `isMethodFilterEnabled`) is active. If both are active, `isSearchFilterEnabled` takes precedence in the displayed count.',
      },
    },
  },
  tags: ['autodocs'],
  args: { clearFilters: fn() },
} satisfies Meta<typeof FilterIndicatorPill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    unfilteredRowLength: 42,
    isSearchFilterEnabled: true,
    searchFilteredRowLength: 7,
  },
}
