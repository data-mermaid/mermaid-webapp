export const getProjectIdFromLocation = (location) => {
  const { pathname } = location
  const pathNameParts = pathname.split('/')
  const indexOfProjects = pathNameParts.indexOf('projects')
  // const isAProjectsPath = indexOfProjects !== -1

  // if (!isAProjectRelatedRoute) {
  //   // I added this part
  //   return null
  // }

  //sloppy logic, projects list page still has /projects/

  // but below will show undfined on the projects list page thankfully

  const projectId = pathNameParts[indexOfProjects + 1]

  return projectId
}
