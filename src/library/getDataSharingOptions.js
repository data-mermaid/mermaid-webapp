export const getDataSharingOptions = (choices) => {
  return choices.data.map(({ name, id, description }) => ({
    label: name,
    value: id,
    description,
  }))
}
