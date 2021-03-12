import React from 'react'
import SubLayout2 from '../../SubLayout2'
import NavMenu from '../../NavMenu'

const NewBleaching = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>New Bleaching Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

NewBleaching.propTypes = {}

export default NewBleaching
