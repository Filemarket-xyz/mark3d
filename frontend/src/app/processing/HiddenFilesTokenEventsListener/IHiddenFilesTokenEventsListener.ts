import { BigNumber } from 'ethers'

export interface IHiddenFilesTokenEventsListener {

  onTransferInit: (tokenId: BigNumber, from: string, to: string) => void

  onTransferDraft: (tokenId: BigNumber, from: string) => void

  onTransferDraftCompletion: (tokenId: BigNumber, to: string) => void

  onTransferPublicKeySet: (tokenId: BigNumber, publicKeyHex: string) => void

  onTransferPasswordSet: (tokenId: BigNumber, encryptedPasswordHex: string) => void

  onTransferFinished: (tokenId: BigNumber) => void

  onTransferFraudReported: (tokenId: BigNumber) => void

  onTransferFraudDecided: (tokenId: BigNumber, approved: boolean) => void

  onTransferCancellation: (tokenId: BigNumber) => void
}
