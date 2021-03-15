import React from 'react'
import Admin from '../components/pages/Admin'
import Collect from '../components/pages/Collect'
import CollectRecord from '../components/pages/CollectRecord'
import Data from '../components/pages/Data'
import DataSharing from '../components/pages/DataSharing'
import FishFamilies from '../components/pages/FishFamilies'
import GraphsAndMaps from '../components/pages/GraphsAndMaps'
import ManagementRegimes from '../components/pages/ManagementRegimes'
import Projects from '../components/pages/Projects'
import Sites from '../components/pages/Sites'
import Users from '../components/pages/Users'
import Health from '../components/pages/Health'

export const useRoutes = ({ mermaidData }) => {
  const routes = [
    {
      path: '/projects',
      name: 'Projects',
      Component: () => <Projects mermaidData={mermaidData} />,
    },
    {
      path: '/projects/:projectId/health',
      name: 'Project Health',
      Component: Health,
    },
    {
      path: '/projects/:projectId/collecting',
      name: 'Collecting',
      Component: () => <Collect mermaidData={mermaidData} />,
    },
    {
      path: '/projects/:projectId/collecting/fishbelt/:recordId',
      name: 'Fish Belt',
      Component: () => <CollectRecord mermaidData={mermaidData} />,
    },
    {
      path: '/projects/:projectId/collecting/benthiclit/:recordId',
      name: 'Benthic LIT',
      Component: () => <CollectRecord mermaidData={mermaidData} />,
    },
    {
      path: '/projects/:projectId/data',
      name: 'Data',
      Component: Data,
    },
    {
      path: '/projects/:projectId/admin',
      name: 'Admin',
      Component: Admin,
    },

    {
      path: '/projects/:projectId/graphs-and-maps',
      name: 'Graphs and Maps',
      Component: GraphsAndMaps,
    },

    {
      path: '/projects/:projectId/sites/:workflow?',
      name: 'Sites',
      Component: Sites,
    },

    {
      path: '/projects/:projectId/management-regimes/:workflow?',
      name: 'Management Regimes',
      Component: ManagementRegimes,
    },
    {
      path: '/projects/:projectId/users',
      name: 'Users',
      Component: Users,
    },
    {
      path: '/projects/:projectId/fish-families',
      name: 'Fish Families',
      Component: FishFamilies,
    },
    {
      path: '/projects/:projectId/data-sharing',
      name: 'Data Sharing',
      Component: DataSharing,
    },
  ]

  return { routes }
}
