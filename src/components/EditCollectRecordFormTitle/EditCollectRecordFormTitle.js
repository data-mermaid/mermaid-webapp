import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '../generic/text'
import { getProtocolName } from '../../library/getProtocolName'
import { getObjectById } from '../../library/getObjectById'
import {
  fishBeltPropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'

const EditCollectRecordFormTitle = ({ collectRecord, sites }) => {
  const collectRecordTitle = []

  const collectRecordData = collectRecord.data
  const siteId = collectRecordData.sample_event?.site
  const collectRecordProtocol = collectRecordData.protocol

  const transectType =
    collectRecordProtocol === 'fishbelt' ? 'fishbelt_transect' : ''

  const defaultTitle = getProtocolName(collectRecordProtocol) || 'Fish Belt'
  const siteName =
    siteId && sites.length > 0 ? getObjectById(sites, siteId).name : ''
  const transectNumber = collectRecordData[transectType]?.number || ''
  const label = collectRecordData[transectType]?.label || ''

  collectRecordTitle.push(defaultTitle)

  if (siteName !== '') collectRecordTitle.push(siteName)
  if (transectNumber !== '') collectRecordTitle.push(transectNumber)
  if (label !== '') collectRecordTitle.push(label)

  const collectRecordTitleText = collectRecordTitle.join(' ')

  return <H2 id="collect-form-title">{collectRecordTitleText}</H2>
}

EditCollectRecordFormTitle.propTypes = {
  collectRecord: fishBeltPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

export default EditCollectRecordFormTitle
