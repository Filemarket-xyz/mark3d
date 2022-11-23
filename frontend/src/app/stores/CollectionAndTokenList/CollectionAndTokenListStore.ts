import { IActivateDeactivate, storeRequest, IStoreRequester, storeReset, RequestContext } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { makeAutoObservable } from 'mobx'
import { Collection, Token, TokensResponse } from '../../../swagger/Api'
import { api } from '../../config/api'

export class CollectionAndTokenListStore implements IActivateDeactivate<[string]>, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  collections: Collection[] = []
  tokens: Token[] = []
  address = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(address: string) {
    storeRequest<TokensResponse>(
      this,
      api.tokens.tokensDetail(address),
      resp => {
        console.log('request response', resp)
        if (resp.collections) {
          this.collections = resp.collections
        }
        if (resp.tokens) {
          this.tokens = resp.tokens
        }
      })
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
