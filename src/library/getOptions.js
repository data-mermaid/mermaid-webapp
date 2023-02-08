export const getOptions = (choices) => {
  return choices.map(({ name, id }) => ({
    label: name,
    value: id,
  }))
}

export const getMROptions = (mrChoices) => {
  return mrChoices.map(({ name, name_secondary, id }) => ({
    label: name_secondary.length ? `${name} [${name_secondary}]` : name,
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
