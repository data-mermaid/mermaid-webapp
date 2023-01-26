import PropTypes from 'prop-types'
import React from 'react'

import { InlineCell, Table } from '../../generic/Table/table'
import TableRowItem from '../../generic/Table/TableRowItem'
import { getSampleDateLabel } from '../../../App/mermaidData/getSampleDateLabel'
import { PopupText, SampleUnitNumber, SampleUnitPopupInfo } from '../SampleUnitPopups.styles'
import language from '../../../language'
import { sortArray } from '../../../library/arrays/sortArray'

const CollectSampleUnitPopup = ({ rowRecord, recordProfileSummary }) => {
  const { sample_unit_method, site_name } = rowRecord

  const sampleUnitLinks = sortArray(recordProfileSummary.labels).map((row, idx) => {
    const { name, sample_date } = row

    const rowName = name || language.pages.usersAndTransectsTable.missingLabelNumber

    return (
      <SampleUnitNumber tabIndex="0" id={idx}>
        {rowName}
        <SampleUnitPopupInfo role="tooltip">
          <PopupText>
            {sample_unit_method} {name}
          </PopupText>
          <Table>
            <tbody>
              <TableRowItem title="Last edited by" value="" />
              <TableRowItem title="Observers" value="" />
              <TableRowItem title="Site" value={site_name} />
              <TableRowItem title="Management" value="" />
              <TableRowItem title="Date" value={getSampleDateLabel(sample_date)} />
            </tbody>
          </Table>
          <PopupText className="highlighted">
            {language.popoverTexts.notSubmittedSampleUnit}
          </PopupText>
        </SampleUnitPopupInfo>
        {idx < recordProfileSummary.labels.length - 1 && ','}
      </SampleUnitNumber>
    )
  })

  return <InlineCell>{sampleUnitLinks}</InlineCell>
}

CollectSampleUnitPopup.propTypes = {
  rowRecord: PropTypes.shape({
    sample_unit_method: PropTypes.string,
    sample_unit_protocol: PropTypes.string,
    site_name: PropTypes.string,
  }).isRequired,
  recordProfileSummary: PropTypes.shape({
    profile_name: PropTypes.string,
    labels: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string, sample_date: PropTypes.string }),
    ),
  }).isRequired,
}

export default CollectSampleUnitPopup
