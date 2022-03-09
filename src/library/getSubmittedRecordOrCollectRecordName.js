import React from 'react'
import { getObjectById } from './getObjectById'

export const getSubmittedRecordOrCollectRecordName = (recordData, sites, transect_type) => {
  const recordSiteId = recordData?.sample_event?.site
  const siteName = getObjectById(sites, recordSiteId)?.name ?? ''
  const transectNumber = recordData[transect_type]?.number ?? ''
  const label = recordData[transect_type]?.label ?? ''

  if (!(transectNumber || label)) {
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
