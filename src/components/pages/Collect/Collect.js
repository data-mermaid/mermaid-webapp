import React from 'react'
import { Link } from 'react-router-dom'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import SubLayout2 from '../../SubLayout2'
import { mermaidDataPropType } from '../../../library/mermaidData/useMermaidData'
import NavMenu from '../../NavMenu'
import { H3 } from '../../generic/text'

/**
 * Project Collect Page
 */
const Collect = ({ apiService }) => {
  const currentProjectPath = useCurrentProjectPath()
  const { collectRecords } = apiService

  const CollectRecordList = () => {
    return (
      <>
        <H3>Collect Records</H3>
        {collectRecords.map(({ id, method, data }) => (
          <div key={id}>
            <Link
              to={`${currentProjectPath}/collecting/${data.protocol}/${id}`}
            >
              {method}
            </Link>
          </div>
        ))}
      </>
    )
  }

  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={<CollectRecordList />}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

Collect.propTypes = {
  apiService: mermaidDataPropType.isRequired,
}

export default Collect
