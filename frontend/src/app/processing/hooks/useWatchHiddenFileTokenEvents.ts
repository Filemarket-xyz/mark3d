import { useContractEvent } from 'wagmi'
import { mark3dConfig } from '../../config/mark3d'
import { HiddenFilesTokenEventNames } from '../types'
import { IHiddenFilesTokenEventsListener } from '../HiddenFilesTokenEventsListener'

/**
 * Hook called to listen for transfer updates and pass them into TransferStore.
 * @param address
 * @param listener
 */
export function useWatchHiddenFileTokenEvents(listener: IHiddenFilesTokenEventsListener, address?: string) {
  // TODO: refactor to use ethers.Provider to also receive tx that caused event emission
  const abi = mark3dConfig.collectionToken.abi
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferInit,
    listener: (tokenId, from, to) => listener.onTransferInit(tokenId, from, to)
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferDraft,
    listener: (tokenId, from) => listener.onTransferDraft(tokenId, from)
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferDraftCompletion,
    listener: (tokenId, to) => listener.onTransferDraftCompletion(tokenId, to)
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferPublicKeySet,
    listener: (tokenId, publicKeyHex) => listener.onTransferPublicKeySet(tokenId, publicKeyHex)
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferPasswordSet,
    listener: (tokenId, encryptedPasswordHex) => listener.onTransferPasswordSet(tokenId, encryptedPasswordHex)
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFinished,
    listener: (tokenId) => listener.onTransferFinished(tokenId)
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFraudReported,
    listener: (tokenId) => listener.onTransferFraudReported(tokenId)
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFraudDecided,
    listener: (tokenId, approved) => listener.onTransferFraudDecided(tokenId, approved)
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferCancellation,
    listener: (tokenId) => listener.onTransferCancellation(tokenId)
  })
}
