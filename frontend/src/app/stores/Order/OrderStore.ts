import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { Order } from '../../../swagger/Api'
import { TokenFullId } from '../../processing/types'
import { makeAutoObservable } from 'mobx'
import { api } from '../../config/api'

/**
 * Stores only ACTIVE order state.
 * Does not listen for updates, need to reload manually.
 */
export class OrderStore implements IStoreRequester,
  IActivateDeactivate<[string, string]> {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data?: Order = undefined
  tokenFullId?: TokenFullId = undefined

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(tokenFullId: TokenFullId) {
    storeRequest<Order | null>(
      this,
      api.orders.ordersDetail2(tokenFullId?.collectionAddress, tokenFullId?.tokenId),
      resp => {
        this.data = resp ?? undefined
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
