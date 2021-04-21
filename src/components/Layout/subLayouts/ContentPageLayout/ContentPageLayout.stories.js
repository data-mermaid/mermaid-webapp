import React from 'react'

import ContentPageLayout from '.'

export default {
  title: 'ContentPageLayout',
  component: ContentPageLayout,
}
export const basic = () => (
  <ContentPageLayout content={<>Lower Right</>} toolbar={<>Upper Right</>} />
)
