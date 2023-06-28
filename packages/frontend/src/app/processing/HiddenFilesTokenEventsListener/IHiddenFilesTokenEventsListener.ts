import { BigNumber } from 'ethers'

export interface IHiddenFilesTokenEventsListener {

  onTransferInit: (tokenId: BigNumber, from: string, to: string, transferNumber: BigNumber) => void

  onTransferDraft: (tokenId: BigNumber, from: string, transferNumber: BigNumber) => void

  onTransferDraftCompletion: (tokenId: BigNumber, to: string, transferNumber: BigNumber) => void

  onTransferPublicKeySet: (tokenId: BigNumber, publicKeyHex: string, transferNumber: BigNumber) => void

  onTransferPasswordSet: (tokenId: BigNumber, encryptedPasswordHex: string, transferNumber: BigNumber) => void

  onTransferFinished: (tokenId: BigNumber, transferNumber: BigNumber) => void

  onTransferFraudReported: (tokenId: BigNumber, transferNumber: BigNumber) => void

  onTransferFraudDecided: (tokenId: BigNumber, approved: boolean, transferNumber: BigNumber) => void

  onTransferCancellation: (tokenId: BigNumber, transferNumber: BigNumber) => void
}
