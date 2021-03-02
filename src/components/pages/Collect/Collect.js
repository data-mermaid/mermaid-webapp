import React from 'react'
import SubLayout2 from '../../SubLayout2'
import NavMenu from '../../NavMenu'

/**
 * Project Collect Page
 */
const Collect = () => {
  return (
    <SubLayout2
      lowerLeft={<NavMenu />}
      lowerRight={<>Collect Table Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

Collect.propTypes = {}

export default Collect
