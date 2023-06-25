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

  setIsLoading = (isLoading: boolean) => {
    console.log(`IS LOADING: ${isLoading}`)
    this.isLoading = isLoading
  }

  // We listen to only events related to transfer change, not transfer initialization
  // This store is supposed to be used only on existing transfers (TransferStatus.Drafted or TransferStatus.Created)

  onTransferInit(tokenId: BigNumber, from: string, to: string) {
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
      this.reload()
      this.setIsLoading(false)
    })
  }

  onTransferDraft(tokenId: BigNumber, from: string) {
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
      this.reload()
      this.setIsLoading(false)
    })
  }

  onTransferDraftCompletion(tokenId: BigNumber, to: string) {
    console.log('onTransferCompletion')
    this.checkData(tokenId, data => {
      data.to = to
      this.reload()
      this.setIsLoading(false)
    })
  }

  onTransferPublicKeySet(tokenId: BigNumber, publicKeyHex: string) {
    console.log('onTransferPublicKeySet')
    this.checkData(tokenId, data => {
      data.publicKey = publicKeyHex
      data.statuses?.unshift({
        status: TransferStatus.PublicKeySet,
        timestamp: Date.now(),
      })
      this.reload()
      this.setIsLoading(false)
    })
  }

  onTransferPasswordSet(tokenId: BigNumber, encryptedPasswordHex: string) {
    console.log('onTransferPasswordSet')
    this.checkData(tokenId, data => {
      data.encryptedPassword = encryptedPasswordHex
      data.statuses?.unshift({
        status: TransferStatus.PasswordSet,
        timestamp: Date.now(),
      })
      this.reload()
      this.setIsLoading(false)
    })
  }

  onTransferFinished(tokenId: BigNumber) {
    console.log('onTransferFinished')
    this.checkActivation(tokenId, () => {
      this.data = undefined
      this.reload()
      this.setIsLoading(false)
    })
  }

  onTransferFraudReported(tokenId: BigNumber) {
    console.log('onTransferFraud')
    this.checkData(tokenId, data => {
      data.statuses?.unshift({
        status: TransferStatus.FraudReported,
        timestamp: Date.now(),
      })
      this.reload()
      this.setIsLoading(false)
    })
  }

  onTransferFraudDecided(tokenId: BigNumber, approved: boolean) {
    this.checkData(tokenId, data => {
      data.fraudApproved = approved
      data.statuses?.unshift({
        status: TransferStatus.Finished,
        timestamp: Date.now(),
      })
      this.reload()
      this.setIsLoading(false)
    })
  }

  onTransferCancellation(tokenId: BigNumber) {
    console.log('onTransferCancel')
    this.checkActivation(tokenId, () => {
      this.data = undefined
      this.reload()
      this.setIsLoading(false)
    })
  }
}
