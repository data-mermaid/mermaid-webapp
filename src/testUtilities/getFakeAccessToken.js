export const getFakeAccessToken = () =>
  Promise.resolve ? Promise.resolve('fake token') : new Promise((resolve) => resolve('fake token'))
