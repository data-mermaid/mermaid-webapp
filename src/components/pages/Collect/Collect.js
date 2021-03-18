import { Link } from 'react-router-dom'
import React from 'react'

import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import SubLayout2 from '../../SubLayout2'
import { mermaidDataPropType } from '../../../library/mermaidData/useMermaidData'
import { H3 } from '../../generic/text'
import { RowSpaceBetween } from '../../generic/positioning'

import AddSampleUnitButton from './AddSampleUnitButton'

const TopBar = () => (
  <>
    <H3>Collect Records</H3>
    <RowSpaceBetween>
      <div>Future filter</div> <AddSampleUnitButton />
    </RowSpaceBetween>
  </>
)

const CollectRecordList = ({ mermaidData }) => {
  const currentProjectPath = useCurrentProjectPath()
  const { collectRecords } = mermaidData

  return (
    <>
      {collectRecords.map(({ id, method, data }) => (
        <div key={id}>
          <Link to={`${currentProjectPath}/collecting/${data.protocol}/${id}`}>
            {method}
          </Link>
        </div>
      ))}
    </>
  )
}

CollectRecordList.propTypes = {
  mermaidData: mermaidDataPropType.isRequired,
}

const Collect = ({ mermaidData }) => {
  return (
    <SubLayout2
      content={<CollectRecordList mermaidData={mermaidData} />}
      toolbar={<TopBar />}
    />
  )
}

Collect.propTypes = {
  mermaidData: mermaidDataPropType.isRequired,
}

export default Collect
