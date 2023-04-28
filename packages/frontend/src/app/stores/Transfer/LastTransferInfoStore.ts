import { makeAutoObservable } from 'mobx'

import { EncryptedPasswordResponse } from '../../../swagger/Api'
import { api } from '../../config/api'
import { TokenFullId } from '../../processing/types'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'

/**
 * Stores token state, referenced by the TokenFullId
 * Does not listen for updates, need to reload manually.
 */
export class LastTransferInfoStore implements IStoreRequester,
  IActivateDeactivate<[string, string]> {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data?: EncryptedPasswordResponse = undefined
  tokenFullId?: TokenFullId = undefined

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  setData(data: EncryptedPasswordResponse) {
    this.data = data
  }

  private request(tokenFullId: TokenFullId) {
    storeRequest<EncryptedPasswordResponse>(
      this,
      api.tokens.encryptedPasswordDetail(tokenFullId?.collectionAddress, tokenFullId?.tokenId),
      (data) => this.setData(data)
    )
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
