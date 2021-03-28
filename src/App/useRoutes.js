import React from 'react'
import Admin from '../components/pages/Admin'
import Collect from '../components/pages/Collect'
import Data from '../components/pages/Data'
import DataSharing from '../components/pages/DataSharing'
import FishFamilies from '../components/pages/FishFamilies'
import GraphsAndMaps from '../components/pages/GraphsAndMaps'
import ManagementRegimes from '../components/pages/ManagementRegimes'
import Projects from '../components/pages/Projects'
import Sites from '../components/pages/Sites'
import Users from '../components/pages/Users'
import Health from '../components/pages/Health'
import NewFishBelt from '../components/pages/NewFishBelt'
import NewBenthicLit from '../components/pages/NewBenthicLit'
import NewBenthicPit from '../components/pages/NewBenthicPit'
import NewHabitatComplexity from '../components/pages/NewHabitatComplexity'
import NewBleaching from '../components/pages/NewBleaching'
import EditFishBelt from '../components/pages/EditfishBelt/EditFishBelt'

export const useRoutes = ({ mermaidDatabaseGatewayInstance }) => {
  const routes = [
    {
      path: '/projects',
      Component: () => (
        <Projects databaseGatewayInstance={mermaidDatabaseGatewayInstance} />
      ),
    },
    {
      path: '/projects/:projectId/health',
      Component: Health,
    },
    {
      path: '/projects/:projectId/collecting',
      Component: () => (
        <Collect
          mermaidDatabaseGatewayInstance={mermaidDatabaseGatewayInstance}
        />
      ),
    },
    {
      path: '/projects/:projectId/collecting/fishbelt',
      Component: () => <NewFishBelt />,
    },
    {
      path: '/projects/:projectId/collecting/fishbelt/:recordId',
      Component: () => (
        <EditFishBelt
          databaseGatewayInstance={mermaidDatabaseGatewayInstance}
        />
      ),
    },
    {
      path: '/projects/:projectId/collecting/benthiclit/',
      Component: () => <NewBenthicLit />,
    },
    {
      path: '/projects/:projectId/collecting/benthiclit/:recordId',
      Component: () => <> Placeholder edit benthic LIT collect record page </>,
    },
    {
      path: '/projects/:projectId/collecting/benthicpit/',
      Component: () => <NewBenthicPit />,
    },
    {
      path: '/projects/:projectId/collecting/habitatcomplexity/',
      Component: () => <NewHabitatComplexity />,
    },
    {
      path: '/projects/:projectId/collecting/bleaching/',
      Component: () => <NewBleaching />,
    },
    {
      path: '/projects/:projectId/data',
      Component: Data,
    },
    {
      path: '/projects/:projectId/admin',
      Component: Admin,
    },

    {
      path: '/projects/:projectId/graphs-and-maps',
      Component: GraphsAndMaps,
    },

    {
      path: '/projects/:projectId/sites/:workflow?',
      Component: Sites,
    },

    {
      path: '/projects/:projectId/management-regimes/:workflow?',
      Component: ManagementRegimes,
    },
    {
      path: '/projects/:projectId/users',
      Component: Users,
    },
    {
      path: '/projects/:projectId/fish-families',
      Component: FishFamilies,
    },
    {
      path: '/projects/:projectId/data-sharing',
      Component: DataSharing,
    },
  ]

  return { routes }
}
