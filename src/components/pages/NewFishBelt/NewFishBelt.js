import React from 'react'
import SubLayout2 from '../../SubLayout2'
import NavMenu from '../../NavMenu'

const NewFishBelt = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>New Fish Belt Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

NewFishBelt.propTypes = {}

export default NewFishBelt
