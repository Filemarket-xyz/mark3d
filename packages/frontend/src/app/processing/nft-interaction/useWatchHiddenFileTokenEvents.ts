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
    listener: (tokenId: any, from: any, to: any, transferNumber: any) => listener.onTransferInit(tokenId, from, to, transferNumber),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferDraft,
    listener: (tokenId: any, from: any, transferNumber: any) => listener.onTransferDraft(tokenId, from, transferNumber),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferDraftCompletion,
    listener: (tokenId: any, to: any, transferNumber: any) => listener.onTransferDraftCompletion(tokenId, to, transferNumber),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferPublicKeySet,
    listener: (tokenId: any, publicKeyHex: any, transferNumber: any) => listener.onTransferPublicKeySet(tokenId, publicKeyHex, transferNumber),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferPasswordSet,
    listener: (tokenId: any, encryptedPasswordHex: any, transferNumber: any) => listener.onTransferPasswordSet(tokenId, encryptedPasswordHex, transferNumber),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFinished,
    listener: (tokenId: any, transferNumber: any) => listener.onTransferFinished(tokenId, transferNumber),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFraudReported,
    listener: (tokenId: any, transferNumber: any) => listener.onTransferFraudReported(tokenId, transferNumber),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferFraudDecided,
    listener: (tokenId: any, approved: any, transferNumber: any) => listener.onTransferFraudDecided(tokenId, approved, transferNumber),
  })
  useContractEvent({
    address,
    abi,
    eventName: HiddenFilesTokenEventNames.TransferCancellation,
    listener: (tokenId: any, transferNumber: any) => {
      console.log('CANCEL')
      listener.onTransferCancellation(tokenId, transferNumber)
    },
  })
}
