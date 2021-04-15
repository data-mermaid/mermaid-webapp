import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '../generic/text'
import { getProtocolName } from '../../library/getProtocolName'
import { getObjectById } from '../../library/getObjectById'
import {
  fishBeltPropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'

const CollectRecordFormTitle = ({ collectRecordData, sites }) => {
  const collectRecordTitle = []

  const siteId = collectRecordData?.sample_event?.site
  const transectType =
    collectRecordData.protocol === 'fishbelt' ? 'fishbelt_transect' : ''

  const defaultTitle =
    getProtocolName(collectRecordData.protocol) || 'Fish Belt'
  const siteName =
    siteId && sites.length > 0 ? getObjectById(sites, siteId).name : ''
  const transectNumber = collectRecordData[transectType]?.number || ''
  const label = collectRecordData[transectType]?.label || ''

  if (siteName !== '') collectRecordTitle.push(siteName)
  if (transectNumber !== '') collectRecordTitle.push(transectNumber)
  if (label !== '') collectRecordTitle.push(label)

  const collectRecordTitleText =
    collectRecordTitle.length === 0
      ? defaultTitle
      : collectRecordTitle.join(' - ')

  return <H2 id="collect-form-title">{collectRecordTitleText}</H2>
}

CollectRecordFormTitle.propTypes = {
  collectRecordData: fishBeltPropType,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

CollectRecordFormTitle.defaultProps = {
  collectRecordData: {},
}

export default CollectRecordFormTitle
