import {
  IActivateDeactivate,
  storeRequest,
  IStoreRequester,
  storeReset,
  RequestContext
} from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { makeAutoObservable } from 'mobx'
import { Collection } from '../../../swagger/Api'
import { api } from '../../config/api'

export class CollectionStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  collection?: Collection
  address: string = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(address: string) {
    storeRequest<Collection>(
      this,
      api.collections.collectionsDetail(address),
      (resp) => {
        this.collection = resp
      }
    )
  }

  activate(address: string): void {
    this.isActivated = true
    this.address = address
    this.request(address)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    this.request(this.address)
  }
}
