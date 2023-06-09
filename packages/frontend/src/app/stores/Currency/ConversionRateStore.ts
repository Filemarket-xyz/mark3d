import { makeAutoObservable } from 'mobx'

import { ConversionRateResponse } from '../../../swagger/Api'
import { api } from '../../config/api'
import {
  IActivateDeactivate,
  IStoreRequester,
  RequestContext,
  storeRequest,
  storeReset,
} from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import type { RootStore } from '../RootStore'

export class ConversionRateStore implements IActivateDeactivate, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data?: ConversionRateResponse = undefined

  constructor({ errorStore }: RootStore) {
    this.errorStore = errorStore
    makeAutoObservable(this)
  }

  setData(data: ConversionRateResponse) {
    this.data = data
  }

  private request() {
    storeRequest(
      this,
      api.currency.conversionRateList(),
      (data) => this.setData(data),
    )
  }

  activate(): void {
    this.isActivated = true
    this.request()
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    this.data = undefined
    storeReset(this)
  }

  reload(): void {
    this.request()
  }
}
