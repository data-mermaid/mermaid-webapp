import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import SubLayout2 from '../../SubLayout2'
import CollectingNav from '../../CollectingNav'
import InputSelect from '../../generic/InputSelect'
import { fetchCollectRecord } from '../../../ApiServices/fetchApiService'
import { mermaidApiServicePropType } from '../../../ApiServices/useMermaidApi'

/**
 * Describe your component
 */

// this will be a separate component soon...
const CollectBody = ({ apiService }) => {
  const { sites, managementRegimes } = apiService
  const { recordId } = useParams()
  const result = fetchCollectRecord(recordId)[0]

  return (
    <>
      <InputSelect
        key="sites"
        label="Site"
        options={sites}
        value={result.site}
      />
      <InputSelect
        key="managementRegimes"
        label="Management Regime"
        value={result.management_regime}
        options={managementRegimes}
      />
    </>
  )
}

const CollectRecord = ({ apiService }) => {
  return (
    <SubLayout2
      lowerLeft={<CollectingNav />}
      lowerRight={<CollectBody apiService={apiService} />}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

CollectBody.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

CollectRecord.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

export default CollectRecord
