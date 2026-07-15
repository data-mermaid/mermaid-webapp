import { VALIDATION_STATUS } from './collectConstants'
import { Tr } from '../../generic/Table/table'
import { styled } from 'styled-components'
import theme from '../../../theme'

// Keyed on the stable status value (not the translated label) so the status
// border colour is consistent across all app languages.
const RECORD_STATUS_COLORS = {
  [VALIDATION_STATUS.error]: theme.color.cautionColor,
  [VALIDATION_STATUS.ok]: '#298217',
  [VALIDATION_STATUS.stale]: theme.color.primaryColor,
  [VALIDATION_STATUS.warning]: theme.color.warningColor,
}

export const TrCollectRecordStatus = styled(Tr)`
  border-left: 4px solid ${({ $recordStatus }) => RECORD_STATUS_COLORS[$recordStatus]};
`
