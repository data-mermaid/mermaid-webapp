import React from 'react'
import styled from 'styled-components'

import HideShow from '.'

export default {
  title: 'HideShow',
  component: HideShow,
}

const SomeExtraSpace = styled.div`
  padding: 100px;
`

export const basic = () => (
  <SomeExtraSpace>
    <HideShow
      button={<button type="button">Hey, I am a hide/show click target!</button>}
      contents={<div>Im the drop down part that hides and shows</div>}
    />
  </SomeExtraSpace>
)
