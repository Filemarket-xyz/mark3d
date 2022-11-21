import { ErrorStore } from '../Error/ErrorStore'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { Token } from '../../../swagger/Api'
import { makeAutoObservable } from 'mobx'
import { api } from '../../config/api'

export class CollectionTokenListStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data: Token[] = []
  collectionAddress = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(collectionAddress: string) {
    storeRequest<Token[]>(
      this,
      api.tokens.byCollectionDetail(collectionAddress), resp => {
        this.data = resp
      })
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
