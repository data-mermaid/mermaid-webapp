import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '../generic/text'

const CollectRecordFormTitle = ({
  protocol,
  siteName,
  transectName,
  labelName,
}) => {
  const collectRecordTitle = []

  if (siteName !== '') collectRecordTitle.push(siteName)
  if (transectName !== '') collectRecordTitle.push(transectName)
  if (labelName !== '') collectRecordTitle.push(labelName)

  const collectRecordTitleText =
    collectRecordTitle.length === 0 ? protocol : collectRecordTitle.join(' - ')

  return <H2 id="fishbelt-form-title">{collectRecordTitleText}</H2>
}

CollectRecordFormTitle.propTypes = {
  protocol: PropTypes.string,
  siteName: PropTypes.string,
  transectName: PropTypes.string,
  labelName: PropTypes.string,
}

CollectRecordFormTitle.defaultProps = {
  protocol: '',
  siteName: '',
  transectName: '',
  labelName: '',
}

export default CollectRecordFormTitle
