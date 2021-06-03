export const getOptions = (choices, hasData = true) => {
  const optionData = hasData ? choices.data : choices

  return optionData.map(({ name, id }) => ({
    label: name,
    value: id,
  }))
}
