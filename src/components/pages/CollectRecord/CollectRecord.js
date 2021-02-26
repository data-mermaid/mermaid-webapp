import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import SubLayout2 from '../../SubLayout2'
import CollectingNav from '../../CollectingNav'
import InputSelect from '../../generic/InputSelect'
import InputNumber from '../../generic/InputNumber'
import { ButtonCallout } from '../../generic/buttons'
import { RowRight } from '../../generic/positioning'
import { fetchCollectRecord } from '../../../ApiServices/fetchApiService'
import { mermaidApiServicePropType } from '../../../ApiServices/useMermaidApi'
import { _save } from '../../../library/offlineTable'

/**
 * Describe your component
 */

// this will be a separate component soon...
const CollectBody = ({ result, apiService, handleInputChange }) => {
  const { sites, managementRegimes } = apiService
  const { site, management_regime, depth } = result

  return (
    <>
      <InputSelect
        key="sites"
        inputName="site"
        label="Site"
        options={sites}
        value={site}
        handleInputChange={handleInputChange}
      />
      <InputSelect
        key="managementRegimes"
        inputName="management_regime"
        label="Management Regime"
        value={management_regime}
        options={managementRegimes}
        handleInputChange={handleInputChange}
      />
      <InputNumber
        inputName="depth"
        label="Depth"
        value={depth}
        handleInputChange={handleInputChange}
      />
    </>
  )
}

const CollectRecord = ({ apiService }) => {
  const { recordId } = useParams()
  const result = fetchCollectRecord(recordId)[0]
  const [collectRecord, setCollectRecord] = useState(result)

  const handleInputChange = (e) => {
    const { name, value } = e.target

    const newValue = name === 'depth' ? parseInt(value, 10) : value

    setCollectRecord({ ...collectRecord, [name]: newValue })
  }

  const saveRecord = () => {
    _save('collect_records', collectRecord)
  }

  return (
    <SubLayout2
      lowerLeft={<CollectingNav />}
      lowerRight={
        <CollectBody
          result={collectRecord}
          apiService={apiService}
          handleInputChange={handleInputChange}
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

CollectRecord.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

export default CollectRecord
