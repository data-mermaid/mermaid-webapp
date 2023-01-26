import PropTypes from 'prop-types'
import React from 'react'

import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { InlineCell, Table } from '../../generic/Table/table'
import TableRowItem from '../../generic/Table/TableRowItem'
import { getSampleDateLabel } from '../../../App/mermaidData/getSampleDateLabel'
import {
  PopupLink,
  PopupText,
  SampleUnitNumber,
  SampleUnitPopupInfo,
} from '../SampleUnitPopups.styles'
import language from '../../../language'

const SampleUnitPopup = ({ rowRecord, sampleUnitNumbersRow }) => {
  const currentProjectPath = useCurrentProjectPath()
  const { sample_unit_method, sample_unit_protocol, site_name } = rowRecord
  const SiteTitle = `${sample_unit_method} ${site_name}`

  const sampleUnitLinks = sampleUnitNumbersRow.map((row, idx) => {
    const { label, management, sample_date } = row

    return (
      <SampleUnitNumber tabIndex="0" id={idx}>
        {label}
        <SampleUnitPopupInfo role="tooltip">
          <PopupText>
            {SiteTitle} {label}
          </PopupText>
          <Table>
            <tbody>
              <TableRowItem title="Last edited by" value="" />
              <TableRowItem title="Observers" value="" />
              <TableRowItem title="Site" value={site_name} />
              <TableRowItem title="Management" value={management.name} />
              <TableRowItem title="Date" value={getSampleDateLabel(sample_date)} />
            </tbody>
          </Table>
          <PopupLink to={`${currentProjectPath}/submitted/${sample_unit_protocol}/${row.id}`}>
            {language.popoverTexts.viewSubmittedSampleUnit}
          </PopupLink>
        </SampleUnitPopupInfo>
        {idx < sampleUnitNumbersRow.length - 1 && ','}
      </SampleUnitNumber>
    )
  })

  return <InlineCell>{sampleUnitLinks}</InlineCell>
}

SampleUnitPopup.propTypes = {
  rowRecord: PropTypes.shape({
    sample_unit_method: PropTypes.string,
    sample_unit_protocol: PropTypes.string,
    site_name: PropTypes.string,
  }).isRequired,
  sampleUnitNumbersRow: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
}

export default SampleUnitPopup
