import React from 'react'
import SubLayout2 from '../../SubLayout2'
import NavMenu from '../../NavMenu'

const NewBenthicPit = () => {
  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<>New Benthic PIT Placeholder</>}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

NewBenthicPit.propTypes = {}

export default NewBenthicPit
