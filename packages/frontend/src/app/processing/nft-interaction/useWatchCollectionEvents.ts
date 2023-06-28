/* eslint-disable max-len */
import { useContractEvent } from 'wagmi'

import { mark3dConfig } from '../../config/mark3d'
import { ICollectionEventsListener } from '../CollectionEventsListener/ICollectionEventsListener'
import { Mark3dCollectionEventNames } from '../types'
import { ensureAddress } from '../utils'

/**
 * Hook called to listen for transfer updates.
 * @param contractAddress
 * @param listener
 */

export function useWatchCollectionEvents(listener: ICollectionEventsListener, contractAddress?: string) {
  // TODO: refactor to use ethers.Provider to also receive tx that caused event emission
  const abi = mark3dConfig.collectionToken.abi
  const address = ensureAddress(contractAddress)
  // Sorry for any type. During one of wagmi updates typing was broken
  useContractEvent({
    address,
    abi,
    eventName: Mark3dCollectionEventNames.Approval,
    listener: () => {
      console.log('APPROVE')
      listener.onApproval()
    },
  })
}
