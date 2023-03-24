export const getProjectIdFromLocation = (location) => {
  const { pathname } = location
  const pathNameParts = pathname.split('/')
  const indexOfProjects = pathNameParts.indexOf('projects')
  const isAProjectRelatedRoute = indexOfProjects !== -1

  if (!isAProjectRelatedRoute) {
    // I added this part
    return null
  }

  const projectId = pathNameParts[indexOfProjects + 1]

  return projectId
}
