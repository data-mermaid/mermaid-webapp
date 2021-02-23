import React from 'react'
import SubLayout2 from '../../SubLayout2'
import CollectingNav from '../../CollectingNav'
import InputSelect from '../../generic/InputSelect'
import { mermaidApiServicePropType } from '../../../ApiServices/useMermaidApi'

/**
 * Describe your component
 */

// this will be a separate component soon...
const CollectBody = ({ apiService }) => {
  const { sites, managementRegimes } = apiService

  return (
    <>
      <InputSelect key="sites" label="Site" options={sites} />
      <InputSelect
        key="managementRegimes"
        label="Management Regime"
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
