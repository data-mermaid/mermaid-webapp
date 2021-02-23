import React from 'react'
import SubLayout2 from '../../SubLayout2'
import CollectingNav from '../../CollectingNav'
import SelectInputForm from '../../generic/SelectInputForm'
import { mermaidApiServicePropType } from '../../../ApiServices/useMermaidApi'

/**
 * Describe your component
 */

// this will be a separate component soon...
const CollectBody = ({ apiData }) => {
  const { sites, managementRegimes } = apiData

  return (
    <>
      <SelectInputForm key="sites" label="Site" options={sites} />
      <SelectInputForm
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
      lowerRight={<CollectBody apiData={apiService} />}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

CollectRecord.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

export default CollectRecord
