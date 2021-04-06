import React from 'react'
import { H3 } from '../../generic/text'
// import PropTypes from 'prop-types'
import ContentPageLayout from '../../ContentPageLayout'

const Health = () => {
  return (
    <ContentPageLayout
      content={<>Project Health Placeholder</>}
      toolbar={
        <>
          <H3>Project Health</H3>
        </>
      }
    />
  )
}

Health.propTypes = {}

export default Health
