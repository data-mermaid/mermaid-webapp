import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components/macro'

import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import { InlineCell, Table, Td, Th, Tr } from '../generic/Table/table'
import theme from '../../theme'
import TableRowItem from '../generic/Table/TableRowItem'
import { getSampleDateLabel } from '../../App/mermaidData/getSampleDateLabel'

const SampleUnitNumber = styled('span')`
  white-space: nowrap;
  border-style: dotted;
  border-width: 0 0 ${theme.spacing.borderMedium} 0;
  position: relative;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
  &:hover span,
  &:focus span {
    transition: ${theme.timing.hoverTransition};
    display: block;
  }
`

const SampleUnitPopupInfo = styled('span')`
  display: none;
  width: 100%;
  min-width: 30ch;
  max-width: 60ch;
  background-color: ${theme.color.calloutColor};
  /* color: ${theme.color.primaryColor}; */
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  bottom: 3rem;
  white-space: normal;
  z-index: 100;
  border: 2px solid ${theme.color.primaryColor};
`

const PopupText = styled('div')`
  display: flex;
  justify-content: center;
  margin: 4px;
  font-size: ${theme.typography.smallFontSize};
`
const PopupLink = styled(Link)`
  display: flex;
  justify-content: center;
  margin: 4px;
  font-size: ${theme.typography.smallFontSize};
`

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
            View Submitted Sample Unit
          </PopupLink>
        </SampleUnitPopupInfo>
        {idx < sampleUnitNumbersRow.length - 1 && ', '}
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
