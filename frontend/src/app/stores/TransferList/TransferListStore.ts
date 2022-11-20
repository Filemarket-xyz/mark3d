import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'
import { Transfer, TransfersResponse } from '../../../swagger/Api'
import { makeAutoObservable } from 'mobx'
import { stringifyTokenFullId } from '../../processing/utils/id'
import { api } from '../../config/api'

export class TransferListStore implements IActivateDeactivate, IStoreRequester {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false

  incoming: Transfer[] = []
  outgoing: Transfer[] = []
  address = ''

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  // key - stringifyTokenFullId({collectionAddress, tokenId})
  get fullIdDict(): Record<string, Transfer> {
    const dict: Record<string, Transfer> = Object.create(null)
    const fillDict = (list: Transfer[]) => {
      list.forEach(transfer => {
        if (transfer.collection && transfer.tokenId) {
          dict[stringifyTokenFullId({ collectionAddress: transfer.collection, tokenId: transfer.tokenId })] = transfer
        }
      })
    }
    fillDict(this.incoming)
    fillDict(this.outgoing)
    return dict
  }

  private request(address: string) {
    storeRequest<TransfersResponse>(
      this,
      api.transfers.transfersDetail(address),
      data => {
        if (data.incoming) {
          this.incoming = data.incoming
        }
        if (data.outgoing) {
          this.outgoing = data.outgoing
        }
      }
    )
  }

  reset() {
    storeReset(this)
  }

  activate(address: string): void {
    // no double activation
    if (!this.isLoaded) {
      this.address = address
      this.request(address)
    }
  }

  deactivate(): void {
    this.reset()
  }

  reload(): void {
    this.request(this.address)
  }
}
