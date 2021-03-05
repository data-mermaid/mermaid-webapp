import React, { useState } from 'react'
import PropTypes from 'prop-types'
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
const CollectBody = ({
  collectRecord,
  sites,
  managementRegimes,
  handleInputChange,
}) => {
  const { site, management, depth } = collectRecord

  return (
    <>
      <InputSelect
        name="site"
        label="Site"
        options={sites}
        value={site}
        onChange={handleInputChange}
      />
      <InputSelect
        name="management"
        label="Management Regime"
        value={management}
        options={managementRegimes}
        onChange={handleInputChange}
      />
      <InputNumber
        name="depth"
        label="Depth"
        value={depth}
        onChange={handleInputChange}
      />
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

  const handleInputChange = (e) => {
    const { name, value } = e.target

    const newValue = name === 'depth' ? parseInt(value, 10) : value

    setCurCollectRecord({ ...curCollectRecord, [name]: newValue })
  }

  const saveRecord = () => {}

  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={
        <CollectBody
          collectRecord={curCollectRecord}
          sites={sites}
          managementRegimes={managementRegimes}
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
  collectRecord: PropTypes.shape({
    site: PropTypes.string,
    management: PropTypes.string,
    depth: PropTypes.number,
  }).isRequired,
  sites: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
  managementRegimes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ).isRequired,
  handleInputChange: PropTypes.func.isRequired,
}

CollectRecord.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

export default CollectRecord
