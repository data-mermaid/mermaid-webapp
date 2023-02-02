import PropTypes from 'prop-types'
import React from 'react'

import { EmptyCellPopup } from '../SampleUnitPopups.styles'
import language from '../../../language'

const EmptySampleUnitPopup = ({ tableCellData, collectRecordsByProfile }) => {
  const {
    column: { Header },
    row: { values },
  } = tableCellData

  const filterProfileValues = Object.entries(values).filter((rowValue) => {
    return rowValue[1]?.props?.recordProfileSummary
  })

  const matchedProfileNamesFromCollectRecords = filterProfileValues.filter((value) => {
    return value[1]?.props?.recordProfileSummary?.collect_records.filter(
      (profileLabel) => profileLabel?.name === Header,
    ).length
  })

  if (matchedProfileNamesFromCollectRecords.length) {
    const profileNames = matchedProfileNamesFromCollectRecords
      .map((profile) => collectRecordsByProfile[profile[0]].profileName)
      .join(', ')

    return (
      <EmptyCellPopup>
        <div>
          In Collecting With: <strong>{profileNames}</strong>
        </div>
      </EmptyCellPopup>
    )
  }

  return (
    <EmptyCellPopup>
      <div>{language.popoverTexts.noSampleUnitMatch}</div>
      <h4>{Header}</h4>
      <h4>{values.method}</h4>
      <h4>{values.site}</h4>
    </EmptyCellPopup>
  )
}

EmptySampleUnitPopup.propTypes = {
  tableCellData: PropTypes.shape({
    column: PropTypes.shape({
      Header: PropTypes.string,
    }),
    row: PropTypes.shape({
      values: PropTypes.shape({
        method: PropTypes.string,
        site: PropTypes.string,
      }),
    }),
  }).isRequired,
  collectRecordsByProfile: PropTypes.shape({}).isRequired,
}

export default EmptySampleUnitPopup
