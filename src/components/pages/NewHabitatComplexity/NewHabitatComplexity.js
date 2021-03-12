import React from 'react'
import SubLayout2 from '../../SubLayout2'
import NavMenu from '../../NavMenu'

const NewHabitatComplexity = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>New Habitat Complexity Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

NewHabitatComplexity.propTypes = {}

export default NewHabitatComplexity
