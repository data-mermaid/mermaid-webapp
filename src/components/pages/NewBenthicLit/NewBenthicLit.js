import React from 'react'
import NavMenu from '../../NavMenu'
import SubLayout2 from '../../SubLayout2'

const NewBenthicLit = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>New Benthic LIT Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

NewBenthicLit.propTypes = {}

export default NewBenthicLit
