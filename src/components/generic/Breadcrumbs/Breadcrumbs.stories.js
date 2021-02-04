import React from 'react'

import Breadcrumbs from '.'

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
}

const fakeCrumbs = [
  { name: 'stuff', path: '/path/somewhere1' },
  { name: 'things', path: '/path/somewhere2' },
  { name: 'unicorn', path: '/path/somewhere3' },
]

export const basic = () => <Breadcrumbs crumbs={fakeCrumbs} />

export const oneCrumbOnly = () => (
  <Breadcrumbs crumbs={[{ name: 'Just Me!', path: 'over/here' }]} />
)
