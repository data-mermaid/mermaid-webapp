import Collect from './components/pages/Collect'
import Details from './components/pages/Details'
import Projects from './components/pages/Projects'

const routes = [
  { path: '/projects', name: 'Projects', Component: Projects },
  { path: '/projects/:projectId', name: 'Project Details', Component: Details },
  {
    path: '/projects/:projectId/collect',
    name: 'Collect',
    Component: Collect,
  },
]

const _getContainingRoutes = (reactRouterRenderProps) =>
  routes.filter((route) => {
    return reactRouterRenderProps.match.path.includes(route.path)
  })

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

export { routes as default, getBreadCrumbs }
