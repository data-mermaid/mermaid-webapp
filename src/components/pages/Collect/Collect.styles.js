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

export const TrCollectRecordStatus = styled(Tr)`
  border-left: 4px solid ${({ $recordStatusLabel }) => RECORD_STATUS_COLORS[$recordStatusLabel]};
`
