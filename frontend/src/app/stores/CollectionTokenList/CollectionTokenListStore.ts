import { ErrorStore } from '../Error/ErrorStore'
import {
  IActivateDeactivate,
  IStoreRequester,
  RequestContext,
  storeRequest,
  storeReset
} from '../../utils/store'
import { Token, Collection } from '../../../swagger/Api'
import { makeAutoObservable } from 'mobx'
import { api } from '../../config/api'

export class CollectionTokenListStore
implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data: {
    collection: Collection
    tokens: Token[]
  } = {
      collection: {},
      tokens: []
    }

  collectionAddress = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(collectionAddress: string) {
    storeRequest<{ collection: Collection, tokens: Token[] }>(
      this,
      api.collections.fullCollectionsDetail(collectionAddress),
      (resp) => {
        this.data = resp
      }
    )
  }

  activate(collectionAddress: string): void {
    this.isActivated = true
    this.collectionAddress = collectionAddress
    this.request(collectionAddress)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    this.request(this.collectionAddress)
  }
}
