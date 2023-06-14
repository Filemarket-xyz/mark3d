import { makeAutoObservable } from 'mobx'

import { WhitelistResponse } from '../../../swagger/Api'
import { api } from '../../config/api'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'

/**
 * Stores whitelist state
 * Does not listen for updates, need to reload manually.
 */

export class WhiteListStore implements IStoreRequester,
  IActivateDeactivate<[`0x${string}`]> {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data?: WhitelistResponse = undefined
  address?: `0x${string}` = undefined

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false,
    })
  }

  private request(address: `0x${string}`) {
    storeRequest<WhitelistResponse>(
      this,
      api.collections.fileBunniesWhitelistDetail(address),
      resp => {
        this.data = resp
      })
  }

  activate(address: `0x${string}`): void {
    this.isActivated = true
    this.address = address
    this.request(this.address)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    if (this.address) {
      this.request(this.address)
    }
  }
}
