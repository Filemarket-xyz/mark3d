import { makeAutoObservable } from 'mobx'

import { SequencerAcquireResponse } from '../../../swagger/Api'
import { api } from '../../config/api'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'

export type IRarityWl = 'common' | 'uncommon' | '' | 'unknown' | 'payed'

/**
 * Stores whitelist state
 * Does not listen for updates, need to reload manually.
 */

export class FileBunniesTokenStore implements IStoreRequester,
  IActivateDeactivate<[`0x${string}`, IRarityWl ]> {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data?: SequencerAcquireResponse = undefined
  address?: `0x${string}` = undefined
  rarityWL?: IRarityWl

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false,
    })
  }

  private async request(address: `0x${string}`) {
    const suffix = this.rarityWL
    await storeRequest<SequencerAcquireResponse>(
      this,
      api.sequencer.acquireDetail(address, { suffix }),
      resp => {
        this.data = resp
      })
  }

  async activate(address: `0x${string}`, rarityWL?: IRarityWl): Promise<void> {
    this.isActivated = true
    this.address = address
    this.rarityWL = rarityWL
    await this.request(this.address)
  }

  deactivate(): void {
    this.reset()
    this.isActivated = false
  }

  reset(): void {
    storeReset(this)
  }

  async reload(): Promise<void> {
    if (this.address) {
      await this.request(this.address)
    }
  }
}
