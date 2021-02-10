export default function (val, singluar, plural) {
  if (val === 1) {
    return singluar
  }
  return plural
}
