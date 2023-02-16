export const getOptions = (choices) => {
  try {
    return choices.map(({ name, id }) => ({
      label: name,
      value: id,
    }))
  } catch {
    return []
  }
}

export const getManagementRegimeOptions = (managementRegimeChoices) => {
  try {
    return managementRegimeChoices.map(({ name, name_secondary, id }) => ({
      label: name_secondary.length ? `${name} [${name_secondary}]` : name,
      value: id,
    }))
  } catch {
    return []
  }
}

export const getBenthicOptions = (benthicChoices) => {
  try {
    return benthicChoices.map(({ name, id, top_level_category }) => ({
      label: name,
      value: id,
      topLevelCategory: top_level_category,
    }))
  } catch {
    return []
  }
}
