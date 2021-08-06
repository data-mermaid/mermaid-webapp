import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

/**
 * Button that shows content in drop down on click
 */
const DropdownContainer = styled.div`
  padding: 0;
  margin: 0;
  position: absolute;
  z-index: 9;
  left: 0;
  min-width: 100%;
`
const PositionedAncestor = styled.div`
  position: relative;
  width: max-content;
`

const HideShow = ({ contents, button }) => {
  const [showItems, setShowItems] = useState(false)
  const buttonRef = useRef(null)

  const toggleShowItems = () => {
    setShowItems(!showItems)
  }

  useEffect(() => {
    const currentButtonRef = buttonRef.current

    window.addEventListener('click', (event) => {
      if (!(currentButtonRef && currentButtonRef.contains(event.target))) {
        setShowItems(false)
      }
    })

    return () => {
      window.removeEventListener('click', (event) => {
        if (!(currentButtonRef && currentButtonRef.contains(event.target))) {
          setShowItems(false)
        }
      })
    }
  }, [buttonRef, showItems])

  const buttonForRender = React.cloneElement(button, {
    ref: buttonRef,
    onClick: toggleShowItems,
  })

  return (
    <PositionedAncestor data-testid="add-sample-unit">
      {buttonForRender}
      {showItems && contents}
    </PositionedAncestor>
  )
}

HideShow.propTypes = {
  button: PropTypes.node.isRequired,
  contents: PropTypes.node.isRequired,
}

export default HideShow
export { DropdownContainer }
