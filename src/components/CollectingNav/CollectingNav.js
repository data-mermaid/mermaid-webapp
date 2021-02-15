import React from 'react'
import { Column } from '../generic/positioning'
import { NavLinkSidebar } from '../generic/links'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import { IconCollect, IconCopy, IconSites } from '../icons'

/**
 * Describe your component
 */
const CollectingNav = () => {
  const currentProjectPath = useCurrentProjectPath()

  return (
    <Column as="nav">
      <NavLinkSidebar to={`${currentProjectPath}/collecting`}>
        <IconCollect />
        Submitted
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

export default CollectingNav
