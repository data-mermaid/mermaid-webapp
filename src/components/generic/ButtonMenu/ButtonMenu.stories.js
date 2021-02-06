import React from 'react'
import { action } from '@storybook/addon-actions'

import ButtonMenu from '.'
import styled from 'styled-components'

export default {
  title: 'ButtonMenu',
  component: ButtonMenu,
}

const SomeExtraSpace = styled.div`
  padding: 100px;
`

export const basic = () => (
  <SomeExtraSpace>
    <ButtonMenu
      label="click me"
      items={[
        { label: 'Looooooooong Label 1', onClick: action('item 1 clicked') },
        { label: 'Label 2', onClick: action('item 2 clicked') },
        { label: 'Label 3', onClick: action('item 3 clicked') },
        { label: 'Label 4', onClick: action('item 4 clicked') },
      ]}
    />
  </SomeExtraSpace>
)
