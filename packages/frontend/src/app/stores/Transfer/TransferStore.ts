import { BigNumber } from 'ethers'
import { makeAutoObservable } from 'mobx'

import { Transfer, TransferStatus } from '../../../swagger/Api'
import { api } from '../../config/api'
import { IHiddenFilesTokenEventsListener } from '../../processing'
import { TokenFullId } from '../../processing/types'
import { normalizeCounterId } from '../../processing/utils/id'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { ErrorStore } from '../Error/ErrorStore'

/**
 * Stores only ACTIVE (i.e. created and not finished/cancelled) transfer state
 */
export class TransferStore implements IStoreRequester,
  IActivateDeactivate<[string, string]>, IHiddenFilesTokenEventsListener {
  errorStore: ErrorStore

  currentRequest?: RequestContext
  requestCount = 0
  isLoaded = false
  isLoading = false
  isActivated = false

  data?: Transfer = undefined
  tokenFullId?: TokenFullId = undefined

  constructor({ errorStore }: { errorStore: ErrorStore }) {
    this.errorStore = errorStore
    makeAutoObservable(this, {
      errorStore: false
    })
  }

  private request(tokenFullId: TokenFullId) {
    storeRequest<Transfer | null>(
      this,
      api.transfers.transfersDetail2(tokenFullId?.collectionAddress, tokenFullId?.tokenId),
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

  private checkData(tokenId: BigNumber, ifDataOk: (data: Transfer) => void) {
    if (this.data?.tokenId && normalizeCounterId(this.data?.tokenId) === normalizeCounterId(tokenId)) {
      ifDataOk(this.data)
    }
  }

  private checkActivation(tokenId: BigNumber, ifActivationOk: (tokenFullId: TokenFullId) => void) {
    if (
      this.isActivated &&
      this.tokenFullId &&
      normalizeCounterId(this.tokenFullId?.tokenId) === normalizeCounterId(tokenId)
    ) {
      ifActivationOk(this.tokenFullId)
    }
  }

  // We listen to only events related to transfer change, not transfer initialization
  // This store is supposed to be used only on existing transfers (TransferStatus.Drafted or TransferStatus.Created)

  onTransferInit(tokenId: BigNumber, from: string, to: string) {
    this.checkActivation(tokenId, (tokenFullId) => {
      this.data = {
        collection: tokenFullId.collectionAddress,
        tokenId: tokenFullId.tokenId,
        from,
        to,
        statuses: [{
          status: TransferStatus.Created,
          timestamp: Date.now()
        }]
      }
    })
  }

  onTransferDraft(tokenId: BigNumber, from: string) {
    this.checkActivation(tokenId, (tokenFullId) => {
      this.data = {
        collection: tokenFullId.collectionAddress,
        tokenId: tokenFullId.tokenId,
        from,
        statuses: [{
          status: TransferStatus.Drafted,
          timestamp: Date.now()
        }]
      }
    })
  }

  onTransferDraftCompletion(tokenId: BigNumber, to: string) {
    this.checkData(tokenId, data => {
      data.to = to
    })
  }

  onTransferPublicKeySet(tokenId: BigNumber, publicKeyHex: string) {
    this.checkData(tokenId, data => {
      data.publicKey = publicKeyHex
      data.statuses?.unshift({
        status: TransferStatus.PublicKeySet,
        timestamp: Date.now()
      })
    })
  }

  onTransferPasswordSet(tokenId: BigNumber, encryptedPasswordHex: string) {
    this.checkData(tokenId, data => {
      data.encryptedPassword = encryptedPasswordHex
      data.statuses?.unshift({
        status: TransferStatus.PasswordSet,
        timestamp: Date.now()
      })
    })
  }

  onTransferFinished(tokenId: BigNumber) {
    this.checkActivation(tokenId, () => {
      this.data = undefined
    })
  }

  onTransferFraudReported(tokenId: BigNumber) {
    this.checkData(tokenId, data => {
      data.statuses?.unshift({
        status: TransferStatus.FraudReported,
        timestamp: Date.now()
      })
    })
  }

  onTransferFraudDecided(tokenId: BigNumber, approved: boolean) {
    this.checkData(tokenId, data => {
      data.fraudApproved = approved
      data.statuses?.unshift({
        status: TransferStatus.Finished,
        timestamp: Date.now()
      })
    })
  }

  onTransferCancellation(tokenId: BigNumber) {
    this.checkActivation(tokenId, () => {
      this.data = undefined
    })
  }
}
