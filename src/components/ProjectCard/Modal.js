import React, { useRef } from 'react'
import styled from 'styled-components'
import { useFormik } from 'formik'
import stopEventPropagation from '../../library/stopEventPropagation'

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  position: fixed;
  display: flex;
  left: 0px;
  bottom: 0px;
  z-index: 1000; // or any value higher than your other elements
  justify-content: center;
  align-items: center;
`
const ModalWrapper = styled.div`
  width: 1000px;
  height: 500px;
  background: #fff;
  color: #000;
  display: flex;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`

const ButtonNext = styled.button`
   {
    padding: 5px 14px;
    background: #96bf48;
    color: #fff;
    text-align: center;
    border: none;
    text-decoration: none;
    display: inline-block;
    border-color: rgba(230, 230, 230, 0.74);
    margin-left: 50rem;
    float: right;
  }
`

const ButtonCancel = styled.button`
   {
    padding: 5px 14px;
    background: rgba(230, 230, 230, 1);
    // color: #333333;
    text-align: center;
    border: none;
    border-color: rgba(230, 230, 230, 0.74);
    text-decoration: none;
    display: inline-block;
    outline: none;
  }
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  line-height: 1.8;
  color: #141414;

  p {
    margin-bottom: 1rem;
  }

  form textarea {
    width: 100%;
    padding: 16px;
    border: none;
    margin-bottom: 16px;
    font-size: 14px;
    border: 1px solid #a0aec0;
    box-sizing: border-box;
    height: 150px;
  }

  form input {
    width: 100%;
    padding: 16px;
    border: none;
    margin-bottom: 16px;
    font-size: 14px;
    border: 1px solid #a0aec0;
    box-sizing: border-box;
    height: 15px;
  }
`

const Modal = ({ showModal, setShowModal }) => {
  const modalRef = useRef()

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false)
    }
  }

  const CopyProject = () => {
    const formik = useFormik({
      initialValues: { name: '' },
      //   onSubmit: (values) => {
      //     alert(JSON.stringify(values, null, 2))
      //   },
    })

    return (
      <form>
        <label htmlFor="Name">
          Name
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Dev Team Test Project" // hardcoded for now
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </label>
        <label htmlFor="notes">
          Notes
          <textarea
            id="notes"
            name="notes"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.notes}
          />
        </label>
        <label htmlFor="organizations">
          Organizations
          <input
            id="organizations"
            name="organizations"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.organizations}
          />
        </label>
        <ButtonCancel
          type="button"
          aria-label="Close modal"
          onClick={() => setShowModal((prev) => !prev)}
        >
          Cancel
        </ButtonCancel>
        <ButtonNext type="button" aria-label="Next" onClick={stopEventPropagation}>
          Next
        </ButtonNext>
      </form>
    )
  }

  return (
    <>
      {showModal ? (
        <Background>
          <ModalWrapper showModal={showModal}>
            <ModalContent>
              <CopyProject />
            </ModalContent>
          </ModalWrapper>
        </Background>
      ) : null}
    </>
  )
}

export default Modal
