import PropTypes from 'prop-types'
import React from 'react'

import { InlineCell, Table } from '../../generic/Table/table'
import TableRowItem from '../../generic/Table/TableRowItem'
import { getSampleDateLabel } from '../../../App/mermaidData/getSampleDateLabel'
import { SampleUnitNumber, SampleUnitPopup } from '../SampleUnitPopups.styles'
import language from '../../../language'
import { sortArray } from '../../../library/arrays/sortArray'
import { getName } from '../../../library/strings/nameHelpers'

const CollectSampleUnitPopup = ({ rowRecord, recordProfileSummary }) => {
  const { sample_unit_method, site_name } = rowRecord
  const { profile_name, collect_records } = recordProfileSummary

  const sampleUnitLinks = sortArray(collect_records).map((record, idx) => {
    const { name, sample_date, observers, management_name } = record
    const popupTitle = `${sample_unit_method} ${name}`

    const transectNumberLabel = name || language.pages.usersAndTransectsTable.missingLabelNumber
    const managementName = getName(
      management_name,
      language.pages.usersAndTransectsTable.missingMRName,
    )

    return (
      <SampleUnitNumber tabIndex="0" id={idx}>
        {transectNumberLabel}
        <SampleUnitPopup role="tooltip"> 
          <div>{popupTitle}</div>
          <Table>
            <tbody>
              <TableRowItem title="Last edited by" value={profile_name} />
              <TableRowItem title="Observers" value={observers.join(',')} />
              <TableRowItem title="Site" value={site_name} />
              <TableRowItem title="Management" value={managementName} />
              <TableRowItem title="Date" value={getSampleDateLabel(sample_date)} />
            </tbody>
          </Table>
          <div>{language.popoverTexts.notSubmittedSampleUnit}</div>
        </SampleUnitPopup>
        {idx < recordProfileSummary.collect_records.length - 1 && ','}
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
    management_name: PropTypes.string,
  }).isRequired,
  recordProfileSummary: PropTypes.shape({
    profile_name: PropTypes.string,
    collect_records: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string, sample_date: PropTypes.string }),
    ),
  }).isRequired,
}

export default CollectSampleUnitPopup
