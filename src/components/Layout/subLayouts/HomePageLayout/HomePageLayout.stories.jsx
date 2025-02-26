import React from 'react'

import HomePageLayout from '.'

export default {
  title: 'HomePageLayout',
  component: HomePageLayout,
}
export const basic = () => <HomePageLayout topRow={<>Top Row</>} bottomRow={<>Bottom Row</>} />
