import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

/**
 * Button that shows children in drop down on click
 */
const MenuButton = styled.button``
const ListButton = styled.button``
const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: absolute;
  right: 0;
  & > li {
    text-align: right;
  }
`
const PositionedAncestor = styled.div`
  position: relative;
  width: max-content;
`

const ButtonMenu = ({ items, label }) => {
  const [showItems, setShowItems] = useState(false)
  const toggleShowItems = () => {
    setShowItems(!showItems)
  }

  return (
    <PositionedAncestor>
      <MenuButton onClick={toggleShowItems}>{label}</MenuButton>
      {showItems && (
        <List>
          {items.map((item) => (
            <li key={item.label}>
              <ListButton onClick={item.onClick}>{item.label}</ListButton>
            </li>
          ))}
        </List>
      )}
    </PositionedAncestor>
  )
}

ButtonMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, onClick: PropTypes.func }),
  ).isRequired,
  label: PropTypes.string.isRequired,
}

export default ButtonMenu
