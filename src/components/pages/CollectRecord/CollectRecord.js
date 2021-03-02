import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import SubLayout2 from '../../SubLayout2'
import NavMenu from '../../NavMenu'
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
const CollectBody = ({ collectRecord, apiService, handleInputChange }) => {
  const { sites, managementRegimes } = apiService
  const { site, management, depth } = collectRecord

  return (
    <>
      <InputSelect
        key="sites"
        inputName="site"
        label="Site"
        value={site}
        options={sites}
        handleInputChange={handleInputChange}
      />
      <InputSelect
        key="managementRegimes"
        inputName="management"
        label="Management Regime"
        value={management}
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
      lowerLeft={<NavMenu />}
      lowerRight={
        <CollectBody
          collectRecord={collectRecord}
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

CollectBody.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  collectRecord: PropTypes.shape({
    site: PropTypes.string.isRequired,
    management: PropTypes.string.isRequired,
    depth: PropTypes.number.isRequired,
  }).isRequired,
}

CollectRecord.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

export default CollectRecord
