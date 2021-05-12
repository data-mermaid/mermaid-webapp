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
import FishBelt from '../components/pages/collectRecordFormPages/FishBelt/FishBelt'

export const useRoutes = ({ databaseSwitchboardInstance }) => {
  const routes = [
    {
      path: '/projects',
      Component: () => (
        <Projects databaseSwitchboardInstance={databaseSwitchboardInstance} />
      ),
    },
    {
      path: '/projects/:projectId/health',
      Component: () => (
        <Health databaseSwitchboardInstance={databaseSwitchboardInstance} />
      ),
    },
    {
      path: '/projects/:projectId/collecting',
      Component: () => (
        <Collect databaseSwitchboardInstance={databaseSwitchboardInstance} />
      ),
    },
    {
      path: '/projects/:projectId/collecting/fishbelt',
      Component: () => (
        <FishBelt databaseSwitchboardInstance={databaseSwitchboardInstance} />
      ),
    },
    {
      path: '/projects/:projectId/collecting/fishbelt/:recordId',
      Component: () => (
        <FishBelt
          databaseSwitchboardInstance={databaseSwitchboardInstance}
          isNewRecord={false}
        />
      ),
    },
    {
      path: '/projects/:projectId/collecting/benthiclit/',
      Component: () => (
        <> Placeholder create benthic LIT collect record page </>
      ),
    },
    {
      path: '/projects/:projectId/collecting/benthiclit/:recordId',
      Component: () => <> Placeholder edit benthic LIT collect record page </>,
    },
    {
      path: '/projects/:projectId/collecting/benthicpit/',
      Component: () => (
        <> Placeholder create benthic PIT collect record page </>
      ),
    },
    {
      path: '/projects/:projectId/collecting/habitatcomplexity/',
      Component: () => (
        <> Placeholder create habitat complexity collect record page </>
      ),
    },
    {
      path: '/projects/:projectId/collecting/bleaching/',
      Component: () => <> Placeholder create bleaching collect record page </>,
    },
    {
      path: '/projects/:projectId/data',
      Component: () => (
        <Data databaseSwitchboardInstance={databaseSwitchboardInstance} />
      ),
    },
    {
      path: '/projects/:projectId/admin',
      Component: Admin,
    },

    {
      path: '/projects/:projectId/graphs-and-maps',
      Component: () => (
        <GraphsAndMaps databaseSwitchboardInstance={databaseSwitchboardInstance} />
      ),
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
