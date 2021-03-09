import React from 'react'
import Admin from '../components/pages/Admin'
import Collect from '../components/pages/Collect'
import CollectRecord from '../components/pages/CollectRecord'
import Data from '../components/pages/Data'
import DataSharing from '../components/pages/DataSharing'
import Details from '../components/pages/Details'
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
      path: '/projects/:projectId',
      name: 'Project Details',
      Component: Details,
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

  const _getContainingRoutes = (reactRouterRenderProps) => {
    // adding a slash to the matchee and matcher makes sure partial words dont get matched and extra crumbs dont get generated
    // EG data-sharing matches the data route and creates an extra data crumb without this fix
    const reactRouterMatchPathWithEndingSlashForBetterFiltering = `${reactRouterRenderProps.match.path}/`

    return routes.filter((route) => {
      return reactRouterMatchPathWithEndingSlashForBetterFiltering.includes(
        `${route.path}/`,
      )
    })
  }
  const _generateUrlsWithParameterValues = (
    originalRoutePath,
    reactRouterRenderProps,
  ) => {
    const parameterNames = Object.keys(reactRouterRenderProps.match.params)

    return parameterNames.reduce(
      (accumulatorString, parameterName) =>
        accumulatorString.replace(
          `:${parameterName}`,
          reactRouterRenderProps.match.params[parameterName],
        ),
      originalRoutePath,
    )
  }
  const getBreadCrumbs = (reactRouterRenderProps) => {
    const containingRoutes = _getContainingRoutes(reactRouterRenderProps)
    const parameterNames = Object.keys(reactRouterRenderProps.match.params)
    const hasParameters = parameterNames.length

    const crumbs = containingRoutes.map(
      ({ path: originalRoutePath, ...restOfRouteProperties }) => ({
        path: hasParameters
          ? _generateUrlsWithParameterValues(
              originalRoutePath,
              reactRouterRenderProps,
            )
          : originalRoutePath,
        ...restOfRouteProperties,
      }),
    )

    return crumbs
  }

  return { routes, getBreadCrumbs }
}
