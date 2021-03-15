import React from 'react'

import SubLayout2 from '.'

export default {
  title: 'SubLayout2',
  component: SubLayout2,
}
export const basic = () => (
  <SubLayout2 content={<>Lower Right</>} toolbar={<>Upper Right</>} />
)
