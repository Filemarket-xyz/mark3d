import { ErrorStore } from '../Error/ErrorStore'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { Token } from '../../../swagger/Api'
import { makeAutoObservable } from 'mobx'
import { api } from '../../config/api'

export class CollectionTokenListStore implements IActivateDeactivate, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false

  data: Token[] = []
  address = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(address: string) {
    storeRequest<Token[]>(
      this,
      api.tokens.byCollectionDetail(address), resp => {
        this.data = resp
      })
  }

  activate(address: string): void {
    if (!this.isLoaded) {
      this.address = address
      this.request(address)
    }
  }

  deactivate(): void {
    this.reset()
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    this.request(this.address)
  }
}
