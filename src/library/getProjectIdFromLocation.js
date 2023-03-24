export const getProjectIdFromLocation = (location) => {
  const { pathname } = location
  const pathNameParts = pathname.split('/')
  const isAProjectPage = pathNameParts[1] === 'projects' && pathNameParts.length > 2
  const projectId = pathNameParts[2]

  if (!isAProjectPage) {
    return null
  }

  return projectId
}
