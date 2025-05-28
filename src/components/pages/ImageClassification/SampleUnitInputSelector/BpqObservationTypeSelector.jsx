import React from "react";
import { ButtonPrimary, ButtonSecondary } from "../../../generic/buttons";
import { H3 } from "../../../generic/text";
import { IconPen, IconSparkles } from "../../../icons";
import PropTypes from "prop-types";
import {
  ButtonContainer,
  ButtonText,
  OfflineText,
  SelectorContainer,
  TextContainer,
} from "./BpqObservationTypeSelector.styles";
import { Trans, useTranslation } from "react-i18next";

const BpqObservationTypeSelector = ({
  setIsImageClassificationSelected,
  isAppOnline,
}) => {
  const { t } = useTranslation();
  const handleSampleUnitChange = (type) => () => {
    setIsImageClassificationSelected(type);
  };

  return (
    <SelectorContainer>
      <TextContainer>
        <H3 htmlFor="image-classification-selection">
          {t("image_classification.feature_introduction.title")}
        </H3>
        <p>
          <Trans
            i18nKey="image_classification.feature_introduction.description"
            components={{
              a: <a href="https://coralnet.ucsd.edu">CoralNet</a>,
            }}
          />
        </p>
      </TextContainer>
      <ButtonContainer>
        <div>
          {!isAppOnline && (
            <OfflineText>{t("offline.unavailable_offline")}</OfflineText>
          )}
          <ButtonPrimary
            type="button"
            onClick={handleSampleUnitChange(true)}
            disabled={!isAppOnline}
          >
            <IconSparkles />
            <ButtonText>
              {t("image_classification.feature_introduction.use_ai_button")}
            </ButtonText>
          </ButtonPrimary>
        </div>
        <ButtonSecondary type="button" onClick={handleSampleUnitChange(false)}>
          <IconPen />
          <ButtonText>
            {t(
              "image_classification.feature_introduction.use_manual_observations_button"
            )}
          </ButtonText>
        </ButtonSecondary>
      </ButtonContainer>
    </SelectorContainer>
  );
};

BpqObservationTypeSelector.propTypes = {
  setIsImageClassificationSelected: PropTypes.func.isRequired,
  isAppOnline: PropTypes.bool.isRequired,
};

export default BpqObservationTypeSelector;
