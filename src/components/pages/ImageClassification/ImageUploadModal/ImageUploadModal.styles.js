import styled from 'styled-components'

const DropZone = styled.div`
  border: 2px dashed #007bff;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
`

const HiddenInput = styled.input`
  display: none;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

export { DropZone, HiddenInput, ButtonContainer }
