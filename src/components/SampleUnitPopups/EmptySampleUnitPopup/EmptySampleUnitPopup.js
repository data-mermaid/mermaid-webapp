import PropTypes from 'prop-types'
import React from 'react'

import { EmptyCellPopup } from '../SampleUnitPopups.styles'
import language from '../../../language'

const EmptySampleUnitPopup = ({ tableCellData, collectRecordsByProfile }) => {
  const {
    column: { Header },
    row: { values },
  } = tableCellData

  const filterRowValues = Object.entries(values).filter((rowValue) => {
    return typeof rowValue[1] === 'string' && rowValue[1].split(',').includes(Header)
  })

  if (filterRowValues.length) {
    const profileNames = filterRowValues
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
