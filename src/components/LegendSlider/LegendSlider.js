import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const SliderContainer = styled.div`
  position: absolute;
  width: 270px;
  height: 384px;
  right: ${(props) => (props.open ? '0px' : '-270px')};
  background: ${(props) => props.open && 'rgba(255, 255, 255, 1)'};
  top: 8px;
  z-index: 2;
  transition: 0.3s ease-in-out;
`

const SliderHandler = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 1);
  height: 120px;
  width: 20px;
  cursor: pointer;
  top: 10%;
  left: -20px;
  border-right: 1px solid;
  transition: 0.3s ease-in-out;
  visibility: visible;
`

const SliderName = styled.span`
  display: inline-block;
  position: relative;
  transform: rotate(-90deg);
  top: 50px;
  left: -45px;
  font-size: 1.5rem;
`

const SliderLegendPanel = styled.div`
  opacity: ${(props) => (props.open ? 1 : 0)};
  visibility: ${(props) => (props.open ? 'visible' : 'hidden')};
`

const LegendSlider = () => {
  const [navbarOpen, setNavbarOpen] = useState(true)

  const handleNavbarOpen = () => {
    setNavbarOpen(!navbarOpen)
  }

  return (
    <SliderContainer open={navbarOpen}>
      <SliderHandler onClick={handleNavbarOpen}>
        <SliderName>Allen&nbsp;Coral&nbsp;Atlas</SliderName>
      </SliderHandler>
      <SliderLegendPanel open={navbarOpen}>
        <h4>Title</h4>
      </SliderLegendPanel>
    </SliderContainer>
  )
}

LegendSlider.propTypes = {}

export default LegendSlider
