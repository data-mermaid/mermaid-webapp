import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { InlineCell, Table } from '../../generic/Table/table'
import TableRowItem from '../../generic/Table/TableRowItem'
import { getSampleDateLabel } from '../../../App/mermaidData/getSampleDateLabel'
import {
  TooltipText,
  PopupLink,
  SampleUnitNumber,
  SampleUnitPopup,
} from '../SampleUnitPopups.styles'
import { API_NULL_NAME } from '../../../library/constants/constants'

const SubmittedSampleUnitPopup = ({ rowRecord, sampleUnitNumbersRow }) => {
  const { t } = useTranslation()
  const currentProjectPath = useCurrentProjectPath()
  const { sample_unit_method, sample_unit_protocol, site_name } = rowRecord
  const popupTitle = `${sample_unit_method} ${site_name}`

  const sampleUnitsWithPopup = sampleUnitNumbersRow.map((row, index) => {
    const { label: transectNumberLabel, management, sample_date, updated_by, observers, id } = row

    const managementName =
      management.name === API_NULL_NAME ? t('management_regimes.missing_mr_name') : management.name

    const keyName = transectNumberLabel + site_name + managementName + updated_by + sample_date + id

    return (
      <SampleUnitNumber tabIndex="0" id={index} key={keyName}>
        {transectNumberLabel}
        <SampleUnitPopup role="tooltip">
          <TooltipText>
            {popupTitle} {transectNumberLabel}
          </TooltipText>
          <Table>
            <tbody>
              <TableRowItem title={t('sample_units.last_edited_by')} value={updated_by} />
              <TableRowItem title={t('sample_units.observers')} value={observers?.join(',')} />
              <TableRowItem title={t('sites.site')} value={site_name} />
              <TableRowItem title={t('management_regimes.management')} value={managementName} />
              <TableRowItem
                title={t('sample_units.sample_date')}
                value={getSampleDateLabel(sample_date)}
              />
            </tbody>
          </Table>
          <PopupLink to={`${currentProjectPath}/submitted/${sample_unit_protocol}/${row.id}`}>
            {t('sample_units.view_submitted')}
          </PopupLink>
        </SampleUnitPopup>
        {index < sampleUnitNumbersRow.length - 1 && ' '}
      </SampleUnitNumber>
    )
  })

  return <InlineCell>{sampleUnitsWithPopup}</InlineCell>
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
