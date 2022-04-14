

export const getDuplicateSampleUnitErrorMessage = (duplicateSampleUnitContext) => {
  const { projectId } = useParams()

  const linkToSubmitRecord = `/projects/${projectId}/data/fishbelt/${duplicateSampleUnitContext}`

  return (
    <div>
      <span>
        Duplicate sample unit <a href={linkToSubmitRecord}>{duplicateSampleUnitContext}</a> should
        be link to sample unit page
      </span>
    </div>
  )
}
