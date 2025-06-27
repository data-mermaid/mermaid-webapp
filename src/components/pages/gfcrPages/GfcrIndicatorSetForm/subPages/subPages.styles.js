import styled from 'styled-components'
import { InputWrapper } from '../../../../generic/form'
import theme from '../../../../../theme'
import { LeftFooter } from '../../../../generic/Modal'

export const StyledGfcrInputWrapper = styled(InputWrapper)`
  display: flex;
  flex-direction: column;
  width: 50rem;

  .inputRow {
    display: inline-block;
  }

  .labelContainer {
    margin-bottom: 1rem;
  }
`

export const StyledGfcrSubInputWrapper = styled(InputWrapper)`
  padding 0;

  .inputRow {
    display: flex;
    border-width: 0;
    padding: 1rem 0 1rem 1rem;
    /* justify-content: right; */
  }

  .labelContainer {
    margin-right: 1rem;
    flex: 0.5;
  }
`

export const TableContentToolbar = styled('div')`
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border-bottom: solid ${theme.spacing.borderMedium} ${theme.color.backgroundColor};
  margin-bottom: 0;
  /* z-index: 100; */
`

const contentPadding = theme.spacing.xsmall

export const StyledTableContentWrapper = styled('div')`
  padding: ${contentPadding} 0 0 ${contentPadding};
`

export const StyledTableAnchor = styled('a')`
  cursor: pointer;
`

export const StyledModalInputRow = styled('div')`
  margin: 1rem;
`

export const StyledModalFooterWrapper = styled('div')`
  display: flex;
`

export const StyledModalLeftFooter = styled(LeftFooter)`
  flex: 1;
`
