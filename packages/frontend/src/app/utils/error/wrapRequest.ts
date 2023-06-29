
import { ErrorResponse, HttpResponse } from '../../../swagger/Api'
import { errorResponseToMessage, stringifyError } from './stringifyError'

export const wrapRequest = <T>(func: () => Promise<HttpResponse<T, ErrorResponse>>): Promise<T> => {
  return func()
    .catch((error) => {
      console.log('catch error', error)
      if (error instanceof Response && 'error' in error) {
        throw new Error(errorResponseToMessage(error.error as ErrorResponse))
      }
      throw new Error(stringifyError(error))
    })
    .then(response => {
      if (response.ok) {
        return response.data
      } else {
        throw new Error(errorResponseToMessage(response.error))
      }
    })
}
