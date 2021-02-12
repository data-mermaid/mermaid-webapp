import React from 'react'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import { NavLinkSidebar } from '../generic/links'
import { Column } from '../generic/positioning'
import { IconCopy, IconData, IconGraph, IconSites } from '../icons'

/**
 * A reusable nav for pages part of the 'data workflow'
 */

const DataNav = () => {
  const currentProjectPath = useCurrentProjectPath()

  return (
    <Column as="nav">
      <NavLinkSidebar to={`${currentProjectPath}/data`}>
        <IconData />
        Submitted
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/graphs-and-maps`}>
        <IconGraph />
        Graphs and Maps
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/sites`}>
        <IconSites />
        Sites
      </NavLinkSidebar>
      <NavLinkSidebar to={`${currentProjectPath}/management-regimes`}>
        <IconCopy />
        Management Regimes
      </NavLinkSidebar>
    </Column>
  )
}

export default DataNav
