export const getClosestNumberInArray = (searchNumber, array) => {
  // in the case of a tie, the first closest number encountered is chosen
  return array.reduce((prev, curr) => {
    return Math.abs(curr - searchNumber) < Math.abs(prev - searchNumber)
      ? curr
      : prev
  })
}
