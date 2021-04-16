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

  const siteId = collectRecord.data?.sample_event?.site
  const transectType =
    collectRecord.data?.protocol === 'fishbelt' ? 'fishbelt_transect' : ''

  const defaultTitle =
    getProtocolName(collectRecord.data?.protocol) || 'Fish Belt'
  const siteName =
    siteId && sites.length > 0 ? getObjectById(sites, siteId).name : ''
  const transectNumber = collectRecord.data?.[transectType]?.number || ''
  const label = collectRecord.data?.[transectType]?.label || ''

  if (siteName !== '') collectRecordTitle.push(siteName)
  if (transectNumber !== '') collectRecordTitle.push(transectNumber)
  if (label !== '') collectRecordTitle.push(label)

  const collectRecordTitleText =
    collectRecordTitle.length === 0
      ? defaultTitle
      : collectRecordTitle.join(' - ')

  return <H2 id="collect-form-title">{collectRecordTitleText}</H2>
}

EditCollectRecordFormTitle.propTypes = {
  collectRecord: fishBeltPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

export default EditCollectRecordFormTitle
