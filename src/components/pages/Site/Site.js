import React from 'react'
import PropTypes from 'prop-types'

import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'

const Site = () => {
  return (
    <ContentPageLayout
      content={<>Site Form Placeholder</>}
      toolbar={
        <>
          <H2>Site Name</H2>
        </>
      }
    />
  )
}

Site.propTypes = {}

export default Site
