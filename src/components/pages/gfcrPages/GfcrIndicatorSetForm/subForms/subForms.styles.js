import styled from 'styled-components'
import { InputWrapper } from '../../../../generic/form'

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
