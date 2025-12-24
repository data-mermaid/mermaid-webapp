import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from '../../theme'
import { useTranslation } from 'react-i18next'

const size = '3.5rem'
const speed = '40s'
const animationDelay = '6s'
const initialRotation = '0deg'

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
      transform: rotate(${initialRotation});
      animation: spin ${speed} ease-in-out infinite;
      animation-delay: ${animationDelay};

      div {
        background: ${theme.color.white};
        position: absolute;
        width: ${size};
        height: ${size};
        transform: rotate(-${initialRotation});
        animation: objCounter ${speed} ease-in-out infinite;
        animation-delay: ${animationDelay};
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
      transform: rotate(${initialRotation});
    }
    to {
      transform: rotate(1080deg);
    }
  }
  @keyframes objCounter {
    from {
      transform: rotate(-${initialRotation});
    }
    to {
      transform: rotate(calc(-1080deg - ${initialRotation}));
    }
  }
`

const LoadingIndicator = ({
  displaySecondary = true,
  displaySecondaryTimingSeconds = 10,
  ...props
}) => {
  const { t } = useTranslation()
  const [isDisplaySecondaryTime, setIsDisplaySecondaryTime] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsDisplaySecondaryTime(true)
    }, displaySecondaryTimingSeconds * 1000)

    return () => {
      clearTimeout(timeout)
    }
  })

  const shouldDisplaySecondary = displaySecondary && isDisplaySecondaryTime

  return (
    <LoadingIndicatorContainer
      aria-label={t('loading_indicator')}
      data-testid="loading-indicator"
      {...props}
    >
      <div className="loadingWrapper">
        <div className="objectWrapper">
          <div className="triangle">&nbsp;</div>
          <div className="circle">&nbsp;</div>
          <div className="square">&nbsp;</div>
          <div className="diamond">&nbsp;</div>
          <div className="plus">&nbsp;</div>
          <div className="x">&nbsp;</div>
        </div>
        <p className="loadingPrimary">{t('loading')}</p>
        {shouldDisplaySecondary && <p className="loadingSecondary">{t('still_working')}</p>}
      </div>
    </LoadingIndicatorContainer>
  )
}

LoadingIndicator.propTypes = {
  displaySecondary: PropTypes.bool,
  displaySecondaryTimingSeconds: PropTypes.number,
}

export default LoadingIndicator
