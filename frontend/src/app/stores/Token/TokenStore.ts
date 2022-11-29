import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { Token } from '../../../swagger/Api'
import { TokenFullId } from '../../processing/types'
import { makeAutoObservable } from 'mobx'
import { api } from '../../config/api'

/**
 * Stores token state, referenced by the TokenFullId
 * Does not listen for updates, need to reload manually.
 */
export class TokenStore implements IStoreRequester,
  IActivateDeactivate<[string, string]> {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data?: Token = undefined
  tokenFullId?: TokenFullId = undefined

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(tokenFullId: TokenFullId) {
    storeRequest<Token>(
      this,
      api.tokens.tokensDetail2(tokenFullId?.collectionAddress, tokenFullId?.tokenId),
      resp => {
        this.data = resp
      })
  }

  activate(collectionAddress: string, tokenId: string): void {
    this.isActivated = true
    this.tokenFullId = { collectionAddress, tokenId }
    this.request(this.tokenFullId)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  reload(): void {
    if (this.tokenFullId) {
      this.request(this.tokenFullId)
    }
  }
}
