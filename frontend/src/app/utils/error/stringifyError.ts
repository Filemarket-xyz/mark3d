import { ErrorResponse } from '../../../swagger/Api'

export function stringifyError(error: any): string {
  if (typeof error === 'string') {
    return error
  }
  if (error instanceof Error) {
    if (error.stack) {
      return error.stack
    } else {
      return `${error.name}: ${error.message}`
    }
  }
  let str
  try {
    str = JSON.stringify(error)
    if (str === '{}') {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      str = error + ''
    }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    str = (error + '')
  }
  return str
}

export function errorResponseToMessage(error?: ErrorResponse): string {
  if (!error) {
    return 'received nullish error from the backend, but request was not successful'
  }
  return `${error.message}: ${error.detail}`
}
