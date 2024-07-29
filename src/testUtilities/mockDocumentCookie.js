export const mockDocumentCookie = (cookie) => {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: cookie,
  })
}
