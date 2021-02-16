import React from 'react'
import AdminNav from '../../AdminNav'
import SubLayout2 from '../../SubLayout2'
// import PropTypes from 'prop-types'

/**
 * Describe your component
 */
const FishFamilies = () => {
  return (
    <SubLayout2
      lowerLeft={<AdminNav />}
      lowerRight={<>Fish Families Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

// FishFamilies.propTypes = {}

export default FishFamilies
