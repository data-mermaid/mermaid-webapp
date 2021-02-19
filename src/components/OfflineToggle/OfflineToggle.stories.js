import { action } from '@storybook/addon-actions'
import React from 'react'

import OfflineToggle from '.'

export default {
  title: 'OfflineToggle',
  component: OfflineToggle,
}
export const basic = () => <OfflineToggle onChange={action('toggle changed')} />
