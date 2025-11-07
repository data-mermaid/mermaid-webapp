import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { EmptyCellPopup, TooltipText } from '../SampleUnitPopups.styles'

const EmptySampleUnitPopup = ({ tableCellData, collectRecordsByProfile }) => {
  const { t } = useTranslation()
  const {
    column: { Header },
    row: { values },
  } = tableCellData

  const recordProfileSummaryValues = Object.entries(values).filter((rowValue) => {
    return rowValue[1]?.props?.recordProfileSummary
  })

  const matchHeaderProfileNamesByCollectRecordProfileSummaries = recordProfileSummaryValues.filter(
    (value) => {
      return value[1]?.props?.recordProfileSummary?.collect_records.filter(
        (profileLabel) => profileLabel?.name === Header,
      ).length
    },
  )

  if (matchHeaderProfileNamesByCollectRecordProfileSummaries.length) {
    const profileNames = matchHeaderProfileNamesByCollectRecordProfileSummaries
      .map((profile) => collectRecordsByProfile[profile[0]].profileName)
      .join(', ')

    return (
      <EmptyCellPopup>
        <TooltipText>{t('in_collecting_with')}</TooltipText>
        <p>{profileNames}</p>
      </EmptyCellPopup>
    )
  }

  return (
    <EmptyCellPopup>
      <TooltipText>{t('sample_units.no_match')}</TooltipText>
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
