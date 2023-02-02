import PropTypes from 'prop-types'
import React from 'react'

import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { InlineCell, Table } from '../../generic/Table/table'
import TableRowItem from '../../generic/Table/TableRowItem'
import { getSampleDateLabel } from '../../../App/mermaidData/getSampleDateLabel'
import { PopupLink, SampleUnitNumber, SampleUnitPopup } from '../SampleUnitPopups.styles'
import language from '../../../language'

const SubmittedSampleUnitPopup = ({ rowRecord, sampleUnitNumbersRow }) => {
  const currentProjectPath = useCurrentProjectPath()
  const { sample_unit_method, sample_unit_protocol, site_name } = rowRecord
  const SiteTitle = `${sample_unit_method} ${site_name}`

  const sampleUnitLinks = sampleUnitNumbersRow.map((row, idx) => {
    const { label, management, sample_date, updated_by, observers } = row

    return (
      <SampleUnitNumber tabIndex="0" id={idx}>
        {label}
        <SampleUnitPopup role="tooltip">
          <div>
            {SiteTitle} {label}
          </div>
          <Table>
            <tbody>
              <TableRowItem title="Last edited by" value={updated_by} />
              <TableRowItem title="Observers" value={observers.join(',')} />
              <TableRowItem title="Site" value={site_name} />
              <TableRowItem title="Management" value={management.name} />
              <TableRowItem title="Date" value={getSampleDateLabel(sample_date)} />
            </tbody>
          </Table>
          <PopupLink to={`${currentProjectPath}/submitted/${sample_unit_protocol}/${row.id}`}>
            {language.popoverTexts.viewSubmittedSampleUnit}
          </PopupLink>
        </SampleUnitPopup>
        {idx < sampleUnitNumbersRow.length - 1 && ','}
      </SampleUnitNumber>
    )
  })

  return <InlineCell>{sampleUnitLinks}</InlineCell>
}

SubmittedSampleUnitPopup.propTypes = {
  rowRecord: PropTypes.shape({
    sample_unit_method: PropTypes.string,
    sample_unit_protocol: PropTypes.string,
    site_name: PropTypes.string,
    updated_by: PropTypes.string,
    observers: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  sampleUnitNumbersRow: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
}

export default SubmittedSampleUnitPopup
