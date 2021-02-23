import React from 'react'
import { Link } from 'react-router-dom'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import SubLayout2 from '../../SubLayout2'
import { mermaidApiServicePropType } from '../../../ApiServices/useMermaidApi'
import CollectingNav from '../../CollectingNav'

/**
 * Project Collect Page
 */
const Collect = ({ apiService }) => {
  const currentProjectPath = useCurrentProjectPath()
  const { collectRecords } = apiService

  const collectRecordList = collectRecords.map(({ id, method, data }) => (
    <div key={id}>
      <Link to={`${currentProjectPath}/collecting/${data.protocol}/${id}`}>
        {method}
      </Link>
    </div>
  ))

  return (
    <SubLayout2
      lowerLeft={<CollectingNav />}
      lowerRight={collectRecordList}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

Collect.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

export default Collect
