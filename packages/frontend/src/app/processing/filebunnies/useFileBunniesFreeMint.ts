import { useState } from 'react'
import { useAccount } from 'wagmi'

import { useStores } from '../../hooks'
import { useStatusModal } from '../../hooks/useStatusModal'
import { useFulfillOrder } from '../nft-interaction'
import { useCheckWhitelist } from './useCheckWhitelist'

export const useFileBunniesFreeMint = () => {
  const [tokenId, setTokenId] = useState<string | undefined>()
  const { address } = useAccount()
  const { fileBunniesTokenStore } = useStores()
  const { whiteList } = useCheckWhitelist({ address })
  const { fulfillOrder, ...statuses } = useFulfillOrder({
    collectionAddress: '0x2D189D840C0F716FcF883c75A7edB31553151696',
    tokenId,
  }, 1)

  const prepare = async () => {
    if (!address) {
      statuses.error = 'address is undefined'

      return
    }
    if (!fileBunniesTokenStore.isActivated) await fileBunniesTokenStore.activate(address, whiteList)
    else await fileBunniesTokenStore.reload()
    setTokenId(fileBunniesTokenStore.data?.tokenId)
  }

  const { isLoading } = statuses
  const { modalProps } = useStatusModal({
    statuses,
    okMsg: 'Order fulfilled! Now wait until owner of the EFT transfers you hidden files. ' +
      'After that, check the hidden files and finalize the transfer',
    loadingMsg: 'Fulfilling order',
  })

  return {
    isLoading,
    modalProps,
    fulfillOrder,
    prepare,
  }
}
