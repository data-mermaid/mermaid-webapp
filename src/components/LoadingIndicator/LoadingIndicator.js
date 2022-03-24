import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import language from '../../language'
import theme from '../../theme'

const size = '3.5rem'
const speed = '20s'

const LoadingIndicatorContainer = styled.div`
  display: grid;
  place-items: center;
  .loadingWrapper {
    width: calc(${size} * 6);
    height: calc(${size} * 6);
    top: 30%;
    position: fixed;
    p {
      position: absolute;
      color: ${theme.color.white};
      margin: 0;
      width: 100%;
      text-align: center;
    }
    .loadingPrimary {
        top: 45%;
        font-size: ${theme.typography.defaultFontSize};
        font-weight: 900;
        text-transform: uppercase;
      }
      .loadingSecondary {
        top: 110%;
        font-size: ${theme.typography.defaultFontSize};
        font-weight: 600;
      }
    }
    .objectWrapper {
      position: relative;
      width: 100%;
      height: 100%;
      animation: spin ${speed} linear infinite;

      div {
        background: ${theme.color.white};
        position: absolute;
        width: ${size};
        height: ${size};
        animation: objCounter ${speed} linear infinite;
      }
      .triangle {
        top: 0%;
        left: calc(50% - calc(${size} / 2));
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      }
      .circle {
        top: 60%;
        clip-path: ellipse(50% 50% at 50% 50%);
      }
      .square {
        top: 20%;
        left: calc(100% - ${size});
      }
      .diamond {
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        bottom: 0;
        left: calc(50% - calc(${size} / 2));
      }
      .x {
        clip-path: polygon(
          20% 0%,
          0% 20%,
          30% 50%,
          0% 80%,
          20% 100%,
          50% 70%,
          80% 100%,
          100% 80%,
          70% 50%,
          100% 20%,
          80% 0%,
          50% 30%
        );
        top: 20%;
        left: 0;
      }
      .plus {
        clip-path: polygon(
          0 35%,
          35% 35%,
          35% 0%,
          65% 0%,
          65% 35%,
          100% 35%,
          100% 65%,
          65% 65%,
          65% 100%,
          35% 100%,
          35% 65%,
          0 65%
        );
        top: 60%;
        left: calc(100% - ${size});
      }
    }
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes objCounter {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }
`

const LoadingIndicator = ({
  primaryMessage,
  secondaryMessage,
  displaySecondary,
  displaySecondaryTimingSeconds,
  ...props
}) => {
    const [isDisplaySecondaryTime, setIsDisplaySecondaryTime] = useState(false)

    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsDisplaySecondaryTime(true)
      }, displaySecondaryTimingSeconds * 1000)

      return () => {
        clearTimeout(timeout)
      }
    })

  const isDisplaySecondary = displaySecondary && secondaryMessage && isDisplaySecondaryTime

  return (
    <LoadingIndicatorContainer {...props}>
      <div className="loadingWrapper">
        <div className="objectWrapper">
          <div className="triangle">&nbsp;</div>
          <div className="circle">&nbsp;</div>
          <div className="square">&nbsp;</div>
          <div className="diamond">&nbsp;</div>
          <div className="plus">&nbsp;</div>
          <div className="x">&nbsp;</div>
        </div>
        <p className="loadingPrimary">{primaryMessage}</p>
        { (isDisplaySecondary) && <p className="loadingSecondary">{secondaryMessage}</p> }
      </div>
    </LoadingIndicatorContainer>
  )
}

LoadingIndicator.defaultProps = {
  primaryMessage: language.loadingIndicator.loadingPrimary,
  secondaryMessage: language.loadingIndicator.loadingSecondary,
  displaySecondary: true,
  displaySecondaryTimingSeconds: 10,
}

LoadingIndicator.propTypes = {
  primaryMessage: PropTypes.string,
  secondaryMessage: PropTypes.string,
  displaySecondary: PropTypes.bool,
  displaySecondaryTimingSeconds: PropTypes.number,
}

export default LoadingIndicator
