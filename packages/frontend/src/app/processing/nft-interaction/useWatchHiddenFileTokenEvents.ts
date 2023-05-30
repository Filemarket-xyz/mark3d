/* eslint-disable max-len */
import { useContractEvent } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { IHiddenFilesTokenEventsListener } from '../HiddenFilesTokenEventsListener'
import { HiddenFilesTokenEventNames } from '../types'
import { ensureAddress } from '../utils'

/**
 * Hook called to listen for transfer updates and pass them into TransferStore.
 * @param contractAddress
 * @param listener
 */
export function useWatchHiddenFileTokenEvents(listener: IHiddenFilesTokenEventsListener, contractAddress?: string) {
  // TODO: refactor to use ethers.Provider to also receive tx that caused event emission
  const abi = mark3dConfig.collectionToken.abi
  const address = ensureAddress(contractAddress)
  // Sorry for any type. During one of wagmi updates typing was broken
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferInit,
    listener: (tokenId: any, from: any, to: any) => listener.onTransferInit(tokenId, from, to),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferDraft,
    listener: (tokenId: any, from: any) => listener.onTransferDraft(tokenId, from),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferDraftCompletion,
    listener: (tokenId: any, to: any) => listener.onTransferDraftCompletion(tokenId, to),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferPublicKeySet,
    listener: (tokenId: any, publicKeyHex: any) => listener.onTransferPublicKeySet(tokenId, publicKeyHex),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferPasswordSet,
    listener: (tokenId: any, encryptedPasswordHex: any) => listener.onTransferPasswordSet(tokenId, encryptedPasswordHex),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFinished,
    listener: (tokenId: any) => listener.onTransferFinished(tokenId),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFraudReported,
    listener: (tokenId: any) => listener.onTransferFraudReported(tokenId),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFraudDecided,
    listener: (tokenId: any, approved: any) => listener.onTransferFraudDecided(tokenId, approved),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferCancellation,
    listener: (tokenId: any) => listener.onTransferCancellation(tokenId),
  })
}
