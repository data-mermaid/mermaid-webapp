import React from 'react'
import { H3 } from '../../generic/text'
// import PropTypes from 'prop-types'
import SubLayout2 from '../../SubLayout2'

const Health = () => {
  return (
    <SubLayout2
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
