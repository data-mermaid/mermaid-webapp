import styled from 'styled-components'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure the overlay is on top */
`

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  position: relative;
  z-index: 1001; /* Ensure the content is on top of the overlay */
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`

const DropZone = styled.div`
  border: 2px dashed #007bff;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
  border-radius: 4px;
`

const HiddenInput = styled.input`
  display: none;
`

export { ModalOverlay, ModalContent, CloseButton, DropZone, HiddenInput }
