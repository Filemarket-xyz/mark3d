import { IActivateDeactivate, storeRequest, IStoreRequester, storeReset, RequestContext } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { makeAutoObservable } from 'mobx'
import { Collection, Token, TokensResponse } from '../../../swagger/Api'
import { api } from '../../config/api'

export class CollectionAndTokenList implements IActivateDeactivate, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false

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
    storeRequest<TokensResponse>(this, api.tokens.tokensDetail(address), resp => {
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
    // no double activation
    if (!this.isLoaded) {
      console.log('request', address)
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
