import React from 'react'
import { Column } from '../generic/positioning'
import { navItemList } from '../../constants/navItemList'
import NavItem from '../NavItem'

/**
 * Describe your component
 */

const NavMenu = () => {
  return (
    <Column as="nav">
      {navItemList.map(({ header, itemList }) => (
        <NavItem key={header} header={header} itemList={itemList} />
      ))}
    </Column>
  )
}

export default NavMenu
