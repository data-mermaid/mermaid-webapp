import { RECORD_STATUS_LABELS } from './collectConstants'
import { Tr } from '../../generic/Table/table'
import styled from 'styled-components'
import theme from '../../../theme'

const RECORD_STATUS_COLORS = {
  [RECORD_STATUS_LABELS.error]: theme.color.cautionColor,
  [RECORD_STATUS_LABELS.ok]: '#298217',
  [RECORD_STATUS_LABELS.stale]: theme.color.primaryColor,
  [RECORD_STATUS_LABELS.warning]: theme.color.warningColor,
}

const RECORD_STATUS_BACKGROUND_COLORS = {
  [RECORD_STATUS_LABELS.error]: 'rgba(242, 169, 0, 0.1)',
  [RECORD_STATUS_LABELS.ok]: 'rgba(41, 130, 23, 0.1)',
  [RECORD_STATUS_LABELS.stale]: 'rgba(23, 75, 130, 0.1)',
  [RECORD_STATUS_LABELS.warning]: 'rgba(255, 193, 7, 0.1)',
}

export const TrCollectRecordStatus = styled(Tr)`
  border-left: 4px solid ${({ $recordStatusLabel }) => RECORD_STATUS_COLORS[$recordStatusLabel]};
  background-color: ${({ $recordStatusLabel }) =>
    RECORD_STATUS_BACKGROUND_COLORS[$recordStatusLabel]};
`
