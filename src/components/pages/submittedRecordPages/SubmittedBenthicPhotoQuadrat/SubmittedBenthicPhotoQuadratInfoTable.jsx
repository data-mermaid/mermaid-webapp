import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  managementRegimePropType,
  sitePropType,
  choicesPropType,
  submittedBenthicPhotoQuadratPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../../generic/Table/table'
import TableRowItem from '../../../generic/Table/TableRowItem/TableRowItem'

const SubmittedBenthicPhotoQuadratInfoTable = ({
  sites,
  managementRegimes,
  choices,
  submittedRecord = undefined,
}) => {
  const { t } = useTranslation()
  const { site, management, sample_date } = submittedRecord.sample_event

  const {
    sample_time,
    depth,
    number,
    label,
    len_surveyed,
    quadrat_number_start,
    quadrat_size,
    num_quadrats,
    num_points_per_quadrat,
    visibility,
    current,
    relative_depth,
    tide,
    notes,
  } = submittedRecord.quadrat_transect

  const { visibilities, currents, relativedepths, tides } = choices

  return (
    <Table>
      <tbody>
        <TableRowItem title={t('sites.site')} options={sites} value={site} isLink={true} />
        <TableRowItem
          title={t('management_regimes.management')}
          options={managementRegimes}
          value={management}
          isLink={true}
        />
        <TableRowItem
          title={t('sample_units.sample_date_time')}
          value={`${sample_date} ${sample_time || ''}`}
        />
        <TableRowItem
          title={`${t('sample_units.depth')} (${t('measurements.meter')})`}
          value={depth}
        />
        <TableRowItem title={t('transect_number')} value={number} />
        <TableRowItem title={t('label')} value={label} />
        <TableRowItem
          title={`${t('sample_units.transect_length_surveyed')} (${t('measurements.meter')})`}
          value={len_surveyed}
        />
        <TableRowItem title={t('observations.quadrat_number_start')} value={quadrat_number_start} />
        <TableRowItem
          title={`${t('quadrat_size')} (${t('measurements.meter')}²)`}
          value={quadrat_size}
        />
        <TableRowItem title={t('observations.number_of_quadrats')} value={num_quadrats} />
        <TableRowItem
          title={t('observations.number_of_points_per_quadrat')}
          value={num_points_per_quadrat}
        />
        <TableRowItem title={t('visibility')} options={visibilities.data} value={visibility} />
        <TableRowItem title={t('current')} options={currents.data} value={current} />
        <TableRowItem
          title={t('relative_depth')}
          options={relativedepths.data}
          value={relative_depth}
        />
        <TableRowItem title={t('tide')} options={tides.data} value={tide} />
        <TableRowItem title={t('notes')} value={notes} isAllowNewlines={true} />
      </tbody>
    </Table>
  )
}

SubmittedBenthicPhotoQuadratInfoTable.propTypes = {
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  choices: choicesPropType.isRequired,
  submittedRecord: submittedBenthicPhotoQuadratPropType,
}

export default SubmittedBenthicPhotoQuadratInfoTable
