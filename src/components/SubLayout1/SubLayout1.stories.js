import React from 'react'

import SubLayout1 from '.'

export default {
  title: 'SubLayout1',
  component: SubLayout1,
}
export const basic = () => (
  <SubLayout1 topRow={<>Top Row</>} bottomRow={<>Bottom Row</>} />
)
