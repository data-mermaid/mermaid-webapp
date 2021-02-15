import React from 'react'
import { useParams } from 'react-router-dom'
import CollectingNav from '../../CollectingNav'
// import PropTypes from 'prop-types'
import DataNav from '../../DataNav'
import SubLayout2 from '../../SubLayout2'

/**
 * Describe your component
 */
const Sites = () => {
  const { workflow } = useParams()
  const showCollectingNav = !(workflow === 'data')

  return (
    <SubLayout2
      lowerLeft={showCollectingNav ? <CollectingNav /> : <DataNav />}
      lowerRight={<>Sites Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

Sites.propTypes = {}

export default Sites
