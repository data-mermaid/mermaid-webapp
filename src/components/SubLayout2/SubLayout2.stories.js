import React from 'react'

import SubLayout2 from '.'

export default {
  title: 'SubLayout2',
  component: SubLayout2,
}
export const basic = () => (
  <SubLayout2
    lowerLeft={<>Lower Left</>}
    lowerRight={<>Lower Right</>}
    upperLeft={<>Upper Left</>}
    upperRight={<>Upper Right</>}
  />
)
