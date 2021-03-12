import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

/**
 * Button that shows content in drop down on click
 */
const DropdownContainer = styled.div`
  padding: 0;
  margin: 0;
  position: absolute;
  right: 0;
`
const PositionedAncestor = styled.div`
  position: relative;
  width: max-content;
`

const HideShow = ({ contents, button }) => {
  const [showItems, setShowItems] = useState(false)
  const toggleShowItems = () => {
    setShowItems(!showItems)
  }

  const buttonForRender = React.cloneElement(button, {
    onClick: toggleShowItems,
  })

  return (
    <PositionedAncestor>
      {buttonForRender}
      {showItems && <DropdownContainer>{contents}</DropdownContainer>}
    </PositionedAncestor>
  )
}

HideShow.propTypes = {
  button: PropTypes.node.isRequired,
  contents: PropTypes.node.isRequired,
}

export default HideShow
