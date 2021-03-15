import React from 'react'

import ButtonSecondaryDropdown from '.'

export default {
  title: 'ButtonSecondaryDropdown',
  component: ButtonSecondaryDropdown,
}
export const basic = () => (
  <ButtonSecondaryDropdown label="Button label. Could be a node not just a string">
    <div>Could be anything</div>
  </ButtonSecondaryDropdown>
)
