export const getOptions = (choices, hasData = true) => {
  const optionData = hasData ? choices.data : choices

  return optionData.map(({ name, id }) => ({
    label: name,
    value: id,
  }))
}

export const getBenthicOptions = (benthicChoices) => {
  return benthicChoices.map(({ name, id, top_level_category }) => ({
    label: name,
    value: id,
    topLevelCategory: top_level_category,
  }))
}
