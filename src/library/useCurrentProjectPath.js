import { useParams } from 'react-router-dom'

const useCurrentProjectPath = () => {
  const params = useParams()
  const projectUrl = `/projects/${params.projectId}`

  return projectUrl
}

export default useCurrentProjectPath
