export const makeWsUrl = (relativeUrl: string): string => {
  return window.location.protocol.replace(/http/, 'ws') + '//' + window.location.host + relativeUrl
}
