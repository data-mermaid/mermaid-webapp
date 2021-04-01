import React from 'react'
import styled from 'styled-components/macro'

import CollectRecordFormTitle from '.'

export default {
  title: 'CollectRecordFormTitle',
  component: CollectRecordFormTitle,
}

export const fullTitle = () => {
  const collectRecordData = {
    siteVal: 'Site Name',
    transectVal: 'Number',
    labelVal: 'Label',
  }

  return (
    <CollectRecordFormTitle
      siteVal={collectRecordData.siteVal}
      transectVal={collectRecordData.transectVal}
      labelVal={collectRecordData.labelVal}
    />
  )
}

export const missingValTitle = () => {
  const collectRecordData = {
    transectVal: 'Number',
    labelVal: 'Label',
  }

  return (
    <CollectRecordFormTitle
      transectVal={collectRecordData.transectVal}
      labelVal={collectRecordData.labelVal}
    />
  )
}

export const showMethodOnlyTitle = () => {
  const collectRecordData = {
    protocol: 'Fish Belt',
  }

  return <CollectRecordFormTitle protocol={collectRecordData.protocol} />
}
