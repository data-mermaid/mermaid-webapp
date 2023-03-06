export const getProjectId = ({ routerLocation }) => {
  const { pathname } = routerLocation

  const pathNameParts = pathname.split('/')

  const projectId = pathNameParts[pathNameParts.indexOf('projects') + 1]

  return projectId
}
