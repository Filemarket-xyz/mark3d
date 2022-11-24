import { ErrorStore } from '../../stores/Error/ErrorStore'
import { tap } from '../structs'
import { action } from 'mobx'
import { errorResponseToMessage, stringifyError } from '../error'
import { ErrorResponse, HttpResponse } from '../../../swagger/Api'

/**
 * Maintains request statuses. Prohibits concurrent requests.
 * Error is supposed to be shown through ErrorStore.
 */
export interface IStoreRequester {
  isLoading: boolean // indicates, if the request is in process. Setting loading to false will cancel the request
  isLoaded: boolean
  errorStore: ErrorStore
  requestCount: number
  currentRequest?: RequestContext // current request. Helps to prevent concurrent request
  reset: () => void
}

export interface RequestContext {
  id: number
  req?: Promise<any>
}

// Promise will fire void if the error is thrown and handled
export const storeRequest = <Data>(
  target: IStoreRequester,
  requester: Promise<HttpResponse<Data, ErrorResponse>>,
  callback: (data: Data) => void
): void => {
  if (!target.currentRequest) {
    console.log('request, start execution!')
    target.isLoading = true
    const context: RequestContext = {
      id: target.requestCount++
    }
    const finish = (resultHandler: () => void) => {
      // handle result only if request is not replaced by another and not cancelled
      if (target.currentRequest?.id === context.id) {
        console.log('request, handle result')
        target.currentRequest = undefined
        target.isLoading = false
        resultHandler()
      }
      // check, if we need to handle request results
    }
    context.req = requester
      .then(
        tap(
          action((data) => {
            finish(() => {
              if (data.ok) {
                target.isLoaded = true
                callback(data.data)
              } else {
                console.log('req error', data.error)
                target.errorStore.showError(errorResponseToMessage(data.error))
              }
            })
          })
        )
      )
      .catch(
        action((error) => {
          finish(() => {
            console.log('req error', error)
            target.errorStore.showError(stringifyError(error))
          })
        })
      )
    target.currentRequest = context
  }
}

export const storeReset = <Target extends IStoreRequester>(target: Target) => {
  target.currentRequest = undefined // cancel current request
  target.isLoading = false
  target.isLoaded = false
}
