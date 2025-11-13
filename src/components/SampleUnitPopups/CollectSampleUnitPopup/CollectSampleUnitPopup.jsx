import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { InlineCell, Table } from '../../generic/Table/table'
import TableRowItem from '../../generic/Table/TableRowItem'
import { getSampleDateLabel } from '../../../App/mermaidData/getSampleDateLabel'
import {
  TooltipSampleUnitStatus,
  SampleUnitNumber,
  SampleUnitPopup,
  TooltipText,
} from '../SampleUnitPopups.styles'
import { sortArray } from '../../../library/arrays/sortArray'
import { API_NULL_NAME } from '../../../library/constants/constants'

const toKebabCase = (str) => {
  if (str == null) {
    return ''
  }

  return str.toString().toLowerCase().replace(/\s+/g, '-').trim()
}

const CollectSampleUnitPopup = ({ rowRecord, recordProfileSummary }) => {
  const { t } = useTranslation()
  const { sample_unit_method, site_name } = rowRecord
  const { profile_name, collect_records } = recordProfileSummary

  const sampleUnitsWithPopup = sortArray(collect_records).map((record, index) => {
    const { name, sample_date, observers, management_name } = record

    const popupTitle = `${sample_unit_method} ${name}`
    const transectNumberLabel = name || t('sample_units.missing_label_number')

    const managementName =
      management_name === API_NULL_NAME ? t('management_regimes.missing_mr_name') : management_name

    const keyName = [
      toKebabCase(transectNumberLabel),
      toKebabCase(site_name),
      toKebabCase(managementName),
      toKebabCase(profile_name),
      toKebabCase(sample_date),
      index,
    ].join('-')

    return (
      <SampleUnitNumber tabIndex="0" id={index} key={keyName}>
        {transectNumberLabel}
        <SampleUnitPopup role="tooltip">
          <TooltipText>{popupTitle}</TooltipText>
          <Table>
            <tbody>
              <TableRowItem title={t('sample_units.last_edited_by')} value={profile_name} />
              <TableRowItem title={t('sample_units.observers')} value={observers?.join(',')} />
              <TableRowItem title={t('sites.site')} value={site_name} />
              <TableRowItem title={t('management_regimes.management')} value={managementName} />
              <TableRowItem
                title={t('sample_units.sample_date')}
                value={getSampleDateLabel(sample_date)}
              />
            </tbody>
          </Table>
          <TooltipSampleUnitStatus>{t('sample_units.not_submitted')}</TooltipSampleUnitStatus>
        </SampleUnitPopup>
        {index < recordProfileSummary.collect_records.length - 1 && ' '}
      </SampleUnitNumber>
    )
  })

  return <InlineCell>{sampleUnitsWithPopup}</InlineCell>
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
