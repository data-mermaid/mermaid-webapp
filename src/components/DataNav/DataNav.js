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
      {/* When we are using the 'data workflow' we want the sites page to show the side bar/nav
       for the data workflow with the workflow=data parameter (its different from the sidebar
       nav for the 'collecting workflow') */}
      <NavLinkSidebar to={`${currentProjectPath}/sites/data`}>
        <IconSites />
        Sites
      </NavLinkSidebar>
      {/* When we are using the 'data workflow' we want the management regimes page to show the side bar/nav
       for the data workflow with the workflow=data parameter (its different from the sidebar
       nav for the 'collecting workflow') */}
      <NavLinkSidebar to={`${currentProjectPath}/management-regimes/data`}>
        <IconCopy />
        Management Regimes
      </NavLinkSidebar>
    </Column>
  )
}

export default DataNav
