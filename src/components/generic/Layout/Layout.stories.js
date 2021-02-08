import React from 'react'

import Layout from './Layout'

export default {
  title: 'Stacked Layout',
  component: Layout,
}

export const basic = () => (
  <Layout
    header={<header>Header</header>}
    breadcrumbs={<>Breadcrumbs (responsible for its own hiding and showing)</>}
    footer={<footer>Footer</footer>}
  >
    main content (could contain sub layouts)
  </Layout>
)
