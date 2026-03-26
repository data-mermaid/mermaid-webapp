import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router'
import { fn } from 'storybook/test'

import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonSecondarySmall,
  ButtonCaution,
  ButtonCallout,
  ButtonThatLooksLikeLink,
  ButtonThatLooksLikeLinkUnderlined,
  CloseButton,
  IconButton,
  InlineValidationButton,
  LinkLooksLikeButtonSecondary,
} from './buttons'
import { IconClose } from '../icons'

const meta = {
  title: 'Components/Buttons',
  component: ButtonPrimary,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Generic button components used throughout the app.',
      },
    },
  },
  args: {
    onClick: fn(),
    children: 'Button',
    disabled: false,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof ButtonPrimary>

export default meta
type Story = StoryObj<typeof meta>

// ── ButtonPrimary ─────────────────────────────────────────────────────────────

export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The main call-to-action button. Use for the single most important action on a page.',
      },
    },
  },
}

export const PrimaryDisabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state — use when the action is temporarily unavailable.',
      },
    },
  },
}

// ── ButtonSecondary ───────────────────────────────────────────────────────────

export const Secondary: Story = {
  render: (args) => <ButtonSecondary {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A secondary action button. Use alongside a primary button for less prominent actions like Cancel.',
      },
    },
  },
}

export const SecondaryDisabled: Story = {
  args: { disabled: true },
  render: (args) => <ButtonSecondary {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state for the secondary button.',
      },
    },
  },
}

// ── ButtonSecondarySmall ──────────────────────────────────────────────────────

export const SecondarySmall: Story = {
  render: (args) => <ButtonSecondarySmall {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A compact variant of the secondary button for use in tight layouts like toolbars or table rows.',
      },
    },
  },
}

export const SecondarySmallDisabled: Story = {
  args: { disabled: true },
  render: (args) => <ButtonSecondarySmall {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state for the small secondary button.',
      },
    },
  },
}

// ── ButtonCaution ─────────────────────────────────────────────────────────────

export const Caution: Story = {
  render: (args) => <ButtonCaution {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A destructive action button. Use for irreversible actions like Delete or Remove.',
      },
    },
  },
}

export const CautionDisabled: Story = {
  args: { disabled: true },
  render: (args) => <ButtonCaution {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state for the caution button.',
      },
    },
  },
}

// ── ButtonCallout ─────────────────────────────────────────────────────────────

export const Callout: Story = {
  render: (args) => <ButtonCallout {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A callout button for drawing attention to an action without it being the primary CTA. Used for actions like Add New.',
      },
    },
  },
}

export const CalloutDisabled: Story = {
  args: { disabled: true },
  render: (args) => <ButtonCallout {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state for the callout button.',
      },
    },
  },
}

// ── ButtonThatLooksLikeLink ───────────────────────────────────────────────────

export const LooksLikeLink: Story = {
  render: (args) => <ButtonThatLooksLikeLink {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A button styled as plain text. Use when an action should feel lightweight and inline, without the visual weight of a button.',
      },
    },
  },
}

export const LooksLikeLinkDisabled: Story = {
  args: { disabled: true },
  render: (args) => <ButtonThatLooksLikeLink {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state for the link-style button.',
      },
    },
  },
}

// ── ButtonThatLooksLikeLinkUnderlined ─────────────────────────────────────────

export const LooksLikeLinkUnderlined: Story = {
  render: (args) => <ButtonThatLooksLikeLinkUnderlined {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A button styled as an underlined text link. Use when the action should appear inline with body text.',
      },
    },
  },
}

export const LooksLikeLinkUnderlinedDisabled: Story = {
  args: { disabled: true },
  render: (args) => <ButtonThatLooksLikeLinkUnderlined {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state for the underlined link-style button.',
      },
    },
  },
}

// ── CloseButton ───────────────────────────────────────────────────────────────

export const Close: Story = {
  args: { children: <IconClose /> },
  render: (args) => <CloseButton {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A circular icon button for dismissing modals, panels, or notifications.',
      },
    },
  },
}

// ── IconButton ────────────────────────────────────────────────────────────────

export const Icon: Story = {
  args: { children: <IconClose /> },
  render: (args) => <IconButton {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A minimal button for icon-only actions. No background or border — the icon itself is the affordance.',
      },
    },
  },
}

// ── InlineValidationButton ────────────────────────────────────────────────────

export const InlineValidation: Story = {
  args: { children: 'Resolve duplicate' },
  render: (args) => <InlineValidationButton {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'A compact secondary button for inline validation messages, prompting the user to resolve a field error.',
      },
    },
  },
}

export const InlineValidationDisabled: Story = {
  args: { children: 'Resolve duplicate', disabled: true },
  render: (args) => <InlineValidationButton {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state for the inline validation button.',
      },
    },
  },
}

// ── LinkLooksLikeButtonSecondary ──────────────────────────────────────────────

export const LinkAsSecondaryButton: Story = {
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  render: (args) => (
    <LinkLooksLikeButtonSecondary to="/">{args.children}</LinkLooksLikeButtonSecondary>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A React Router `<Link>` styled as a secondary button. Use when navigation should look like a button action rather than a text link.',
      },
    },
  },
}
