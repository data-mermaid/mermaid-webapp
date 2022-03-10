import React from 'react'
import { getObjectById } from './getObjectById'

const transectName = {
  fishbelt_transect: 'Fish Belt',
}

export const getSubmittedRecordOrCollectRecordName = (recordData, sites, transect_type) => {
  const recordSiteId = recordData?.sample_event?.site
  const siteName = getObjectById(sites, recordSiteId)?.name ?? ''
  const transectNumber = recordData[transect_type]?.number ?? ''
  const label = recordData[transect_type]?.label ?? ''
  const defaultName = transectName[transect_type]

  if (!siteName && !transectNumber && !label) {
    return <>{defaultName}</>
  }
  if (!transectNumber && !label) {
    return <>{siteName}</>
  }
  if (!siteName) {
    return (
      <>
        {transectNumber} ${label}
      </>
    )
  }

  return (
    <>
      <span>{siteName}</span>
      {transectNumber} {label}
    </>
  )
}
