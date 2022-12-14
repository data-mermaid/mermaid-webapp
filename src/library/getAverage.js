export const getAverage = (arr) => {
  if (!arr.length) {
    return 0
  }

  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)
}
