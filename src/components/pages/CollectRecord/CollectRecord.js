import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import SubLayout2 from '../../SubLayout2'
import NavMenu from '../../NavMenu'
import InputSelect from '../../generic/InputSelect'
import InputNumber from '../../generic/InputNumber'
import { ButtonCallout } from '../../generic/buttons'
import { RowRight } from '../../generic/positioning'
import { mermaidApiServicePropType } from '../../../ApiServices/useMermaidApi'

/**
 * Describe your component
 */

// this will be a separate component soon...
const CollectBody = ({ collectRecord, sites, managementRegimes }) => {
  const { site, management, depth } = collectRecord

  return (
    <>
      <InputSelect key="sites" label="Site" options={sites} value={site} />
      <InputSelect
        key="managementRegimes"
        label="Management Regime"
        value={management}
        options={managementRegimes}
      />
      <InputNumber label="Depth" value={depth} />
    </>
  )
}

const CollectRecord = ({ apiService }) => {
  const { recordId } = useParams()
  const { collectRecords, sites, managementRegimes } = apiService

  const filterRecord = (record) =>
    collectRecords.filter(({ id }) => id === record)[0]

  const [curCollectRecord, setCurCollectRecord] = useState(
    filterRecord(recordId),
  )

  const saveRecord = () => {}

  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={
        <CollectBody
          collectRecord={curCollectRecord}
          sites={sites}
          managementRegimes={managementRegimes}
        />
      }
      upperRight={
        <RowRight>
          <ButtonCallout onClick={saveRecord}>Save</ButtonCallout>
        </RowRight>
      }
    />
  )
}

CollectBody.propTypes = {}

CollectRecord.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

export default CollectRecord
