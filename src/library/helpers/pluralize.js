export default function pluralize(val, singluar, plural) {
  if (val === 1) {
    return singluar
  }
  return plural
}
