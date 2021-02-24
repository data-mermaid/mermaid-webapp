import React from 'react'
import { useParams } from 'react-router-dom'
import SubLayout2 from '../../SubLayout2'
import CollectingNav from '../../CollectingNav'
import InputSelect from '../../generic/InputSelect'
import InputNumber from '../../generic/InputNumber'
import { ButtonCallout } from '../../generic/buttons'
import { RowRight } from '../../generic/positioning'
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
      <InputNumber label="Depth" value={result.depth} />
    </>
  )
}

const CollectRecord = ({ apiService }) => {
  const saveRecord = () => {
    console.log('click save')
  }

  return (
    <SubLayout2
      lowerLeft={<CollectingNav />}
      lowerRight={<CollectBody apiService={apiService} />}
      upperRight={
        <RowRight>
          <ButtonCallout onClick={saveRecord}>Save</ButtonCallout>
        </RowRight>
      }
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
