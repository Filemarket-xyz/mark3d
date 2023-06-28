import { BigNumber } from 'ethers'
import { makeAutoObservable } from 'mobx'

import { Transfer, TransferStatus } from '../../../swagger/Api'
import { api } from '../../config/api'
import { IHiddenFilesTokenEventsListener } from '../../processing'
import { TokenFullId } from '../../processing/types'
import { normalizeCounterId } from '../../processing/utils/id'
import { IActivateDeactivate, IStoreRequester, RequestContext, storeRequest, storeReset } from '../../utils/store'
import { BlockStore } from '../BlockStore/BlockStore'
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

  isWaitingForEvent: boolean = false
  data?: Transfer = undefined
  tokenFullId?: TokenFullId = undefined
  blockStore: BlockStore
  constructor({ errorStore, blockStore }: { errorStore: ErrorStore, blockStore: BlockStore }) {
    this.errorStore = errorStore
    this.blockStore = blockStore
    makeAutoObservable(this, {
      errorStore: false,
      blockStore: false,
    })
  }

  private request(tokenFullId: TokenFullId) {
    storeRequest<Transfer | null>(
      this,
      api.transfers.transfersDetail2(tokenFullId?.collectionAddress, tokenFullId?.tokenId),
      resp => {
        this.data = resp ?? undefined
        this.blockStore.setRecieptBlock(BigNumber.from(resp?.block?.number))
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

  setIsWaitingForEvent = (isLoading: boolean) => {
    this.isWaitingForEvent = isLoading
  }

  // We listen to only events related to transfer change, not transfer initialization
  // This store is supposed to be used only on existing transfers (TransferStatus.Drafted or TransferStatus.Created)

  onTransferInit(tokenId: BigNumber, from: string, to: string, transferNumber: BigNumber) {
    console.log('onTransferInit')
    this.checkActivation(tokenId, (tokenFullId) => {
      this.data = {
        collection: tokenFullId.collectionAddress,
        tokenId: tokenFullId.tokenId,
        from,
        to,
        statuses: [{
          status: TransferStatus.Created,
          timestamp: Date.now(),
        }],
      }
      this.setIsWaitingForEvent(false)
      this.reload()
    })
  }

  onTransferDraft(tokenId: BigNumber, from: string, transferNumber: BigNumber) {
    console.log('onTransferDraft')
    this.checkActivation(tokenId, (tokenFullId) => {
      this.data = {
        collection: tokenFullId.collectionAddress,
        tokenId: tokenFullId.tokenId,
        from,
        statuses: [{
          status: TransferStatus.Drafted,
          timestamp: Date.now(),
        }],
      }
      this.setIsWaitingForEvent(false)
      this.reload()
    })
  }

  onTransferDraftCompletion(tokenId: BigNumber, to: string, transferNumber: BigNumber) {
    console.log('onTransferCompletion')
    this.checkData(tokenId, data => {
      data.to = to
      this.setIsWaitingForEvent(false)
      this.reload()
    })
  }

  onTransferPublicKeySet(tokenId: BigNumber, publicKeyHex: string, transferNumber: BigNumber) {
    console.log('onTransferPublicKeySet')
    this.checkData(tokenId, data => {
      data.publicKey = publicKeyHex
      data.statuses?.unshift({
        status: TransferStatus.PublicKeySet,
        timestamp: Date.now(),
      })
      this.reload()
      this.setIsWaitingForEvent(false)
    })
  }

  onTransferPasswordSet(tokenId: BigNumber, encryptedPasswordHex: string, transferNumber: BigNumber) {
    console.log('onTransferPasswordSet')
    this.checkData(tokenId, data => {
      data.encryptedPassword = encryptedPasswordHex
      data.statuses?.unshift({
        status: TransferStatus.PasswordSet,
        timestamp: Date.now(),
      })
      this.reload()
      this.setIsWaitingForEvent(false)
    })
  }

  onTransferFinished(tokenId: BigNumber, transferNumber: BigNumber) {
    console.log('onTransferFinished')
    this.checkActivation(tokenId, () => {
      this.data = undefined
      this.reload()
      this.setIsWaitingForEvent(false)
    })
  }

  onTransferFraudReported(tokenId: BigNumber, transferNumber: BigNumber) {
    console.log('onTransferFraud')
    this.checkData(tokenId, data => {
      data.statuses?.unshift({
        status: TransferStatus.FraudReported,
        timestamp: Date.now(),
      })
      this.setIsWaitingForEvent(false)
      this.reload()
    })
  }

  onTransferFraudDecided(tokenId: BigNumber, approved: boolean, transferNumber: BigNumber) {
    this.checkData(tokenId, data => {
      data.fraudApproved = approved
      data.statuses?.unshift({
        status: TransferStatus.Finished,
        timestamp: Date.now(),
      })
      this.reload()
      this.setIsWaitingForEvent(false)
    })
  }

  onTransferCancellation(tokenId: BigNumber, transferNumber: BigNumber) {
    console.log('onTransferCancel')
    this.checkActivation(tokenId, () => {
      this.data = undefined
      this.reload()
      this.setIsWaitingForEvent(false)
    })
  }
}
