import { getProjectId } from './getProjectId'

const getIsProjectPage = ({ routerLocation }) => {
  const projectId = getProjectId({ routerLocation })

  const isProjectPage = !!projectId

  return isProjectPage
}

export { getIsProjectPage }
