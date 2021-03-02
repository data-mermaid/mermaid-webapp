import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLinkSidebar } from '../generic/links'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import { H4 } from '../generic/text'

/**
 * Describe your component
 */
const NavHeader = styled(H4)`
  text-transform: uppercase;
  border-bottom: 1px solid;
  padding: 10px;
`

const NavItem = ({ header, itemList }) => {
  const currentProjectPath = useCurrentProjectPath()

  const categoryItemList = itemList.map(({ path, icon, name }) => (
    <NavLinkSidebar key={path} to={`${currentProjectPath}/${path}`}>
      {icon()}
      {name}
    </NavLinkSidebar>
  ))

  return (
    <>
      <NavHeader>{header}</NavHeader>
      {categoryItemList}
    </>
  )
}

NavItem.propTypes = {
  header: PropTypes.string.isRequired,
  itemList: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      name: PropTypes.string,
      icon: PropTypes.func,
    }),
  ).isRequired,
}

export default NavItem
